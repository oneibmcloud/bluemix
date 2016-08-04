Bluemix = {};

OAuth.registerService('bluemix', 2, null, function(query) {

  var data = getAccessToken(query);
  console.log(data);
  // console.log(JSON.stringify(data, null, 4));
  var accessToken = data.access_token;
  // console.log('access',accessToken);
  var refreshToken = data.refresh_token;
  // console.log('refresh',refreshToken);
  var identity = getIdentity(accessToken);

  return {
    serviceData: {
      id: identity.user_id,
      accessToken: OAuth.sealSecret(accessToken),
      refreshToken: OAuth.sealSecret(refreshToken),
      email: identity.email || '',
      username: identity.user_name,
      bmprofile: identity,
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
   
  var basicAuth = 'Basic ' + new Buffer(config.clientId + ':' + config.secret).toString('base64');
  var redirectUri = config.redirectUri || OAuth._redirectUri('bluemix', config);
  var response;
  var tokenUrl = config.tokenUrl || "https://uaa.eu-gb.bluemix.net/oauth/token";
  try {
    response = HTTP.post(
        tokenUrl, {
        headers: {
          Accept: 'application/json',
          "User-Agent": userAgent,
          Authorization: basicAuth
        },
        params: {
          code: query.code,
          client_id: config.clientId,
          client_secret: OAuth.openSecret(config.secret),
          redirect_uri: redirectUri,
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
    return response.data;
  }
};

var getIdentity = function (accessToken) {
  // get the config
  var config = ServiceConfiguration.configurations.findOne({service: 'bluemix'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  try {
    var userInfoUrl = config.userInfoUrl || "https://uaa.eu-gb.bluemix.net/userinfo";
    var url = userInfoUrl + "?access_token=" + accessToken;
    return JSON.parse(HTTP.get(url).content);
  } catch (err) {
    throw _.extend(new Error("Failed to fetch identity from Bluemix. " + err.message),
                   {response: err.response});
  }
};

Bluemix.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
