const express = require("express");
const router = express.Router();
const fs = require("fs");

const { DynamoDBClient } = require("../dynamodb");

const categories = [
  "biomedical-engineering",
  "communications",
  "electrical-computer-engineering",
  "electromagnetics",
  "electronics",
  "energy-system",
  "photonics",
  "systems-control",
];

// Helper functions
function readSeedData(category) {
  try {
    const jsonString = fs.readFileSync(
      "../resources/ece-courses/meng-" + category + ".json"
    );
    return JSON.parse(jsonString);
  } catch (err) {
    console.log("!!! FAIL TO READ meng-" + category + ".json !!!");
  }
}

router.post("/", async (req, res) => {
  console.log("router post", req);
  // Want to add data from courses.json to our DB
  const courses = readSeedData("biomedical-engineering");
  // Put data read from json file to our DB.
  try {
    await Promise.all(
      // Promise.all resolves when the list of promies resolved
      courses.map((course, index) => {
        // This will return a list of
        const params = {
          TableName: "Courses",
          Item: {
            Department: "ECE",
            Category: "biomedical-engineering",
            CourseCode: course.CourseCode,
            SessionTime: course.SessionCode,
            Title: course.Title,
            Instructor: course.Instructor,
            Days: course.Days,
            Rooms: course.Room,
          },
        };
        console.log("=== Init Post:" + params.Item.CourseCode + "===");
        DynamoDBClient.put(params).promise();
      })
    );
    res.status(200).json("Updated");
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
