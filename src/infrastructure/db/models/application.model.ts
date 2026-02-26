import { model } from "mongoose";
import { applicationSchema } from "../schema/application.schema";
import { IApplication } from "../interface/application.interface";


export const applicationModel = model<IApplication>("Applications",applicationSchema)