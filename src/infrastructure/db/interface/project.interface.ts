import { InferSchemaType } from "mongoose";
import { projectSchema } from "../schema/project.schema";

export type IProject = InferSchemaType<typeof projectSchema>;
