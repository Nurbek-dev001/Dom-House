import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function setupSwagger(app) {
  try {
    const candidates = [
      path.join(process.cwd(), 'docs', 'openapi.yaml'),
      path.join(process.cwd(), 'backend', 'docs', 'openapi.yaml'),
      path.join(__dirname, 'docs', 'openapi.yaml')
    ];

    const specPath = candidates.find(p => fs.existsSync(p));
    if (!specPath) {
      console.warn('OpenAPI spec file not found; skipping Swagger UI initialization.');
      return;
    }

    const swaggerDocument = YAML.load(specPath);

    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));
    console.log('Swagger UI available at /api/docs');
  } catch (err) {
    console.warn('Could not initialize Swagger UI:', err.message);
  }
}
