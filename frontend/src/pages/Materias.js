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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { materiaService, cursoService, professorService } from '../services/api';

const Materias = () => {
  const [materias, setMaterias] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMateria, setEditingMateria] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    carga_horaria: '',
    curso: '',
    professor: '',
    periodo: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchMaterias();
    fetchCursos();
    fetchProfessores();
  }, []);

  const fetchMaterias = async () => {
    try {
      const response = await materiaService.getAll();
      setMaterias(response.data.results || response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar matérias:', error);
      showSnackbar('Erro ao carregar matérias', 'error');
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

  const fetchProfessores = async () => {
    try {
      const response = await professorService.getAll();
      setProfessores(response.data.results || response.data);
    } catch (error) {
      console.error('Erro ao buscar professores:', error);
    }
  };

  const handleOpenDialog = (materia = null) => {
    if (materia) {
      setEditingMateria(materia);
      setFormData({
        nome: materia.nome,
        codigo: materia.codigo,
        carga_horaria: materia.carga_horaria,
        curso: materia.curso,
        professor: materia.professor || '',
        periodo: materia.periodo,
      });
    } else {
      setEditingMateria(null);
      setFormData({
        nome: '',
        codigo: '',
        carga_horaria: '',
        curso: '',
        professor: '',
        periodo: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMateria(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const submitData = { ...formData };
      // Se professor não foi selecionado, enviar null
      if (!submitData.professor) {
        submitData.professor = null;
      }
      
      if (editingMateria) {
        await materiaService.update(editingMateria.id, submitData);
        showSnackbar('Matéria atualizada com sucesso!', 'success');
      } else {
        await materiaService.create(submitData);
        showSnackbar('Matéria criada com sucesso!', 'success');
      }
      handleCloseDialog();
      fetchMaterias();
    } catch (error) {
      console.error('Erro ao salvar matéria:', error);
      showSnackbar('Erro ao salvar matéria', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta matéria?')) {
      try {
        await materiaService.delete(id);
        showSnackbar('Matéria excluída com sucesso!', 'success');
        fetchMaterias();
      } catch (error) {
        console.error('Erro ao excluir matéria:', error);
        showSnackbar('Erro ao excluir matéria', 'error');
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
        <Typography variant="h4">Matérias</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nova Matéria
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Curso</TableCell>
              <TableCell>Professor</TableCell>
              <TableCell>Período</TableCell>
              <TableCell>Carga Horária</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {materias.map((materia) => (
              <TableRow key={materia.id}>
                <TableCell>{materia.codigo}</TableCell>
                <TableCell>{materia.nome}</TableCell>
                <TableCell>{materia.curso_nome}</TableCell>
                <TableCell>{materia.professor_nome || '-'}</TableCell>
                <TableCell>{materia.periodo}º</TableCell>
                <TableCell>{materia.carga_horaria}h</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(materia)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(materia.id)}
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
          {editingMateria ? 'Editar Matéria' : 'Nova Matéria'}
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
            <FormControl fullWidth>
              <InputLabel>Professor</InputLabel>
              <Select
                name="professor"
                value={formData.professor}
                onChange={handleChange}
                label="Professor"
              >
                <MenuItem value="">
                  <em>Nenhum</em>
                </MenuItem>
                {professores.map((professor) => (
                  <MenuItem key={professor.id} value={professor.id}>
                    {professor.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box display="flex" gap={2}>
              <TextField
                label="Período"
                name="periodo"
                type="number"
                value={formData.periodo}
                onChange={handleChange}
                required
                fullWidth
                inputProps={{ min: 1 }}
              />
              <TextField
                label="Carga Horária"
                name="carga_horaria"
                type="number"
                value={formData.carga_horaria}
                onChange={handleChange}
                required
                fullWidth
                inputProps={{ min: 1 }}
              />
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

export default Materias;
