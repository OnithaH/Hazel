import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: 'app/api', // define api folder under app/api
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Hazel Companion API',
        version: '1.0.0',
        description: 'Interactive API documentation for the Hazel Companion project.',
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [],
    },
  });
  return spec;
};
