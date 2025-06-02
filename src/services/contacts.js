import { getContactsController } from '../controllers/contacts.js';
import Contact from '../models/contacts.js';

export const getContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

export const getContactsById = async (id) => {
  const contact = await Contact.findById(id);
  return contact;
};

export const deleteContact = async (id) => {
  const contact = await Contact.findByIdAndDelete(id);
  return contact;
};

export const createContact = async (payload) => {
  const contact = await Contact.create(payload);
  return contact;
};

export const updateContact = async (id, payload) => {
  const contact = await Contact.findByIdAndUpdate(id, payload, { new: true });
  return contact;
};
