import { expect } from 'chai';
import request from 'supertest';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import contactRouter from '../src/routers/contactRouter.ts';

const app: Express = express();
app.use(bodyParser.json());
app.use(contactRouter);

describe('Contact Router', () => {
  describe('POST /contacts/add', () => {
    it('should create a new contact when valid data is provided', async () => {
      const res = await request(app)
        .post('/contacts/add')
        .send({
          fullname: 'John Doe',
          email: 'john.doe@gmail.com',
          phone: '089990009990',
          address: '123 Street Name'
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('status', true);
      expect(res.body.message).to.equal('Contact created successfully');
    });

    it('should return an error when validation fails', async () => {
      const res = await request(app)
        .post('/contacts/add')
        .send({
          fullname: '', // Invalid fullname
          email: '',
          phone: '',
          address: ''
        });

      expect(res.status).to.equal(400); // Assuming a 400 response for validation errors
      expect(res.body).to.have.property('status', false);
      expect(res.body.message).to.equal('Fullname is required., Email is required., Email must contain a valid email address, Phone is required., Phone must a numbers., Address must contain an alpha numeric.');
    });
  });

  describe('PUT /contacts/update/:id', () => {
    it('should return validation errors if required fields are missing in update', async () => {
      const res = await request(app)
        .put('/contacts/update/1')
        .send({ fullname: '', email: '', phone: '', address: '' });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('status', false);
      expect(res.body.message).to.equal('Fullname is required., Email is required., Email must contain a valid email address, Phone is required., Phone must a numbers., Address must contain an alpha numeric.');
    });

    it('should update a contact when valid data is provided', async () => {
      const res = await request(app)
        .put('/contacts/update/5')
        .send({
          fullname: 'Jane Doe',
          email: 'jane.doe@example.com',
          phone: '0987654321',
          address: '456 Another St'
        });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('status', true);
      expect(res.body.message).to.equal('Contact with ID(5) haveb been updated.');
    });
  });

  describe('GET /contacts', () => {
    it('should return all contacts', async () => {
      const res = await request(app)
        .get('/contacts');

      expect(res.status).to.equal(200);
      expect(res.status).to.have.property('status', true);
    });
  });

  describe('GET /contacts/detail/:id', () => {
    it('should return contact details for a valid ID', async () => {
      const res = await request(app)
        .get('/contacts/detail/2');

      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Get detail contact with ID : 2');
      expect(res.body).to.have.property('status', true);
    });

    it('should return an error for a non-existent contact ID', async () => {
      const res = await request(app)
        .get('/contacts/detail/999');

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('status', false);
      expect(res.body.message).to.equal('No contacts found');
    });
  });

  describe('DELETE /contacts/delete/:id', () => {
    it('should delete a contact with a valid ID', async () => {
      const res = await request(app)
        .delete('/contacts/delete/6');

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('status', true);
    });

    it('should return an error for a non-existent contact ID', async () => {
      const res = await request(app)
        .delete('/contacts/delete/999');

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('status', false);
    });
  });
});
