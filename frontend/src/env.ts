import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
  API_URL: {
    public: true,
    static: true,
    description: 'Base URL of the Leftover REST API',
    schema: (value) => value || 'http://localhost:3000',
  },
});
