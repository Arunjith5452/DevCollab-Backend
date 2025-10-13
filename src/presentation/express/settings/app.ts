import express from 'express'
const app = express()
import { authRouter } from '../router/auth/auth.router'
import compression from 'compression'
import cors from "cors"
import cookieParser from "cookie-parser"
import { profileRouter } from '../router/auth/profile.router'

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}))

app.use(cookieParser())
app.use(compression())
app.use(express.json())

app.use("/api",authRouter)
app.use("/api",profileRouter)

export default app;