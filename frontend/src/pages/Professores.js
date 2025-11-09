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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { professorService } from '../services/api';
import { CPFInput, TelefoneInput, EmailInput } from '../components/MaskedInputs';
import { removeFormat, formatDateDisplay } from '../utils/validators';

const Professores = () => {
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProfessor, setEditingProfessor] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    data_contratacao: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchProfessores();
  }, []);

  const fetchProfessores = async () => {
    try {
      const response = await professorService.getAll();
      setProfessores(response.data.results || response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar professores:', error);
      showSnackbar('Erro ao carregar professores', 'error');
      setLoading(false);
    }
  };

  const handleOpenDialog = (professor = null) => {
    if (professor) {
      setEditingProfessor(professor);
      setFormData({
        nome: professor.nome,
        cpf: professor.cpf,
        email: professor.email,
        telefone: professor.telefone,
        data_contratacao: professor.data_contratacao,
      });
    } else {
      setEditingProfessor(null);
      setFormData({
        nome: '',
        cpf: '',
        email: '',
        telefone: '',
        data_contratacao: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProfessor(null);
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
      
      if (editingProfessor) {
        await professorService.update(editingProfessor.id, submitData);
        showSnackbar('Professor atualizado com sucesso!', 'success');
      } else {
        await professorService.create(submitData);
        showSnackbar('Professor criado com sucesso!', 'success');
      }
      handleCloseDialog();
      fetchProfessores();
    } catch (error) {
      console.error('Erro ao salvar professor:', error);
      const errorMsg = error.response?.data?.cpf?.[0] || 
                       error.response?.data?.email?.[0] || 
                       'Erro ao salvar professor';
      showSnackbar(errorMsg, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este professor?')) {
      try {
        await professorService.delete(id);
        showSnackbar('Professor excluído com sucesso!', 'success');
        fetchProfessores();
      } catch (error) {
        console.error('Erro ao excluir professor:', error);
        showSnackbar('Erro ao excluir professor', 'error');
      }
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
        <Typography variant="h4">Professores</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Novo Professor
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>CPF</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Data Contratação</TableCell>
              <TableCell>Matérias</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {professores.map((professor) => (
              <TableRow key={professor.id}>
                <TableCell>{professor.nome}</TableCell>
                <TableCell>{professor.cpf}</TableCell>
                <TableCell>{professor.email}</TableCell>
                <TableCell>{professor.telefone || '-'}</TableCell>
                <TableCell>{formatDateDisplay(professor.data_contratacao)}</TableCell>
                <TableCell>{professor.total_materias}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(professor)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(professor.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingProfessor ? 'Editar Professor' : 'Novo Professor'}
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
            <CPFInput
              label="CPF"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              required
              fullWidth
            />
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
            <TextField
              label="Data de Contratação"
              name="data_contratacao"
              type="date"
              format="DD-MM-YYYY"
              value={formData.data_contratacao}
              onChange={handleChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
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

export default Professores;
