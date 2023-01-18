const router = require('express').Router();
const SampleController = require('../controller/sample')

router.post('/result',SampleController.result);
module.exports = router;