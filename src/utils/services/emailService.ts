import amqp from 'amqplib';

const QUEUE_NAME = process.env.QUEUE_NAME || 'email_queue';
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

export const sendEmailMessage = async (to: string, subject: string, text: string) => {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        
        await channel.assertQueue(QUEUE_NAME, {
            durable: true
        });

        const emailData = JSON.stringify({ to, subject, text });
        channel.sendToQueue(QUEUE_NAME, Buffer.from(emailData), {
            persistent: true // Ensures message is saved to disk
        });

        console.log(`Email message sent to queue: ${emailData}`);

        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('Error sending email message to queue:', error);
        throw error;
    }
};