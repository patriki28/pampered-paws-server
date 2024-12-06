import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const swaggerConfig = {
  info: {
    version: '1.0.0',
    title: 'Pampered Paws Server',
    description:
      'Pampered Paws Server is a web server with a REST API designed to streamline and manage dog grooming appointments, making it easier for customers to schedule, modify, and track their grooming sessions.',
  },
  baseDir: path.join(__dirname, '../'),
  filesPattern: './**/*.js',
  swaggerUIPath: '/api-docs',
  exposeSwaggerUI: true,
  exposeApiDocs: false,
  notRequiredAsNullable: false,
  swaggerDocsPath: '/api-docs.json',
};

export default swaggerConfig;
