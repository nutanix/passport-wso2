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
  var _json = json.Resources[0];
  var profile = {};

  profile.id = String(_json.id);
  profile.name = _json.name;
  profile.displayName = _json.name.givenName + ' ' + _json.name.familyName;
  profile.userName = _json.userName
  profile.emails = _parseEmails(_json);
  profile.groups = _json.groups;

  return profile;
};

//
// Private
//

function _parseEmails(json) {
  var emails = [];
  json.emails.forEach(function(val, idx) {
    // TODO: Identify how plural fields will be served. For now, we'll just
    // assume the first index contains the primary but emails should be
    // returned as a list of objects of the form
    // [{value: 'j@e.com' primary: true}]. An alternative would be to assume
    // that the `username` property is always an email address and mark that
    // as the primary if found.
    if (idx === 0) {
      emails.push({value: val, primary: true});
      return;
    }
    emails.push({value: val});
  })

  return emails;
}
