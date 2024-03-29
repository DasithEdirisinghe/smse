const client = require('./es/client');

async function generateApiKeys(opts) {
  const body = await client.security.createApiKey({
    body: {
      name: 'search_app',
      role_descriptors: {
        search_role: {
          cluster: ['monitor'],
          index: [
            {
              names: ['sinhala_songs'],
              privileges: ['create_index', 'write', 'read', 'manage'],
            },
          ],
        },
      },
    },
  });
  return Buffer.from(`${body.id}:${body.api_key}`).toString('base64');
}

generateApiKeys()
  .then(console.log)
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });