const express = require("express");
const router = express.Router();
// Helper functions
router.get("/", async (req, res) => {
  console.log("### INIT Get###", req);
  try {
    res.status(200).json("Updated");
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
