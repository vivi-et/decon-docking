// =============================== NOTICE ROUTES ==============================
// =============================== NOTICE ROUTES ==============================
// =============================== NOTICE ROUTES ==============================

const express = require('express');
const moment = require('moment');
const Notice = require('../models/Notice');

const router = express.Router();

// =============================== GET / ==============================
router.get('/', async (req, res) => {
  const notices = await Notice.findAll();

  // for (k in notices) {
  //   console.log(notices[k].createdAt);
  // }

  Object.keys(notices).forEach((key) => {
    notices[key].moments = moment(notices[key].createdAt).format('MMM Do YY');
    // console.log(key, obj[key].moments);
  });
  // console.log(notices);

  res.render('notice/notice_home.hbs', { notices });
});

// =============================== GET /ADD ==============================
router.get('/add', (req, res) => {
  res.render('notice/notice_add.hbs');
});

// =============================== POST /ADD ==============================
router.post('/add', async (req, res) => {
  const { title } = req.body;
  const { text } = req.body;

  const option = {
    userid: req.user.id,
    option1: 'help',
    option2: 'option2',
  };

  try {
    await Notice.create({
      title,
      text,
      userId: req.user.id,
      option,
    });
  } catch (err) {
    alert(err);

    console.log(err);
    res.send(err);
  }

  return res.redirect('/notice');
});

module.exports = router;
