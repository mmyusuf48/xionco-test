const pool = require("../config/db")

const getAllPurchases = async () => {
  const result = await pool.query(`
    SELECT
      pu.id,
      pu.product_id,
      p.name AS product_name,
      pu.quantity,
      pu.price,
      pu.total,
      pu.status,
      pu.created_at,
      pu.updated_at
    FROM purchases pu
    INNER JOIN products p
      ON p.id = pu.product_id
    ORDER BY pu.created_at DESC
  `)

  return result.rows
}

const getPurchaseById = async (id) => {
  const result = await pool.query(
    `
    SELECT
      pu.id,
      pu.product_id,
      p.name AS product_name,
      pu.quantity,
      pu.price,
      pu.total,
      pu.status,
      pu.created_at,
      pu.updated_at
    FROM purchases pu
    INNER JOIN products p
      ON p.id = pu.product_id
    WHERE pu.id = $1
    `,
    [id],
  )

  return result.rows[0]
}

const createPurchase = async ({
  product_id,
  quantity,
}) => {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    const purchaseQuantity = Number(quantity)

    if (
      !Number.isInteger(purchaseQuantity) ||
      purchaseQuantity <= 0
    ) {
      throw new Error(
        "Quantity purchase harus lebih dari 0",
      )
    }

    const productResult = await client.query(
      `
      SELECT
        id,
        name,
        price
      FROM products
      WHERE id = $1
      FOR UPDATE
      `,
      [product_id],
    )

    if (productResult.rows.length === 0) {
      throw new Error("PRODUCT_NOT_FOUND")
    }

    const product = productResult.rows[0]

    const price = Number(product.price)
    const total = price * purchaseQuantity

    const purchaseResult = await client.query(
      `
      INSERT INTO purchases (
        product_id,
        quantity,
        price,
        total,
        status
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        product_id,
        purchaseQuantity,
        price,
        total,
        "PENDING",
      ],
    )

    await client.query("COMMIT")

    return {
      ...purchaseResult.rows[0],
      product_name: product.name,
    }
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

const updatePurchase = async (
  id,
  {
    quantity,
  },
) => {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    const oldPurchaseResult = await client.query(
      `
      SELECT *
      FROM purchases
      WHERE id = $1
      FOR UPDATE
      `,
      [id],
    )

    if (oldPurchaseResult.rows.length === 0) {
      await client.query("ROLLBACK")
      return null
    }

    const oldPurchase = oldPurchaseResult.rows[0]

    if (oldPurchase.status === "CANCELLED") {
      throw new Error(
        "Purchase yang sudah dibatalkan tidak dapat diubah",
      )
    }

    const newQuantity = Number(quantity)

    if (
      !Number.isInteger(newQuantity) ||
      newQuantity <= 0
    ) {
      throw new Error(
        "Quantity purchase harus lebih dari 0",
      )
    }

    const productResult = await client.query(
      `
      SELECT
        id,
        name,
        price
      FROM products
      WHERE id = $1
      FOR UPDATE
      `,
      [oldPurchase.product_id],
    )

    if (productResult.rows.length === 0) {
      throw new Error("PRODUCT_NOT_FOUND")
    }

    const product = productResult.rows[0]

    const oldQuantity = Number(
      oldPurchase.quantity,
    )

    const price = Number(product.price)
    const total = price * newQuantity

    if (oldPurchase.status === "COMPLETED") {
      const difference =
        newQuantity - oldQuantity

      if (difference !== 0) {
        const stockResult = await client.query(
          `
          SELECT *
          FROM stocks
          WHERE product_id = $1
          FOR UPDATE
          `,
          [oldPurchase.product_id],
        )

        if (stockResult.rows.length === 0) {
          throw new Error(
            "Stock untuk produk tersebut tidak ditemukan",
          )
        }

        const currentStock = Number(
          stockResult.rows[0].quantity,
        )

        if (
          difference < 0 &&
          currentStock < Math.abs(difference)
        ) {
          throw new Error(
            "Stock tidak mencukupi",
          )
        }

        await client.query(
          `
          UPDATE stocks
          SET
            quantity = quantity + $1,
            updated_at = CURRENT_TIMESTAMP
          WHERE product_id = $2
          `,
          [
            difference,
            oldPurchase.product_id,
          ],
        )
      }
    }

    const purchaseResult = await client.query(
      `
      UPDATE purchases
      SET
        quantity = $1,
        price = $2,
        total = $3,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
      `,
      [
        newQuantity,
        price,
        total,
        id,
      ],
    )

    await client.query("COMMIT")

    return {
      ...purchaseResult.rows[0],
      product_name: product.name,
    }
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

const updatePurchaseStatus = async (
  id,
  status,
) => {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    const purchaseResult = await client.query(
      `
      SELECT *
      FROM purchases
      WHERE id = $1
      FOR UPDATE
      `,
      [id],
    )

    if (purchaseResult.rows.length === 0) {
      await client.query("ROLLBACK")
      return null
    }

    const purchase = purchaseResult.rows[0]

    const oldStatus = purchase.status
    const newStatus = status

    const allowedStatuses = [
      "PENDING",
      "COMPLETED",
      "CANCELLED",
    ]

    if (!allowedStatuses.includes(newStatus)) {
      throw new Error(
        "Status purchase tidak valid",
      )
    }

    if (oldStatus === newStatus) {
      throw new Error(
        "Status purchase sudah sama",
      )
    }

    if (oldStatus === "CANCELLED") {
      throw new Error(
        "Purchase yang sudah dibatalkan tidak dapat diubah",
      )
    }

    if (
      oldStatus === "PENDING" &&
      newStatus === "COMPLETED"
    ) {
      await client.query(
        `
        INSERT INTO stocks (
          product_id,
          quantity
        )
        VALUES ($1, $2)
        ON CONFLICT (product_id)
        DO UPDATE SET
          quantity = stocks.quantity + EXCLUDED.quantity,
          updated_at = CURRENT_TIMESTAMP
        `,
        [
          purchase.product_id,
          purchase.quantity,
        ],
      )
    }

    if (
      oldStatus === "COMPLETED" &&
      newStatus === "CANCELLED"
    ) {
      const stockResult = await client.query(
        `
        SELECT *
        FROM stocks
        WHERE product_id = $1
        FOR UPDATE
        `,
        [purchase.product_id],
      )

      if (stockResult.rows.length === 0) {
        throw new Error(
          "Stock untuk produk tersebut tidak ditemukan",
        )
      }

      const currentStock = Number(
        stockResult.rows[0].quantity,
      )

      const purchaseQuantity = Number(
        purchase.quantity,
      )

      if (currentStock < purchaseQuantity) {
        throw new Error(
          "Stock tidak mencukupi untuk membatalkan purchase",
        )
      }

      await client.query(
        `
        UPDATE stocks
        SET
          quantity = quantity - $1,
          updated_at = CURRENT_TIMESTAMP
        WHERE product_id = $2
        `,
        [
          purchaseQuantity,
          purchase.product_id,
        ],
      )
    }

    if (
      oldStatus === "PENDING" &&
      newStatus === "CANCELLED"
    ) {
    }

    const updatedPurchaseResult =
      await client.query(
        `
        UPDATE purchases
        SET
          status = $1,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
        `,
        [
          newStatus,
          id,
        ],
      )

    await client.query("COMMIT")

    return updatedPurchaseResult.rows[0]
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

module.exports = {
  getAllPurchases,
  getPurchaseById,
  createPurchase,
  updatePurchase,
  updatePurchaseStatus,
}