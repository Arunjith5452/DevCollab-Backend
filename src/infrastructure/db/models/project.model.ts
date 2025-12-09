import { model } from "mongoose";
import { projectSchema } from "../schema/project.schema";
import { IProject } from "../interface/project.interface";

export const projectModel = model<IProject>("Projects", projectSchema);
