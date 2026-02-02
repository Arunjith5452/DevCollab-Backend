export interface IEmailService {
    sendOtpEmail(email: string, otp: number, expiryMinutes?: number): Promise<void>;
    sendWelcomeEmail(email: string, name: string): Promise<void>;
    sendPasswordResetEmail(email: string, resetLink: string): Promise<void>;
}
