const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');

const User = require('../models/user');
const user = require('../controlers/user')

const passport = require('passport');

router.route('/register')
    .get(user.renderRegister)
    .post(catchAsync(user.register));

router.get('/logout', user.logout);

router.route('/login')
    .get(user.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.login);

module.exports = router;
