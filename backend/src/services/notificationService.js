import { prisma } from '../config/db.js';

export async function queueNotification({ channel, recipient, message, referenceId }) {
  // Hook Twilio/WhatsApp/SMTP providers here for production.
  return prisma.notificationLog.create({
    data: {
      channel,
      recipient,
      message,
      referenceId,
      status: 'QUEUED'
    }
  });
}
