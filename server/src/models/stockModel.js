const pool = require("../config/db")

const getAllStocks = async () => {
  const result = await pool.query(`
    SELECT
      p.id AS product_id,
      p.name AS product_name,
      p.price,
      s.id,
      COALESCE(s.quantity, 0) AS quantity,
      s.created_at,
      s.updated_at,
      COALESCE(
        (
          SELECT SUM(pu.quantity)
          FROM purchases pu
          WHERE pu.product_id = p.id
            AND pu.status = 'COMPLETED'
        ),
        0
      ) AS total_purchased,
      (
        SELECT MAX(pu.created_at)
        FROM purchases pu
        WHERE pu.product_id = p.id
          AND pu.status = 'COMPLETED'
      ) AS last_purchase_at
    FROM products p
    LEFT JOIN stocks s
      ON s.product_id = p.id
    ORDER BY p.created_at DESC
  `)

  return result.rows
}

const getStockById = async (id) => {
  const result = await pool.query(
    `
    SELECT
      s.id,
      s.product_id,
      p.name AS product_name,
      p.price,
      s.quantity,
      s.created_at,
      s.updated_at,
      COALESCE(
        (
          SELECT SUM(pu.quantity)
          FROM purchases pu
          WHERE pu.product_id = s.product_id
            AND pu.status = 'COMPLETED'
        ),
        0
      ) AS total_purchased,
      (
        SELECT MAX(pu.created_at)
        FROM purchases pu
        WHERE pu.product_id = s.product_id
          AND pu.status = 'COMPLETED'
      ) AS last_purchase_at
    FROM stocks s
    INNER JOIN products p
      ON p.id = s.product_id
    WHERE s.id = $1
    `,
    [id],
  )

  return result.rows[0]
}

const getStockByProductId = async (productId) => {
  const result = await pool.query(
    `
    SELECT
      p.id AS product_id,
      p.name AS product_name,
      p.price,
      s.id,
      COALESCE(s.quantity, 0) AS quantity,
      s.created_at,
      s.updated_at,
      COALESCE(
        (
          SELECT SUM(pu.quantity)
          FROM purchases pu
          WHERE pu.product_id = p.id
            AND pu.status = 'COMPLETED'
        ),
        0
      ) AS total_purchased,
      (
        SELECT MAX(pu.created_at)
        FROM purchases pu
        WHERE pu.product_id = p.id
          AND pu.status = 'COMPLETED'
      ) AS last_purchase_at
    FROM products p
    LEFT JOIN stocks s
      ON s.product_id = p.id
    WHERE p.id = $1
    `,
    [productId],
  )

  return result.rows[0]
}

const createStock = async ({
  product_id,
  quantity = 0,
}) => {
  const result = await pool.query(
    `
    INSERT INTO stocks (
      product_id,
      quantity
    )
    VALUES ($1, $2)
    RETURNING *
    `,
    [
      product_id,
      quantity,
    ],
  )

  return result.rows[0]
}

const updateStock = async (
  id,
  {
    quantity,
  },
) => {
  const result = await pool.query(
    `
    UPDATE stocks
    SET
      quantity = $1,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *
    `,
    [
      quantity,
      id,
    ],
  )

  return result.rows[0]
}

const getStockSummary = async () => {
  const result = await pool.query(`
    SELECT
      COUNT(*) AS total_products,
      COALESCE(
        SUM(COALESCE(s.quantity, 0)),
        0
      ) AS total_stock,
      COUNT(
        CASE
          WHEN COALESCE(s.quantity, 0) > 0
            AND COALESCE(s.quantity, 0) <= 10
          THEN 1
        END
      ) AS low_stock,
      COUNT(
        CASE
          WHEN COALESCE(s.quantity, 0) = 0
          THEN 1
        END
      ) AS out_of_stock
    FROM products p
    LEFT JOIN stocks s
      ON s.product_id = p.id
  `)

  return result.rows[0]
}

const deleteStock = async (id) => {
  const result = await pool.query(
    `
    DELETE FROM stocks
    WHERE id = $1
    RETURNING *
    `,
    [id],
  )

  return result.rows[0]
}

module.exports = {
  getAllStocks,
  getStockById,
  getStockByProductId,
  createStock,
  updateStock,
  deleteStock,
  getStockSummary,
}