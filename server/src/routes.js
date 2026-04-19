const express = require("express");
const router = express.Router();
const {
  getAllTestCases,
  getTestCaseById,
  createTestCase,
  getStats,
} = require("./data");

// GET /api/testcases
router.get("/testcases", (req, res) => {
  try {
    const testCases = getAllTestCases();
    res.json({ success: true, data: testCases });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch test cases" });
  }
});

// GET /api/testcases/:id
router.get("/testcases/:id", (req, res) => {
  try {
    const testCase = getTestCaseById(req.params.id);
    if (!testCase) {
      return res.status(404).json({ success: false, message: "Test case not found" });
    }
    res.json({ success: true, data: testCase });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch test case" });
  }
});

// POST /api/testcases
router.post("/testcases", (req, res) => {
  try {
    const { prompt, response, category, bugType, severity, edgeCaseTags, notes, rating } = req.body;

    if (!prompt || !response || !category || !bugType || !severity) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: prompt, response, category, bugType, severity",
      });
    }

    const newCase = createTestCase({
      prompt,
      response,
      category,
      bugType,
      severity,
      edgeCaseTags: edgeCaseTags || [],
      notes: notes || "",
      rating: rating || "Incorrect",
    });

    res.status(201).json({ success: true, data: newCase });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create test case" });
  }
});

// GET /api/stats
router.get("/stats", (req, res) => {
  try {
    const stats = getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
});

module.exports = router;