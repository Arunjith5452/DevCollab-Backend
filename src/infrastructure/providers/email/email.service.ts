import nodemailer, { Transporter } from 'nodemailer';
import { injectable } from 'inversify';
import { IEmailService } from '../interface/email.interface';
import { otpEmailTemplate } from '../templates/email/otp-email.template';
import { logger } from '../logs/logger.service';

@injectable()
export class EmailService implements IEmailService {
    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        this.verifyConnection();
    }

    /**
     * Verify email transporter connection
     */
    private async verifyConnection(): Promise<void> {
        try {
            await this.transporter.verify();
            logger.info('Email service is ready to send emails');
        } catch (error) {
            logger.error('Email service configuration error:', error);
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
            const htmlContent = otpEmailTemplate(otp, expiryMinutes);

            await this.transporter.sendMail({
                from: `"DevCollab" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Your DevCollab Verification Code',
                html: htmlContent,
                text: `Your DevCollab verification code is: ${otp}. This code will expire in ${expiryMinutes} minutes. Never share this code with anyone.`
            });

            logger.info(`📧 OTP email sent successfully to ${email}`);
        } catch (error) {
            logger.error(`❌ Failed to send OTP email to ${email}:`, error);
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
            await this.transporter.sendMail({
                from: `"DevCollab" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Welcome to DevCollab!',
                text: `Welcome ${name}! Thank you for joining DevCollab.`
            });

            logger.info(`Welcome email sent successfully to ${email}`);
        } catch (error) {
            logger.error(`Failed to send welcome email to ${email}:`, error);
        }
    }

    /**
     * Send password reset email
     * @param email - Recipient email address
     * @param resetLink - Password reset link
     */
    async sendPasswordResetEmail(email: string, resetLink: string): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: `"DevCollab" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Reset Your DevCollab Password',
                text: `Click the following link to reset your password: ${resetLink}`
            });

            logger.info(`Password reset email sent successfully to ${email}`);
        } catch (error) {
            logger.error(`Failed to send password reset email to ${email}:`, error);
            throw new Error('Failed to send password reset email. Please try again later.');
        }
    }
}
