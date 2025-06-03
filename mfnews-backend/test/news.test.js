// mfnews-backend/test/news.test.js

const request = require('supertest');
const app = require('../app'); // La instancia de tu app Express

// NO NECESITAS require('chai') ni chai.use(chaiHttp) AQUÍ,
// ya que 'setup.js' lo hace globalmente y configura 'expect'

// No necesitas 'pool' aquí si solo lo usas en setup.js

describe('API de Noticias', () => {
  let createdNewsId;

  // No necesitas beforeEach y afterAll aquí, ya los maneja setup.js

  describe('POST /api/news', () => {
    it('debería crear una noticia nueva', async () => {
      const newNews = {
        title: 'Noticia de prueba',
        content: 'Contenido de prueba',
        category: 'Tecnología',
        author: 'Autor de prueba'
      };

      const res = await request(app).post('/api/news').send(newNews);

      // console.log(res.statusCode, res.body); // Descomenta para depurar respuestas

      expect(res.statusCode).to.equal(201); // Usa .to.equal() con Chai
      expect(res.body).to.have.property('id');
      expect(res.body.title).to.equal(newNews.title);
      // Asegúrate de verificar que el ID es un número
      expect(res.body.id).to.be.a('number');
      createdNewsId = res.body.id;
    });

    it('debería fallar si faltan campos requeridos', async () => {
      const res = await request(app).post('/api/news').send({ title: 'Faltan campos' });

      expect(res.statusCode).to.equal(400);
      expect(res.body.message).to.equal('Título y contenido son campos requeridos.'); 

    });
    
  });

  describe('GET /api/news', () => {
    it('debería devolver un listado de noticias', async () => {
        // Inserta una noticia para asegurar que haya datos
        await request(app).post('/api/news').send({
            title: 'Noticia para listado',
            content: 'Contenido de listado',
            category: 'General',
            author: 'Test List'
        });

      const res = await request(app).get('/api/news');

      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.greaterThanOrEqual(1);
    });
  });

  describe('GET /api/news/:id', () => {
    let localNewsId;
    // Creamos una noticia específicamente para este bloque de tests
    beforeEach(async () => {
        const res = await request(app).post('/api/news').send({
            title: 'Noticia para GET ID',
            content: 'Contenido de GET ID',
            category: 'Tech',
            author: 'Local Test'
        });
        localNewsId = res.body.id;
    });

    it('debería devolver una noticia específica', async () => {
      const res = await request(app).get(`/api/news/${localNewsId}`);

      expect(res.statusCode).to.equal(200);
      expect(res.body).to.have.property('id', localNewsId);
      expect(res.body.title).to.equal('Noticia para GET ID');
    });

    it('debería devolver 404 si no existe la noticia', async () => {
      const res = await request(app).get('/api/news/999999');

      expect(res.statusCode).to.equal(404);
      expect(res.body.message).to.match(/Noticia no encontrada/);
    });

    it('debería devolver 400 si el ID no es un número', async () => {
      const res = await request(app).get('/api/news/abc');

      expect(res.statusCode).to.equal(400);
      expect(res.body.message).to.match(/El ID de la noticia debe ser un número válido/);
    });
  });

  describe('PUT /api/news/:id', () => {
    let localNewsId;
    beforeEach(async () => {
        const res = await request(app).post('/api/news').send({
            title: 'Noticia para PUT',
            content: 'Contenido para PUT',
            category: 'Testing',
            author: 'PUT Test'
        });
        localNewsId = res.body.id;
    });

    it('debería actualizar la noticia correctamente', async () => {
      const updatedTitle = 'Título actualizado de prueba';
      const res = await request(app)
        .put(`/api/news/${localNewsId}`)
        .send({ title: updatedTitle, content: 'Contenido actualizado' }); // ¡Importante! Asegúrate de que el campo coincida (body vs content)

      expect(res.statusCode).to.equal(200);
      expect(res.body.title).to.equal(updatedTitle);
    });

    it('debería devolver 404 si el ID no existe', async () => {
      const res = await request(app).put('/api/news/999999').send({ title: 'Test' });

      expect(res.statusCode).to.equal(404);
      expect(res.body.message).to.match(/Noticia no encontrada para actualizar/);
    });

    it('debería devolver 400 si no se envían campos para actualizar', async () => {
      const res = await request(app).put(`/api/news/${localNewsId}`).send({});

      expect(res.statusCode).to.equal(400);
      expect(res.body.message).to.match(/No se proporcionaron datos para actualizar/);
    });
  });

  describe('GET /api/news/search', () => {
    beforeEach(async () => {
        await request(app).post('/api/news').send({
            title: 'Noticia de búsqueda 1',
            content: 'Contenido relevante para búsqueda',
            category: 'Search',
            author: 'Search Author'
        });
        await request(app).post('/api/news').send({
            title: 'Otra noticia',
            content: 'Sin palabras clave',
            category: 'General',
            author: 'Another Author'
        });
    });

    it('debería devolver resultados al buscar por título', async () => {
      const res = await request(app).get('/api/news/search?query=relevante');

      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.greaterThanOrEqual(1);
      expect(res.body[0].title).to.equal('Noticia de búsqueda 1');
    });

    it('debería devolver resultados al buscar por autor', async () => {
        const res = await request(app).get('/api/news/search?author=Search');

        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.greaterThanOrEqual(1);
        expect(res.body[0].author).to.equal('Search Author');
    });

    it('debería devolver error si no se envían parámetros', async () => {
      const res = await request(app).get('/api/news/search');

      expect(res.statusCode).to.equal(400);
      expect(res.body.message).to.match(/Debe proporcionar un parámetro de búsqueda/);
    });
  });

  describe('DELETE /api/news/:id', () => {
    let localNewsIdToDelete;
    beforeEach(async () => {
        const res = await request(app).post('/api/news').send({
            title: 'Noticia para DELETE',
            content: 'Contenido para DELETE',
            category: 'Removal',
            author: 'DELETE Test'
        });
        localNewsIdToDelete = res.body.id;
    });

    it('debería eliminar la noticia correctamente', async () => {
      const res = await request(app).delete(`/api/news/${localNewsIdToDelete}`);

      expect(res.statusCode).to.equal(200);
      expect(res.body.message).to.match(/eliminada exitosamente/i);
      expect(res.body).to.have.property('id', localNewsIdToDelete);

      // Opcional: verificar que ya no existe después de la eliminación
      const getRes = await request(app).get(`/api/news/${localNewsIdToDelete}`);
      expect(getRes.statusCode).to.equal(404);
    });

    it('debería devolver 404 si ya fue eliminada o no existe', async () => {
      const nonExistentId = 999999; // Un ID que no existe
      const res = await request(app).delete(`/api/news/${nonExistentId}`);

      expect(res.statusCode).to.equal(404);
      expect(res.body.message).to.match(/Noticia no encontrada para eliminar/);
    });

    it('debería devolver 400 si el ID es inválido', async () => {
      const res = await request(app).delete('/api/news/abc');

      expect(res.statusCode).to.equal(400);
      expect(res.body.message).to.match(/El ID de la noticia debe ser un número válido/);
    });
  });
});