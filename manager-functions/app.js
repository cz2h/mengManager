const express = require("express");
const awsServerlessExpress = require("aws-serverless-express");

const cors = require("cors");

const initRouter = require("./routers/init");
const programsRouter = require("./routers/programs");

const app = express();
app.use(cors);
app.use("/init", initRouter);
app.use("/programs", programsRouter);

const server = awsServerlessExpress.createServer(app);

exports.lambdaHandler = async (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};
