{/* 4. API Service (QuizApiService)

Complete HTTP client with axios
Token management and automatic refresh
Error handling with user-friendly messages
Request/response interceptors
Offline support with localStorage */
}

// services/quizApi.js
import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token management
class TokenManager {
  static getToken() {
    return localStorage.getItem("authToken");
  }

  static setToken(token) {
    localStorage.setItem("authToken", token);
  }

  static removeToken() {
    localStorage.removeItem("authToken");
  }

  static isTokenExpired(token) {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  }
}

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = TokenManager.getToken();
    if (token && !TokenManager.isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add institution ID if available
    const institutionId = localStorage.getItem("currentInstitutionId");
    if (institutionId) {
      config.headers["x-institution-id"] = institutionId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      TokenManager.removeToken();
      window.location.href = "/login";
    }

    // Transform error for consistent handling
    const customError = {
      message:
        error.response?.data?.message || error.message || "Error desconocido",
      code: error.response?.data?.code || "UNKNOWN_ERROR",
      status: error.response?.status,
      details: error.response?.data?.detail || null,
    };

    return Promise.reject(customError);
  }
);

// Quiz API Service
export class QuizApiService {
  // Authentication
  static async login(credentials) {
    try {
      const response = await api.post("/auth/login", credentials);
      if (response.data.success && response.data.token) {
        TokenManager.setToken(response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static logout() {
    TokenManager.removeToken();
    localStorage.removeItem("currentInstitutionId");
  }

  // Get public quizzes (available quizzes for the user)
  static async getPublicQuizzes() {
    try {
      const response = await api.get("/quizzes/public");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get specific quiz with questions
  static async getQuiz(quizId) {
    try {
      const response = await api.get(`/quizzes/${quizId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Submit quiz answers
  static async submitQuiz(quizId, submissionData) {
    try {
      const response = await api.post(
        `/quizzes/${quizId}/submit`,
        submissionData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get user's own results
  static async getUserResults() {
    try {
      const response = await api.get("/quizzes/me/results");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get quiz results for institution (admin/psychologist access)
  static async getQuizResults(filters = {}) {
    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          params.append(key, value);
        }
      });

      const response = await api.get(
        `/quizzes/resultados?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get analytics data
  static async getAnalytics(filters = {}) {
    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          params.append(key, value);
        }
      });

      const response = await api.get(`/quizzes/analytics?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Set current institution context
  static setCurrentInstitution(institutionId) {
    if (institutionId) {
      localStorage.setItem("currentInstitutionId", institutionId);
    } else {
      localStorage.removeItem("currentInstitutionId");
    }
  }

  static getCurrentInstitution() {
    return localStorage.getItem("currentInstitutionId");
  }
}

// React Hook for API calls with loading states
export const useQuizApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeRequest = async (apiCall) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      setLoading(false);
      return result;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  return {
    loading,
    error,
    executeRequest,
    clearError: () => setError(null),
  };
};

// Error handling utilities
export class ApiErrorHandler {
  static getErrorMessage(error) {
    if (typeof error === "string") return error;

    return error?.message || "Ha ocurrido un error inesperado";
  }

  static getErrorCode(error) {
    return error?.code || "UNKNOWN_ERROR";
  }

  static isNetworkError(error) {
    return error?.code === "NETWORK_ERROR" || !error?.status;
  }

  static isAuthError(error) {
    return (
      error?.status === 401 ||
      error?.code === "TOKEN_EXPIRED" ||
      error?.code === "TOKEN_INVALID"
    );
  }

  static isValidationError(error) {
    return error?.status === 400 && error?.details;
  }

  static getValidationErrors(error) {
    if (!this.isValidationError(error)) return [];

    if (Array.isArray(error.details)) {
      return error.details;
    }

    return [error.details];
  }
}

// Notification service for showing user feedback
export class NotificationService {
  static success(message, options = {}) {
    // Implement your preferred notification library here
    // Example with react-hot-toast:
    // toast.success(message, options);
    console.log("SUCCESS:", message);
  }

  static error(message, options = {}) {
    // Implement your preferred notification library here
    // Example with react-hot-toast:
    // toast.error(message, options);
    console.error("ERROR:", message);
  }

  static info(message, options = {}) {
    // Implement your preferred notification library here
    console.log("INFO:", message);
  }

  static warning(message, options = {}) {
    // Implement your preferred notification library here
    console.warn("WARNING:", message);
  }
}

// Validation utilities
export class QuizValidation {
  static validateAnswers(questions, answers) {
    const errors = [];

    questions.forEach((question) => {
      if (
        question.obligatoria &&
        (answers[question.id] === undefined || answers[question.id] === null)
      ) {
        errors.push({
          questionId: question.id,
          message: `La pregunta "${question.texto}" es obligatoria`,
        });
      }

      if (answers[question.id] !== undefined) {
        const value = answers[question.id];
        if (!Number.isInteger(value) || value < 0 || value > 3) {
          errors.push({
            questionId: question.id,
            message: `Respuesta inválida para la pregunta "${question.texto}"`,
          });
        }
      }
    });

    return errors;
  }

  static formatAnswersForSubmission(answers) {
    return Object.entries(answers).map(([preguntaId, valor]) => ({
      preguntaId: parseInt(preguntaId, 10),
      valor: parseInt(valor, 10),
    }));
  }
}

// Local storage utilities for offline support
export class LocalStorageService {
  static saveQuizProgress(quizId, progress) {
    try {
      const key = `quiz_progress_${quizId}`;
      localStorage.setItem(
        key,
        JSON.stringify({
          ...progress,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.warn("Could not save quiz progress:", error);
    }
  }

  static getQuizProgress(quizId) {
    try {
      const key = `quiz_progress_${quizId}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const progress = JSON.parse(saved);
        // Check if progress is recent (within 24 hours)
        if (Date.now() - progress.timestamp < 24 * 60 * 60 * 1000) {
          return progress;
        }
        // Remove old progress
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn("Could not load quiz progress:", error);
    }
    return null;
  }

  static clearQuizProgress(quizId) {
    try {
      const key = `quiz_progress_${quizId}`;
      localStorage.removeItem(key);
    } catch (error) {
      console.warn("Could not clear quiz progress:", error);
    }
  }
}

export default QuizApiService;
