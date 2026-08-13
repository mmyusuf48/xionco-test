const stockModel = require("../models/stockModel")

const getStocks = async (req, res) => {
  try {
    const data = await stockModel.getAllStocks()

    res.json(data)
  } catch (err) {
    console.error("Get stocks error:", err)

    res.status(500).json({
      message: err.message,
    })
  }
}

const getStock = async (req, res) => {
  try {
    const data = await stockModel.getStockById(
      req.params.id,
    )

    if (!data) {
      return res.status(404).json({
        message: "Stock not found",
      })
    }

    res.json(data)
  } catch (err) {
    console.error("Get stock error:", err)

    res.status(500).json({
      message: err.message,
    })
  }
}

const getStockByProduct = async (req, res) => {
  try {
    const data =
      await stockModel.getStockByProductId(
        req.params.productId,
      )

    if (!data) {
      return res.status(404).json({
        message: "Product stock not found",
      })
    }

    res.json(data)
  } catch (err) {
    console.error(
      "Get stock by product error:",
      err,
    )

    res.status(500).json({
      message: err.message,
    })
  }
}

const createStock = async (req, res) => {
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
      Number(quantity) < 0
    ) {
      return res.status(400).json({
        message:
          "Quantity must be a non-negative integer",
      })
    }

    const existingStock =
      await stockModel.getStockByProductId(
        product_id,
      )

    if (existingStock?.id) {
      return res.status(409).json({
        message:
          "Stock untuk produk tersebut sudah ada",
      })
    }

    const data =
      await stockModel.createStock({
        product_id,
        quantity: Number(quantity),
      })

    res.status(201).json(data)
  } catch (err) {
    console.error(
      "Create stock error:",
      err,
    )

    res.status(500).json({
      message: err.message,
    })
  }
}

const updateStock = async (req, res) => {
  try {
    const {
      quantity,
    } = req.body

    if (
      quantity === undefined ||
      quantity === null ||
      !Number.isInteger(Number(quantity)) ||
      Number(quantity) < 0
    ) {
      return res.status(400).json({
        message:
          "Quantity must be a non-negative integer",
      })
    }

    const data =
      await stockModel.updateStock(
        req.params.id,
        {
          quantity: Number(quantity),
        },
      )

    if (!data) {
      return res.status(404).json({
        message: "Stock not found",
      })
    }

    res.json(data)
  } catch (err) {
    console.error(
      "Update stock error:",
      err,
    )

    res.status(500).json({
      message: err.message,
    })
  }
}

const deleteStock = async (req, res) => {
  try {
    const data =
      await stockModel.deleteStock(
        req.params.id,
      )

    if (!data) {
      return res.status(404).json({
        message: "Stock not found",
      })
    }

    res.json({
      message: "Stock deleted successfully",
      data,
    })
  } catch (err) {
    console.error(
      "Delete stock error:",
      err,
    )

    res.status(500).json({
      message: err.message,
    })
  }
}

const getStockSummary = async (
  req,
  res,
) => {
  try {
    const data =
      await stockModel.getStockSummary()

    res.json({
      total_products: Number(
        data.total_products,
      ),
      total_stock: Number(
        data.total_stock,
      ),
      low_stock: Number(
        data.low_stock,
      ),
      out_of_stock: Number(
        data.out_of_stock,
      ),
    })
  } catch (err) {
    console.error(
      "Get stock summary error:",
      err,
    )

    res.status(500).json({
      message: err.message,
    })
  }
}

module.exports = {
  getStocks,
  getStock,
  getStockByProduct,
  createStock,
  updateStock,
  deleteStock,
  getStockSummary,
}