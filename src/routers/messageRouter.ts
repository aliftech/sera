import express, { Request, Response, NextFunction } from 'express';
import { sendEmail } from '../controllers/mail.controller';
import { ValidateEmail } from '../utils/middleware/validator/emailValidator';

const messageRouter = express.Router();

messageRouter.post('/emails/send',ValidateEmail, async (req: Request, res: Response, next: NextFunction) => {
    try {
      await sendEmail(req, res);
    } catch (error) {
      next(error); // Pass errors to the error-handling middleware
    }
  });

export default messageRouter;