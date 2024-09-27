const router=require('express').Router();
const upload = require('../Middlewares/fileUpload.middleware');
const {postTrade,postBalance} = require('../Controllers/trade.controller')

router.post('/upload',upload.single('file'),postTrade);
router.post('/balance',postBalance);
module.exports = router;