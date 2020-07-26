const express = require("express");
const router = express.Router();

const { DynamoDBClient } = require("../dynamodb");

router.get("/list/:dept/:code", async (req, res) => {
  const dept = req.params.dept;
  const code = req.params.code;
  console.log(req);
  try {
    const queryParamms = {
      TableName: "Courselist",
      ExpressionAttributeValues: {
        ":code": code,
        ":dept": dept,
      },
      KeyConditionExpression:
        "department = :dept AND begins_with(course_code, :code)",
    };
    console.log(
      `### GET list of satisfied Courses : prefix ${dept} ${code} ###`
    );
    const queryRes = await DynamoDBClient.query(queryParamms).promise();
    res.status(200).json(queryRes);
  } catch (error) {
    console.log("!!! GET list of satisfied Courses !!!", error);
    res.status(400).json(error);
  }
});

router.get("/detail/:courseId", async (req, res) => {
  const courseId = req.params.courseId;
  console.log(req);
  try {
    const queryParamms = {
      TableName: "engCourses",
      ExpressionAttributeValues: {
        ":courseId": courseId,
      },
      KeyConditionExpression: "id = :courseId",
    };
    console.log(`### GET Course:id ${courseId} ###`);
    const queryRes = await DynamoDBClient.query(queryParamms).promise();
    res.status(200).json(queryRes);
  } catch (error) {
    console.log("!!! GET Course:id Error!!!", error);
    res.status(400).json(error);
  }
});

module.exports = router;
