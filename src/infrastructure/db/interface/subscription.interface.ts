import { InferSchemaType } from "mongoose";
import { subscriptionSchema } from "../schema/subscription.schema";

export type ISubscription = InferSchemaType<typeof subscriptionSchema> & { _id: string };
