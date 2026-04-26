const dotenv = require('dotenv');
dotenv.config();

const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n🚀 FinControl Flow API rodando em http://localhost:${PORT}`);
  console.log(`📄 Documentação Swagger:  http://localhost:${PORT}/api-docs`);
  console.log(`❤️  Health Check:          http://localhost:${PORT}/api/health\n`);
});
