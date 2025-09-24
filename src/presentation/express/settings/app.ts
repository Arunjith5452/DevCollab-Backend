import express from 'express'
const app = express()
import { authRouter } from '../router/auth/regsiter.router'
import compression from 'compression'
import cors from "cors"

app.use(cors())
app.use(compression())
app.use(express.json())

app.use("/api",authRouter)
export default app;