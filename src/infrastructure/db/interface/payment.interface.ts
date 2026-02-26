import { InferSchemaType } from "mongoose";
import { paymentSchema } from "../schema/payment.schema";

export type IPayment = InferSchemaType<typeof paymentSchema>