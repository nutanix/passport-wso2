/**
 * Module dependencies.
 */
var util = require('util');
var OAuth2Strategy = require('passport-oauth2');
var InternalOAuthError = require('passport-oauth2').InternalOAuthError;
var Profile = require('./profile');


/**
 * `Strategy` constructor.
 *
 * The WSO2 authentication strategy authenticates requests by delegating to a
 * WSO2 Identity Server using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your WSO2 service provider's Client ID
 *   - `clientSecret`  your WSO2 service provider's Client Secret
 *   - `callbackURL`   URL to which WSO2 will redirect the user after
 *                     granting authorization
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};

  OAuth2Strategy.call(this, options, verify);
  this.name = 'wso2';
  this._oauth2.useAuthorizationHeaderforGET(true);
  this._authorizationParams = options.authorizationParams || {}
  this._tokenParams = options.tokenParams || {}
  // TODO: We should be able to assume the user profile URL based on the
  // hostname of the identity provider since the endpoint should always
  // be /wso2/scim/Users/me.
  this._userProfileURL = options.userProfileURL;
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from the WSO2 Identity Server.
 *
 * @override
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.get(this._userProfileURL, accessToken, function(err, body, res) {
    var json;
    var profile;

    if (err) {
      return done(new InternalOAuthError('Failed to fetch user profile', err));
    }

    try {
      json = JSON.parse(body)
    } catch (ex) {
      return done(new Error('Failed to parse user profile'))
    }

    profile = Profile.parse(json)
    profile.provider = 'wso2'
    profile._raw = body
    profile._json = json

    done(null, profile)
  })
}

/**
 * Return extra parameters to be included in the authorization request.
 *
 * @override
 * @param {Object} options
 * @return {Object}
 * @api protected
 */
Strategy.prototype.authorizationParams = function(options) {
  return this._authorizationParams
}

/**
 * Return extra parameters to be included in the token request.
 *
 * @override
 * @return {Object}
 * @api protected
 */
Strategy.prototype.tokenParams = function(options) {
  return this._tokenParams;
}

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
