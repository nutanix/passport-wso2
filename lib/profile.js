/**
 * Parse profile.
 *
 * This parser normalizes the JSON representation of the user profile, as given
 * by the auth provider, in accordance with the portable contacts spec.
 * http://portablecontacts.net/draft-spec.html
 *
 * @param {Object} Profile JSON from provider
 * @return {Object}
 * @api private
 */
exports.parse = function(json) {
  var _json = {};
  //
  // there is a change in idp v5.2 profile information. Resources key is not
  // available in idp v5.2. Modified below code to support new changes.
  //
  // Sample format for the both versions
  // idp v5.0: {Resources: [userName: 'test@nutanix.com']}
  // idp v5.2: {userName: 'test@nutanix.com'}
  //
  if (json && json.Resources && json.Resources[0]) {
    _json = json.Resources[0];
  } else {
    _json = json;
  }

  var profile = {};

  profile.id = String(_json.id);
  profile.name = _parseName(_json);
  profile.displayName = _parseDisplayName(_json);
  profile.userName = _json.userName;
  profile.emails = _parseEmails(_json);
  profile.groups = _json.groups;

  return profile;
};

//
// Private
//
function _parseName(json) {
  return json.name || {givenName: '', familyName: ''}
}

function _parseDisplayName(json) {
  var nameObj = json.name || {}
  var nameItems = []
  if (nameObj.givenName) {nameItems.push(nameObj.givenName)}
  if (nameObj.familyName) {nameItems.push(nameObj.familyName)}

  return nameItems.join(' ')
}

function _parseEmails(json) {
  var emails = [];
  var toParse = json.emails || [];

  // Normalize user email list. The WSO2 API maintains the email list in a
  // strage way returning the primary email as a string elment in the `emails`
  // array but includes everything else as an object.
  toParse.forEach(function(val, idx) {
    var emailObj = (typeof val === 'string') ?
      {type: 'primary', value: val} : val
    emails.push(emailObj);
  })

  return emails;
}
