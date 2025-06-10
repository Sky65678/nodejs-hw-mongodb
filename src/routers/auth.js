import express from 'express';

import { validateBody } from '../middlewares/validateBody.js';

const router = express.Router();
const jsonParser = express.json();

router.post('', jsonParser);

export default router;
