# Backend: API RESTful de Noticias

Este es el componente backend del proyecto de gestión de noticias. Se encarga de la lógica del servidor, la interacción con la base de datos (simulada) y la provisión de una API RESTful para realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre los artículos de noticias.

---

## 🚀 Cómo Empezar

Sigue estos pasos para levantar el servidor backend en tu entorno local.

### Prerrequisitos

Asegúrate de tener instalado lo siguiente:

* **Node.js**: Versión 18.x o superior. Puedes verificar tu versión con `node -v`.
* **npm**: Versión 9.x o superior. Se instala automáticamente con Node.js. Puedes verificar tu versión con `npm -v`.

### Instalación

1.  **Navega a la carpeta del backend** en tu terminal:
    ```bash
    cd mfnews-backend
    ```
2.  **Instala las dependencias** del proyecto:
    ```bash
    npm install
    ```

### Configuración de Variables de Entorno

Para configurar el entorno del servidor, crea un archivo llamado `.env` en la raíz de esta carpeta (`mfnews-backend/`), al mismo nivel que `package.json`. Este archivo es crucial para manejar configuraciones sensibles y específicas del entorno, y está **ignorado por Git** por seguridad.

```bash
touch .env
Puedes definir el puerto en el que correrá el servidor (por defecto, json-server suele usar el 3000):

PORT=3000
(Si no tienes otras variables de entorno específicas para este proyecto, el archivo puede quedar con solo esta línea o vacío, pero es buena práctica tenerlo.)

Ejecución del Servidor

Para iniciar el servidor de desarrollo, que utilizará json-server para la base de datos:

Bash
npm run dev
El servidor backend estará disponible en http://localhost:3000.

Puedes verificar que el servidor está funcionando visitando la URL base: http://localhost:3000/. Deberías ver un mensaje de bienvenida o el estado de la API.
Los datos de las noticias, gestionados por json-server, estarán accesibles en el endpoint: http://localhost:3000/api/news.

🛠 Tecnologías Utilizadas

Node.js: Entorno de ejecución de JavaScript del lado del servidor.
Express.js: Un framework web rápido y minimalista para Node.js, utilizado para construir la API RESTful.
json-server: Una herramienta ligera que permite crear una API REST completa en menos de un minuto, usando un archivo JSON (db.json) como base de datos. Ideal para prototipos y desarrollo local.
Nodemon: Una utilidad que monitorea cualquier cambio en los archivos de tu código fuente y automáticamente reinicia el servidor. Esto agiliza el flujo de desarrollo.
📂 Estructura de Archivos Clave
db.json: El archivo que actúa como la base de datos de tu aplicación, donde json-server almacena y gestiona los datos de las noticias.
server.js: El archivo principal del backend, donde se configura el servidor Express, se integra json-server y se definen las rutas de la API.
.env: Archivo de configuración de variables de entorno, no versionado por Git para proteger información sensible.
package.json: Define el proyecto, sus metadatos y todas las dependencias necesarias.
package-lock.json: Registra el árbol exacto de dependencias instaladas.

🔑 Endpoints de la API
La API de noticias expone los siguientes endpoints para interactuar con los recursos:

GET /api/news: Recupera una lista de todas las noticias disponibles.
GET /api/news/:id: Obtiene los detalles de una noticia específica utilizando su ID.
POST /api/news: Crea una nueva noticia. Los datos de la noticia se envían en el cuerpo de la solicitud.
PUT /api/news/:id: Actualiza completamente una noticia existente. Los datos actualizados se envían en el cuerpo de la solicitud.
DELETE /api/news/:id: Elimina una noticia de la base de datos utilizando su ID.