import express from 'express'
const app = express()
import compression from 'compression'
import cors from "cors"
import cookieParser from "cookie-parser"
import { appRouter } from '../router/index'
import { errorHandler } from '../middlewares/error-handler.middlware'


app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}))

app.use(cookieParser())
app.use(compression())


app.use((req, res, next) => {
  if (req.originalUrl === "/api/payment/webhook") {
    next()
    } else {
    express.json()(req, res, next)
  }
})


app.use("/api", appRouter)

/* =====  GLOBAL DEBUG  ===== */
app.use((req, res, next) => {
  console.log(' GLOBAL – method:', req.method, '  url:', req.originalUrl)
  next()     
})

app.use(errorHandler)


export default app;