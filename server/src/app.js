require("dotenv").config()

const express = require("express")
const cors = require("cors")

const productRoutes = require("./routes/productRoutes")
const stockRoutes = require("./routes/stockRoutes")
const purchaseRoutes = require("./routes/purchaseRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes")

const app = express()

app.use(cors())
app.use(express.json())

// ROUTES
app.use("/api/products", productRoutes)
app.use("/api/stocks", stockRoutes)
app.use("/api/purchases", purchaseRoutes)
app.use("/api/dashboard", dashboardRoutes)

// TEST
app.get("/", (req, res) => {
  res.json({
    message: "API running 🚀",
  })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  )
})