import { expect } from 'chai';
import request from 'supertest';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import contactRouter from '../src/routers/contactRouter';

const app: Express = express();
app.use(bodyParser.json());
app.use(contactRouter);

describe('Contact Router', () => {
  describe('POST /contacts/add', () => {
    it('should return validation errors if required fields are missing', async () => {
      const res = await request(app)
        .post('/contacts/add')
        .send({ fullname: '', email: '', phone: '', address: '' });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('success', false);
      expect(res.body.message).to.include('Fullname is required');
      expect(res.body.message).to.include('Email is required');
      expect(res.body.message).to.include('Phone is required');
    });

    it('should create a new contact when valid data is provided', async () => {
      const res = await request(app)
        .post('/contacts/add')
        .send({
          fullname: 'John Doe',
          email: 'john.doe@example.com',
          phone: '1234567890',
          address: '123 Street Name'
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('success', true);
      expect(res.body.message).to.equal('Contact created successfully');
    });
  });

  describe('PUT /contacts/update/:id', () => {
    it('should return validation errors if required fields are missing in update', async () => {
      const res = await request(app)
        .put('/contacts/update/1')
        .send({ fullname: '', email: '', phone: '', address: '' });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('success', false);
      expect(res.body.message).to.include('Fullname is required');
      expect(res.body.message).to.include('Email is required');
      expect(res.body.message).to.include('Phone is required');
    });

    it('should update a contact when valid data is provided', async () => {
      const res = await request(app)
        .put('/contacts/update/1')
        .send({
          fullname: 'Jane Doe',
          email: 'jane.doe@example.com',
          phone: '0987654321',
          address: '456 Another St'
        });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.message).to.equal('Contact updated successfully');
    });
  });

  describe('GET /contacts', () => {
    it('should return all contacts', async () => {
      const res = await request(app)
        .get('/contacts');

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });
  });

  describe('GET /contacts/detail/:id', () => {
    it('should return contact details for a valid ID', async () => {
      const res = await request(app)
        .get('/contacts/detail/1');

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('id', 1);
      expect(res.body).to.have.property('fullname');
      expect(res.body).to.have.property('email');
      expect(res.body).to.have.property('phone');
      expect(res.body).to.have.property('address');
    });

    it('should return an error for a non-existent contact ID', async () => {
      const res = await request(app)
        .get('/contacts/detail/999');

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('success', false);
      expect(res.body.message).to.equal('Contact not found');
    });
  });

  describe('DELETE /contacts/delete/:id', () => {
    it('should delete a contact with a valid ID', async () => {
      const res = await request(app)
        .delete('/contacts/delete/1');

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.message).to.equal('Contact deleted successfully');
    });

    it('should return an error for a non-existent contact ID', async () => {
      const res = await request(app)
        .delete('/contacts/delete/999');

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('success', false);
      expect(res.body.message).to.equal('Contact not found');
    });
  });
});
