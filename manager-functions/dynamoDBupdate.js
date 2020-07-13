// Try `node dynamoDBupdate` run this file.
const AWS = require("aws-sdk");
const biomedicalEngineering = require("./resources/ece-courses/meng-biomedical-engineering.json");
const eceprograms = require("./resources/programs/ece.json");

AWS.config.update({
  accessKeyId: "",
  secretAccessKey: "",
  region: "us-east-1",
});

const DynamoDBClient = new AWS.DynamoDB.DocumentClient();

async function setupCourses(seedData) {
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
      console.log(`Create ECE${data.CourseCode} succeeded`);
    } catch (error) {
      console.error(
        `Failed to create document:\n Table: ${"ECE"}\n Data: ${data}\n Error:`,
        error
      );
    }
  }
}

async function setupPrograms(seedData) {
  for (let data of seedData) {
    try {
      const params = {
        TableName: "Programs",
        Item: {
          Department: data.Department,
          Program: data.Program,
          CoursesRequired: data.CoursesRequired,
          OtherRequirements: data.OtherRequirements,
        },
      };

      await DynamoDBClient.put(params).promise();
      console.log(
        `Create program  ${data.Department} :  ${data.Program} succeeded`
      );
    } catch (error) {
      console.error(
        `Failed to create document:\n Table: ${"ECE"}\n Data: ${data}\n Error:`,
        error
      );
    }
  }
}

// Sample methods to update our db
// await setupCourses(biomedicalEngineering);
// await setupPrograms(eceprograms);

// // Sample Query playground
// try {
//   const assignmentParams = {
//     TableName: "Programs",
//     ExpressionAttributeValues: {
//       ":department": "ECE",
//       ":program": "MENG",
//     },
//     KeyConditionExpression: "Department = :department AND Program = :program",
//   };
//   DynamoDBClient.query(assignmentParams)
//     .promise()
//     .then((res, err) => {
//       console.log(res.Items);
//     });
// } catch (error) {
//   console.log(error);
// }
