# Sistema Acadêmico - StudeoWONPS

Sistema de gestão acadêmica desenvolvido com Django (Backend) e React (Frontend) utilizando arquitetura MVC.

## 🏗️ Arquitetura

### Backend (Django)
- **Models**: Definição das entidades (Curso, Professor, Aluno, Matéria) em `main/models.py`
- **Controllers**: Serializers e ViewSets em `main/controller.py` usando Django REST Framework
- **Views**: View para servir o frontend React em `main/views.py`
- **URLs**: Configuração de rotas da API em `studeoWONPS/urls.py`

### Frontend (React + Material UI)
- **Dashboard**: Visão geral com estatísticas
- **CRUD Completo**: Cursos, Professores, Alunos e Matérias
- **Navegação**: React Router para SPA
- **UI**: Material-UI para interface moderna e responsiva

## 📋 Funcionalidades

### Para o Administrativo da Faculdade:

1. **Gestão de Cursos**
   - Criar, editar e excluir cursos
   - Visualizar carga horária total
   - Acompanhar número de alunos e matérias

2. **Gestão de Professores**
   - Cadastrar professores com dados pessoais
   - Acompanhar matérias lecionadas
   - Controle de data de contratação

3. **Gestão de Alunos**
   - Matricular novos alunos
   - Atualizar status (Ativo, Trancado, Formado, Cancelado)
   - Vincular alunos a cursos
   - Controle de matrículas

4. **Gestão de Matérias**
   - Criar matérias vinculadas a cursos
   - Atribuir professores às matérias
   - Definir período/semestre e carga horária
   - Gerenciar códigos de disciplinas

## 🚀 Como Executar

### Pré-requisitos
- Python 3.10+
- Node.js 14+
- npm ou yarn

### Backend (Django)

```bash
# 1. Ativar ambiente virtual
source venv/bin/activate

# 2. Instalar dependências (se necessário)
pip install -r requirements.txt

# 3. Aplicar migrations
python manage.py migrate

# 4. Criar superusuário (opcional)
python manage.py createsuperuser

# 5. Executar servidor
python manage.py runserver
```

O backend estará disponível em: http://localhost:8000

### Frontend (React)

#### Modo Desenvolvimento
```bash
cd frontend
npm install
npm start
```

O frontend em modo dev estará em: http://localhost:3000

#### Modo Produção (Build)
```bash
cd frontend
npm run build
```

O Django serve automaticamente o build do React em: http://localhost:8000

## 📡 API Endpoints

### Cursos
- `GET /api/cursos/` - Listar todos os cursos
- `POST /api/cursos/` - Criar novo curso
- `GET /api/cursos/{id}/` - Obter curso específico
- `PUT /api/cursos/{id}/` - Atualizar curso
- `DELETE /api/cursos/{id}/` - Deletar curso

### Professores
- `GET /api/professores/` - Listar todos os professores
- `POST /api/professores/` - Criar novo professor
- `GET /api/professores/{id}/` - Obter professor específico
- `PUT /api/professores/{id}/` - Atualizar professor
- `DELETE /api/professores/{id}/` - Deletar professor

### Alunos
- `GET /api/alunos/` - Listar todos os alunos
- `POST /api/alunos/` - Criar novo aluno
- `GET /api/alunos/{id}/` - Obter aluno específico
- `PUT /api/alunos/{id}/` - Atualizar aluno
- `DELETE /api/alunos/{id}/` - Deletar aluno

### Matérias
- `GET /api/materias/` - Listar todas as matérias
- `POST /api/materias/` - Criar nova matéria
- `GET /api/materias/{id}/` - Obter matéria específica
- `PUT /api/materias/{id}/` - Atualizar matéria
- `DELETE /api/materias/{id}/` - Deletar matéria

## 🛠️ Tecnologias Utilizadas

### Backend
- Django 5.2.8
- Django REST Framework 3.16.1
- Django CORS Headers 4.9.0
- Django Filter 25.2
- SQLite (desenvolvimento)

### Frontend
- React 18
- Material-UI (MUI) 5
- React Router DOM 6
- Axios
- Emotion (CSS-in-JS)

## 📁 Estrutura do Projeto

```
studeoWONPS/
├── main/                      # App principal Django
│   ├── models.py             # Models (Curso, Professor, Aluno, Materia)
│   ├── controller.py         # Controllers (Serializers e ViewSets)
│   ├── views.py              # Views (IndexView para React)
│   └── migrations/           # Migrations do banco
├── studeoWONPS/              # Configurações Django
│   ├── settings.py           # Configurações do projeto
│   └── urls.py               # Rotas principais
├── frontend/                 # Aplicação React
│   ├── src/
│   │   ├── components/       # Componentes reutilizáveis
│   │   │   └── Navbar.js
│   │   ├── pages/            # Páginas da aplicação
│   │   │   ├── Dashboard.js
│   │   │   ├── Cursos.js
│   │   │   ├── Professores.js
│   │   │   ├── Alunos.js
│   │   │   └── Materias.js
│   │   ├── services/         # Serviços de API
│   │   │   └── api.js
│   │   └── App.js            # Componente principal
│   └── build/                # Build de produção
└── db.sqlite3                # Banco de dados
```

## 🔐 Configurações de Segurança

Para produção, lembre-se de:
- Alterar `SECRET_KEY` no `settings.py`
- Definir `DEBUG = False`
- Configurar `ALLOWED_HOSTS`
- Usar banco de dados apropriado (PostgreSQL, MySQL)
- Configurar CORS adequadamente
- Implementar autenticação e autorização

## 📝 Notas

- O sistema foi desenvolvido focando no stakeholder "Administrativo da Faculdade"
- Todas as operações CRUD estão implementadas para todas as entidades
- A interface utiliza Material-UI para uma experiência moderna
- O Django serve os arquivos estáticos do React em produção

## 🤝 Contribuindo

Para contribuir com o projeto:
1. Faça um fork
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
