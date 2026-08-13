const express = require("express")

const router = express.Router()

const controller = require("../controllers/stockController")

router.get(
  "/",
  controller.getStocks,
)

router.get(
  "/summary",
  controller.getStockSummary,
)

router.get(
  "/product/:productId",
  controller.getStockByProduct,
)

router.get(
  "/:id",
  controller.getStock,
)

router.post(
  "/",
  controller.createStock,
)

router.put(
  "/:id",
  controller.updateStock,
)

router.delete(
  "/:id",
  controller.deleteStock,
)

module.exports = router