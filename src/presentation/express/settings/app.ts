import express from 'express'
const app = express()
import { authRouter } from '../router/auth/auth.router'
import compression from 'compression'
import cors from "cors"
import cookieParser from "cookie-parser"
import { profileRouter } from '../router/auth/profile.router'
import { adminRouter } from '../router/admin/admin.router'
import { projectRouter } from '../router/project/project.router'

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
}))

app.use(cookieParser())
app.use(compression())
app.use(express.json())

app.use("/api",authRouter)
app.use("/api",profileRouter)
app.use("/api",projectRouter)
app.use("/api",adminRouter)

export default app;