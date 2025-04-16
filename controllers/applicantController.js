import { getJobById } from '../models/jobModel.js';

export function getApplicant(req, res) {
  const job = getJobById(req.params.id);
  if (!job || job.recruiterId !== req.session.userId) {
    return res.status(403).render('404', { title: 'Not Authorized' });
  }
  const applicant = job.applicants.find(a => a.id === Number(req.params.applicantId));
  if (!applicant) {
    return res.status(404).render('404', { title: 'Applicant Not Found' });
  }
  res.render('applicantDetails', { title: 'Applicant Details', applicant, job });
}

export function deleteApplicant(req, res) {
  const job = getJobById(req.params.id);
  if (!job || job.recruiterId !== req.session.userId) {
    return res.status(403).render('404', { title: 'Not Authorized' });
  }
  const index = job.applicants.findIndex(a => a.id === Number(req.params.applicantId));
  if (index !== -1) {
    job.applicants.splice(index, 1);
  }
  res.redirect(`/jobs/${job.id}/applicants`);
}