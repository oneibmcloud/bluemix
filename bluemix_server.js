Bluemix = {};

OAuth.registerService('bluemix', 2, null, function(query) {

  var accessToken = getAccessToken(query);
  var identity = getIdentity(accessToken);

  return {
    serviceData: {
      id: identity.userUniqueID,
      accessToken: OAuth.sealSecret(accessToken),
      email: identity.email || '',
      username: identity.username,
    },
    options: {profile: {name: identity.name}}
  };
});

// http://developer.github.com/v3/#user-agent-required
var userAgent = "Meteor";
if (Meteor.release)
  userAgent += "/" + Meteor.release;

var getAccessToken = function (query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'bluemix'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var response;
  try {
    response = HTTP.post(
      "https://idaas.ng.bluemix.net/sps/oauth20sp/oauth20/token", {
        headers: {
          Accept: 'application/json',
          "User-Agent": userAgent
        },
        params: {
          code: query.code,
          client_id: config.clientId,
          client_secret: OAuth.openSecret(config.secret),
          redirect_uri: OAuth._redirectUri('bluemix', config),
          grant_type: 'authorization_code',
          state: query.state
        }
      });
  } catch (err) {
    throw _.extend(new Error("Failed to complete OAuth handshake with Bluemix. " + err.message),
                   {response: err.response});
  }
  if (response.data.error) { // if the http response was a json object with an error attribute
    throw new Error("Failed to complete OAuth handshake with Bluemix. " + response.data.error);
  } else {
    return response.data.access_token;
  }
};

var getIdentity = function (accessToken) {
  try {
    var url = "https://idaas.ng.bluemix.net/idaas/resources/profile.jsp?access_token=" + accessToken;
    return JSON.parse(HTTP.get(url).content);
  } catch (err) {
    throw _.extend(new Error("Failed to fetch identity from Bluemix. " + err.message),
                   {response: err.response});
  }
};

Bluemix.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
