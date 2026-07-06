import { api } from './api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

function handleAuthFailure(message) {
  const normalized = String(message || '').toLowerCase();
  if (normalized.includes('invalid token') || normalized.includes('not authorized') || normalized.includes('admin access required')) {
    if (!window.__authTokenAlertShown) {
      window.__authTokenAlertShown = true;
      alert('Your admin session has expired. Please log in again.');
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
      setTimeout(() => {
        window.__authTokenAlertShown = false;
      }, 1000);
    }
  }
}

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function uploadMultipart(path, formData, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${BASE_URL}${path}`);

    Object.entries(getAuthHeaders()).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && typeof onProgress === 'function') {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      let data = null;
      try {
        data = xhr.responseText ? JSON.parse(xhr.responseText) : null;
      } catch {
        data = null;
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data);
        return;
      }
      handleAuthFailure(data?.message);
      reject(new Error(data?.message || `Request failed with status ${xhr.status}`));
    };

    xhr.onerror = () => reject(new Error('Upload failed'));
    xhr.send(formData);
  });
}

export const adminApi = {
  login: (payload) => api.post('/auth/login', payload),
  listServices: () => api.get('/admin/services'),
  createService: (payload) => api.post('/admin/services', payload),
  updateService: (id, payload) => api.put(`/admin/services/${id}`, payload),
  deleteService: (id) => api.del(`/admin/services/${id}`),
  listTeam: () => api.get('/admin/team'),
  createTeam: (payload) => api.post('/admin/team', payload),
  updateTeam: (id, payload) => api.put(`/admin/team/${id}`, payload),
  deleteTeam: (id) => api.del(`/admin/team/${id}`),
  listBlogs: () => api.get('/admin/blogs'),
  createBlog: (payload) => api.post('/admin/blogs', payload),
  updateBlog: (id, payload) => api.put(`/admin/blogs/${id}`, payload),
  deleteBlog: (id) => api.del(`/admin/blogs/${id}`),
  listInquiries: () => api.get('/admin/contact'),
  updateInquiry: (id, payload) => api.put(`/admin/contact/${id}`, payload),
  deleteInquiry: (id) => api.del(`/admin/contact/${id}`),
  saveHomeVideo: (payload) => api.post('/home-video', payload),
  getHomeVideo: () => api.get('/home-video'),
  listAchievements: () => api.get('/admin/achievements'),
  createAchievement: (payload) => api.post('/admin/achievements', payload),
  updateAchievement: (id, payload) => api.put(`/admin/achievements/${id}`, payload),
  deleteAchievement: (id) => api.del(`/admin/achievements/${id}`),
  getAboutPage: () => api.get('/admin/about'),
  saveAboutPage: (payload) => api.put('/admin/about', payload),
  getCareersPage: () => api.get('/admin/careers'),
  saveCareersPage: (payload) => api.put('/admin/careers', payload),
  getGalleryPage: () => api.get('/admin/gallery'),
  saveGalleryPage: (payload) => api.put('/admin/gallery', payload),
  getPrivacyPolicyPage: () => api.get('/admin/privacy-policy'),
  savePrivacyPolicyPage: (payload) => api.put('/admin/privacy-policy', payload),
  getContactPage: () => api.get('/admin/contact-page'),
  saveContactPage: (payload) => api.put('/admin/contact-page', payload),
  listSitePages: () => api.get('/admin/site-pages'),
  createSitePage: (payload) => api.post('/admin/site-pages', payload),
  updateSitePage: (id, payload) => api.put(`/admin/site-pages/${id}`, payload),
  deleteSitePage: (id) => api.del(`/admin/site-pages/${id}`),
  getSitePageBySlug: (slug) => api.get(`/admin/site-pages/${slug}`),
  uploadFile: async ({ file, resourceType = 'image', onProgress } = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('resourceType', resourceType);
    return uploadMultipart('/uploads', formData, onProgress);
  }
};
