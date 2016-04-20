Package.describe({
  name: 'ibmcloud:bluemix',
  version: '1.0.2',
  summary: 'IBM Bluemix OAuth flow',
  git: 'https://github.com/oneibmcloud/bluemix.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.use('oauth2@1.0.0', ['client', 'server']);
  api.use('oauth@1.0.0', ['client', 'server']);
  api.use('http@1.0.0', ['server']);
  api.use('underscore@1.0.0', 'client');
  api.use('templating@1.0.0', 'client');
  api.use('random@1.0.0', 'client');
  api.use('service-configuration@1.0.0', ['client', 'server']);

  api.export('Bluemix');

  api.addFiles(['bluemix_configure.html', 'bluemix_configure.js'], 'client');

  api.addFiles('bluemix_server.js', 'server');
  api.addFiles('bluemix_client.js', 'client');
});
