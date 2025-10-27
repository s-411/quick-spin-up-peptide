interface WelcomeEmailProps {
  firstName?: string
  appUrl: string
}

export function WelcomeEmail({ firstName, appUrl }: WelcomeEmailProps) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Starter App</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 32px;">Welcome${firstName ? ` ${firstName}` : ''}!</h1>
  </div>

  <div style="background: #f9fafb; padding: 40px 30px; border-radius: 0 0 8px 8px;">
    <p style="font-size: 18px; margin-bottom: 20px;">Thank you for joining Starter App Template!</p>

    <p>We're excited to have you on board. Here's what you can do next:</p>

    <ul style="margin: 20px 0;">
      <li style="margin: 10px 0;">Complete your profile setup</li>
      <li style="margin: 10px 0;">Explore our features and documentation</li>
      <li style="margin: 10px 0;">Upload your first document for AI-powered Q&A</li>
      <li style="margin: 10px 0;">Check out our pricing plans for advanced features</li>
    </ul>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${appUrl}/dashboard" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">Go to Dashboard</a>
    </div>

    <p style="color: #666; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
      Need help? Reply to this email or visit our <a href="${appUrl}/docs" style="color: #667eea;">documentation</a>.
    </p>
  </div>

  <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
    <p>© ${new Date().getFullYear()} Starter App Template. All rights reserved.</p>
  </div>
</body>
</html>
  `.trim()
}

export function getWelcomeEmailText({ firstName, appUrl }: WelcomeEmailProps) {
  return `
Welcome${firstName ? ` ${firstName}` : ''}!

Thank you for joining Starter App Template!

Here's what you can do next:
- Complete your profile setup
- Explore our features and documentation
- Upload your first document for AI-powered Q&A
- Check out our pricing plans for advanced features

Go to Dashboard: ${appUrl}/dashboard

Need help? Reply to this email or visit our documentation at ${appUrl}/docs.

© ${new Date().getFullYear()} Starter App Template. All rights reserved.
  `.trim()
}
