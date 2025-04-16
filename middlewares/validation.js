export function validateJobFields(req, res, next) {
  const { jobcategory, jobdesignation, joblocation, companyname, salary, applyBy, skills, openings, description } = req.body;
  if (!jobcategory || !jobdesignation || !joblocation || !companyname || !salary || !applyBy || !skills || !openings || !description) {
    req.validationError = 'All fields are required.';
    return next();
  }
  next();
}

export function validateApplicantFields(req, res, next) {
  const { name, email } = req.body;
  if (!name || !email || !req.file) {
    req.validationError = 'All fields and resume are required.';
    return next();
  }
  next();
}