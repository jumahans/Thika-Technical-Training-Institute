// src/api/api.js

import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/"
// const BASE_URL = "https://thika-technical-training-institute.onrender.com/"

// ── AXIOS INSTANCE ────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ── REQUEST INTERCEPTOR — attach token ────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── RESPONSE INTERCEPTOR — auto refresh token ─────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = localStorage.getItem("refresh_token");
        const res = await axios.post(`${BASE_URL}/auth/token/refresh/`, { refresh });
        localStorage.setItem("access_token", res.data.access);
        original.headers.Authorization = `Bearer ${res.data.access}`;
        return api(original);
      } catch {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────────────────────

export const authAPI = {

  register: (data) =>
    api.post("/auth/register/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  login: (data) =>
    api.post("/auth/login/", data),

  logout: () =>
    api.post("/auth/logout/", {
      refresh: localStorage.getItem("refresh_token"),
    }),

  refreshToken: () =>
    api.post("/auth/token/refresh/", {
      refresh: localStorage.getItem("refresh_token"),
    }),

  getProfile: () =>
    api.get("/auth/profile/"),

  updateProfile: (data) =>
    api.patch("/auth/profile/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  changePassword: (data) =>
    api.post("/auth/change-password/", data),
};

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────

export const dashboardAPI = {

  getDashboard: () =>
    api.get("/dashboard/"),
};

// ─────────────────────────────────────────────────────────────────────────────
// EVENTS
// ─────────────────────────────────────────────────────────────────────────────

export const eventsAPI = {

  getEvents: () =>
    api.get("/events/"),

  getEvent: (id) =>
    api.get(`/events/${id}/`),
};

// ─────────────────────────────────────────────────────────────────────────────
// UNITS
// ─────────────────────────────────────────────────────────────────────────────

export const unitsAPI = {

  getUnits: () =>
    api.get("/units/"),
    getAvailableUnits: () => api.get("/units/available/"), 
};

// ─────────────────────────────────────────────────────────────────────────────
// UNIT REGISTRATION
// ─────────────────────────────────────────────────────────────────────────────

export const unitRegistrationAPI = {

  getRegistrations: () =>
    api.get("/unit-registration/"),

  getRegistration: (id) =>
    api.get(`/unit-registration/${id}/`),

  createRegistration: (data) =>
    api.post("/unit-registration/", data),
};

// ─────────────────────────────────────────────────────────────────────────────
// ACADEMIC RESULTS
// ─────────────────────────────────────────────────────────────────────────────

export const resultsAPI = {

  getResults: () =>
    api.get("/results/"),
};

// ─────────────────────────────────────────────────────────────────────────────
// EXAM CARD
// ─────────────────────────────────────────────────────────────────────────────

export const examCardAPI = {

  getExamCards: () =>
    api.get("/exam-card/"),
};

// ─────────────────────────────────────────────────────────────────────────────
// FEES
// ─────────────────────────────────────────────────────────────────────────────

export const feesAPI = {

  getFeeStructure: () =>
    api.get("/fees/structure/"),

  getPayments: () =>
    api.get("/fees/payments/"),

  getFeeSummary: () =>
    api.get("/fees/summary/"),
};

// ─────────────────────────────────────────────────────────────────────────────
// CLEARANCE
// ─────────────────────────────────────────────────────────────────────────────

export const clearanceAPI = {

  getClearance: () =>
    api.get("/clearance/"),
};

// ─────────────────────────────────────────────────────────────────────────────
// HOSTEL
// ─────────────────────────────────────────────────────────────────────────────

export const hostelAPI = {

  getHostels: () =>
    api.get("/hostel/"),

  getRooms: () =>
    api.get("/hostel/rooms/"),

  getBookings: () =>
    api.get("/hostel/bookings/"),

  createBooking: (data) =>
    api.post("/hostel/bookings/", data),
};

// ─────────────────────────────────────────────────────────────────────────────
// DISCIPLINARY
// ─────────────────────────────────────────────────────────────────────────────

export const disciplinaryAPI = {

  getCases: () =>
    api.get("/disciplinary/"),
};

// ─────────────────────────────────────────────────────────────────────────────
// REPORTING
// ─────────────────────────────────────────────────────────────────────────────

export const reportingAPI = {

  getReporting: () =>
    api.get("/reporting/"),

  createReporting: (data) =>
    api.post("/reporting/", data),
};

// ─────────────────────────────────────────────────────────────────────────────
// ATTACHMENTS
// ─────────────────────────────────────────────────────────────────────────────

export const attachmentsAPI = {

  getAttachments: () =>
    api.get("/attachments/"),

  getAttachment: (id) =>
    api.get(`/attachments/${id}/`),

  createAttachment: (data) =>
    api.post("/attachments/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  updateAttachment: (id, data) =>
    api.patch(`/attachments/${id}/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

// ─────────────────────────────────────────────────────────────────────────────
// STUDENT FORMS
// ─────────────────────────────────────────────────────────────────────────────

export const studentFormsAPI = {

  getForms: () =>
    api.get("/forms/"),

  getForm: (id) =>
    api.get(`/forms/${id}/`),

  createForm: (data) =>
    api.post("/forms/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export const courselistAPI = {

  getCourses: () =>
    api.get("/courses/"),
};

// ─────────────────────────────────────────────────────────────────────────────
// LOST CARD
// ─────────────────────────────────────────────────────────────────────────────

export const lostCardAPI = {

  getReports: () =>
    api.get("/lost-card/"),

  createReport: (data) =>
    api.post("/lost-card/", data),
};

// ─────────────────────────────────────────────────────────────────────────────
// REFERENCE — Academic Year & Semester
// ─────────────────────────────────────────────────────────────────────────────

export const referenceAPI = {

  getAcademicYears: () =>
    api.get("/academic-years/"),

  getSemesters: () =>
    api.get("/semesters/"),
};

// ─────────────────────────────────────────────────────────────────────────────
// AUTH HELPERS — save / clear tokens
// ─────────────────────────────────────────────────────────────────────────────

export const saveTokens = (access, refresh) => {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
};

export const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};


export const isAuthenticated = () => !!localStorage.getItem("access_token");

export default api;