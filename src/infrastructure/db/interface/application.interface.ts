import { InferSchemaType } from "mongoose";
import { applicationSchema } from "../schema/application.schema";


export type IApplication = InferSchemaType<typeof applicationSchema>