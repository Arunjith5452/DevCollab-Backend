import express from 'express'
const app = express()
import compression from 'compression'
import cors from "cors"
import cookieParser from "cookie-parser"
import { appRouter } from '../router/index'
import { AppError } from '@/shared/utils/appError'
// import { globalErrorHandler } from '@/presentation/express/middlewares/global-ErrorHandler.middlware'


app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}))

app.use(cookieParser())
app.use(compression())

// Use express.json() for all routes EXCEPT the stripe webhook

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


// // Handle 404 - Not Found
// app.use((req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
// });

// // Global Error Handling Middleware
// app.use(globalErrorHandler)

export default app;