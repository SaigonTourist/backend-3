# Backend 3 - Sistema de Adopción de Mascotas

## 🐾 Descripción
Sistema backend completo para la gestión de adopciones de mascotas, desarrollado con Node.js, Express, MongoDB y dockerizado para fácil deployment.

## 🚀 Características Principales
- ✅ API RESTful completa
- ✅ Sistema de adopciones de mascotas
- ✅ Generación de datos mock
- ✅ Documentación Swagger
- ✅ Tests funcionales completos
- ✅ Dockerización completa
- ✅ Base de datos MongoDB

## 🛠️ Tecnologías Utilizadas
- **Backend**: Node.js + Express
- **Base de datos**: MongoDB + Mongoose
- **Testing**: Mocha + Chai + Supertest
- **Documentación**: Swagger (OpenAPI 3.0)
- **Containerización**: Docker + Docker Compose
- **Generación de datos**: @faker-js/faker
- **Encriptación**: Bcrypt

## 📦 Docker Hub
La imagen Docker está disponible públicamente en:

**🐳 [alanporcojohnson/backend3-adoption-api](https://hub.docker.com/r/alanporcojohnson/backend3-adoption-api)**

```bash
# Descargar y ejecutar directamente desde Docker Hub
docker run -d -p 8080:8080 alanporcojohnson/backend3-adoption-api:latest
```

## ⚡ Inicio Rápido con Docker

### Opción 1: Docker Compose (Recomendado)
```bash
# Clonar el repositorio
git clone <tu-repositorio>
cd backend-3

# Ejecutar todo el stack (API + MongoDB)
docker-compose up -d

# Verificar que funciona
curl http://localhost:8080/
```

### Opción 2: Solo la API (requiere MongoDB local)
```bash
# Ejecutar solo la API
docker run -d \
  --name backend3-api \
  -p 8080:8080 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/backend3 \
  alanporcojohnson/backend3-adoption-api:latest
```

## 🖥️ Instalación Local

### Requisitos Previos
- Node.js 18+ 
- MongoDB
- Docker (opcional)

### Pasos de Instalación
```bash
# 1. Clonar el repositorio
git clone <tu-repositorio>
cd backend-3

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno (opcional)
cp .env.example .env

# 4. Ejecutar el servidor
npm run dev
```

El servidor estará disponible en `http://localhost:8080`

## 📚 Documentación API

### Swagger UI
Una vez que el servidor esté corriendo, accede a la documentación interactiva:
- **Local**: http://localhost:8080/api-docs
- **Docker**: http://localhost:8080/api-docs

## 🔗 Endpoints Principales

### 📋 Rutas Base
| Ruta | Descripción |
|------|-------------|
| `/api/users` | Gestión de usuarios |
| `/api/pets` | Gestión de mascotas |
| `/api/adoptions` | Gestión de adopciones |
| `/api/mocks` | Generación de datos ficticios |
| `/api-docs` | Documentación Swagger |

### 🐱 Adopciones (`/api/adoptions`)

#### GET `/api/adoptions`
Obtiene todas las adopciones
```bash
curl http://localhost:8080/api/adoptions
```

#### GET `/api/adoptions/:aid`
Obtiene una adopción específica
```bash
curl http://localhost:8080/api/adoptions/ADOPTION_ID
```

#### POST `/api/adoptions/:uid/:pid`
Crea una nueva adopción
```bash
curl -X POST http://localhost:8080/api/adoptions/USER_ID/PET_ID \
  -H "Content-Type: application/json" \
  -d '{"notes": "Adopción para familia responsable"}'
```

#### PUT `/api/adoptions/:aid`
Actualiza una adopción
```bash
curl -X PUT http://localhost:8080/api/adoptions/ADOPTION_ID \
  -H "Content-Type: application/json" \
  -d '{"status": "approved", "notes": "Adopción aprobada"}'
```

#### DELETE `/api/adoptions/:aid`
Elimina una adopción
```bash
curl -X DELETE http://localhost:8080/api/adoptions/ADOPTION_ID
```

### 👥 Usuarios (`/api/users`)

#### GET `/api/users`
Lista todos los usuarios
```bash
curl http://localhost:8080/api/users
```

#### GET `/api/users/:id`
Obtiene un usuario específico
```bash
curl http://localhost:8080/api/users/USER_ID
```

### 🐕 Mascotas (`/api/pets`)

#### GET `/api/pets`
Lista todas las mascotas
```bash
curl http://localhost:8080/api/pets
```

#### GET `/api/pets/:id`
Obtiene una mascota específica
```bash
curl http://localhost:8080/api/pets/PET_ID
```

### 🎲 Datos Mock (`/api/mocks`)

#### GET `/api/mocks/mockingpets`
Genera 100 mascotas ficticias
```bash
curl http://localhost:8080/api/mocks/mockingpets
```

#### GET `/api/mocks/mockingusers`
Genera usuarios ficticios (default: 50)
```bash
# 50 usuarios por defecto
curl http://localhost:8080/api/mocks/mockingusers

# Cantidad personalizada
curl http://localhost:8080/api/mocks/mockingusers?quantity=10
```

#### POST `/api/mocks/generateData`
Genera e inserta datos en la base de datos
```bash
curl -X POST http://localhost:8080/api/mocks/generateData \
  -H "Content-Type: application/json" \
  -d '{"users": 5, "pets": 10}'
```

## 🧪 Testing

### Ejecutar Tests
```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests con detalle
npm test -- --reporter spec

# Ejecutar tests específicos
npx mocha test/adoption.test.js
```

### Cobertura de Tests
Los tests cubren:
- ✅ Todos los endpoints de adoption.router.js
- ✅ Casos de éxito y error
- ✅ Validaciones de datos
- ✅ Estados de base de datos
- ✅ Manejo de errores

## 🐳 Docker

### Construir Imagen Local
```bash
# Construir imagen
docker build -t backend3-adoption-api .

# Ejecutar localmente
docker run -d -p 8080:8080 backend3-adoption-api
```

### Docker Compose
```bash
# Iniciar todo el stack
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Limpiar volúmenes
docker-compose down -v
```

## 📁 Estructura del Proyecto
```
backend-3/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── swagger.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Pet.js
│   │   └── Adoption.js
│   ├── services/
│   │   ├── users.service.js
│   │   ├── pets.service.js
│   │   └── adoptions.service.js
│   ├── routes/
│   │   ├── mocks.router.js
│   │   ├── users.router.js
│   │   ├── pets.router.js
│   │   └── adoption.router.js
│   ├── mocks/
│   │   ├── user.mock.js
│   │   └── pet.mock.js
│   ├── utils/
│   │   └── bcrypt.utils.js
│   └── app.js
├── test/
│   └── adoption.test.js
├── .env
├── .gitignore
├── .dockerignore
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

## 🔧 Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | 8080 |
| `MONGODB_URI` | URI de conexión a MongoDB | mongodb://localhost:27017/backend3 |
| `NODE_ENV` | Entorno de ejecución | development |

## 📝 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm start` | Inicia el servidor en producción |
| `npm run dev` | Inicia el servidor en desarrollo con hot reload |
| `npm test` | Ejecuta todos los tests |

## 🚀 Deployment

### Con Docker Hub
```bash
# Descargar imagen
docker pull alanporcojohnson/backend3-adoption-api:latest

# Ejecutar en producción
docker run -d \
  --name backend3-prod \
  -p 80:8080 \
  -e NODE_ENV=production \
  -e MONGODB_URI=your-mongodb-uri \
  alanporcojohnson/backend3-adoption-api:latest
```

### Con Docker Compose en Producción
```bash
# Usar archivo de producción
docker-compose -f docker-compose.yml up -d
```

## 📊 Modelos de Datos

### Usuario (User)
```javascript
{
  first_name: String,
  last_name: String, 
  email: String (unique),
  password: String (encrypted),
  role: "user" | "admin",
  pets: [ObjectId] // Referencias a mascotas
}
```

### Mascota (Pet)
```javascript
{
  name: String,
  type: "dog" | "cat" | "bird" | "fish" | "hamster" | "rabbit",
  breed: String,
  age: Number,
  adopted: Boolean,
  owner: ObjectId, // Referencia a usuario
  image: String
}
```

### Adopción (Adoption)
```javascript
{
  owner: ObjectId, // Referencia a usuario
  pet: ObjectId,   // Referencia a mascota
  status: "pending" | "approved" | "rejected" | "completed",
  adoption_date: Date,
  notes: String
}
```

## 🐛 Troubleshooting

### MongoDB no se conecta
```bash
# Verificar que MongoDB esté corriendo
mongosh --eval "db.runCommand({ ping: 1 })"

# Con Docker
docker run -d -p 27017:27017 mongo:6
```

### Puerto 8080 ocupado
```bash
# Verificar qué usa el puerto
lsof -i :8080

# Usar puerto diferente
PORT=3000 npm run dev
```

### Error de permisos con Docker
```bash
# En Linux/Mac
sudo docker-compose up -d

# O agregar usuario al grupo docker
sudo usermod -aG docker $USER
```

## 🤝 Contribución
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear un Pull Request

## 📄 Licencia
ISC

## 👨‍💻 Autor
Alan Johnson - Full Stack Developer

---

## 🎯 Entrega Final - Backend 3
Este proyecto cumple con todos los criterios de la entrega final:
- ✅ Documentación Swagger del módulo Users
- ✅ Tests funcionales completos para adoption.router.js
- ✅ Dockerfile configurado correctamente
- ✅ Imagen subida a Docker Hub: `alanporcojohnson/backend3-adoption-api`
- ✅ README.md con enlace a Docker Hub e instrucciones completas
