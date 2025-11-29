const twilio = require('twilio');
const nodemailer = require('nodemailer');

// Twilio configuration (you'll need to get these from Twilio console)
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || 'your_account_sid';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || 'your_auth_token';
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || 'your_twilio_number';

// Email configuration
const EMAIL_USER = process.env.EMAIL_USER || 'your_email@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'your_app_password';

// Initialize Twilio client only if credentials are valid
let twilioClient = null;
if (TWILIO_ACCOUNT_SID && 
    TWILIO_ACCOUNT_SID !== 'your_account_sid' && 
    TWILIO_ACCOUNT_SID.startsWith('AC') &&
    TWILIO_AUTH_TOKEN && 
    TWILIO_AUTH_TOKEN !== 'your_auth_token') {
  try {
    twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    console.log('✅ Twilio client initialized successfully');
  } catch (error) {
    console.log('❌ Twilio client initialization failed:', error.message);
  }
} else {
  console.log('ℹ️ Twilio not configured - using development mode');
}

// Create email transporter only if credentials are valid
let emailTransporter = null;
if (EMAIL_USER && EMAIL_USER !== 'your_email@gmail.com' && EMAIL_PASS && EMAIL_PASS !== 'your_app_password') {
  try {
    emailTransporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      }
    });
  } catch (error) {
    console.log('Email transporter initialization failed:', error.message);
  }
}

class OTPService {
  // Send OTP via SMS using Twilio
  static async sendSMS(phone, otp) {
    if (!twilioClient) {
      console.log(`\n🔐 OTP for ${phone}: ${otp}\n`);
      console.log('📱 Twilio not configured. OTP logged to console.\n');
      return { success: false, error: 'Twilio not configured' };
    }

    try {
      // Format phone number (add +91 for India if not present)
      let formattedPhone = phone;
      if (!phone.startsWith('+')) {
        formattedPhone = '+91' + phone.replace(/^0+/, '');
      }

      const message = await twilioClient.messages.create({
        body: `Your PhysioFi OTP is: ${otp}. This code is valid for 10 minutes. Do not share this code with anyone.`,
        from: TWILIO_PHONE_NUMBER,
        to: formattedPhone
      });

      console.log(`SMS sent successfully to ${formattedPhone}. Message SID: ${message.sid}`);
      return { success: true, messageId: message.sid };
    } catch (error) {
      console.error('SMS sending failed:', error.message);
      
      // Fallback: Log to console for development
      console.log(`\n🔐 OTP for ${phone}: ${otp}\n`);
      console.log('📱 SMS sending failed. Check Twilio configuration.\n');
      
      return { success: false, error: error.message };
    }
  }

  // Send OTP via Email
  static async sendEmail(email, otp, name = 'User') {
    if (!emailTransporter) {
      console.log(`\n📧 OTP for ${email}: ${otp}\n`);
      console.log('📧 Email not configured. OTP logged to console.\n');
      return { success: false, error: 'Email not configured' };
    }

    try {
      const mailOptions = {
        from: EMAIL_USER,
        to: email,
        subject: 'PhysioFi - Your OTP Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1C1F4A, #4A7023); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">PhysioFi</h1>
              <p style="color: #E0E0E0; margin: 10px 0 0 0;">Get Better at Home</p>
            </div>
            
            <div style="padding: 40px 30px; background: #f9f9f9;">
              <h2 style="color: #1C1F4A; margin: 0 0 20px 0;">Your OTP Code</h2>
              
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                Hello ${name},
              </p>
              
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                Your One-Time Password (OTP) for PhysioFi is:
              </p>
              
              <div style="background: white; border: 2px solid #1C1F4A; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center;">
                <h1 style="color: #1C1F4A; font-size: 36px; letter-spacing: 5px; margin: 0; font-family: monospace;">${otp}</h1>
              </div>
              
              <p style="color: #666; font-size: 14px; line-height: 1.6;">
                This code is valid for <strong>10 minutes</strong> and can only be used once.
              </p>
              
              <p style="color: #666; font-size: 14px; line-height: 1.6;">
                If you didn't request this code, please ignore this email.
              </p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p style="color: #999; font-size: 12px; margin: 0;">
                  This is an automated message from PhysioFi. Please do not reply to this email.
                </p>
              </div>
            </div>
          </div>
        `
      };

      const result = await emailTransporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${email}. Message ID: ${result.messageId}`);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Email sending failed:', error.message);
      
      // Fallback: Log to console for development
      console.log(`\n📧 OTP for ${email}: ${otp}\n`);
      console.log('📧 Email sending failed. Check email configuration.\n');
      
      return { success: false, error: error.message };
    }
  }

  // Send OTP via both SMS and Email (preferred method)
  static async sendOTP(phone, email, otp, name = 'User') {
    const results = {
      sms: { success: false, error: null },
      email: { success: false, error: null }
    };

    // Try SMS first
    if (phone) {
      results.sms = await this.sendSMS(phone, otp);
    }

    // Try Email as backup
    if (email) {
      results.email = await this.sendEmail(email, otp, name);
    }

    // Return success if at least one method worked
    const success = results.sms.success || results.email.success;
    
    return {
      success,
      results,
      message: success 
        ? 'OTP sent successfully' 
        : 'Failed to send OTP via SMS and Email. Check console for OTP.'
    };
  }

  // Development mode: Just log OTP to console
  static async sendOTPDev(phone, email, otp, name = 'User') {
    console.log('\n' + '='.repeat(50));
    console.log('🔐 PHYSIOFI OTP - DEVELOPMENT MODE');
    console.log('='.repeat(50));
    console.log(`📱 Phone: ${phone || 'N/A'}`);
    console.log(`📧 Email: ${email || 'N/A'}`);
    console.log(`👤 Name: ${name}`);
    console.log(`🔢 OTP: ${otp}`);
    console.log(`⏰ Valid for: 10 minutes`);
    console.log('='.repeat(50) + '\n');
    
    return { success: true, message: 'OTP logged to console (Development Mode)' };
  }
}

module.exports = OTPService;
