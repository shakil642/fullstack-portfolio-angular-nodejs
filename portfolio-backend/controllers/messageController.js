import {
    createMessage as saveMessage,
    getAllMessagesAdmin,
    toggleMessageReadStatus,
    deleteMessageById
} from '../queries/messageQueries.js';
import { sendEmail } from '../utils/sendEmail.js';

// --- Public Controller ---
export const createNewMessage = async (req, res) => {
  try {
    // 1. Save the message to the database
    const newMessage = await saveMessage(req.body);

    const formattedMessage = (newMessage.message || '').replace(/\n/g, '<br>');
        const receivedAt = new Date().toLocaleString();

        const emailOptions = {
          // keep original key for compatibility with existing sendEmail util
          email: process.env.EMAIL_USER, // Send the email to yourself

          // also provide full nodemailer-style fields for richer behavior
          from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_USER,
          replyTo: `${newMessage.name} <${newMessage.email}>`,

          subject: `Portfolio Contact: ${newMessage.name} — ${newMessage.email}`,

          // plain-text fallback
          text: `
New contact form submission

Name: ${newMessage.name}
Email: ${newMessage.email}
Received: ${receivedAt}

Message:
${newMessage.message || ''}
      `.trim(),

      // polished HTML layout
      html: `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#222; line-height:1.5; max-width:680px; margin:0 auto;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse; background:#ffffff; border:1px solid #e6e9ee; border-radius:8px; overflow:hidden;">
      <tr>
        <td style="padding:20px 24px; text-align:left;">
          <h2 style="margin:0 0 8px 0; font-size:18px; color:#0d6efd;">Potential Client/Job Opportunity</h2>
          <p style="margin:0 0 12px 0; color:#6c757d; font-size:13px;">You have received a new message via your portfolio contact form.</p>

          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:12px; border-collapse:collapse;">
            <tr>
              <td style="padding:8px 0; width:140px; font-weight:600; color:#495057;">Name</td>
              <td style="padding:8px 0; color:#212529;">${newMessage.name}</td>
            </tr>
            <tr>
              <td style="padding:8px 0; font-weight:600; color:#495057;">Email</td>
              <td style="padding:8px 0; color:#212529;"><a href="mailto:${newMessage.email}" style="color:#0d6efd; text-decoration:none;">${newMessage.email}</a></td>
            </tr>
            <tr>
              <td style="padding:8px 0; font-weight:600; color:#495057;">Received</td>
              <td style="padding:8px 0; color:#212529;">${receivedAt}</td>
            </tr>
          </table>

          <hr style="border:none; border-top:1px solid #eef0f3; margin:18px 0;" />

          <div style="background:#f8f9fb; padding:14px; border-radius:6px; color:#333;">
            <strong style="display:block; margin-bottom:8px; color:#495057;">Message</strong>
            <div style="font-size:14px; line-height:1.6; color:#212529;">${formattedMessage}</div>
          </div>

          <p style="margin:18px 0 0 0; font-size:12px; color:#8891a6;">This email was generated from your portfolio contact form. Replying to this message will send your response to the sender listed above.</p>
        </td>
      </tr>
    </table>

    <p style="text-align:center; font-size:12px; color:#a1a9b8; margin:14px 0 0 0;">&copy; ${new Date().getFullYear()} Your Name / Your Company</p>
  </div>
      `
    };
    // --- END: Updated professional email template ---

    await sendEmail(emailOptions);

    res.status(201).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ message: 'Server error while sending message' });
  }
};

// --- NEW Admin Controllers ---

export const getAllMessages = async (req, res) => {
  try {
    const messages = await getAllMessagesAdmin();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching messages' });
  }
};

export const toggleReadStatus = async (req, res) => {
  try {
    const updatedMessage = await toggleMessageReadStatus(req.params.id);
    if (!updatedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating message' });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    await deleteMessageById(req.params.id);
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting message' });
  }
};