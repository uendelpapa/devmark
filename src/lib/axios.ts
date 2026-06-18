import axios from 'axios';
import { toast } from '../components/Toast';

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
});

function getSuccessMessage(method: string, url: string): string | null {
  const normalizedUrl = url.toLowerCase();
  
  if (normalizedUrl.includes('/time-entries')) {
    return null;
  }

  
  if (method === 'post') {
    if (normalizedUrl.includes('/clients')) {
      return 'Cliente cadastrado com sucesso!';
    }
    if (normalizedUrl.includes('/projects')) {
      return 'Projeto criado com sucesso!';
    }
    if (normalizedUrl.includes('/tasks')) {
      return 'Tarefa criada com sucesso!';
    }
    return 'Item cadastrado com sucesso!';
  }
  
  if (method === 'patch' || method === 'put') {
    if (normalizedUrl.includes('/projects')) {
      return 'Projeto atualizado com sucesso!';
    }
    if (normalizedUrl.includes('/tasks')) {
      return 'Tarefa atualizada com sucesso!';
    }
    if (normalizedUrl.includes('/clients')) {
      return 'Cliente atualizado com sucesso!';
    }
    return 'Item atualizado com sucesso!';
  }
  
  if (method === 'delete') {
    if (normalizedUrl.includes('/projects')) {
      return 'Projeto excluído com sucesso!';
    }
    if (normalizedUrl.includes('/tasks')) {
      return 'Tarefa excluída com sucesso!';
    }
    if (normalizedUrl.includes('/clients')) {
      return 'Cliente excluído com sucesso!';
    }
    return 'Item excluído com sucesso!';
  }
  
  return null;
}

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
  (error) => {
    let errorMessage = 'Ocorreu um erro inesperado.';
    
    if (error.response) {
      const { status, data } = error.response;
      
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
    
    toast.error(errorMessage);
    return Promise.reject(new ApiError(errorMessage, error.response?.status, error));
  }
);


