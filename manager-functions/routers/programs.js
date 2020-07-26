const express = require("express");
const router = express.Router();

const { DynamoDBClient } = require("../dynamodb");

router.get("/:programid", async (req, res) => {
  console.log("### GET PROGRAMS :programid ###");
  const queryString = req.params.programid;
  console.log(queryString);
  const queryDepartment = queryString.split("_")[0].toUpperCase();
  const queryProgram = queryString.split("_")[1].toUpperCase();

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
