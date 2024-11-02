import { expect } from 'chai';
import request from 'supertest';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import messageRouter from '../src/routers/messageRouter.ts';

const app: Express = express();
app.use(bodyParser.json());
app.use(messageRouter);

describe('Message Router', () => {
  describe('POST /emails/send', () => {
    it('should send an email successfully with valid data', async () => {
      const res = await request(app)
        .post('/emails/send')
        .send({
          to: 'recipient@example.com',
          subject: 'Test Subject',
          body: 'This is a test email body'
        });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.message).to.equal('Email sent successfully');
    });

    it('should return validation errors if required fields are missing', async () => {
      const res = await request(app)
        .post('/emails/send')
        .send({
          to: '',
          subject: '',
          body: ''
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('success', false);
      expect(res.body.message).to.include('Recipient email is required');
      expect(res.body.message).to.include('Subject is required');
      expect(res.body.message).to.include('Body is required');
    });

    it('should return an error for invalid email format', async () => {
      const res = await request(app)
        .post('/emails/send')
        .send({
          to: 'invalid-email-format',
          subject: 'Test Subject',
          body: 'This is a test email body'
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('success', false);
      expect(res.body.message).to.include('Invalid email format');
    });
  });
});
