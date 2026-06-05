# Dockerfile para FastAPI
FROM python:3.11-slim

# Evitar que Python genere archivos .pyc y habilitar logs en tiempo real
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Instalar dependencias del sistema necesarias para psycopg2
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Instalar dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código de la aplicación
COPY . .

# Exponer el puerto que usará Cloud Run (por defecto 8080)
EXPOSE 8080

# Comando para ejecutar la aplicación
# Usamos el host 0.0.0.0 y el puerto de la variable de entorno PORT (requerido por Cloud Run)
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}
