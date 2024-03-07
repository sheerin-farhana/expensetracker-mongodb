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

// const Sequelize = require('sequelize');
// const sequelize = require('../utils/database');

// const DownloadedFile = sequelize.define('DownloadedFiles', {
//     id: {
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//         allowNull:false
//     },
//     fileURL: {
//         type: Sequelize.STRING,
//     },

// });

module.exports = DownloadedFile;
