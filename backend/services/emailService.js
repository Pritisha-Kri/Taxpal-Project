const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('⚠️ Email credentials not configured - using console-only mode');
    return null; // Return null instead of throwing error
  }

  console.log('📧 Configuring Gmail SMTP with user:', process.env.EMAIL_USER);

  // Gmail SMTP configuration
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use STARTTLS
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS  // Your Gmail App Password
    },
    debug: false, // Disable debug logging
    logger: false  // Disable verbose logging
  });
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken, userName) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    
    // For development - log the reset URL to console
    console.log('🔐 PASSWORD RESET REQUEST');
    console.log('📧 Email:', email);
    console.log('👤 User:', userName);
    console.log('🔗 Reset URL:', resetUrl);
    console.log('⏰ Expires in: 1 hour');
    console.log('═'.repeat(80));
    
    // Create transporter
    const transporter = createTransporter();
    
    // If no transporter (missing credentials), use console-only mode
    if (!transporter) {
      console.log('📧 EMAIL WOULD BE SENT TO:', email);
      console.log('📧 SUBJECT: Password Reset Request - TaxPal');
      console.log('🔗 USE THIS RESET URL:', resetUrl);
      return {
        success: true,
        messageId: 'console-only-' + Date.now(),
        previewUrl: resetUrl
      };
    }
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || `TaxPal <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request - TaxPal',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
              <p>TaxPal - Your Financial Assistant</p>
            </div>
            
            <div class="content">
              <h2>Hello ${userName}!</h2>
              
              <p>We received a request to reset your password for your TaxPal account.</p>
              
              <p>If you made this request, click the button below to reset your password:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset My Password</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="background: #e9ecef; padding: 10px; border-radius: 5px; word-break: break-all;">
                ${resetUrl}
              </p>
              
              <div class="warning">
                <strong>⚠️ Important:</strong>
                <ul>
                  <li>This link will expire in 1 hour for security reasons</li>
                  <li>If you didn't request this reset, please ignore this email</li>
                  <li>Your password will remain unchanged until you create a new one</li>
                </ul>
              </div>
              
              <p>If you're having trouble with the button above, copy and paste the URL into your web browser.</p>
            </div>
            
            <div class="footer">
              <p>This email was sent by TaxPal</p>
              <p>If you didn't request this password reset, please ignore this email.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };


    // Test the connection first
    await transporter.verify();
    console.log('✅ SMTP connection verified');

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Password reset email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📧 Response:', info.response);
    
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };
    
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

// Send password change confirmation email
const sendPasswordChangeConfirmation = async (email, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || `TaxPal <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Changed Successfully - TaxPal',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #48bb78, #38a169); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .success { background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Password Changed Successfully</h1>
              <p>TaxPal - Your Financial Assistant</p>
            </div>
            
            <div class="content">
              <h2>Hello ${userName}!</h2>
              
              <div class="success">
                <strong>Your password has been successfully changed!</strong>
              </div>
              
              <p>This email confirms that your TaxPal account password was recently changed.</p>
              
              <p><strong>When:</strong> ${new Date().toLocaleString()}</p>
              
              <p>If you made this change, no further action is required.</p>
              
              <p>If you did not change your password, please contact our support team immediately and consider:</p>
              <ul>
                <li>Changing your password again</li>
                <li>Reviewing your account activity</li>
                <li>Enabling additional security measures</li>
              </ul>
            </div>
            
            <div class="footer">
              <p>This email was sent by TaxPal</p>
              <p>For security reasons, this is an automated message.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password change confirmation sent:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId
    };
    
  } catch (error) {
    console.error('Error sending password change confirmation:', error);
    throw new Error('Failed to send confirmation email');
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendPasswordChangeConfirmation
};
