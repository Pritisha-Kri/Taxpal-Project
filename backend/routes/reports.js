const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Report = require('../models/Report');

// GET /api/reports - list recent reports for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const reports = await Report.find({ createdBy: req.user._id }).sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, data: { reports } });
  } catch (err) {
    console.error('Fetch reports error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching reports' });
  }
});

// POST /api/reports/generate - create a report record and (optionally) produce downloadable file
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { reportType = 'Income Statement', period = 'Current Month', format = 'pdf' } = req.body;
    // Here you'd gather required financial data (transactions / budgets) and produce a file.
    // For now we'll create a placeholder report entry and a fake download url.

    const name = `${reportType} - ${period} - ${new Date().toISOString()}`;
    // TODO: produce real file and upload to storage or local folder and set downloadUrl accordingly.
    const fakeDownloadUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reports/download/${Date.now()}`;

    const report = new Report({
      name,
      format,
      type: reportType,
      period,
      createdBy: req.user._id,
      downloadUrl: fakeDownloadUrl,
    });

    await report.save();

    res.status(201).json({
      success: true,
      message: 'Report generated',
      data: { report }
    });
  } catch (err) {
    console.error('Generate report error:', err);
    res.status(500).json({ success: false, message: 'Server error generating report' });
  }
});

module.exports = router;
