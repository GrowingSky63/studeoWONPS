import axios from 'axios';

// Usa o mesmo host que está servindo a página
const API_URL = `${window.location.protocol}//${window.location.host}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cursos
export const cursoService = {
  getAll: (params) => api.get('/cursos/', { params }),
  getById: (id) => api.get(`/cursos/${id}/`),
  create: (data) => api.post('/cursos/', data),
  update: (id, data) => api.put(`/cursos/${id}/`, data),
  delete: (id) => api.delete(`/cursos/${id}/`),
};

// Professores
export const professorService = {
  getAll: (params) => api.get('/professores/', { params }),
  getById: (id) => api.get(`/professores/${id}/`),
  create: (data) => api.post('/professores/', data),
  update: (id, data) => api.put(`/professores/${id}/`, data),
  delete: (id) => api.delete(`/professores/${id}/`),
};

// Alunos
export const alunoService = {
  getAll: (params) => api.get('/alunos/', { params }),
  getById: (id) => api.get(`/alunos/${id}/`),
  create: (data) => api.post('/alunos/', data),
  update: (id, data) => api.put(`/alunos/${id}/`, data),
  delete: (id) => api.delete(`/alunos/${id}/`),
  gerarMatricula: () => api.get('/alunos/gerar_matricula/'),
};

// Matérias
export const materiaService = {
  getAll: (params) => api.get('/materias/', { params }),
  getById: (id) => api.get(`/materias/${id}/`),
  create: (data) => api.post('/materias/', data),
  update: (id, data) => api.put(`/materias/${id}/`, data),
  delete: (id) => api.delete(`/materias/${id}/`),
};

export default api;
