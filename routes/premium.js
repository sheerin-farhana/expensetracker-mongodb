// /premium/showLeaderboard

const express = require("express");
const route = express.Router();

const { showLeaderboard, downloadReport } = require("../controllers/premium");

route.get("/showLeaderboard", showLeaderboard);

module.exports = route;
