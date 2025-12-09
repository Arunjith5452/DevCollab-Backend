import { model } from "mongoose";
import { taskSchema } from "../schema/task.schema";
import { ITask } from "../interface/task.interface";


export const taskModel = model<ITask>("Tasks",taskSchema)