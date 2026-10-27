const http = require('http');
const fs = require('fs');
const path = require('path');

// Helper to make HTTP JSON requests
function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data, headers: res.headers });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

// Helper to make Multipart form request for file upload
function makeMultipartRequest(options, fields, filePath, fileField) {
  return new Promise((resolve, reject) => {
    const boundary = '----CareerConnectFormBoundary' + Date.now();
    options.headers = {
      ...options.headers,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    let body = '';
    for (const [key, val] of Object.entries(fields)) {
      body += `--${boundary}\r\n`;
      body += `Content-Disposition: form-data; name="${key}"\r\n\r\n`;
      body += `${val}\r\n`;
    }

    const fileContent = fs.readFileSync(filePath);
    const filename = path.basename(filePath);

    req.write(body);

    const fileHeader =
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="${fileField}"; filename="${filename}"\r\n` +
      `Content-Type: application/pdf\r\n\r\n`;

    req.write(fileHeader);
    req.write(fileContent);
    req.write(`\r\n--${boundary}--\r\n`);
    req.end();
  });
}

async function runTestSuite() {
  console.log('====================================================');
  console.log('   CAREERCONNECT COMPREHENSIVE API TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const health = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/health',
      method: 'GET',
    });
    assert(health.status === 200 && health.data.status === 'online', '1. Server Health Check API');

    // 2. Reject self-registration as admin
    const adminRegAttempt = await makeRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        name: 'Hacker',
        email: 'hacker@example.com',
        password: 'password123',
        role: 'admin',
      }
    );
    assert(
      adminRegAttempt.status === 403 && adminRegAttempt.data.success === false,
      '2. Security: Prevent user self-registration as "admin" role'
    );

    // 3. Register candidate
    const timestamp = Date.now();
    const candidateReg = await makeRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        name: 'Test Candidate',
        email: `candidate_${timestamp}@test.com`,
        password: 'Password123!',
        role: 'candidate',
        title: 'Software Developer',
      }
    );
    assert(
      candidateReg.status === 201 && candidateReg.data.token,
      '3. Candidate Registration'
    );
    const candidateToken = candidateReg.data.token;

    // 4. Register employer
    const employerReg = await makeRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        name: 'Test Employer',
        email: `employer_${timestamp}@test.com`,
        password: 'Password123!',
        role: 'employer',
        company: 'InnovateX Labs',
      }
    );
    assert(
      employerReg.status === 201 && employerReg.data.token,
      '4. Employer Registration'
    );
    const employerToken = employerReg.data.token;

    // 5. Duplicate email rejection
    const duplicateEmail = await makeRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        name: 'Another User',
        email: `candidate_${timestamp}@test.com`,
        password: 'Password123!',
        role: 'candidate',
      }
    );
    assert(
      duplicateEmail.status === 400 && duplicateEmail.data.success === false,
      '5. Validation: Reject duplicate email registration'
    );

    // 6. Login authentication (Admin)
    const adminLogin = await makeRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        email: 'admin@careerconnect.com',
        password: 'AdminPassword@123',
      }
    );
    assert(
      adminLogin.status === 200 && adminLogin.data.user.role === 'admin',
      '6. Admin Login with initialized credentials'
    );
    const adminToken = adminLogin.data.token;

    // 7. Employer creates a job -> Verify pending status
    const newJob = await makeRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/jobs',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${employerToken}`,
        },
      },
      {
        title: 'Staff Platform Architect',
        company: 'InnovateX Labs',
        category: 'Technology & IT',
        location: 'Remote',
        employmentType: 'Full-time',
        salaryRange: '$160,000 - $190,000 / year',
        experienceLevel: 'Lead / Manager',
        requiredSkills: ['Node.js', 'MongoDB', 'Docker', 'Kubernetes'],
        description: 'Lead next-generation platform architecture and microservices design.',
      }
    );
    assert(
      newJob.status === 201 && newJob.data.data.status === 'pending',
      '7. Employer creates job posting (defaults to "pending" approval)'
    );
    const createdJobId = newJob.data.data._id;

    // 8. Public jobs view -> Pending job should NOT be visible to public
    const publicJobs = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/jobs',
      method: 'GET',
    });
    const foundInPublic = publicJobs.data.data.some((j) => j._id === createdJobId);
    assert(
      publicJobs.status === 200 && !foundInPublic,
      '8. Moderation: Pending job is hidden from public job board'
    );

    // 9. Admin approves the job posting
    const approveJob = await makeRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: `/api/admin/jobs/${createdJobId}/status`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
      },
      { status: 'approved' }
    );
    assert(
      approveJob.status === 200 && approveJob.data.data.status === 'approved',
      '9. Admin approves job posting'
    );

    // 10. Public jobs view -> Approved job is now visible!
    const publicJobsAfter = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/jobs',
      method: 'GET',
    });
    const foundAfterApproval = publicJobsAfter.data.data.some((j) => j._id === createdJobId);
    assert(
      foundAfterApproval,
      '10. Moderation: Approved job is now visible in public job board'
    );

    // 11. Candidate applies for the approved job with a PDF resume
    const sampleResumePath = path.join(__dirname, 'uploads', 'resumes', 'sample-candidate-resume.pdf');
    const application = await makeMultipartRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: `/api/applications/${createdJobId}`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${candidateToken}`,
        },
      },
      { coverLetter: 'I am excited to apply for this Platform Architect position!' },
      sampleResumePath,
      'resume'
    );
    assert(
      application.status === 201 && application.data.success === true,
      '11. Candidate submits application with PDF resume & cover letter'
    );

    // 12. Candidate attempts duplicate application to the same job
    const dupApp = await makeMultipartRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: `/api/applications/${createdJobId}`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${candidateToken}`,
        },
      },
      { coverLetter: 'Submitting again...' },
      sampleResumePath,
      'resume'
    );
    assert(
      dupApp.status === 400 && dupApp.data.success === false,
      '12. Constraint: Candidate cannot submit duplicate applications for the same job'
    );

    // 13. Candidate views their own applications
    const myApps = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/applications/my-applications',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${candidateToken}`,
      },
    });
    assert(
      myApps.status === 200 && myApps.data.count >= 1,
      '13. Candidate retrieves their submitted applications'
    );

    // 14. Employer views applications for their own job
    const jobApps = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: `/api/applications/job/${createdJobId}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${employerToken}`,
      },
    });
    assert(
      jobApps.status === 200 && jobApps.data.count === 1,
      '14. Employer retrieves candidate applications for their own job posting'
    );

    // 15. Cross-employer authorization check: Another employer cannot edit this job
    const anotherEmployerReg = await makeRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        name: 'Rival Employer',
        email: `rival_${timestamp}@test.com`,
        password: 'Password123!',
        role: 'employer',
        company: 'Rival Corp',
      }
    );
    const rivalToken = anotherEmployerReg.data.token;

    const unauthorizedEdit = await makeRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: `/api/jobs/${createdJobId}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${rivalToken}`,
        },
      },
      { title: 'Hijacked Job Title' }
    );
    assert(
      unauthorizedEdit.status === 403,
      '15. Access Control: Employer cannot modify another employer\'s job posting'
    );

    // 16. Admin Dashboard statistics overview
    const adminDash = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/dashboard',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    assert(
      adminDash.status === 200 &&
        adminDash.data.stats &&
        adminDash.data.stats.jobs.total > 0,
      '16. Admin Dashboard aggregates accurate platform-wide metrics'
    );

    console.log('\n====================================================');
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

// Start backend server in-process if not already running, then execute
const app = require('./server');
setTimeout(() => {
  runTestSuite();
}, 1000);
