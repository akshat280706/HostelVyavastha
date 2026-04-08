const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send email function
const sendEmail = async (to, subject, html, text = '') => {
  try {
    const mailOptions = {
      from: `"Hostel Management System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
};

// Welcome email for new student
const sendWelcomeEmail = async (email, name, rollNumber, password) => {
  const subject = 'Welcome to Hostel Management System';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4F46E5;">Welcome ${name}!</h2>
      <p>Your account has been successfully created in the Hostel Management System.</p>
      <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>Login Credentials:</h3>
        <p><strong>Roll Number:</strong> ${rollNumber}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
      </div>
      <p>Please change your password after first login.</p>
      <a href="${process.env.FRONTEND_URL}/login" style="background: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login Now</a>
      <p style="margin-top: 20px; color: #6b7280;">Regards,<br>Hostel Management Team</p>
    </div>
  `;
  
  return await sendEmail(email, subject, html);
};

// Complaint status update email
const sendComplaintStatusEmail = async (email, name, complaintTitle, status, remark = '') => {
  const subject = `Complaint Update: ${complaintTitle}`;
  const statusColors = {
    'pending': '#F59E0B',
    'in-progress': '#3B82F6',
    'resolved': '#10B981',
    'rejected': '#EF4444'
  };
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Hello ${name},</h2>
      <p>Your complaint <strong>"${complaintTitle}"</strong> has been updated.</p>
      <div style="background: ${statusColors[status] || '#6B7280'}; color: white; padding: 10px; border-radius: 5px; text-align: center;">
        <strong>New Status: ${status.toUpperCase()}</strong>
      </div>
      ${remark ? `<p><strong>Remarks:</strong> ${remark}</p>` : ''}
      <p>You can track your complaint in the dashboard.</p>
      <a href="${process.env.FRONTEND_URL}/complaints" style="background: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Complaint</a>
    </div>
  `;
  
  return await sendEmail(email, subject, html);
};

// Leave request approval email
const sendLeaveStatusEmail = async (email, name, fromDate, toDate, status, reason = '') => {
  const subject = `Leave Request ${status}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Dear ${name},</h2>
      <p>Your leave request from <strong>${fromDate}</strong> to <strong>${toDate}</strong> has been <strong>${status.toUpperCase()}</strong>.</p>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
      <p>For any queries, please contact the hostel office.</p>
    </div>
  `;
  
  return await sendEmail(email, subject, html);
};

// Fee reminder email
const sendFeeReminderEmail = async (email, name, amount, dueDate) => {
  const subject = 'Fee Payment Reminder';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #EF4444;">Fee Payment Reminder</h2>
      <p>Dear ${name},</p>
      <p>This is a reminder that your hostel fee of <strong>₹${amount}</strong> is due on <strong>${dueDate}</strong>.</p>
      <p>Please make the payment before the due date to avoid late fees.</p>
      <a href="${process.env.FRONTEND_URL}/fees" style="background: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Pay Now</a>
    </div>
  `;
  
  return await sendEmail(email, subject, html);
};

// Password reset email
const sendPasswordResetEmail = async (email, name, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const subject = 'Password Reset Request';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Reset Your Password</h2>
      <p>Hello ${name},</p>
      <p>You requested to reset your password. Click the button below to set a new password.</p>
      <a href="${resetUrl}" style="background: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `;
  
  return await sendEmail(email, subject, html);
};

// Notice broadcast email
const sendNoticeEmail = async (emails, title, content) => {
  const subject = `New Notice: ${title}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4F46E5;">📢 New Notice</h2>
      <h3>${title}</h3>
      <p>${content}</p>
      <p>Please check the portal for more details.</p>
    </div>
  `;
  
  // Send to multiple recipients
  const results = [];
  for (const email of emails) {
    const result = await sendEmail(email, subject, html);
    results.push(result);
  }
  
  return results;
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendComplaintStatusEmail,
  sendLeaveStatusEmail,
  sendFeeReminderEmail,
  sendPasswordResetEmail,
  sendNoticeEmail
};