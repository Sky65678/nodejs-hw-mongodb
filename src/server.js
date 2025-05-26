import 'dotenv/config';
import express from 'express';
import { initDatabaseConection } from './db.js';

import cors from 'cors';
import pino from 'pino-http';

import { getContacts, getContactsById } from './services/contacts.js';

export async function setupServer() {
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
      const contacts = await getContacts();
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
    const contact = await getContactsById(id);
    if (contact === null) {
      return res.status(404).send('contact not found');
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully found contact!',
      data: contact,
    });
  });

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  const PORT = process.env.PORT;

  try {
    await initDatabaseConection();

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}

setupServer();
