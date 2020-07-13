const AWS = require("aws-sdk");
const biomedicalEngineering = require("./ece-courses/meng-biomedical-engineering.json");

AWS.config.update({
  accessKeyId: "",
  secretAccessKey: "",
  region: "us-east-1",
});

const DynamoDBClient = new AWS.DynamoDB.DocumentClient();

async function setup(seedData) {
  for (let data of seedData) {
    try {
      const params = {
        TableName: "Courses",
        Item: {
          Department: "ECE",
          CourseCode: data.CourseCode,
          Session: data.SessionCode,
          Title: data.Title,
          Instructor: data.Instructor,
          Days: data.Days,
          Room: data.Room,
          StartDate: data.StartDate,
          Category: data.Category,
        },
      };

      await DynamoDBClient.put(params).promise();
      console.log(`Create document succeeded`);
    } catch (error) {
      console.error(
        `Failed to create document:\n Table: ${"ECE"}\n Data: ${data}\n Error:`,
        error
      );
    }
  }
}

setup(biomedicalEngineering);
