const AWS = require("aws-sdk");

const DynamoDBClient = new AWS.DynamoDB.DocumentClient();

module.exports = { DynamoDBClient };
