import { InferSchemaType } from "mongoose";
import { taskSchema } from "../schema/task.schema";

export type ITask = InferSchemaType<typeof taskSchema>