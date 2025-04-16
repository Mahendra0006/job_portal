import express from 'express';
import { getApplicant, deleteApplicant } from '../controllers/applicantController.js';
import { ensureAuthenticated } from '../middlewares/auth.js';

const router = express.Router({ mergeParams: true });

router.get('/:applicantId', ensureAuthenticated, getApplicant);
router.get('/:applicantId/delete', ensureAuthenticated, deleteApplicant);

export default router;