
const pool = require('../db/config'); 

//función para traerme todas las noticias
exports.getAllNews = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, title, image_url, author, date FROM news ORDER BY date DESC');
        res.json(result.rows); 
    } catch (err) {
        console.error('Error al obtener noticias:', err.message);
        res.status(500).json({ message: 'Error interno del servidor al obtener noticias.' });
    }
};

//funcion para traer una noticia por id
exports.getNewsById = async (req, res) => {
    const { id } = req.params; // Extrae el id de los parámetros de la URL

    try {
        // Validar si el ID es un número
        if (isNaN(id)) {
            return res.status(400).json({ message: 'El ID de la noticia debe ser un número válido.' });
        }

        const result = await pool.query('SELECT * FROM news WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Noticia no encontrada.' });
        }
        res.json(result.rows[0]); // Devuelve la primera (y única) fila encontrada
    } catch (err) {
        console.error('Error al obtener noticia por ID:', err.message);
        res.status(500).json({ message: 'Error interno del servidor al obtener la noticia.' });
    }
};

//funcion para crear noticia
exports.createNews = async (req, res) => {
    // Extrae los datos del cuerpo de la petición (lo que envía el frontend)
    const { title, body, image_url, author } = req.body;

    // Validación básica de datos 
    if (!title || !body || !image_url || !author) {
        return res.status(400).json({ message: 'Faltan campos requeridos: title, body, image_url, author.' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO news (title, body, image_url, author) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, body, image_url, author]
        );
        res.status(201).json(result.rows[0]); 
    } catch (err) {
        console.error('Error al crear noticia:', err.message);
        res.status(500).json({ message: 'Error interno del servidor al crear la noticia.' });
    }
};

//funcion para editar noticia
exports.updateNews = async (req, res) => {
    const { id } = req.params;
    const { title, body, image_url, author } = req.body;

    if (isNaN(id)) {
        return res.status(400).json({ message: 'El ID de la noticia debe ser un número válido.' });
    }

    // Validación básica de datos 
    if (!title && !body && !image_url && !author) {
        return res.status(400).json({ message: 'No se proporcionaron datos para actualizar.' });
    }

    try {
        // Construir la query dinámicamente para actualizar solo los campos presentes
        const fields = [];
        const values = [];
        let paramIndex = 1;

        if (title) { fields.push(`title = $${paramIndex++}`); values.push(title); }
        if (body) { fields.push(`body = $${paramIndex++}`); values.push(body); }
        if (image_url) { fields.push(`image_url = $${paramIndex++}`); values.push(image_url); }
        if (author) { fields.push(`author = $${paramIndex++}`); values.push(author); }

        if (fields.length === 0) {
            return res.status(400).json({ message: 'No hay campos válidos para actualizar.' });
        }

        values.push(id); // El ID siempre será el último parámetro

        const query = `UPDATE news SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Noticia no encontrada para actualizar.' });
        }
        res.json(result.rows[0]); // Devuelve la noticia actualizada
    } catch (err) {
        console.error('Error al actualizar noticia:', err.message);
        res.status(500).json({ message: 'Error interno del servidor al actualizar la noticia.' });
    }
};


//funcion para eliminar noticia
exports.deleteNews = async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ message: 'El ID de la noticia debe ser un número válido.' });
    }

    try {
        const result = await pool.query('DELETE FROM news WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Noticia no encontrada para eliminar.' });
        }
        res.status(200).json({ message: 'Noticia eliminada exitosamente.', id: result.rows[0].id });
    } catch (err) {
        console.error('Error al eliminar noticia:', err.message);
        res.status(500).json({ message: 'Error interno del servidor al eliminar la noticia.' });
    }
};

//funcion para buscar noticia
exports.searchNews = async (req, res) => {
    const { query, author } = req.query;

    if (!query && !author) {
        return res.status(400).json({ message: 'Debe proporcionar un parámetro de búsqueda (query y/o author).' });
    }

    let sqlQuery = 'SELECT * FROM news WHERE ';
    const queryParams = [];
    const conditions = [];
    let paramIndex = 1;

    if (query) {
        conditions.push(`(title ILIKE $${paramIndex} OR body ILIKE $${paramIndex})`);
        queryParams.push(`%${query}%`);
        paramIndex++;
    }
    if (author) {
        conditions.push(`author ILIKE $${paramIndex}`);
        queryParams.push(`%${author}%`);
        paramIndex++;
    }

    sqlQuery += conditions.join(' AND ');

    try {
        const result = await pool.query(sqlQuery, queryParams);
        res.json(result.rows);
    } catch (err) {
        console.error('Error en la búsqueda de noticias:', err.message);
        res.status(500).json({ message: 'Error interno del servidor al buscar noticias.' });
    }
};