const pool = require("../config/db")

const getDashboard = async () => {
  const result = await pool.query(`
    SELECT
      (
        SELECT COUNT(*)
        FROM products
      ) AS total_products,

      (
        SELECT COALESCE(
          SUM(COALESCE(s.quantity, 0)),
          0
        )
        FROM products p
        LEFT JOIN stocks s
          ON s.product_id = p.id
      ) AS total_stock,

      (
        SELECT COUNT(*)
        FROM products p
        LEFT JOIN stocks s
          ON s.product_id = p.id
        WHERE COALESCE(s.quantity, 0) > 0
          AND COALESCE(s.quantity, 0) <= 10
      ) AS low_stock,

      (
        SELECT COUNT(*)
        FROM products p
        LEFT JOIN stocks s
          ON s.product_id = p.id
        WHERE COALESCE(s.quantity, 0) = 0
      ) AS out_of_stock,

      (
        SELECT COUNT(*)
        FROM purchases
        WHERE status = 'COMPLETED'
      ) AS total_purchases,

      (
        SELECT COUNT(*)
        FROM purchases
        WHERE status = 'PENDING'
      ) AS pending_purchases,

      (
        SELECT COUNT(*)
        FROM purchases
        WHERE status = 'COMPLETED'
      ) AS completed_purchases,

      (
        SELECT COUNT(*)
        FROM purchases
        WHERE status = 'CANCELLED'
      ) AS cancelled_purchases,

      (
        SELECT COALESCE(SUM(total), 0)
        FROM purchases
        WHERE status = 'COMPLETED'
      ) AS total_purchase_value
  `)

  return result.rows[0]
}

const getRecentPurchases = async (limit = 5) => {
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
      pu.created_at
    FROM purchases pu
    INNER JOIN products p
      ON p.id = pu.product_id
    ORDER BY pu.created_at DESC
    LIMIT $1
    `,
    [limit],
  )

  return result.rows
}

const getStockAlerts = async (limit = 5) => {
  const result = await pool.query(
    `
    SELECT
      p.id AS product_id,
      p.name AS product_name,
      p.price,
      COALESCE(s.quantity, 0) AS quantity
    FROM products p
    LEFT JOIN stocks s
      ON s.product_id = p.id
    WHERE COALESCE(s.quantity, 0) <= 10
    ORDER BY
      COALESCE(s.quantity, 0) ASC,
      p.name ASC
    LIMIT $1
    `,
    [limit],
  )

  return result.rows
}

module.exports = {
  getDashboard,
  getRecentPurchases,
  getStockAlerts,
}