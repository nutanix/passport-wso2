/**
 * Module dependencies.
 */
var util = require('util');
var OAuth2Strategy = require('passport-oauth2');
var InternalOAuthError = require('passport-oauth2').InternalOAuthError;


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
  this._userProfileURL = options.userProfileURL;
  this._oauth2.useAuthorizationHeaderforGET(true);
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from the WSO2 Identity Server.
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {

  // TODO: Fetch the user profile.
  done(null, {})
}

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
