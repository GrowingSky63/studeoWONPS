import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Cursos from './pages/Cursos';
import Professores from './pages/Professores';
import Alunos from './pages/Alunos';
import Materias from './pages/Materias';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/professores" element={<Professores />} />
          <Route path="/alunos" element={<Alunos />} />
          <Route path="/materias" element={<Materias />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

