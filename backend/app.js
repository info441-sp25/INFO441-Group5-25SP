import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { createProxyMiddleware } from 'http-proxy-middleware'
import request from 'request'
import sessions from 'express-session'

import WebAppAuthProvider from 'msal-node-wrapper'
import usersRouter from './routes/users.js';
import crosswordsRouter from './routes/crosswords.js'

const authConfig = {
  auth: {
    clientId: '9cf79576-bc82-45d9-addc-4e91791e0414',
    authority:
      'https://login.microsoftonline.com/f6b6dd5b-f02f-441a-99a0-162ac5060bd2',
    clientSecret:
      "",
    redirectUri: '/form',
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

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.enable('trust proxy');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const oneDay = 1000 * 60 * 60 * 24;
app.use(
  sessions({
    secret:
      'this is some secret key I am making up dsafewanvejr852308rfhowisaelfn',
    saveUninitialized: true,
    cookie: { 
      maxAge: oneDay,
      sameSite: "none"
    },
    resave: false,
  })
);

// app.post("/auth/redirect", (req, res) => {
//   req.session.user = { name: profile.displayName, email: profile.email };
//   res.redirect("/"); // postLoginRedirectUri
// });

const authProvider = await WebAppAuthProvider.WebAppAuthProvider.initialize(
  authConfig
);

app.use(authProvider.authenticate());

app.use('/users', usersRouter);

app.get('/signin', (req, res, next) => {
  return req.authContext.login({
    postLoginRedirectUri: '/form', // redirect here after login
  })(req, res, next);
});
app.get('/signout', (req, res, next) => {
  return req.authContext.logout({
    postLogoutRedirectUri: '/', // redirect here after logout
  })(req, res, next);
});

app.use('/crosswords', crosswordsRouter);

app.use(express.static(path.join(__dirname, '../react-client/build')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../react-client/build', 'index.html'));
});

app.use(authProvider.interactionErrorHandler());

// app.use('/*', createProxyMiddleware({
//     target: 'http://localhost:4000',
//     pathRewrite: (path, req) => req.baseUrl,
//     changeOrigin: true
// }))

// backend connection to do

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
