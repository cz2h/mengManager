"use strict";
const express = require("express");
const awsServerlessExpress = require("aws-serverless-express");

const cors = require("cors");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");

// Routers
const initRouter = require("./routers/init");
const programsRouter = require("./routers/programs");
const courseRouter = require("./routers/courses");

// Set up app
const app = express();
app.use(cors());
app.use(awsServerlessExpressMiddleware.eventContext());
app.use("/init", initRouter);
app.use("/programs", programsRouter);
app.use("/courses", courseRouter);

// Create our sam express server
const server = awsServerlessExpress.createServer(app);
exports.lambdaHandler = (event, context) => {
  console.log(event, context);
  awsServerlessExpress.proxy(server, event, context);
};
