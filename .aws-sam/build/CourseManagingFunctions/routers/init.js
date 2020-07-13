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

router.get("/", async (req, res) => {
  console.log(req);
  try {
    res.status(200).json("Updated");
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
