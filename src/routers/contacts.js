import express from 'express';

import {
  getContactsController,
  getContactByIdController,
  deleteContactController,
  createContactController,
  updateContactController,
} from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';

import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contact.js';

const router = express.Router();
const jsonParser = express.json();

router.get('/', ctrlWrapper(getContactsController));

router.get('/:id', isValidId, ctrlWrapper(getContactByIdController));

router.delete('/:id', isValidId, ctrlWrapper(deleteContactController));

router.post(
  '/',
  jsonParser,
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

router.patch(
  '/:id',
  isValidId,
  jsonParser,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController),
);

export default router;
