import { Request, Response } from 'express';
import amqp from 'amqplib';
import { validationResult } from 'express-validator';
import { createResponse } from '../utils/helpers/response.helper';


const sendEmail = async (req: Request, res: Response): Promise<Response> => {
    
    try {
        const QUEUE_NAME = 'email_queue';
        // Declare all req body
        const { to, subject, text } = req.body;

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg).join(', ');
            return res.status(400).json(createResponse(false, errorMessages, null));
        }

        let connection: amqp.Connection;
        let channel: amqp.Channel;

        connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost'); // Use environment variable
        channel = await connection.createChannel();

        await channel.assertQueue(QUEUE_NAME, {
            durable: true
        });

        // Send message to the queue
        channel.sendToQueue(
            QUEUE_NAME,
            Buffer.from(JSON.stringify({ to, subject, text })),
            { persistent: true }
        );

        // Standard response
        return res.status(200).json(createResponse(true, 'Email request sent to the queue.', null));
    } catch (error) {
        console.error('Error sending email request to the queue:', error);
        return res.status(500).json(createResponse(false, 'Failed to send email request.', null));
    }
};

export { sendEmail };
