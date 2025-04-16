const jobs = [];
let jobIdCounter = 1;

export function addJob(job) {
  const newJob = { ...job, id: jobIdCounter++, applicants: [], jobPosted: new Date() };
  jobs.push(newJob);
  return newJob;
}

export function getAllJobs() {
  return jobs;
}

export function getJobById(id) {
  return jobs.find(j => j.id === Number(id));
}

export function updateJob(id, updatedFields) {
  const job = getJobById(id);
  if (job) {
    Object.assign(job, updatedFields);
    return job;
  }
  return null;
}

export function deleteJob(id) {
  const index = jobs.findIndex(j => j.id === Number(id));
  if (index !== -1) {
    jobs.splice(index, 1);
    return true;
  }
  return false;
}

export function addApplicant(jobId, applicant) {
  const job = getJobById(jobId);
  if (job) {
    job.applicants.push(applicant);
    return applicant;
  }
  return null;
}

export function getApplicants(jobId) {
  const job = getJobById(jobId);
  return job ? job.applicants : [];
}