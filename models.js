/**
 * Mongoose models for movie and user data.
 * @module models
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

/**
 * Mongoose schema for a movie
 * @typedef {Object} MovieSchema
 * @property {string} Title - The title of the movie (required).
 * @property {string} Description - Description of the movie (required).
 * @property {Object} Genre - Genre information for the movie.
 * @property {string} Genre.Name - Name of the genre.
 * @property {string} Genre.Description - Description of the genre.
 * @property {Object} Director - Director information for the movie.
 * @property {string} Director.Name - Name of the director.
 * @property {string} Director.Bio - Biography of the director.
 * @property {string} Director.Birth - Birthdate of the director.
 * @property {string} Director.Death - Date of death of the director.
 * @property {string} ImagePath - Path to the image of the movie.
 * @property {boolean} Featured - Indicates if the movie is featured.
 */
let movieSchema = new Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
    Birth: String,
    Death: String,
  },
  ImagePath: String,
  Featured: Boolean,
});

/**
 * Mongoose schema for a user
 * @typedef {Object} UserSchema
 * @property {string} Username - The username (required).
 * @property {string} Password - The hashed password (required).
 * @property {string} Email - The email of the user (required).
 * @property {Date} Birthday - The user's birthday.
 * @property {Array.<mongoose.Schema.Types.ObjectId>} TopMovies - Array of movie IDs.
 * @property {Function} hashPassword - Hashes a password.
 * @property {Function} validatePassword - Validates a password.
 */
let userSchema = new Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  TopMovies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
    },
  ],
});

/**
 * Password hashing
 * @function
 * @name hashPassword
 * @param {string} password - The password to hash.
 * @returns {string} The hashed password.
 */
userSchema.statics.hashPassword = function (password) {
  return bcrypt.hashSync(password, 10);
};

/**
 * Password validation
 * @function
 * @name validatePassword
 * @param {string} password - The password to validate.
 * @returns {boolean} Whether the password is valid.
 * @instance
 */
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
