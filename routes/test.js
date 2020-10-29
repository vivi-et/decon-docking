const { json } = require('body-parser');
const express = require('express');
const Test = require('../models/Test');

const router = express.Router();
router.use(express.json());

router.post('/', (req, res) => {
  // console.log(req.body);

  const { data } = req.body;

  Test.create({ data });

  return res.send(data);
});

router.get('/', (req, res) => {
  Test.findByPk(9).then((result) => {
    // data[0].data.forEach((element) => {
    //   console.log(element);
    // });

    console.log(result.data);

    // const dat = result.data;

    // const outer = data[0].data[0];

    // console.log(outer);

    res.render('test.hbs', { result });
  }).catch((err) => {
    console.log(err);
  });
});

module.exports = router;
