# Imagem base Python
FROM python:3.11-slim

# Definir diretório de trabalho
WORKDIR /app

RUN apt-get update && apt-get install -y nodejs

# Copiar código do projeto
COPY . .

# Instalar dependências Python
RUN pip install --no-cache-dir -r requirements.txt

# Construir frontend
RUN cd frontend && npm install && npm run build && cd ..

# Criar migrações iniciais
RUN python manage.py makemigrations

# Expor porta
EXPOSE 8000

# Executar migrations e iniciar servidor
CMD python manage.py migrate && \
    python manage.py runserver 0.0.0.0:8000
