Package.describe({
  summary: "IBM Bluemix OAuth flow",
  version: "1.0.0"
});

Package.onUse(function(api) {
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('underscore', 'client');
  api.use('templating', 'client');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);

  api.export('Bluemix');

  api.addFiles(['bluemix_configure.html', 'bluemix_configure.js'], 'client');

  api.addFiles('bluemix_server.js', 'server');
  api.addFiles('bluemix_client.js', 'client');
});
