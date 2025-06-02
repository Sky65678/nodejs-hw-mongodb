import express from 'express';

import {
  getContactsController,
  getContactByIdController,
  deleteContactController,
  createContactController,
  updateContactController,
} from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();
const jsonParser = express.json();

router.get('/', ctrlWrapper(getContactsController));

router.get('/:id', ctrlWrapper(getContactByIdController));

router.delete('/:id', ctrlWrapper(deleteContactController));

router.post('/', jsonParser, ctrlWrapper(createContactController));

router.patch('/:id', jsonParser, ctrlWrapper(updateContactController));

export default router;
