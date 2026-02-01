import { baseEmailTemplate } from './base.template';

/**
 * OTP Email Template
 * Professional, accessible design following UI/UX best practices
 */
export const otpEmailTemplate = (otp: number, expiryMinutes: number = 3): string => {
    const content = `
        <style>
            .greeting {
                font-size: 18px;
                color: #111827;
                margin-bottom: 20px;
                font-weight: 500;
            }
            .message {
                font-size: 15px;
                color: #4b5563;
                line-height: 1.7;
                margin-bottom: 30px;
            }
            .otp-container {
                background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%);
                border: 2px solid #14b8a6;
                border-radius: 12px;
                padding: 30px;
                text-align: center;
                margin: 30px 0;
            }
            .otp-label {
                font-size: 13px;
                color: #0f766e;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 12px;
            }
            .otp-code {
                font-size: 42px;
                font-weight: 700;
                color: #0d9488;
                letter-spacing: 8px;
                font-family: 'Courier New', monospace;
                margin: 10px 0;
                text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .expiry-notice {
                font-size: 13px;
                color: #0f766e;
                margin-top: 12px;
                font-weight: 500;
            }
            .warning-box {
                background-color: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 16px 20px;
                margin: 25px 0;
                border-radius: 4px;
            }
            .warning-box p {
                font-size: 14px;
                color: #92400e;
                margin: 0;
            }
            .warning-box strong {
                color: #78350f;
            }
            .help-text {
                font-size: 14px;
                color: #6b7280;
                margin-top: 30px;
                padding-top: 25px;
                border-top: 1px solid #e5e7eb;
            }
            .help-text a {
                color: #0d9488;
                text-decoration: none;
                font-weight: 500;
            }
        </style>

        <p class="greeting">Hello,</p>
        
        <p class="message">
            Thank you for using <strong>DevCollab</strong>! To complete your verification, 
            please use the One-Time Password (OTP) below:
        </p>

        <div class="otp-container">
            <div class="otp-label">Your Verification Code</div>
            <div class="otp-code">${otp}</div>
            <div class="expiry-notice">⏱ Expires in ${expiryMinutes} minutes</div>
        </div>

        <div class="warning-box">
            <p><strong>🔒 Security Notice:</strong> Never share this code with anyone. 
            DevCollab will never ask for your OTP via phone, email, or any other means.</p>
        </div>

        <p class="message">
            If you didn't request this code, please ignore this email or contact our 
            support team if you have concerns about your account security.
        </p>

        <div class="help-text">
            <p>Need assistance? We're here to help!</p>
            <p>Contact us at <a href="mailto:support@devcollab.com">support@devcollab.com</a></p>
        </div>
    `;

    return baseEmailTemplate(content);
};
