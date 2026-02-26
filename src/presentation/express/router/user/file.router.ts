import { container } from "@/infrastructure/di/inversify.di";
import { FileController } from "@/presentation/http/controllers/file.controller";
import { Request, Response, Router } from "express";



const router = Router()

const fileController = container.get(FileController)


router.post("/signed-url",(req: Request, res: Response) => fileController.signedUrl(req, res))


export {router as s3Router} 