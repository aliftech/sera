import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Contact } from '../models/contacts';
import { Optional, where } from 'sequelize';
import { createResponse } from '../utils/helpers/response.helper';

type ContactCreationAttributes = Optional<Contact, 'address' >;

const createContact = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg).join(', ');
            return res.status(400).json(createResponse(false, errorMessages, null));
        }

        // Destructure validated fields
        const { fullname, phone, email, address } = req.body;

        // Create the new contact
        const newContact = await Contact.create({
            fullname,
            email,
            phone,
            address
        } as ContactCreationAttributes);

        console.log('New Contact Created:', newContact); // Log the new contact object

        return res.status(201).json(createResponse(true, 'Contact created successfully', null));
    } catch (error) {
        console.error('Contact Creation Error:', error);
        return res.status(500).json(createResponse(false, 'Server error: ' + error, null));
    }
};

const getAllContacts = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Fetch all contacts from the database
        const contacts = await Contact.findAll({
            where: {
                deletedAt: null
            }
        });

        // Check if any contacts were found
        if (contacts.length === 0) {
            return res.status(404).json(createResponse(false, 'No contacts found', null));
        }

        // Return the list of contacts
        return res.status(200).json(createResponse(true, 'Contacts retrieved successfully', contacts));
    } catch (error) {
        console.error('Error Fetching Contacts:', error);
        return res.status(500).json(createResponse(false, 'Server error: ' + error, null));
    }
};

const detailContact = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Get req param
        const contactId = req.params.id;

        const contact = await Contact.findOne({
            where: {
                id: contactId,
                deletedAt: null
            }
        });

        // Check if any contacts were found
        if (!contact) {
            return res.status(404).json(createResponse(false, 'No contacts found', null));
        }

        return res.status(200).json(createResponse(true, 'Get detail contact with ID : ' + contactId, contact));
    } catch (error) {
        console.error('Error Fetching Contact:', error);
        return res.status(500).json(createResponse(false, 'Server error: ' + error, null));
    }
}

const updateContact = async (req: Request, res: Response): Promise<Response> => {
    try {
        const contactId = req.params.id;
        const { fullname, phone, email, address } = req.body;

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg).join(', ');
            return res.status(400).json(createResponse(false, errorMessages, null));
        }

        const contact = await Contact.findOne({
            where: {
                id: contactId,
                deletedAt: null,
            },
        });

        if (!contact) {
            return res.status(404).json(createResponse(false, 'No contact found.', null));
        }

        await Contact.update({ ...req.body }, { where: { id: contactId } });
        return res.status(200).json(createResponse(true, `Contact with ID(${contactId}) haveb been updated.`, null));
    } catch (error) {
        console.error('Error updating a contact:', error);
        return res.status(500).json(createResponse(false, 'Server error: ' + error, null));
    }
};

const deleteContact = async (req: Request, res: Response): Promise<Response> => {
    try {
        const contactId = req.params.id;

        // Check if contact exists
        const contact = await Contact.findOne({
            where: { id: contactId, deletedAt: null }
        });

        if (!contact) {
            return res.status(404).json(createResponse(false, 'No contact found.', null));
        }

        // Perform a soft delete
        await contact.destroy();

        return res.status(200).json(createResponse(true, `Contact with ID(${contactId}) has been deleted.`, null));
    } catch (error) {
        console.error('Error deleting a contact:', error);
        return res.status(500).json(createResponse(false, 'Server error: ' + error, null));
    }
};

export {
    createContact,
    getAllContacts,
    detailContact,
    updateContact,
    deleteContact
};
