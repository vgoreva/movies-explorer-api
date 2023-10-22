const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUserInfo, editUserData,
} = require('../controllers/users');

router.get('/me', getUserInfo);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().min(2).max(30),
    name: Joi.string().min(2).max(30),
  }),
}), editUserData);

module.exports = router;
