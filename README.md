# To-Do Task App

A full-stack To-Do application built with React for the frontend, Express with MariaDB for the backend, and Docker Compose for container orchestration. This app allows you to add tasks, view the latest tasks, and mark them as complete.

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Docker Setup](#docker-setup)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Features
- **Add a Task:** Create new tasks with a title and description.
- **View Tasks:** Display the most recent uncompleted tasks.
- **Complete a Task:** Mark tasks as complete, which updates the list.
- **Responsive UI:** Modern, clean design built with Material-UI (MUI v5).
- **Persistent Storage:** Uses MariaDB with Docker volumes to persist data.

## Architecture
- **Frontend:** React application styled using Material-UI. Communicates with the backend via REST API.
- **Backend:** Express server using MariaDB for storing tasks. Exposes API endpoints for adding, retrieving, and updating tasks.
- **Database:** MariaDB container with persistent storage using Docker volumes.
- **Containerization:** Docker Compose orchestrates three services (frontend, backend, and database).

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js (if you want to run the frontend/backend outside of Docker)

### Installation
Clone the repository:

```bash
git clone repo link
cd todo-task-app
```

### Project Structure

```plaintext
todo-task-app/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   └── App.js
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── README.md
└── .env (optional)
```

### Running the Application
The easiest way to run the entire stack is using Docker Compose.

Start the application:

```bash
docker-compose up --build
```

Access the Application:

- **Frontend:** Open your browser and navigate to `http://localhost:3000`
- **Backend API:** Available at `http://localhost:5000`

## Environment Variables
The backend uses the following environment variables (configured in the `docker-compose.yml` file):

```plaintext
DB_HOST: Hostname of the MariaDB container
DB_USER: Database user
DB_PASSWORD: your_db_password
DB_DATABASE: your_db_name
DB_PORT: Port number (e.g., 3306)
PORT: Port number for the backend server (e.g., 5000)
```

If you need to run the application outside Docker, create a `.env` file in the backend directory with these variables.

## Docker Setup
The project is containerized with Docker Compose. Here is the sample `docker-compose.yml`:

```yaml
version: "3.8"

services:
  database:
    image: mariadb:latest
    container_name: todo_db
    environment:
      - MYSQL_ROOT_PASSWORD = your_db_password
      - MYSQL_DATABASE = your_db_name
      - MYSQL_USER = root
      - MYSQL_PASSWORD = your_db_password
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: todo_backend
    ports:
      - "5000:5000"
    environment:
      DB_HOST: Hostname of the MariaDB container
      DB_USER: root
      DB_PASSWORD: your_db_password
      DB_DATABASE: your_db_name
      DB_PORT: 3306
      PORT: 5000
    depends_on:
      - database

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: todo_frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  db_data:
```

## Usage
- **Adding a Task:** Use the form on the left side of the UI to enter a task title and description. Click "Add" to save it.
- **Viewing Tasks:** The right side displays the most recent tasks (up to five) that are not marked as complete.
- **Completing a Task:** Click the "Done" button on a task card to mark it as complete. The task will be updated in the backend and removed from the active list.

## Troubleshooting

### Build Errors
If you encounter errors during the build (e.g., missing dependencies), ensure all packages are installed. For MUI v5, consider using the `sx` prop instead of deprecated styling methods.

### Database Data Persistence
Data is stored in a Docker volume (`db_data`). To inspect the data, run:

```bash
docker volume inspect db_data
```

Do not delete this volume if you want your data to persist across container restarts.

### API Connectivity Issues
Make sure the frontend API URL (in `App.js`) points to `http://localhost:5000/tasks` when running locally. If using Docker networking, update the hostname accordingly.

## 📄 License
**This project is licensed under the MIT License. See the LICENSE file for details.**

## 📞 Contact
**For any inquiries or feedback, feel free to reach out:**

**Email:** hashankogul99uoj@gmail.com  
**LinkedIn:** [Hashan's LinkedIn](https://www.linkedin.com/in/hashan-kogul-yogendran-698668290)

## Thank you for checking out this project! Happy coding! 🎉
