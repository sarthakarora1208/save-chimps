import "reflect-metadata";
import path from "path";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import colors from "colors";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import cors from "cors";
import AWS from "aws-sdk";
import session from "express-session";
import passport from "passport";
const xss = require("xss-clean");
const MemoryStore = require("memorystore")(session);
import flash from "express-flash";
import csrf from "csurf";
import moment from "moment";
const DocusignStrategy = require("passport-docusign");
const DSAuthCodeGrant = require("./lib/DSAuthCodeGrant");
const DsJwtAuth = require("./lib/DSJwtAuth");
import errorHandler from "./middleware/error";

//import connectDB from "./config/db";

import connectPostgreSQL from "./config/connnectPostgreSQL";
import {
  AUDITS,
  AUTH,
  BASE_ROUTE,
  DOCUSIGN,
  DS,
  REVISION_REQUESTS,
  SIGNED_DOCUMENT,
  USER,
} from "./constants/routes";
import simpleAuth from "./routes/simpleAuthRoute";
import auth from "./routes/authRoute";
import audits from "./routes/auditsRoute";
import revisionRequests from "./routes/revisionRequestsRoute";
import user from "./routes/userRoute";
import docusign from "./routes/docusignRoute";
import signedDocument from "./routes/signedDocumentRoute";
import { login } from "./controllers/authController";
const dsConfig = require("./config/index").config;
//routes
//dotenv.config({ path: './config/config.env' });
dotenv.config({ path: path.join(__dirname, "config", "config.env") });
// Connect to database
//connectDB();

// Connect to Postgres
connectPostgreSQL();

export const s3bucket = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});
const PORT = process.env.PORT || 5000;
const HOST = process.env.host || "localhost";
const max_session_min = 180;
const csrfProtection = csrf({ cookie: true });

let hostUrl = "http://" + HOST + ":" + PORT;
if (dsConfig.appUrl != "" && dsConfig.appUrl != "{APP_URL}") {
  hostUrl = dsConfig.appUrl;
}

// app
const app = express();

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(function (req, res, next) {
  console.log("Requested path: %s", req.path);
  next();
});

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent //XSS attacks
app.use(xss());

// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Body parser
app.use(express.json());

// Express body parser
app.use(express.urlencoded({ extended: true }));
// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});

//app.use(limiter);
// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());
// Set static folder
//app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: dsConfig.sessionSecret,
    name: "ds-launcher-session",
    cookie: { maxAge: max_session_min * 60000 },
    saveUninitialized: true,
    resave: true,
    store: new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
  })
);
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "25mb" }));
app.use(passport.initialize());
app.use(passport.session());
app
  .use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.session = req.session;
    res.locals.dsConfig = {
      ...dsConfig,
    };
    res.locals.hostUrl = hostUrl; // Used by DSAuthCodeGrant#logout
    next();
  }) // Send user info to views
  .use(flash());
app.use((req: any, res, next) => {
  ///req.dsAuthCodeGrant = new DSAuthCodeGrant(req);
  //req.dsAuth = req.dsAuthCodeGrant;
  req.dsAuthJwt = new DsJwtAuth(req);
  req.dsAuth = req.dsAuthJwt;
  console.log(req.dsAuth);
  next();
});

//routes
app.use(`${BASE_ROUTE}${AUTH}`, simpleAuth);
app.use(`${BASE_ROUTE}${DS}`, auth);
app.use(`${DOCUSIGN}`, docusign);
app.use(`${BASE_ROUTE}${USER}`, user);
app.use(`${BASE_ROUTE}${AUDITS}`, audits);
app.use(`${BASE_ROUTE}${REVISION_REQUESTS}`, revisionRequests);
app.use(`${BASE_ROUTE}${SIGNED_DOCUMENT}`, signedDocument);
app.use(errorHandler);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("dist/build"));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "dist", "build", "index.html"))
  );
}
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete DocuSign profile is serialized
//   and deserialized.
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (obj: any, done) {
  done(null, obj);
});

const scope = ["signature"];

// Configure passport for DocusignStrategy
let docusignStrategy = new DocusignStrategy(
  {
    production: dsConfig.production,
    clientID: dsConfig.dsClientId,
    scope: scope.join(" "),
    clientSecret: dsConfig.dsClientSecret,
    callbackURL: hostUrl + `${DS}/callback`,
    state: true, // automatic CSRF protection.
    // See https://github.com/jaredhanson/passport-oauth2/blob/master/lib/state/session.js
  },
  function _processDsResult(
    accessToken: any,
    refreshToken: any,
    params: any,
    profile: any,
    done: any
  ) {
    // The params arg will be passed additional parameters of the grant.
    // See https://github.com/jaredhanson/passport-oauth2/pull/84
    //
    // Here we're just assigning the tokens to the account object
    // We store the data in DSAuthCodeGrant.getDefaultAccountInfo
    let user = profile;
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    user.expiresIn = params.expires_in;
    user.tokenExpirationTimestamp = moment().add(user.expiresIn, "s"); // The dateTime when the access token will expire
    return done(null, user);
  }
);

/**
 * The DocuSign OAuth default is to allow silent authentication.
 * An additional OAuth query parameter is used to not allow silent authentication
 */
if (!dsConfig.allowSilentAuthentication) {
  // See https://stackoverflow.com/a/32877712/64904
  docusignStrategy.authorizationParams = function (options: any) {
    return { prompt: "login" };
  };
}
passport.use(docusignStrategy);
