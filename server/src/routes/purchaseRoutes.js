const express = require("express")

const router = express.Router()

const controller = require("../controllers/purchaseController")

router.get(
  "/",
  controller.getPurchases,
)

router.get(
  "/:id",
  controller.getPurchase,
)

router.post(
  "/",
  controller.createPurchase,
)

router.put(
  "/:id",
  controller.updatePurchase,
)

router.patch(
  "/:id/status",
  controller.updatePurchaseStatus,
)

module.exports = router