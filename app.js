import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { createProxyMiddleware } from 'http-proxy-middleware'
import request from 'request'

import usersRouter from './routes/users.js';
import crosswordsRouter from './routes/crosswords.js'

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import WebAppAuthProvider from 'msal-node-wrapper';
import sessions from 'express-session'

import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const authConfig = {
    auth: {
        clientId: process.env.AZURE_CLIENT_ID,
        authority: process.env.AZURE_AUTHORITY,
        clientSecret: process.env.AZURE_CLIENT_SECRET,
        redirectUri: "http://localhost:3000/redirect"
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: 3,
        }
    }
};


app.enable('trust proxy')


const oneDay = 1000 * 60 * 60 * 24
app.use(sessions({
    secret: "this is some secret key for INFO 441 Final Project",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}))


const authProvider = await WebAppAuthProvider.WebAppAuthProvider.initialize(authConfig);
app.use(authProvider.authenticate());

app.get('/signin', (req, res, next) => {
    return req.authContext.login({
        postLoginRedirectUri: "/", // redirect here after login
    })(req, res, next);
});

app.get('/signout', (req, res, next) => {
    return req.authContext.logout({
        postLogoutRedirectUri: "/", // redirect here after logout
    })(req, res, next);
});

app.get('/redirect', (req, res) => {
    res.redirect('/');
})


app.use(authProvider.interactionErrorHandler());


app.use('/api/users', usersRouter);
app.use('/crosswords', crosswordsRouter);


// app.use('/*', createProxyMiddleware({
//     target: 'http://localhost:4000',
//     pathRewrite: (path, req) => req.baseUrl,
//     changeOrigin: true
// }))


app.get('/myIdentity', (req, res) => {
    if (req.session.isAuthenticated) {
        const userInfo = {
            name: req.session.account.name,
            username: req.session.account.username
        }
        res.json({
            status: "loggedin",
            userInfo: userInfo
        })
    } else {
        return res.json({ status: "loggedout" })
    }
})



export default app;
