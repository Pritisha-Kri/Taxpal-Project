const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");

router.get("/calendar", authenticateToken, async (req, res) => {
  const calendar = [
    {
      _id: 1,
      title: "Reminder: Q2 Estimated tax payment.",
      date: "June 1, 2025",
      description: "Reminder for upcoming Q2 tax payment on June 15, 2025",
      type: "reminder",
    },
    {
      _id: 2,
      title: "Q2 Estimated tax payment.",
      date: "June 15, 2025",
      description: "Second quarter estimated tax payment due",
      type: "payment",
    },
    {
      _id: 3,
      title: "Reminder: Q3 Estimated tax payment.",
      date: "Sep 1, 2025",
      description: "Reminder for upcoming Q3 tax payment on Sep 15, 2025",
      type: "reminder",
    },
    {
      _id: 4,
      title: "Q3 Estimated tax payment.",
      date: "Sep 15, 2025",
      description: "Third quarter estimated tax payment due",
      type: "payment",
    },
  ];

  res.json({
    success: true,
    data: { calendar },
  });
});

module.exports = router;
