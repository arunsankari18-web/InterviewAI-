import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('interview_ai_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Automatically strip manual Content-Type when sending FormData so browser attaches multipart boundary!
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

// Handle 401 unauthorized
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      // Clear token if invalid
      if (window.location.pathname.startsWith('/app')) {
        localStorage.removeItem('interview_ai_token');
        localStorage.removeItem('interview_ai_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  googleLogin: (data) => api.post('/auth/google-login', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  getMe: () => api.get('/auth/me')
};

export const profileApi = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
  uploadResume: (formData) => api.post('/profile/upload-resume', formData),
  uploadResumeText: (resumeText) => api.post('/profile/upload-resume', { resumeText }),
  deleteResume: () => api.delete('/profile/resume'),
  updateResumeClaims: (claims) => api.put('/profile/resume-claims', { claims }),
  addResumeClaim: (claim) => api.post('/profile/resume-claims', claim),
  deleteResumeClaim: (claimId) => api.delete(`/profile/resume-claims/${claimId}`),
  updateSkills: (skills) => api.put('/profile/skills', { skills })
};

export const companyApi = {
  getCompanies: () => api.get('/companies'),
  getCompanyBySlug: (slug) => api.get(`/companies/${slug}`),
  compareCompanies: (slugA, slugB) => api.get(`/companies/compare/${slugA}/${slugB}`)
};

export const interviewApi = {
  startInterview: (data) => api.post('/interviews/start', data),
  submitAnswer: (sessionId, data) => api.post(`/interviews/${sessionId}/answer`, data),
  finishInterview: (sessionId, data) => api.post(`/interviews/${sessionId}/finish`, data),
  getSessions: () => api.get('/interviews/sessions')
};

export const resumeDefenseApi = {
  initiate: () => api.post('/resume-defense/initiate'),
  submitInterrogation: (defenseId, data) => api.post(`/resume-defense/${defenseId}/interrogate`, data),
  getDefenseSession: (defenseId) => api.get(`/resume-defense/${defenseId}`)
};

export const technicalApi = {
  getProblems: (params) => api.get('/technical/problems', { params }),
  getProblemById: (id) => api.get(`/technical/problems/${id}`),
  executeCode: (data) => api.post('/technical/execute', data),
  submitDefense: (data) => api.post('/technical/defense', data)
};

export const autopsyApi = {
  getReport: (sessionId) => api.get(`/autopsy/${sessionId}`)
};

export const readinessApi = {
  getReadiness: () => api.get('/readiness')
};

export const challengeApi = {
  getModes: () => api.get('/challenges/modes'),
  startChallenge: (data) => api.post('/challenges/start', data),
  submitChallenge: (data) => api.post('/challenges/submit', data)
};

export const adminApi = {
  getMetrics: () => api.get('/admin/metrics'),
  getCandidates: () => api.get('/admin/candidates'),
  getInterviews: () => api.get('/admin/interviews'),
  getAuditLogs: () => api.get('/admin/audit-logs'),
  deleteCandidate: (id) => api.delete(`/admin/candidates/${id}`)
};

export const chatApi = {
  ask: (data) => api.post('/chat/ask', data)
};

export default api;
