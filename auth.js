/**
 * Module for handling user authentication and JWT token generation.
 * @module authentication
 */

const jwtSecret = 'your_jwt_secret';
const jwt = require('jsonwebtoken');
const passport = require('passport');

require('./passport.js');

/**
 * JWT token generation
 * @function
 * @name generateJWTToken
 * @param {Object} user - User object for JWT generation.
 * @returns {string} JWT token.
 */
let generateJWTToken = function (user) {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username,
    expiresIn: '7d',
    algorithm: 'HS256',
  });
};

/**
 * Login endpoint, generating JWT token
 * @function
 * @name login
 * @param {Object} req - Express request object.
 * @param {string} req.body.Username - Username.
 * @param {string} req.body.Password - Password.
 * @param {Object} res - Express response object with user and token information.
 */
module.exports = function (router) {
  router.post('/login', function (req, res) {
    passport.authenticate(
      'local',
      // No session has to be maintained on the server because JWT holds all info necessary to authenticate user
      { session: false },
      function (error, user, info) {
        // If there was an error during local authentication there will be an info argument (see local strategy in passport.js)
        if (info) {
          return res.status(400).json(info);
        }

        if (error) {
          return res.status(400).json({
            message: 'Something is not right',
            user: user,
          });
        }

        req.login(user, { session: false }, function (error) {
          if (error) {
            return res.send(error);
          }

          let token = generateJWTToken(user.toJSON());

          return res.json({
            user: user,
            token: token,
          });
        });
      }
    )(req, res);
  });
};
