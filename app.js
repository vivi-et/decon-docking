// FOLLOWING ESLINT - AIRBNB STYLE FORMAT

const express = require('express');
// =============================== SET ENV NODE ===============================
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
process.env.PWD = process.cwd();

// =============================== DEPENDENCY ===============================

const app = express();
const session = require('express-session');
const hbs = require('express-hbs');
const passport = require('passport');
const flash = require('express-flash');
const path = require('path');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
// const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const fs = require('fs');
const LocalStrategy = require('passport-local').Strategy;
require('./config/passport');

// =============================== MODEL ===============================
const auth = require('./config/auth');
const db = require('./config/db');
const User = require('./models/User');
const Notice = require('./models/Notice');
// =============================== MODEL RELATIONS ===============================
const Relation = require('./models/Relations');

// =============================== STATIC FOLDER / RESOURCES ===============================
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(`${process.env.PWD}/public`));

// =============================== DIRECTORY INIT ===============================
// const dirs = ['.public/uploads/imgs/article'];

// dirs.forEach((key) => {
//   if (!fs.existsSync(key)) {
//     fs.mkdirSync(key, { recursive: true });
//   }
// });

// INIT DIRECTORY

// ============================== SESSION, MIDDLEWARE & VIEW ENGINE  ==============================
// app.engine('hbs', exphbs({ extname: '.hbs' }));
// app.set('view engine', 'hbs');
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const client = redis.createClient(6379, 'localhost');

app.engine(
  'hbs',
  hbs.express4({
    partialsDir: `${__dirname}/views/partials`,
    layoutsDir: `${__dirname}/views/layouts`,
    helpers: {
      inc: function (value, options) {
        return parseInt(value) + 1;
      },
    },
  })
);

app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);

// SESSION SET
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: new RedisStore({
      client,
      ttl: 260,
    }),
    resave: false,
    saveUninitialized: false,
  })
);
// PASSPORT SET
app.use(passport.initialize());
app.use(passport.session()); // LOGIN SESSION

app.use((req, res, next) => {
  res.locals.user = req.user; // STORE USER DATA IN SESSION FOR GLOBAL ACCESS
  next();
});
app.use(flash()); // FOR FLASH MESSAGE

// =============================== HANDLEBARS HELPERS ===============================
hbs.registerHelper('inc', function (value, options) {
  return parseInt(value) + 1;
});
// =============================== ROUTES ===============================
app.get('/', auth.checkAuthenticated, (req, res) => {
  res.render('index.hbs', { req });
});
// app.get('/', auth.checkAuthenticated, (req, res) => {
//   res.render('index.hbs', { req });
//   // res.json('index.hbs', { name: req.user.username });
// });
app.use('/auth', require('./routes/auth'));
// app.use('/notice', auth.checkAuthenticated, require('./routes/notice'));
app.use('/notice', require('./routes/notice'));
app.use('/multer', auth.checkAuthenticated, require('./routes/multer'));
app.use('/article', auth.checkAuthenticated, require('./routes/article'));
app.use('/design', auth.checkAuthenticated, require('./routes/design'));
app.use('/test', auth.checkAuthenticated, require('./routes/test'));
// =============================== PORT & SERVER ===============================

app.set('port', 5000);

app.listen(app.get('port'), () => console.log(`App started on port ${app.get('port')}`));
// =============================== CREATE DB TABLES ===============================
db.sync();

console.log('==========================================================================');
console.log('==========================================================================');
