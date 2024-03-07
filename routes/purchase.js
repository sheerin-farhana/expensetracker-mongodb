const express = require('express');
const route = express.Router();

const { purchasePremium, updateTransactionStatus } = require('../controllers/purchase');
const { authenticate: userAuthentication } = require('../middleware/auth');

route.get('/premiummembership',userAuthentication, purchasePremium);
route.post('/updatetransactionstatus', userAuthentication,updateTransactionStatus);


module.exports = route;

