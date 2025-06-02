import {
  getContacts,
  getContactsById,
  deleteContact,
  createContact,
  updateContact,
} from '../services/contacts.js';
import createError from 'http-errors';
import mongoose from 'mongoose';

async function getContactsController(req, res) {
  const contacts = await getContacts();

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}

async function getContactByIdController(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(404, 'Invalid contact ID');
  }

  const contact = await getContactsById(id);

  if (contact === null) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully found contact!',
    data: contact,
  });
}

async function createContactController(req, res) {
  const contact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
}

async function updateContactController(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(404, 'Invalid contact ID');
  }

  const contact = await updateContact(id, req.body);

  if (contact === null) {
    throw createError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
}

async function deleteContactController(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(404, 'Invalid contact ID');
  }

  const contact = await deleteContact(id);

  if (contact === null) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).end();
}

export {
  getContactsController,
  getContactByIdController,
  deleteContactController,
  createContactController,
  updateContactController,
};
