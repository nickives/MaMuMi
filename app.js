const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
require('dotenv').config();

// routes
const indexRouter = require('./routes/index');
const journeysRouter = require('./routes/journeys');
const adminRouter = require('./routes/admin');
const langRouter = require('./routes/lang');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// I18n
const { I18n } = require('i18n')
const i18n = new I18n({
  locales: ['en', 'bg', 'el', 'it', 'no', 'es'],
  fallbacks: {en: 'en-*', bg: 'bg-*', el: 'el-*', it: 'it-*', no: 'no-*', es: 'es-*' },
  defaultLocale: 'en',
  cookie: 'lang',
  directory: path.join(__dirname, 'locales')
});
app.use(i18n.init);

// app locals - all templates can see these
app.use((req, res, next) => {
  res.locals.hostname = `${req.protocol}://${req.get('host')}`;
  res.locals.port = app.get('port');
  next();
});

// Root
app.use('/', indexRouter);

// journeys
app.use('/journeys', journeysRouter);

// admin
app.use('/admin', adminRouter);

// lang test
app.use('/lang', langRouter);

// static content
app.use("/s", express.static(path.resolve(__dirname, './static')));

// assets
app.use("/a", express.static(path.resolve(__dirname, './assets')));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development

  // render the error page
  res.status(err.status || 500);
  res.render('error', {error: err} );
});

module.exports = app;
