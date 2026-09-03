import nodemailer, { Transporter } from 'nodemailer';
import { injectable } from 'inversify';
import { IEmailService } from '../interface/email.interface';
import { otpEmailTemplate } from '../templates/email/otp-email.template';
import { logger } from '../logs/logger.service';

@injectable()
export class EmailService implements IEmailService {
    private transporter: Transporter;

    constructor() {
        const user = process.env.EMAIL_USER?.trim() || '';
        const rawPass = process.env.EMAIL_PASS || '';
        const pass = rawPass.replace(/\s+/g, '');

        const maskedUser = user ? `${user.substring(0, 3)}...${user.substring(user.indexOf('@'))}` : 'NOT_SET';
        logger.info(`[EmailService Init] User: ${maskedUser} | Raw pass length: ${rawPass.length} | Processed pass length: ${pass.length}`);

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: user,
                pass: pass
            }
        });

        this.verifyConnection();
    }

    /**
     * Verify email transporter connection
     */
    private async verifyConnection(): Promise<void> {
        try {
            logger.info('[EmailService] Verifying SMTP connection to Gmail...');
            await this.transporter.verify();
            logger.info('✅ [EmailService] SMTP Connection successfully verified and ready to send emails.');
        } catch (error: unknown) {
            const err = error as Record<string, unknown>;
            logger.error('❌ [EmailService] Verification Error Details:', {
                message: err?.message,
                code: err?.code,
                command: err?.command,
                responseCode: err?.responseCode,
                response: err?.response,
                stack: err?.stack
            });
        }
    }

    /**
     * Send OTP verification email
     * @param email - Recipient email address
     * @param otp - One-time password code
     * @param expiryMinutes - OTP expiry time in minutes (default: 3)
     */
    async sendOtpEmail(email: string, otp: number, expiryMinutes: number = 3): Promise<void> {
        try {
            logger.info(`[EmailService] Attempting to send OTP email to ${email}...`);
            const htmlContent = otpEmailTemplate(otp, expiryMinutes);

            const info = await this.transporter.sendMail({
                from: `"DevCollab" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Your DevCollab Verification Code',
                html: htmlContent,
                text: `Your DevCollab verification code is: ${otp}. This code will expire in ${expiryMinutes} minutes. Never share this code with anyone.`
            });

            logger.info(`📧 [EmailService] OTP email sent successfully to ${email}. MessageId: ${info?.messageId}`);
        } catch (error: unknown) {
            const err = error as Record<string, unknown>;
            logger.error(`❌ [EmailService] Failed to send OTP email to ${email}:`, {
                message: err?.message,
                code: err?.code,
                command: err?.command,
                responseCode: err?.responseCode,
                response: err?.response,
                stack: err?.stack
            });
            throw new Error('Failed to send verification email. Please try again later.');
        }
    }

    /**
     * Send welcome email to new users
     * @param email - Recipient email address
     * @param name - User's name
     */
    async sendWelcomeEmail(email: string, name: string): Promise<void> {
        try {
            logger.info(`[EmailService] Attempting to send welcome email to ${email}...`);
            await this.transporter.sendMail({
                from: `"DevCollab" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Welcome to DevCollab!',
                text: `Welcome ${name}! Thank you for joining DevCollab.`
            });

            logger.info(`[EmailService] Welcome email sent successfully to ${email}`);
        } catch (error: unknown) {
            const err = error as Record<string, unknown>;
            logger.error(`[EmailService] Failed to send welcome email to ${email}:`, {
                message: err?.message,
                code: err?.code,
                stack: err?.stack
            });
        }
    }

    /**
     * Send password reset email
     * @param email - Recipient email address
     * @param resetLink - Password reset link
     */
    async sendPasswordResetEmail(email: string, resetLink: string): Promise<void> {
        try {
            logger.info(`[EmailService] Attempting to send password reset email to ${email}...`);
            await this.transporter.sendMail({
                from: `"DevCollab" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Reset Your DevCollab Password',
                text: `Click the following link to reset your password: ${resetLink}`
            });

            logger.info(`[EmailService] Password reset email sent successfully to ${email}`);
        } catch (error: unknown) {
            const err = error as Record<string, unknown>;
            logger.error(`[EmailService] Failed to send password reset email to ${email}:`, {
                message: err?.message,
                code: err?.code,
                stack: err?.stack
            });
            throw new Error('Failed to send password reset email. Please try again later.');
        }
    }
}
