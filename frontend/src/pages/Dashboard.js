import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { cursoService, professorService, alunoService, materiaService } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    cursos: 0,
    professores: 0,
    alunos: 0,
    materias: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [cursosRes, professoresRes, alunosRes, materiasRes] = await Promise.all([
          cursoService.getAll(),
          professorService.getAll(),
          alunoService.getAll(),
          materiaService.getAll(),
        ]);

        setStats({
          cursos: cursosRes.data.count || cursosRes.data.length,
          professores: professoresRes.data.count || professoresRes.data.length,
          alunos: alunosRes.data.count || alunosRes.data.length,
          materias: materiasRes.data.count || materiasRes.data.length,
        });
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    { title: 'Cursos', value: stats.cursos, icon: SchoolIcon, color: '#1976d2' },
    { title: 'Professores', value: stats.professores, icon: PersonIcon, color: '#388e3c' },
    { title: 'Alunos', value: stats.alunos, icon: GroupIcon, color: '#f57c00' },
    { title: 'Matérias', value: stats.materias, icon: MenuBookIcon, color: '#7b1fa2' },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Administrativo
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        Visão geral do sistema acadêmico
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={card.title}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        {card.title}
                      </Typography>
                      <Typography variant="h4">
                        {card.value}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        backgroundColor: card.color,
                        borderRadius: '50%',
                        width: 56,
                        height: 56,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon sx={{ color: 'white', fontSize: 32 }} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default Dashboard;
