const purchaseModel = require("../models/purchaseModel")

const getPurchases = async (req, res) => {
  try {
    const data = await purchaseModel.getAllPurchases()

    res.json(data)
  } catch (err) {
    console.error("Get purchases error:", err)

    res.status(500).json({
      message: err.message,
    })
  }
}

const getPurchase = async (req, res) => {
  try {
    const data = await purchaseModel.getPurchaseById(
      req.params.id,
    )

    if (!data) {
      return res.status(404).json({
        message: "Purchase not found",
      })
    }

    res.json(data)
  } catch (err) {
    console.error("Get purchase error:", err)

    res.status(500).json({
      message: err.message,
    })
  }
}

const createPurchase = async (req, res) => {
  try {
    const {
      product_id,
      quantity,
    } = req.body

    if (!product_id) {
      return res.status(400).json({
        message: "Product is required",
      })
    }

    if (
      quantity === undefined ||
      quantity === null ||
      !Number.isInteger(Number(quantity)) ||
      Number(quantity) <= 0
    ) {
      return res.status(400).json({
        message: "Quantity must be a positive integer",
      })
    }

    const data = await purchaseModel.createPurchase({
      product_id,
      quantity: Number(quantity),
    })

    res.status(201).json(data)
  } catch (err) {
    console.error("Create purchase error:", err)

    if (err.message === "PRODUCT_NOT_FOUND") {
      return res.status(404).json({
        message: "Product not found",
      })
    }

    res.status(500).json({
      message: err.message,
    })
  }
}

const updatePurchase = async (req, res) => {
  try {
    const {
      quantity,
    } = req.body

    if (
      quantity === undefined ||
      quantity === null ||
      !Number.isInteger(Number(quantity)) ||
      Number(quantity) <= 0
    ) {
      return res.status(400).json({
        message: "Quantity must be a positive integer",
      })
    }

    const data = await purchaseModel.updatePurchase(
      req.params.id,
      {
        quantity: Number(quantity),
      },
    )

    if (!data) {
      return res.status(404).json({
        message: "Purchase not found",
      })
    }

    res.json(data)
  } catch (err) {
    console.error("Update purchase error:", err)

    if (
      err.message ===
      "Purchase yang sudah dibatalkan tidak dapat diubah"
    ) {
      return res.status(400).json({
        message: err.message,
      })
    }

    if (err.message === "PRODUCT_NOT_FOUND") {
      return res.status(404).json({
        message: "Product not found",
      })
    }

    if (
      err.message ===
      "Stock untuk produk tersebut tidak ditemukan"
    ) {
      return res.status(400).json({
        message: err.message,
      })
    }

    if (err.message === "Stock tidak mencukupi") {
      return res.status(400).json({
        message: err.message,
      })
    }

    res.status(500).json({
      message: err.message,
    })
  }
}

const updatePurchaseStatus = async (req, res) => {
  try {
    const {
      status,
    } = req.body

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      })
    }

    const allowedStatuses = [
      "PENDING",
      "COMPLETED",
      "CANCELLED",
    ]

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message:
          "Status must be PENDING, COMPLETED, or CANCELLED",
      })
    }

    const data =
      await purchaseModel.updatePurchaseStatus(
        req.params.id,
        status,
      )

    if (!data) {
      return res.status(404).json({
        message: "Purchase not found",
      })
    }

    res.json({
      message: "Purchase status updated successfully",
      data,
    })
  } catch (err) {
    console.error(
      "Update purchase status error:",
      err,
    )

    if (
      err.message ===
      "Status purchase tidak valid"
    ) {
      return res.status(400).json({
        message: err.message,
      })
    }

    if (
      err.message ===
      "Status purchase sudah sama"
    ) {
      return res.status(400).json({
        message: err.message,
      })
    }

    if (
      err.message ===
      "Purchase yang sudah dibatalkan tidak dapat diubah"
    ) {
      return res.status(400).json({
        message: err.message,
      })
    }

    if (
      err.message ===
      "Stock untuk produk tersebut tidak ditemukan"
    ) {
      return res.status(400).json({
        message: err.message,
      })
    }

    if (
      err.message ===
      "Stock tidak mencukupi untuk membatalkan purchase"
    ) {
      return res.status(400).json({
        message: err.message,
      })
    }

    res.status(500).json({
      message: err.message,
    })
  }
}

module.exports = {
  getPurchases,
  getPurchase,
  createPurchase,
  updatePurchase,
  updatePurchaseStatus,
}