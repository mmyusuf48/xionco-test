const dashboardModel = require("../models/dashboardModel")

const getDashboard = async (req, res) => {
  try {
    const [
      summary,
      recentPurchases,
      stockAlerts,
    ] = await Promise.all([
      dashboardModel.getDashboard(),
      dashboardModel.getRecentPurchases(5),
      dashboardModel.getStockAlerts(5),
    ])

    res.json({
      summary: {
        total_products: Number(summary.total_products),
        total_stock: Number(summary.total_stock),
        low_stock: Number(summary.low_stock),
        out_of_stock: Number(summary.out_of_stock),
        total_purchases: Number(summary.total_purchases),
        pending_purchases: Number(summary.pending_purchases),
        completed_purchases: Number(summary.completed_purchases),
        cancelled_purchases: Number(summary.cancelled_purchases),
        total_purchase_value: Number(
          summary.total_purchase_value,
        ),
      },
      recent_purchases: recentPurchases.map(
        purchase => ({
          ...purchase,
          quantity: Number(purchase.quantity),
          price: Number(purchase.price),
          total: Number(purchase.total),
        }),
      ),
      stock_alerts: stockAlerts.map(
        stock => ({
          ...stock,
          price: Number(stock.price),
          quantity: Number(stock.quantity),
        }),
      ),
    })
  } catch (err) {
    console.error("Get dashboard error:", err)

    res.status(500).json({
      message: err.message,
    })
  }
}

module.exports = {
  getDashboard,
}