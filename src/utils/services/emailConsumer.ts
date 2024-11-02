import amqp from 'amqplib';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const QUEUE_NAME = 'email_queue';
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

interface EmailMessage {
  to: string;
  subject: string;
  text: string;
}

async function consumeEmailQueue(): Promise<void> {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log(`Waiting for messages in ${QUEUE_NAME}...`);

    channel.consume(
      QUEUE_NAME,
      async (msg) => {
        if (msg !== null) {
          const { to, subject, text }: EmailMessage = JSON.parse(msg.content.toString());

          // Set up Nodemailer transporter
          const transporter = nodemailer.createTransport({
            service: 'gmail', // Update this to your email provider
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });

          // Attempt to send email
          try {
            await transporter.sendMail({
              from: process.env.EMAIL_USER,
              to,
              subject,
              text,
            });
            console.log(`Email sent to ${to}`);
            channel.ack(msg); // Acknowledge message if email sent successfully
          } catch (error) {
            console.error('Error sending email:', error);
          }
        }
      },
      { noAck: false } // Enable message acknowledgment
    );
  } catch (error) {
    console.error('Error in consumer:', error);
  }
}

// Start the consumer
consumeEmailQueue().catch((error) => console.error('Consumer failed to start:', error));
