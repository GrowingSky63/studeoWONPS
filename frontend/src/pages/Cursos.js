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
import { cursoService } from '../services/api';

const Cursos = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCurso, setEditingCurso] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    descricao: '',
    carga_horaria_total: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchCursos();
  }, []);

  const fetchCursos = async () => {
    try {
      const response = await cursoService.getAll();
      setCursos(response.data.results || response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
      showSnackbar('Erro ao carregar cursos', 'error');
      setLoading(false);
    }
  };

  const handleOpenDialog = (curso = null) => {
    if (curso) {
      setEditingCurso(curso);
      setFormData({
        nome: curso.nome,
        codigo: curso.codigo,
        descricao: curso.descricao,
        carga_horaria_total: curso.carga_horaria_total,
      });
    } else {
      setEditingCurso(null);
      setFormData({
        nome: '',
        codigo: '',
        descricao: '',
        carga_horaria_total: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCurso(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingCurso) {
        await cursoService.update(editingCurso.id, formData);
        showSnackbar('Curso atualizado com sucesso!', 'success');
      } else {
        await cursoService.create(formData);
        showSnackbar('Curso criado com sucesso!', 'success');
      }
      handleCloseDialog();
      fetchCursos();
    } catch (error) {
      console.error('Erro ao salvar curso:', error);
      showSnackbar('Erro ao salvar curso', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este curso?')) {
      try {
        await cursoService.delete(id);
        showSnackbar('Curso excluído com sucesso!', 'success');
        fetchCursos();
      } catch (error) {
        console.error('Erro ao excluir curso:', error);
        showSnackbar('Erro ao excluir curso', 'error');
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
        <Typography variant="h4">Cursos</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Novo Curso
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Carga Horária</TableCell>
              <TableCell>Total de Alunos</TableCell>
              <TableCell>Total de Matérias</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cursos.map((curso) => (
              <TableRow key={curso.id}>
                <TableCell>{curso.codigo}</TableCell>
                <TableCell>{curso.nome}</TableCell>
                <TableCell>{curso.carga_horaria_total}h</TableCell>
                <TableCell>{curso.total_alunos}</TableCell>
                <TableCell>{curso.total_materias}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(curso)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(curso.id)}
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
          {editingCurso ? 'Editar Curso' : 'Novo Curso'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Código"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Descrição"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              label="Carga Horária Total"
              name="carga_horaria_total"
              type="number"
              value={formData.carga_horaria_total}
              onChange={handleChange}
              required
              fullWidth
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

export default Cursos;
