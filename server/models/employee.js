const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({

    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    designation: { type: String, required: true },
    gender: { type: String, required: true },
    course: { type: String, required: true },
    imgUpload: {
      data: { type: String, required: true }, // Base64 encoded string
      contentType: { type: String, required: true }
    }
  }, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);