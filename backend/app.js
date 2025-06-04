import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sessions from 'express-session'

import WebAppAuthProvider from 'msal-node-wrapper'
import usersRouter from './routes/users.js';
import crosswordsRouter from './routes/crosswords.js'

import dotenv from 'dotenv';
dotenv.config();
console.log("MONGODB_URI:", process.env.MONGODB_URI);

const authConfig = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID,
    authority: process.env.AZURE_AUTHORITY,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
    redirectUri: "/redirect"
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: 3,
    },
  },
};

console.log(authConfig)

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import models from './models.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.enable('trust proxy');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
  secret: "this is some secret key for INFO 441 Final Project",
  saveUninitialized: true,
  cookie: { maxAge: oneDay, secure: false },
  resave: false
}))

const authProvider = await WebAppAuthProvider.WebAppAuthProvider.initialize(
  authConfig
);

app.use(authProvider.authenticate());

app.use((req, res, next) => {
  req.models = models
  next()
})

app.get('/signin', (req, res, next) => {
  console.log('signed in!')
  return req.authContext.login({
    postLoginRedirectUri: '/form' // redirect here after login
  })(req, res, next);
});

app.get('/signout', (req, res, next) => {
  return req.authContext.logout({
    postLogoutRedirectUri: '/' // redirect here after logout
  })(req, res, next);
});

app.use('/users', usersRouter);
app.use('/crosswords', crosswordsRouter);

app.use(express.static(path.join(__dirname, '/public/build')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/build', 'index.html'));
});

app.use(authProvider.interactionErrorHandler());

// backend connection to do

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
