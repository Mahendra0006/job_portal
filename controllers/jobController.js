import {
  addJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  addApplicant
} from '../models/jobModel.js';
import nodemailer from 'nodemailer';

function paginate(array, page = 1, perPage = 5) {
  const offset = (page - 1) * perPage;
  return {
    items: array.slice(offset, offset + perPage),
    currentPage: page,
    totalPages: Math.ceil(array.length / perPage)
  };
}

export function listJobs(req, res) {
  let jobs = getAllJobs();
  const { search, page } = req.query;
  let filteredJobs = jobs;
  if (search) {
    const q = search.toLowerCase();
    filteredJobs = jobs.filter(
      job =>
        job.jobdesignation.toLowerCase().includes(q) ||
        job.companyname.toLowerCase().includes(q) ||
        job.joblocation.toLowerCase().includes(q)
    );
  }
  const { items, currentPage, totalPages } = paginate(filteredJobs, parseInt(page) || 1, 5);
  res.render('jobs', {
    title: 'All Jobs',
    jobs: items,
    search: search || '',
    currentPage,
    totalPages
  });
}

export function showJobDetails(req, res) {
  const job = getJobById(req.params.id);
  if (!job) {
    return res.status(404).render('404', { title: 'Job Not Found' });
  }
  res.render('jobDetails', { title: job.jobdesignation, job,success: null, error: null });
}

export function showNewJob(req, res) {
  res.render('newJob', { title: 'Post New Job', error: null });
}

export function createJob(req, res) {
  if (req.validationError) {
    return res.render('newJob', { title: 'Post New Job', error: req.validationError });
  }
  const {
    jobcategory, jobdesignation, joblocation, companyname,
    salary, applyBy, skills, openings, description
  } = req.body;
  addJob({
    jobcategory,
    jobdesignation,
    joblocation,
    companyname,
    salary,
    applyBy,
    skills: skills.split(',').map(s => s.trim()),
    openings: Number(openings),
    description,
    recruiterId: req.session.userId,
    recruiterName: req.session.userName
  });
  res.redirect('/jobs');
}

export function showEditJob(req, res) {
  const job = getJobById(req.params.id);
  if (!job || job.recruiterId !== req.session.userId) {
    return res.status(403).render('404', { title: 'Not Authorized' });
  }
  res.render('updateJob', { title: 'Update Job', job, error: null });
}

export function editJob(req, res) {
  const job = getJobById(req.params.id);
  if (!job || job.recruiterId !== req.session.userId) {
    return res.status(403).render('404', { title: 'Not Authorized' });
  }
  if (req.validationError) {
    return res.render('updateJob', { title: 'Update Job', job, error: req.validationError });
  }
  const {
    jobcategory, jobdesignation, joblocation, companyname,
    salary, applyBy, skills, openings, description
  } = req.body;
  updateJob(job.id, {
    jobcategory,
    jobdesignation,
    joblocation,
    companyname,
    salary,
    applyBy,
    skills: skills.split(',').map(s => s.trim()),
    openings: Number(openings),
    description
  });
  res.redirect('/jobs');
}

export function removeJob(req, res) {
  const job = getJobById(req.params.id);
  if (!job || job.recruiterId !== req.session.userId) {
    return res.status(403).render('404', { title: 'Not Authorized' });
  }
  deleteJob(job.id);
  res.redirect('/jobs');
}

// Applicant management
export function listApplicants(req, res) {
  const job = getJobById(req.params.id);
  if (!job || job.recruiterId !== req.session.userId) {
    return res.status(403).render('404', { title: 'Not Authorized' });
  }
  const { page } = req.query;
  const applicants = job.applicants || [];
  const { items, currentPage, totalPages } = paginate(applicants, parseInt(page) || 1, 5);
  res.render('applicants', { title: 'Applicants', job, applicants: items, currentPage, totalPages });
}

export async function applyJob(req, res) {
  const job = getJobById(req.params.id);
  if (!job) {
    return res.status(404).render('404', { title: 'Job Not Found' });
  }
  if (req.validationError) {
    return res.render('jobDetails', { title: job.jobdesignation, job, error: req.validationError });
  }
  const { name, email } = req.body;
  const applicant = {
    id: job.applicants.length + 1,
    name,
    email,
    resume: req.file.filename,
    appliedAt: new Date()
  };
  addApplicant(job.id, applicant);

  // Send confirmation email
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Application Received for ${job.jobdesignation}`,
      text: `Hi ${name},\n\nThank you for applying to ${job.jobdesignation} at ${job.companyname}.\n\nRegards,\nJob Portal`
    });
  }

  res.render('jobDetails', { title: job.jobdesignation, job, success: 'Application submitted successfully!' });
}