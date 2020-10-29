// =============================== /AUTH ROUTES ==============================
// =============================== /AUTH ROUTES ==============================
// =============================== /AUTH ROUTES ==============================

const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const auth = require('../config/auth');
const User = require('../models/User');
const security = require('../util/security');

const router = express.Router();

router.use(express.urlencoded({ extended: false }));

// router.post('/login',
//   passport.authenticate('local', { failureRedirect: '/login' }),
//   (req, res) => {
//     res.redirect('/');
//   });

// router.get('/login', (req, res, next) => {
//   passport.authenticate('local', (err, user, info) => {
//     if (err) { return next(err); }
//     if (!user) { return res.redirect('/login'); }
//     req.logIn(user, (err) => {
//       if (err) { return next(err); }
//       return res.redirect(`/users/${user.username}`);
//     });
//   })(req, res, next);

// });

// =============================== POST / ==============================
router.post('/', passport.authenticate('local'), (req, res) => {
  res.render('auth/index.hbs', { title: req.user.username });
});

// =============================== GET / ==============================
router.get('/login', auth.checkNotAuthenticated, (req, res) => {
  res.render('auth/login.hbs');
});

// =============================== POST /LOGIN ==============================
router.post('/login', passport.authenticate('local'), (req, res) => {
  res.locals.loggedIn = true;
  res.locals.username = req.user.username;
  res.redirect('/');
  // res.send(req.user);
});

// =============================== GET /REGISTER ==============================
router.get('/register', auth.checkNotAuthenticated, (req, res) => {
  res.render('auth/register.hbs');
});

// =============================== POST /REGISTER ==============================
router.post('/register', auth.checkNotAuthenticated, async (req, res) => {
  console.log(req.body);
  console.log(req.body);
  console.log(req.body);
  console.log(req.body);
  const { username, email, password } = req.body;

  const errors = [];

  if (!username) {
    errors.push({ text: 'Please add username' });
  }
  if (!email) {
    errors.push({ text: 'Please add email' });
  }

  if (errors > 0) {
    res.render('auth/login.hbs', { errors });
  }

  // const find = await User.findOne({
  //   where: {
  //     [Op.or]: [{ username }, { email }],
  //   },
  // });

  const findEmail = await User.findOne({ where: { username } });
  if (findEmail) {
    errors.push({ text: 'EMAIL ALREADY EXISTS!' });
    return res.render('auth/login.hbs', { errors });
  }

  const findUser = await User.findOne({ where: { username } });
  if (findUser) {
    errors.push({ text: 'USERNAME ALREADY EXISTS!' });
    return res.render('auth/login.hbs', { errors });
  }

  try {

    security.security_pwdproc(password, (encopwd) => {
      hashedPassword = encopwd;  
  });


    // const salt = bcrypt.genSaltSync(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    User.create({
      username,
      email,
      password: hashedPassword,
    });
    res.redirect('/auth/login');
  } catch (error) {
    errors.push({ text: error });
    console.log(error);
    return res.redirect('/auth/register', { errors });
  }

  return res.send('NO WHERE');
});

// =============================== GET /LOGOUT ==============================
router.get('/logout', (req, res) => {
  req.logout();
  return res.redirect('/');
});

module.exports = router;
