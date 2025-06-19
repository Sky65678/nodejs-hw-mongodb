import * as fs from 'node:fs/promises';

import {
  getContacts,
  getContactsById,
  deleteContact,
  createContact,
  updateContact,
} from '../services/contacts.js';
import createError from 'http-errors';

import { parsePaginationparams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
// import { parseIsFavoriteParams } from '../utils/parseIsFavouriteParams.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

async function getContactsController(req, res) {
  const { page, perPage } = parsePaginationparams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  // const { contactType, isFavourite } = parseIsFavoriteParams(req.query);

  const contacts = await getContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    userId: req.user.id,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}

async function getContactByIdController(req, res) {
  const { id } = req.params;

  const contact = await getContactsById(id, req.user.id);

  if (contact === null) {
    throw createError(404, 'Contact not found');
  }

  if (contact.userId.toString() !== req.user.id.toString()) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully found contact!',
    data: contact,
  });
}

async function createContactController(req, res) {
  let photoUrl = null;

  if (req.file) {
    const result = await uploadToCloudinary(req.file.path);
    await fs.unlink(req.file.path);
    photoUrl = result.secure_url;
  }

  const contact = await createContact({
    ...req.body,
    userId: req.user.id,
    photo: photoUrl,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
}

async function updateContactController(req, res) {
  const { id } = req.params;
  let photoUrl = null;

  if (req.file) {
    const result = await uploadToCloudinary(req.file.path);
    await fs.unlink(req.file.path);
    photoUrl = result.secure_url;
  }

  const updatedData = {
    ...req.body,
  };

  if (photoUrl) {
    updatedData.photo = photoUrl;
  }

  const contact = await updateContact(id, updatedData, req.user.id);

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

  const contact = await deleteContact(id, req.user.id);

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
