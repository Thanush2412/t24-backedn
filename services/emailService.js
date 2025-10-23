const nodemailer = require('nodemailer');

// Brevo SMTP Configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: '971def001@smtp-brevo.com',
      pass: 'ISnbFdDzrpXKHWJf'
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Email templates
const emailTemplates = {
  contactForm: (data) => ({
    subject: `New Contact Form Submission from ${data.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #8B5CF6, #3B82F6); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
          <h2 style="margin: 0; font-size: 24px;">📧 New Contact Form Submission</h2>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
          <div style="margin-bottom: 15px;">
            <strong style="color: #495057;">👤 Name:</strong>
            <span style="color: #212529;">${data.name}</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #495057;">📧 Email:</strong>
            <span style="color: #212529;">${data.email}</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #495057;">📝 Subject:</strong>
            <span style="color: #212529;">${data.subject || 'General Inquiry'}</span>
          </div>
          
          <div style="margin-bottom: 20px;">
            <strong style="color: #495057;">💬 Message:</strong>
            <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #8B5CF6; margin-top: 5px;">
              ${data.message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; border-left: 4px solid #2196f3;">
            <strong style="color: #1976d2;">📅 Submitted:</strong>
            <span style="color: #424242;">${new Date().toLocaleString()}</span>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
          <p>This email was sent from your TECH24 portfolio contact form.</p>
        </div>
      </div>
    `
  }),

  projectBooking: (data) => ({
    subject: `New Project Booking: ${data.projectTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #8B5CF6, #3B82F6); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
          <h2 style="margin: 0; font-size: 24px;">🎯 New Project Booking</h2>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
          <div style="margin-bottom: 15px;">
            <strong style="color: #495057;">👤 Client Name:</strong>
            <span style="color: #212529;">${data.name}</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #495057;">📧 Email:</strong>
            <span style="color: #212529;">${data.email}</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #495057;">📞 Phone:</strong>
            <span style="color: #212529;">${data.phone || 'Not provided'}</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #495057;">📋 Project Title:</strong>
            <span style="color: #212529;">${data.projectTitle}</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #495057;">🏷️ Project Type:</strong>
            <span style="color: #212529;">${data.projectType || 'Not specified'}</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #495057;">🔧 Technologies:</strong>
            <span style="color: #212529;">${data.languagesUsed || 'Not specified'}</span>
          </div>
          
          <div style="margin-bottom: 20px;">
            <strong style="color: #495057;">📝 Project Description:</strong>
            <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #8B5CF6; margin-top: 5px;">
              ${data.projectDescription.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          ${data.existingProjectDetails ? `
          <div style="margin-bottom: 20px;">
            <strong style="color: #495057;">🔗 Existing Project Details:</strong>
            <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #28a745; margin-top: 5px;">
              ${data.existingProjectDetails.replace(/\n/g, '<br>')}
            </div>
          </div>
          ` : ''}
          
          <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; border-left: 4px solid #2196f3;">
            <strong style="color: #1976d2;">📅 Submitted:</strong>
            <span style="color: #424242;">${new Date().toLocaleString()}</span>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
          <p>This email was sent from your TECH24 portfolio project booking form.</p>
        </div>
      </div>
    `
  }),

  autoReply: (data, type) => ({
    subject: `Thank you for contacting TECH24 - ${type === 'contact' ? 'We received your message' : 'Project booking confirmed'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #8B5CF6, #3B82F6); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
          <h2 style="margin: 0; font-size: 24px;">${type === 'contact' ? '📧 Message Received' : '🎯 Project Booking Confirmed'}</h2>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
          <p style="color: #212529; font-size: 16px; margin-bottom: 20px;">
            Hi <strong>${data.name}</strong>,
          </p>
          
          <p style="color: #495057; line-height: 1.6; margin-bottom: 15px;">
            ${type === 'contact' 
              ? 'Thank you for reaching out! I have received your message and will get back to you within 24 hours.'
              : 'Thank you for your project booking! I have received your project details and will review them carefully. I will contact you within 24 hours to discuss your requirements and provide a detailed proposal.'
            }
          </p>
          
          <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #28a745; margin: 20px 0;">
            <strong style="color: #28a745;">📋 What happens next?</strong>
            <ul style="color: #495057; margin: 10px 0; padding-left: 20px;">
              ${type === 'contact' 
                ? '<li>I will review your message</li><li>Prepare a detailed response</li><li>Contact you within 24 hours</li>'
                : '<li>Review your project requirements</li><li>Prepare a detailed proposal</li><li>Schedule a call to discuss details</li><li>Provide timeline and pricing</li>'
              }
            </ul>
          </div>
          
          <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; border-left: 4px solid #2196f3; margin: 20px 0;">
            <strong style="color: #1976d2;">📞 Contact Information</strong>
            <p style="color: #424242; margin: 5px 0;">
              <strong>Email:</strong> thanushkrishna13@gmail.com<br>
              <strong>Location:</strong> Coimbatore, Tamil Nadu
            </p>
          </div>
          
          <p style="color: #495057; line-height: 1.6; margin-top: 20px;">
            Best regards,<br>
            <strong style="color: #8B5CF6;">Thanush Krishna</strong><br>
            <em style="color: #6c757d;">Full Stack Developer | TECH24</em>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
          <p>This is an automated response from TECH24 Portfolio.</p>
        </div>
      </div>
    `
  })
};

// Send email function
const sendEmail = async (to, template, data) => {
  try {
    const transporter = createTransporter();
    const emailTemplate = emailTemplates[template](data);
    
    const mailOptions = {
      from: '"TECH24 Portfolio" <971def001@smtp-brevo.com>',
      to: to,
      subject: emailTemplate.subject,
      html: emailTemplate.html
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Send notification to admin
const sendAdminNotification = async (data, type) => {
  const adminEmail = 'thanushkrishna13@gmail.com';
  const template = type === 'contact' ? 'contactForm' : 'projectBooking';
  
  return await sendEmail(adminEmail, template, data);
};

// Send auto-reply to client
const sendAutoReply = async (data, type) => {
  return await sendEmail(data.email, 'autoReply', data, type);
};

module.exports = {
  sendEmail,
  sendAdminNotification,
  sendAutoReply,
  emailTemplates
};
