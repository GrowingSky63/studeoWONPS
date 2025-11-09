import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Typography,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { alunoService, cursoService } from '../services/api';
import { CPFInput, TelefoneInput, EmailInput } from '../components/MaskedInputs';
import { removeFormat, formatDateDisplay } from '../utils/validators';

const Alunos = () => {
  const [alunos, setAlunos] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAluno, setEditingAluno] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    data_nascimento: '',
    matricula: '',
    curso: '',
    data_matricula: '',
    status: 'ATIVO',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchAlunos();
    fetchCursos();
  }, []);

  const fetchAlunos = async () => {
    try {
      const response = await alunoService.getAll();
      setAlunos(response.data.results || response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      showSnackbar('Erro ao carregar alunos', 'error');
      setLoading(false);
    }
  };

  const fetchCursos = async () => {
    try {
      const response = await cursoService.getAll();
      setCursos(response.data.results || response.data);
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
    }
  };

  const handleOpenDialog = async (aluno = null) => {
    if (aluno) {
      setEditingAluno(aluno);
      setFormData({
        nome: aluno.nome,
        cpf: aluno.cpf,
        email: aluno.email,
        telefone: aluno.telefone,
        data_nascimento: aluno.data_nascimento,
        matricula: aluno.matricula,
        curso: aluno.curso,
        data_matricula: aluno.data_matricula,
        status: aluno.status,
      });
    } else {
      // Gera nova matrícula ao criar novo aluno
      try {
        const response = await alunoService.gerarMatricula();
        setEditingAluno(null);
        setFormData({
          nome: '',
          cpf: '',
          email: '',
          telefone: '',
          data_nascimento: '',
          matricula: response.data.matricula,
          curso: '',
          data_matricula: '',
          status: 'ATIVO',
        });
      } catch (error) {
        console.error('Erro ao gerar matrícula:', error);
        showSnackbar('Erro ao gerar matrícula', 'error');
        return;
      }
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAluno(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      // Remove formatação antes de enviar
      const submitData = {
        ...formData,
        cpf: removeFormat(formData.cpf),
        telefone: removeFormat(formData.telefone),
      };
      
      if (editingAluno) {
        await alunoService.update(editingAluno.id, submitData);
        showSnackbar('Aluno atualizado com sucesso!', 'success');
      } else {
        await alunoService.create(submitData);
        showSnackbar('Aluno criado com sucesso!', 'success');
      }
      handleCloseDialog();
      fetchAlunos();
    } catch (error) {
      console.error('Erro ao salvar aluno:', error);
      const errorMsg = error.response?.data?.cpf?.[0] || 
                       error.response?.data?.email?.[0] || 
                       'Erro ao salvar aluno';
      showSnackbar(errorMsg, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
      try {
        await alunoService.delete(id);
        showSnackbar('Aluno excluído com sucesso!', 'success');
        fetchAlunos();
      } catch (error) {
        console.error('Erro ao excluir aluno:', error);
        showSnackbar('Erro ao excluir aluno', 'error');
      }
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusColor = (status) => {
    const colors = {
      ATIVO: 'success',
      TRANCADO: 'warning',
      FORMADO: 'info',
      CANCELADO: 'error',
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Alunos</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Novo Aluno
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Matrícula</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Curso</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alunos.map((aluno) => (
              <TableRow key={aluno.id}>
                <TableCell>{aluno.matricula}</TableCell>
                <TableCell>{aluno.nome}</TableCell>
                <TableCell>{aluno.email}</TableCell>
                <TableCell>{aluno.curso_nome}</TableCell>
                <TableCell>
                  <Chip
                    label={aluno.status}
                    color={getStatusColor(aluno.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(aluno)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(aluno.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingAluno ? 'Editar Aluno' : 'Novo Aluno'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              fullWidth
            />
            <Box display="flex" gap={2}>
              <CPFInput
                label="CPF"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                label="Matrícula"
                name="matricula"
                value={formData.matricula}
                onChange={handleChange}
                required
                fullWidth
                disabled
                helperText="Matrícula gerada automaticamente"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>
            <Box display="flex" gap={2}>
              <EmailInput
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                fullWidth
              />
              <TelefoneInput
                label="Telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                fullWidth
              />
            </Box>
            <Box display="flex" gap={2}>
              <TextField
                label="Data de Nascimento"
                name="data_nascimento"
                type="date"
                value={formData.data_nascimento}
                onChange={handleChange}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Data de Matrícula"
                name="data_matricula"
                type="date"
                value={formData.data_matricula}
                onChange={handleChange}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box display="flex" gap={2}>
              <FormControl fullWidth required>
                <InputLabel>Curso</InputLabel>
                <Select
                  name="curso"
                  value={formData.curso}
                  onChange={handleChange}
                  label="Curso"
                >
                  {cursos.map((curso) => (
                    <MenuItem key={curso.id} value={curso.id}>
                      {curso.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value="ATIVO">Ativo</MenuItem>
                  <MenuItem value="TRANCADO">Trancado</MenuItem>
                  <MenuItem value="FORMADO">Formado</MenuItem>
                  <MenuItem value="CANCELADO">Cancelado</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Alunos;
