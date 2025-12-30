const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  format: { type: String, default: 'pdf' },
  type: { type: String, default: 'Income Statement' },
  period: { type: String, default: 'Current Month' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  downloadUrl: { type: String }, // store file url/path if you save
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);
