// =============================== PASSPORT CONIFG ==============================
// =============================== PASSPORT CONIFG ==============================
// =============================== PASSPORT CONIFG ==============================

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User');
const security = require('../util/security');

// async function FindUserById(id) {
//   if (!id) throw new Error('Invalid argument: user_id');
//   const result = await User.findOne({ where: { id } });

//   if (result) return result;
//   return false;
// }
// async function FindUserByUsername(username) {
//   if (!username) throw new Error('Invalid argument: user_id');
//   const result = await User.findOne({ where: { username } });

//   if (result) return result;
//   return false;
// }

passport.use(
  new LocalStrategy(async (username, password, done) => {
    security.security_pwdproc(password, (encopwd) => {
      hashedPassword = encopwd;
    });

    try {
      const user = await User.findOne({ where: { username } });
      console.log(`user password = ${user.password}`);
      console.log(`hashed password = ${hashedPassword}`);

      if (user.password === hashedPassword) return done(null, user);
      return done(null, false);
    } catch (error) {
      console.log(`error : ${error}`);
    }

    // User.findOne({ where: { username } })
    //   .then((user) => {
    //     bcrypt.compare(password, user.password)
    //       .then((match) => {
    //         if (match) { return done(null, user); }
    //         return done(null, false);
    //       });
    //   }).catch((err) => done(err));
  })
);

// =============================== FOR SESSION STORAGE ==============================
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch(done);
});
