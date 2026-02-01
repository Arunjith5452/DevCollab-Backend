/**
 * Base email template with consistent branding and layout
 */
export const baseEmailTemplate = (content: string): string => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>DevCollab</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f5f5f5;
        }
        .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .email-header {
            background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
            padding: 40px 20px;
            text-align: center;
        }
        .email-header h1 {
            color: #ffffff;
            font-size: 32px;
            font-weight: 700;
            margin: 0;
            letter-spacing: -0.5px;
        }
        .email-header p {
            color: #e0f2f1;
            font-size: 14px;
            margin-top: 8px;
        }
        .email-body {
            padding: 40px 30px;
        }
        .email-footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .email-footer p {
            color: #6b7280;
            font-size: 13px;
            margin: 5px 0;
        }
        .email-footer a {
            color: #0d9488;
            text-decoration: none;
        }
        @media only screen and (max-width: 600px) {
            .email-body {
                padding: 30px 20px;
            }
            .email-header h1 {
                font-size: 28px;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-header">
            <h1>DevCollab</h1>
            <p>Collaborate. Build. Succeed.</p>
        </div>
        <div class="email-body">
            ${content}
        </div>
        <div class="email-footer">
            <p>© ${new Date().getFullYear()} DevCollab. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
            <p>Need help? Contact us at <a href="mailto:support@devcollab.com">support@devcollab.com</a></p>
        </div>
    </div>
</body>
</html>
    `.trim();
};
