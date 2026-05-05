# PhotoStudio Cloud

PhotoStudio Cloud is a full-stack photo management app where users can upload images, manage their collection, and generate QR codes to share photo links.

## Features
- Upload photos with a custom name
- Image preview before upload
- 10MB upload limit validation in UI and backend
- Gallery view with responsive card layout
- Edit photo name and replace image
- Delete photos (removes from Cloudinary and database)
- Generate QR code for each photo URL
- Download generated QR code as PNG
- Copy direct share link to clipboard

## Tech Stack
- Backend: Spring Boot, Spring Web, Spring Data JPA, Maven
- Frontend: React + Vite + Tailwind CSS
- Database: MySQL
- Cloud Storage: Cloudinary
- QR Code: ZXing

## Project Structure
- `src/main/java/...` - Spring Boot backend code
- `src/main/resources/application.properties` - backend configuration
- `UI/` - React frontend
- `pom.xml` - backend dependencies and build config

## API Endpoints
- `GET /api/photo` - list all photos
- `POST /api/photo/upload` - upload new photo (`name`, `file`)
- `GET /api/photo/{id}` - get photo by id
- `PUT /api/photo/{id}` - update photo name/file
- `DELETE /api/photo/{id}` - delete photo
- `GET /api/photo/generate/{id}` - generate QR code PNG for photo URL

## Prerequisites
- Java 21
- MySQL running locally
- Node.js and npm

## Configuration
Update `src/main/resources/application.properties` with your own values:
- MySQL connection (`spring.datasource.*`)
- Cloudinary credentials (`cloudinary.*`)

## Run Backend
From project root:

```powershell
.\mvnw.cmd spring-boot:run
```

Backend runs on: `http://localhost:8090`

## Run Frontend
From `UI/`:

```powershell
npm install
npm run dev
```

## Build
Backend:

```powershell
.\mvnw.cmd clean package
```

Frontend:

```powershell
cd UI
npm run build
```

## Future Improvements
- Add user authentication
- Add pagination/search for large galleries
- Add role-based access and private albums
- Add drag-and-drop multi-image upload
