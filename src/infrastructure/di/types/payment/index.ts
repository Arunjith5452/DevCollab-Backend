export const PAYMENT_TYPES = {
    StripeProvider: Symbol.for("StripeProvider"),
    CreatePaymentIntentUseCase: Symbol.for("CreatePaymentIntentUseCase"),
    CreateCheckoutSessionUseCase: Symbol.for("CreateCheckoutSessionUseCase"),
    HandleWebhookUseCase: Symbol.for("HandleWebhookUseCase"),
    PaymentController: Symbol.for("PaymentController"),
    PaymentRepository: Symbol.for("PaymentRepository")
}
