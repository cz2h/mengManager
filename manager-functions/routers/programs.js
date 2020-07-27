const express = require("express");
const router = express.Router();

const { DynamoDBClient } = require("../dynamodb");

router.get("/detail/:dept/", async (req, res) => {
  console.log("### GET PROGRAMS :dept ###");
  const queryDepartment = req.params.dept.toUpperCase();

  try {
    const assignmentParams = {
      TableName: "engPrograms",
      ExpressionAttributeValues: {
        ":department": queryDepartment,
      },
      KeyConditionExpression: "Department = :department",
    };
    console.log(`### GET Program ${queryDepartment}  ###`);
    const queryRes = await DynamoDBClient.query(assignmentParams).promise();
    res.status(200).json(queryRes);
  } catch (error) {
    console.log("!!! GET Program Error!!!", error);
    res.status(400).json(error);
  }
});

router.get("/detail/:dept/:program", async (req, res) => {
  console.log("### GET PROGRAMS :dept :program ###");
  const queryDepartment = req.params.dept.toUpperCase();
  const queryProgram = req.params.program.toUpperCase();

  try {
    const assignmentParams = {
      TableName: "engPrograms",
      ExpressionAttributeValues: {
        ":department": queryDepartment,
        ":program": queryProgram,
      },
      KeyConditionExpression: "Department = :department AND Program = :program",
    };
    console.log(`### GET Program ${queryDepartment} ${queryProgram} ###`);
    const queryRes = await DynamoDBClient.query(assignmentParams).promise();
    res.status(200).json(queryRes);
  } catch (error) {
    console.log("!!! GET Program Error!!!", error);
    res.status(400).json(error);
  }
});

module.exports = router;
