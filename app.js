require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const passport     = require('passport');
const LocalStrategy      = require('passport-local').Strategy;
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');

const session    = require("express-session");
const MongoStore = require('connect-mongo')(session);
const flash      = require("connect-flash");
    

mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost/where-is-terry', {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


hbs.registerHelper('ifUndefined', (value, options) => {
  if (arguments.length < 2)
      throw new Error("Handlebars Helper ifUndefined needs 1 parameter");
  if (typeof value !== undefined ) {
      return options.inverse(this);
  } else {
      return options.fn(this);
  }
});
  

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';


// Enable authentication using session + passport
app.use(session({
  secret: 'irongenerator',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore( { mongooseConnection: mongoose.connection })
}))
app.use(flash());
require('./passport')(app);
    

//////////sign up log in feature////////////////
// passport.serializeUser((user, cb) => {
//   cb(null, user.id);
// });

// passport.deserializeUser((id, cb) => {
//   User.findById(id, (err, user) => {
//     if (err) { return cb(err); }
//     cb(null, user);
//   });
// });

// passport.use('local-login', new LocalStrategy((username, password, next) => {
//   User.findOne({ username }, (err, user) => {
//     if (err) {
//       return next(err);
//     }
//     if (!user) {
//       return next(null, false, { message: "Incorrect username" });
//     }
//     if (!bcrypt.compareSync(password, user.password)) {
//       return next(null, false, { message: "Incorrect password" });
//     }

//     return next(null, user);
//   });
// }));

// passport.use('local-signup', new LocalStrategy(
//   { passReqToCallback: true },
//   (req, username, password, next) => {
//     // To avoid race conditions
//     process.nextTick(() => {
//         User.findOne({
//             'username': username
//         }, (err, user) => {
//             if (err){ return next(err); }

//             if (user) {
//                 return next(null, false);
//             } else {
//                 // Destructure the body
//                 const {
//                   username,
//                   email,
//                   password
//                 } = req.body;
//                 const hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
//                 const imagePath =  `/uploads/${req.file.filename}`
//                 // console.log(req.file);
//                 const newUser = new User({
//                   username,
//                   email,
//                   password: hashPass
//                 });


//                 newUser.save((err) => {
//                     if (err){ next(null, false, { message: newUser.errors }) }
//                     return next(null, newUser);
//                 });
//             }
//         });
//     });
// }));

// app.use(flash());
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// ////////////////////////////////////////////////




const index = require('./routes/index');
app.use('/', index);

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);
      

module.exports = app;
