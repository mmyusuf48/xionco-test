const productModel = require("../models/productModel")

const getProducts = async (req, res) => {
  try {
    const data = await productModel.getAllProducts()

    res.json(data)
  } catch (err) {
    console.error(err)

    res.status(500).json({
      message: "Failed to get products",
    })
  }
}

const getProduct = async (req, res) => {
  try {
    const data = await productModel.getProductById(
      req.params.id
    )

    if (!data) {
      return res.status(404).json({
        message: "Product not found",
      })
    }

    res.json(data)
  } catch (err) {
    console.error(err)

    res.status(500).json({
      message: "Failed to get product",
    })
  }
}

const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
    } = req.body

    if (!name || price === undefined || price === null) {
      return res.status(400).json({
        message: "Name and price required",
      })
    }

    const data = await productModel.createProduct({
      name,
      price,
      description,
    })

    res.status(201).json(data)
  } catch (err) {
    console.error(err)

    res.status(500).json({
      message: "Failed to create product",
    })
  }
}

const updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
    } = req.body

    if (!name || price === undefined || price === null) {
      return res.status(400).json({
        message: "Name and price required",
      })
    }

    const data = await productModel.updateProduct(
      req.params.id,
      {
        name,
        price,
        description,
      }
    )

    if (!data) {
      return res.status(404).json({
        message: "Product not found",
      })
    }

    res.json(data)
  } catch (err) {
    console.error(err)

    res.status(500).json({
      message: "Failed to update product",
    })
  }
}

const deleteProduct = async (req, res) => {
  try {
    const data = await productModel.deleteProduct(
      req.params.id
    )

    if (!data) {
      return res.status(404).json({
        message: "Product not found",
      })
    }

    res.json({
      message: "Product deleted successfully",
      data,
    })
  } catch (err) {
    console.error("Delete product error:", err)

    if (err.message === "PRODUCT_HAS_STOCK") {
      return res.status(400).json({
        message:
          "Product tidak dapat dihapus karena masih memiliki stock.",
      })
    }

    if (err.message === "PRODUCT_HAS_PURCHASE") {
      return res.status(400).json({
        message:
          "Product tidak dapat dihapus karena sudah memiliki transaksi purchase.",
      })
    }

    res.status(500).json({
      message: "Failed to delete product",
    })
  }
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
}