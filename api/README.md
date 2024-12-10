# 📦 Furbo - API

**Descripción**: Backend de la API de **Furbo**, construido con **NestJS** y **MongoDB**, y ejecutado en un contenedor **Docker**. Esta API incluye una lista de usuarios predeterminados al momento de su construcción, facilitando pruebas y desarrollo.

---

## 🌟 Características

- API construida con **NestJS**.
- Base de datos **MongoDB** configurada dentro del contenedor Docker.
- Usuarios iniciales creados automáticamente en el build para facilitar el testing.
- Contenedor Docker listo para fácil despliegue y administración.

---

## 📦 Instalación y Configuración

### Requisitos previos
- **Docker** y **Docker Compose** instalados en tu sistema.

### Pasos de instalación
1. Clona el repositorio.
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd furbo/api

2. Construye y levanta el contenedor Docker.
   ```bash
   docker-compose up --build -d
   La app estará disponible en http://localhost:3000

## 🚀 Comandos Útiles para Docker

- **Construir o reconstruir contenedores (útil si cambias el código o la configuración, -d indica en segundo plano)**:
  docker-compose up --build -d

- **Iniciar contenedores**:
  ```bash
  docker-compose up -d
  docker-compose up

- **Detener contenedores**:
  ```bash
  docker-compose stop

- **Remover contenedores**:
  ```bash
  docker-compose down

- **Ver logs de la aplicación**:
  ```bash
  docker-compose logs -f

---

## 🛠️ Comportamiento del Entorno de Desarrollo
Si el entorno es NODE_ENV=development, los usuarios se recrearán cada vez que se construya el contenedor, asegurando que siempre tengas los datos iniciales disponibles para pruebas.

Para producción, el entorno es NODE_ENV=production

---







