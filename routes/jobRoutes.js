import express from 'express';
import {
  listJobs,
  showJobDetails,
  showNewJob,
  createJob,
  showEditJob,
  editJob,
  removeJob,
  applyJob,
  listApplicants
} from '../controllers/jobController.js';
import { ensureAuthenticated } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';
import { validateJobFields, validateApplicantFields } from '../middlewares/validation.js';

const router = express.Router();

router.get('/', listJobs);
router.get('/new', ensureAuthenticated, showNewJob);
router.post('/', ensureAuthenticated, validateJobFields, createJob);
router.get('/:id', showJobDetails);
router.get('/:id/edit', ensureAuthenticated, showEditJob);
router.post('/:id/edit', ensureAuthenticated, validateJobFields, editJob);
router.get('/:id/delete', ensureAuthenticated, removeJob);

router.post('/:id/apply', upload.single('resume'), validateApplicantFields, applyJob);
router.get('/:id/applicants', ensureAuthenticated, listApplicants);

export default router;