const express = require("express")
require("dotenv").config()
require("express-async-errors")
const connectDb = require("./db/connect")
const errorHandler = require("./middleware/errorHandler")
const pathNotFound = require("./middleware/pathNotFound")
const cors = require("cors")
const path = require("path")
const productRoute = require("./routes/productRoute")
const authRoute = require("./routes/authenticationRoute")
const adminRoute = require("./routes/adminRoutes")
const ordersRoute = require("./routes/ordersRoute")
const userRoute = require("./routes/userRoutes")
const categoryRoute = require("./routes/categoryRoutes")
const projectRoute = require("./routes/projectRoutes")
const contactRoute = require("./routes/contactRoutes")
const { clearAdminJwt } = require("./controllers/admin")

const app = express()
//  middlewares
app.use(
cors({
origin: [
"https://artex-furnishes.netlify.app",
"http://localhost:3000",
"http://localhost:3001",
"http://artexcollections.com.al",
"http://www.artexcollections.com.al",
"https://artexcollections.com.al",
"https://www.artexcollections.com.al",
"http://52.54.120.78:3000",
"http://52.54.120.78",
],
credentials: true,
}),
)

app.use((req, res, next) => {
console.log(`[v0] ${req.method} ${req.originalUrl}`)
next()
})

app.use((req, res, next) => {
if (req.headers["content-type"]?.startsWith("multipart/form-data")) {
// Skip express.json() for file uploads - multer will handle these
return next()
}
next()
})
app.use(express.json({ limit: "1mb" }))

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.get("/", (req, res) => {
res.status(200).send("<h1>Artex, ecommerce server</h1> ")
})

app.use("/api/v1/products", productRoute)
app.use("/api/v1/auth", authRoute)
app.use("/api/v1/orders", ordersRoute)
app.use("/api/v1/admin", adminRoute)
app.use("/api/v1/user", userRoute)
app.use("/api/v1/categories", categoryRoute)
app.use("/api/v1/projects", projectRoute)
app.use("/api/v1/contact", contactRoute)
app.use(errorHandler)
app.use(pathNotFound)

// clear admin token after 6 hours of inactivity
setInterval(clearAdminJwt, 6 * 60 * 60 * 1000)

const port = process.env.PORT || 5000

const startServer = async () => {
try {
await connectDb(process.env.MONGO_URI)
app.listen(port, () => console.log(`Server is listening on port ${port}`))
} catch (error) {}
}

startServer()