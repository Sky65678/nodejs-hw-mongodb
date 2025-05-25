import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import Contact from '../models/contacts.js';

const app = express();

app.use(
  pino({
    transport: {
      target: 'pino-pretty',
    },
  }),
);

app.use(cors());

app.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('Contact not found');
  }
});

app.get('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  const contact = await Contact.findById(id);
  if (contact === null) {
    return res.status(404).send('contact not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully found contact!',
    data: contact,
  });
});

export default app;
