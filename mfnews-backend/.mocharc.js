// mfnews-backend/.mocharc.js
module.exports = {
    require: ['./test/setup.cjs'], // Ruta a tu archivo de setup
    timeout: 5000, // Timeout general para los tests, el hook 'before' tiene uno específico de 10s
    spec: 'test/**/*.test.js', // Patrón para encontrar tus archivos de test
  };