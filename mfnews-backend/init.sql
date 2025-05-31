-- mfnews-backend/init.sql
CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Opcional: Insertar algunos datos de prueba
INSERT INTO news (title, body, image_url, author) VALUES
('Novak Djokovic presenta acciones legales contra los organismos rectores del tenis', 'Denuncian un sistema corrupto, ilegal y abusivo por parte de la ATP, WTA, ITF e ITIA. El pulso alcista de Bitcoin (BTC) mostró signos de desaceleración durante todo el miércoles, desmarcándose de la euforia que invadió las acciones tecnológicas en Wall Street. Impulsadas por la expectativa de resultados sobresalientes del gigante de la inteligencia artificial Nvidia (NVDA), dejaron al activo digital principal en una zona de incertidumbre.', 'https://example.com/djokovic.jpg', 'Deportes'),
('Casadó evita el quirófano', 'El medio realizará tratamiento conservador y estará alrededor de dos meses de baja. Lorem ipsum dolor sit amet consectetur. Non accumsan a in morbi amet ultrices ipsum. Hac sollicitudin fermentum nam hac lectus. Justo iaculis purus scelerisque mollis ut adipiscing vestibulum. Adipiscing curabitur lorem ultrices nullam. Cras cursus justo porttitor aliquam. In sed enim quis morbi leo vivamus nulla donec cursus mauris bibendum donec. Ultricies fusce duis sem nunc. Cursus et felis suspendisse nulla donec eleifend. Commodo augue diam ac a arcu magna sit sed nisi. Aliquam nec congue turpis blandit nibh proin ultricies etiam. In tellus magna duis odio auctor enim sem. Enim mauris molestie habitasse amet dolor lacus est massa. Nisl sed blandit nisi enim eget cursus felis. Nisi vivamus pretium libero nisl imperdiet ac aliquet laoreet nec. Morbi a platea nisi dolor id. Sit pellentesque tortor in non integer mattis feugiat pretium. Praesent in venenatis platea eu consequat egestas. Morbi id porttitor ipsum.', 'https://example.com/casado.jpg', 'C. Navarro');