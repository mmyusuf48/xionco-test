const pool = require("../config/db")

const getAllProducts = async () => {
  const result = await pool.query(`
    SELECT *
    FROM products
    ORDER BY created_at DESC
  `)

  return result.rows
}

const getProductById = async (id) => {
  const result = await pool.query(
    `
      SELECT *
      FROM products
      WHERE id = $1
    `,
    [id]
  )

  return result.rows[0]
}

const createProduct = async ({ name, price, description }) => {
  const result = await pool.query(
    `
      INSERT INTO products (
        name,
        price,
        description
      )
      VALUES ($1, $2, $3)
      RETURNING *
    `,
    [name, price, description]
  )

  return result.rows[0]
}

const updateProduct = async (
  id,
  { name, price, description }
) => {
  const result = await pool.query(
    `
      UPDATE products
      SET
        name = $1,
        price = $2,
        description = $3
      WHERE id = $4
      RETURNING *
    `,
    [name, price, description, id]
  )

  return result.rows[0]
}

const deleteProduct = async (id) => {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    const productResult = await client.query(
      `
      SELECT id
      FROM products
      WHERE id = $1
      `,
      [id]
    )

    if (productResult.rows.length === 0) {
      await client.query("ROLLBACK")
      return null
    }

    const stockResult = await client.query(
      `
      SELECT id
      FROM stocks
      WHERE product_id = $1
      LIMIT 1
      `,
      [id]
    )

    if (stockResult.rows.length > 0) {
      throw new Error("PRODUCT_HAS_STOCK")
    }

    const purchaseResult = await client.query(
      `
      SELECT id
      FROM purchases
      WHERE product_id = $1
      LIMIT 1
      `,
      [id]
    )

    if (purchaseResult.rows.length > 0) {
      throw new Error("PRODUCT_HAS_PURCHASE")
    }

    const result = await client.query(
      `
      DELETE FROM products
      WHERE id = $1
      RETURNING *
      `,
      [id]
    )

    await client.query("COMMIT")

    return result.rows[0]
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}