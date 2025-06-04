const pool = require('../db/config');

//función para traerme todas las noticias
exports.getAllNews = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, title, image_url, content, author, date FROM news ORDER BY date DESC');
        res.json(result.rows); 
    } catch (err) {
        console.error('Error al obtener noticias:', err.message);
        res.status(500).json({ message: 'Error interno del servidor al obtener noticias.' });
    }
};
//funcion para traer una noticia por id
exports.getNewsById = async (req, res) => {
    const { id } = req.params;

    try {
        if (isNaN(id)) {
            return res.status(400).json({ message: 'El ID de la noticia debe ser un número válido.' });
        }

        const result = await pool.query('SELECT * FROM news WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Noticia no encontrada.' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error al obtener noticia por ID:', err.message);
        res.status(500).json({ message: 'Error interno del servidor al obtener la noticia.' });
    }
};

//funcion para crear noticia
exports.createNews = async (req, res) => {
    // Extrae todos los campos posibles que podría enviar el frontend
    const { title, content, category, author, image_url } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: 'Título y contenido son campos requeridos.' });
    }

    try {
        const finalCategory = category || null;
        const finalAuthor = author || null;
        const finalImageUrl = image_url || null;

        const result = await pool.query(
            'INSERT INTO news (title, content, category, author, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, content, finalCategory, finalAuthor, finalImageUrl]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error al crear la noticia:', err);
        res.status(500).json({ message: 'Error al crear la noticia', error: err.message });
    }
};


//funcion para editar noticia
exports.updateNews = async (req, res) => {
    const { id } = req.params;
    const { title, content, image_url, author, category } = req.body;

    if (isNaN(id)) {
        return res.status(400).json({ message: 'El ID de la noticia debe ser un número válido.' });
    }

    if (!title && !content && !image_url && !author && !category) {
        return res.status(400).json({ message: 'No se proporcionaron datos para actualizar.' });
    }

    try {
        const fields = [];
        const values = [];
        let paramIndex = 1;

        if (title !== undefined) { fields.push(`title = $${paramIndex++}`); values.push(title); }
        if (content !== undefined) { fields.push(`content = $${paramIndex++}`); values.push(content); }
        if (category !== undefined) { fields.push(`category = $${paramIndex++}`); values.push(category || null); }
        if (author !== undefined) { fields.push(`author = $${paramIndex++}`); values.push(author || null); }
        if (image_url !== undefined) { fields.push(`image_url = $${paramIndex++}`); values.push(image_url || null); }

        if (fields.length === 0) {
            return res.status(400).json({ message: 'No hay campos válidos para actualizar.' });
        }

        values.push(id);

        const query = `UPDATE news SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Noticia no encontrada para actualizar.' });
        }
        res.json(result.rows[0]);
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
        conditions.push(`(title ILIKE $${paramIndex} OR content ILIKE $${paramIndex})`);
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