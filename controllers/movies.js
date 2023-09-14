const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = require('http2').constants;
const { default: mongoose } = require('mongoose');
const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((cards) => res.status(HTTP_STATUS_OK).send(cards))
    .catch(next);
};

module.exports.addMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    owner: req.user._id,
    nameRU,
    nameEN,
  })
    .then((card) => {
      res.status(HTTP_STATUS_CREATED).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.cardId);
  Movie.deleteOne()
    .orFail()
    .then(() => {
      res.status(HTTP_STATUS_OK).send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Передан несуществующий _id карточки.'));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Передан некоректный _id карточки.'));
      } else {
        next(err);
      }
    });
};
