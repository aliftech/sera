import express, { Request, Response, NextFunction } from 'express';
import { createContact, getAllContacts, detailContact, updateContact, deleteContact } from '../controllers/contact.controller';
import { validateContact } from '../utils/middleware/validator/contactValidator';

const contactRouter = express.Router();

// Use `validateContact` as middleware for routes that require validation
contactRouter.post('/contacts/add', validateContact, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await createContact(req, res);
  } catch (error) {
    next(error); // Pass errors to the error-handling middleware
  }
});

contactRouter.put('/contacts/update/:id', validateContact, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await updateContact(req, res);
  } catch (error) {
    next(error); // Pass errors to the error-handling middleware
  }
});

contactRouter.get('/contacts', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getAllContacts(req, res);
  } catch (error) {
    next(error); // Pass errors to the error-handling middleware
  }
});

contactRouter.get('/contacts/detail/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await detailContact(req, res);
  } catch (error) {
    next(error); // Pass errors to the error-handling middleware
  }
});

contactRouter.delete('/contacts/delete/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteContact(req, res);
  } catch (error) {
    next(error); // Pass errors to the error-handling middleware
  }
});

// Error handling middleware
contactRouter.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error for debugging
  res.status(500).json({ message: 'Internal Server Error' }); // Send error response
});

export default contactRouter;
