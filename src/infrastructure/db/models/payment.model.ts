import { model, models } from "mongoose";
import { paymentSchema } from "../schema/payment.schema";
import { IPayment } from "../interface/payment.interface";

export const paymentModel = model<IPayment>("Payment", paymentSchema);
