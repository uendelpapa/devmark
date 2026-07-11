import axios from 'axios';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import { toast } from '../components/ui/Toast';
import { useAuthStore } from './auth';

export class ApiError extends Error {
  statusCode?: number;
  originalError: any;

  constructor(message: string, statusCode?: number, originalError?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // send cookies on cross-origin requests
});

// ─── Request Interceptor: Attach Access Token ────────────────────────────────

api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// ─── Response Interceptor: Success Messages ──────────────────────────────────

function getSuccessMessage(method: string, url: string): string | null {
  const normalizedUrl = url.toLowerCase();

  // Skip endpoints that shouldn't show global success toasts
  if (normalizedUrl.includes('/auth/')) return null;
  if (normalizedUrl.includes('/time-entries')) return null;
  if (normalizedUrl.includes('/ai/')) return null;

  if (method === 'post') {
    if (normalizedUrl.includes('/clients')) return 'Cliente cadastrado com sucesso!';
    if (normalizedUrl.includes('/projects')) return 'Projeto criado com sucesso!';
    if (normalizedUrl.includes('/tasks')) return 'Tarefa criada com sucesso!';
    return 'Item cadastrado com sucesso!';
  }

  if (method === 'patch' || method === 'put') {
    if (normalizedUrl.includes('/projects')) return 'Projeto atualizado com sucesso!';
    if (normalizedUrl.includes('/tasks')) return 'Tarefa atualizada com sucesso!';
    if (normalizedUrl.includes('/clients')) return 'Cliente atualizado com sucesso!';
    return 'Item atualizado com sucesso!';
  }

  if (method === 'delete') {
    if (normalizedUrl.includes('/projects')) return 'Projeto excluído com sucesso!';
    if (normalizedUrl.includes('/tasks')) return 'Tarefa excluída com sucesso!';
    if (normalizedUrl.includes('/clients')) return 'Cliente excluído com sucesso!';
    return 'Item excluído com sucesso!';
  }

  return null;
}

// ─── Silent Refresh Logic ────────────────────────────────────────────────────

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });
  failedQueue = [];
}

// ─── Response Interceptors ───────────────────────────────────────────────────

api.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toLowerCase();
    const url = response.config.url || '';

    if (method && ['post', 'patch', 'put', 'delete'].includes(method)) {
      const msg = getSuccessMessage(method, url);
      if (msg) {
        toast.success(msg);
      }
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean; headers?: any };

    // ─── 401 Silent Refresh ──────────────────────────────────────────────────
    const isAuthEndpoint =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register') ||
      originalRequest?.url?.includes('/auth/refresh');

    if (error.response?.status === 401 && !originalRequest?._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        // Another request already triggered a refresh — queue this one
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const newAccessToken = data.accessToken;
        useAuthStore.getState().setAuth(data.user, newAccessToken);

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Refresh failed — logout and redirect
        useAuthStore.getState().logout();

        // Only redirect if not already on login page
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // ─── Standard Error Handling ─────────────────────────────────────────────
    let errorMessage = 'Ocorreu um erro inesperado.';

    if (error.response) {
      const { status, data } = error.response as any;

      // Parse NestJS validation messages
      if (data && data.message) {
        if (Array.isArray(data.message)) {
          errorMessage = data.message.join('\n');
        } else {
          errorMessage = data.message;
        }
      } else {
        // Fallback standard HTTP status translations
        switch (status) {
          case 400:
            errorMessage = 'Dados inválidos. Verifique as informações preenchidas.';
            break;
          case 401:
            errorMessage = 'Sessão expirada. Faça login novamente.';
            break;
          case 403:
            errorMessage = 'Você não tem permissão para realizar esta ação.';
            break;
          case 404:
            errorMessage = 'Recurso não encontrado no servidor.';
            break;
          case 500:
            errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
            break;
        }
      }
    } else if (error.request) {
      errorMessage = 'Não foi possível conectar ao servidor. Verifique se o backend está ativo.';
    } else {
      errorMessage = error.message;
    }

    // ─── Auto error logging ──────────────────────────────────────────────────
    const isLogEndpoint = originalRequest?.url?.includes('/logs');
    if (!isLogEndpoint) {
      try {
        let requestDataParsed = null;
        if (originalRequest?.data) {
          if (typeof originalRequest.data === 'string') {
            try {
              requestDataParsed = JSON.parse(originalRequest.data);
            } catch {
              requestDataParsed = originalRequest.data;
            }
          } else {
            requestDataParsed = originalRequest.data;
          }
        }

        const logPayload = {
          message: `HTTP Error: ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url} -> Status ${error.response?.status || 'Network Error'}`,
          stack: error.stack || new Error().stack,
          url: window.location.href,
          user_agent: navigator.userAgent,
          level: 'ERROR',
          metadata: {
            errorMessage,
            status: error.response?.status,
            requestData: requestDataParsed,
            responseData: error.response?.data,
          }
        };

        const token = useAuthStore.getState().accessToken;
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        axios.post(
          `${api.defaults.baseURL}/logs`,
          logPayload,
          { headers }
        ).catch(() => {});
      } catch (logErr) {
        console.error('Failed to log error:', logErr);
      }
    }

    if (!isAuthEndpoint) {
      toast.error(errorMessage);
    }
    return Promise.reject(new ApiError(errorMessage, error.response?.status, error));
  }
);
