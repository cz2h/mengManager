const { uuid } = require("uuidv4");
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

async function updateCourses(seedData) {
  // Search if course exist
  for (let data of seedData) {
    try {
      const assignmentParams = {
        TableName: "engCourses",
        IndexName: "gsiCategoryCourses", // Specify the search index
        ExpressionAttributeValues: {
          ":coursecode": data.CourseCode,
          ":dept": "ECE",
        },
        KeyConditionExpression:
          "Department = :dept AND CourseCode = :coursecode",
      };
      const res = await DynamoDBClient.query(assignmentParams).promise();
      console.log(res);
      // We can then try to update the Item and modify it.
      // This is how you update an Item
      //   res.Items[0].Session = "FUCK";
      //   console.log(res.Items);
      //   const newParams = {
      //     TableName: "engCourses",
      //     Item: res.Items[0],
      //   };
      //   const updateres = await DynamoDBClient.put(newParams).promise();
    } catch (error) {
      console.error(`Failed to query:\n ECE${data.CourseCode}\n Error:`, error);
    }
  }
}

async function initCoursesAndCourselist(seedData) {
  for (let data of seedData) {
    try {
      const newId = uuid();
      const addToCourseParams = {
        TableName: "engCourses",
        Item: {
          id: newId,
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
      await DynamoDBClient.put(addToCourseParams).promise();
      console.log(`engCourse : Create ${data.CourseCode} succeeded`);

      const addCourseListParam = {
        TableName: "engCourselist",
        Item: {
          course_code: `${data.CourseCode}${data.SessionCode}`,
          id: newId,
        },
      };
      await DynamoDBClient.put(addCourseListParam).promise();
      console.log(`engCourselist : Create ECE${data.CourseCode} succeeded`);
    } catch (error) {
      console.error(
        `Failed to create document:\n Table: ${"ECE"}\n Data: ${data}\n Error:`,
        error
      );
    }
  }
}

async function initPrograms(seedData) {
  for (let data of seedData) {
    try {
      const params = {
        TableName: "engPrograms",
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

async function testQueryCourseList(dept, prefixQuery) {
  try {
    const queryParamms = {
      TableName: "Courselist",
      ExpressionAttributeValues: {
        ":prefixQuery": prefixQuery,
        ":dept": dept,
      },
      KeyConditionExpression:
        "department = :dept AND begins_with(course_code, :prefixQuery)",
    };
    console.log(
      `### GET list of satisfied Courses : prefix ${prefixQuery} ###`
    );
    const queryRes = await DynamoDBClient.query(queryParamms).promise();
    console.log(queryRes);
  } catch (error) {
    console.log("!!! GET list of satisfied Courses !!!", error);
  }
}

async function testQueryDetailCourse(courseId) {
  try {
    const queryParamms = {
      TableName: "engCourses",
      ExpressionAttributeValues: {
        ":courseId": courseId,
      },
      KeyConditionExpression: "id = :courseId",
    };
    const queryRes = await DynamoDBClient.query(queryParamms).promise();
    console.log(queryRes);
  } catch (error) {
    console.log(error);
  }
}
// Sample methods to update our db
// initCoursesAndCourselist(biomedicalEngineering.slice(0, 1));
// initPrograms(eceprograms);
// updateCourses(biomedicalEngineering.slice(0, 1));

// testQueryCourseList("ECE", "17");
// testQueryDetailCourse("834205ca-0a1b-4396-948e-04a4daf4ac13");
// //!!! Sample Query playground !!!
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
