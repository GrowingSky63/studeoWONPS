import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import HomeIcon from '@mui/icons-material/Home';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="logo"
          sx={{ mr: 2 }}
          component={RouterLink}
          to="/"
        >
          <SchoolIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Sistema Acadêmico
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={RouterLink} to="/" startIcon={<HomeIcon />}>
            Dashboard
          </Button>
          <Button color="inherit" component={RouterLink} to="/cursos">
            Cursos
          </Button>
          <Button color="inherit" component={RouterLink} to="/professores">
            Professores
          </Button>
          <Button color="inherit" component={RouterLink} to="/alunos">
            Alunos
          </Button>
          <Button color="inherit" component={RouterLink} to="/materias">
            Matérias
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
