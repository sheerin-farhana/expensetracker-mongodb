const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  fileURL: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const DownloadedFile = mongoose.model("File", fileSchema);

module.exports = DownloadedFile;
