import { model } from "mongoose";
import { subscriptionSchema } from "../schema/subscription.schema";
import { ISubscription } from "../interface/subscription.interface";

export const SubscriptionModel = model<ISubscription>("Subscription", subscriptionSchema);
