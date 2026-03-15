const nodemailer = require('nodemailer');

// Create reusable transporter using Gmail (free email provider)
const createTransporter = () => {
  // Use environment variables for email credentials
  // For Gmail, you need to:
  // 1. Enable "Less secure app access" or use App Password
  // 2. Or use OAuth2 (more secure)
  
  // Option 1: Using Gmail with App Password (Recommended)
  // Get App Password from: https://myaccount.google.com/apppasswords
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASSWORD // Your Gmail App Password
      }
    });
  }
  
  // Option 2: Using SMTP (works with any email provider)
  // Supports: Gmail, Outlook, Yahoo, custom SMTP servers
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send password reset email
const sendPasswordResetEmail = async (email, name, resetToken, userType) => {
  try {
    const transporter = createTransporter();
    
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&type=${userType}`;
    
    const mailOptions = {
      from: `"PhysioFi" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request - PhysioFi',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset - PhysioFi</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">PhysioFi</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Get Better at Home</p>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">Password Reset Request</h2>
            
            <p>Hello ${name || 'User'},</p>
            
            <p>We received a request to reset your password for your PhysioFi account. Click the button below to reset your password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="display: inline-block; background: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link into your browser:</p>
            <p style="color: #10b981; word-break: break-all; font-size: 12px; background: #f3f4f6; padding: 10px; border-radius: 5px;">${resetUrl}</p>
            
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                <strong>⚠️ Important:</strong> This link will expire in 10 minutes. If you didn't request this password reset, please ignore this email.
              </p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              If you have any questions, please contact us at <a href="mailto:contact@physiofi.com" style="color: #10b981;">contact@physiofi.com</a>
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
              © ${new Date().getFullYear()} PhysioFi. All rights reserved.<br>
              This is an automated email, please do not reply.
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
        Password Reset Request - PhysioFi
        
        Hello ${name || 'User'},
        
        We received a request to reset your password for your PhysioFi account.
        
        Click this link to reset your password:
        ${resetUrl}
        
        This link will expire in 10 minutes.
        
        If you didn't request this password reset, please ignore this email.
        
        © ${new Date().getFullYear()} PhysioFi. All rights reserved.
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    // Don't throw error - return failure so user still gets success message (security best practice)
    return { success: false, error: error.message };
  }
};

// Send welcome email (optional)
const sendWelcomeEmail = async (email, name, userType) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"PhysioFi" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to PhysioFi!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to PhysioFi</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to PhysioFi!</h1>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <p>Hello ${name},</p>
            
            <p>Thank you for joining PhysioFi! We're excited to help you on your journey to better health.</p>
            
            <p>You can now:</p>
            <ul>
              <li>Book appointments with our expert physiotherapists</li>
              <li>Access your treatment plans and progress</li>
              <li>View your medical records and prescriptions</li>
              <li>Track your recovery journey</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/login" 
                 style="display: inline-block; background: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                Get Started
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">
              If you have any questions, please contact us at <a href="mailto:contact@physiofi.com" style="color: #10b981;">contact@physiofi.com</a>
            </p>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendWelcomeEmail
};

