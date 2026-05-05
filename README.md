# Photo Project

A full-stack photo application with:
- Backend: Spring Boot (Maven)
- Frontend: React app in `frontend/`

## Prerequisites
- Java 17+ (or the version required by your Spring Boot setup)
- Maven (or use the included Maven wrapper)
- Node.js and npm

## Project Structure
- `src/` - Spring Boot backend source code
- `frontend/` - Frontend application
- `pom.xml` - Maven project configuration

## Run Backend
From the project root:

```bash
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
.\mvnw.cmd spring-boot:run
```

## Run Frontend
From the `frontend` folder:

```bash
npm install
npm start
```

## Build
Backend:

```bash
./mvnw clean package
```

Frontend:

```bash
npm run build
```

## Notes
- Update this README with your app purpose, screenshots, API endpoints, and deployment steps.
