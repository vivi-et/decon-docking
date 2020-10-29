/* eslint-disable no-plusplus */
/* eslint-disable max-len */
// =============================== /ARTICLE ROUTES ==============================
// =============================== /ARTICLE ROUTES ==============================
// =============================== /ARTICLE ROUTES ==============================

const express = require('express');
const multer = require('multer');
const path = require('path');
const moment = require('moment');
const { Op } = require('sequelize');
const Article = require('../models/Article');
const User = require('../models/User');
const auth = require('../config/auth');
const { query } = require('../config/db');
// const Relations = require('../models/Relations');

const router = express.Router();

// =============================== MULTER ==============================
const storage = multer.diskStorage({
  destination: './public/uploads/imgs/article',
  filename: (req, file, cb) => {
    if (file) {
      cb(
        null,
        `${file.originalname}_${Date.now()}${path.extname(file.originalname)}`,
      );
      // console.log(`fieldName : ${file.fieldname}`);
      // console.log(`originalName : ${file.originalname}`);
    }
  },
});

// Init upload
const upload = multer({
  storage,
  limits: { fileSize: 10000 },
  fileFilter: (req, file, cb) => {
    if (file) {
      checkFileType(file, cb);
    }
  },
}).array('image');

// FileTypeChecker
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // Check the extensions
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // check Mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  return cb('Error: Images Only');
}
// =============================== ROUTES ==============================

// =============================== PAGINATION ==============================
const navBarIndexLimit = 4;
// currentToLastPageOffset: Amount to add to current page to get last page
// (eg: current page 4 results in last page 6, first page 3)
const currentToLastPageOffset = navBarIndexLimit - 2;
const makeNavbarIndexArr = (currentPage, totalPages) => {
  const lastPage = Math.min(
    totalPages,
    currentPage <= 1
      ? navBarIndexLimit - 1 // If on 0th or 1st page, set last page to 3
      : currentPage + currentToLastPageOffset,
  );
  const firstPage = Math.max(lastPage - (navBarIndexLimit - 1), 0);
  // I prefer to create numeric arrays all at once with Array.from:
  return Array.from(
    { length: lastPage - firstPage + 1 },
    (_, i) => firstPage + i,
  );
  // But you could also use a for loop and push if you find it easier to read
};

// console.log(makeNavbarIndexArr(1, 6));
// console.log(makeNavbarIndexArr(2, 6));
// console.log(makeNavbarIndexArr(4, 6));
// console.log(makeNavbarIndexArr(9, 6));
// =============================== GET / ==============================
router.get('/', (req, res) => {
  res.redirect('/article/list/?currentPage=1');
});

// =============================== GET / WITH PAGINATION ==============================
router.get('/list', (req, res) => {
  const { currentPage, itemsPerPage = 5 } = req.query;
  console.log(req.query);


  const offset = currentPage ? (currentPage - 1) * itemsPerPage : 0; // skip previous items
  Article.findAndCountAll({
    include: User,
    raw: true,
    nest: true,
    limit: itemsPerPage,
    offset,
  })
    .then((articles) => {
      const totalPages = Math.ceil(articles.count / itemsPerPage);
      articles.index = makeNavbarIndexArr(currentPage, totalPages);
      if (articles.index.includes(0)) {
        articles.index = articles.index.map((i) => i + 1);
      }

      console.log(articles.index);

      res.render('article/article_home.hbs', { articles });
    })
    .catch((error) => {
      // Handle errors, send error response
    });
});
// =============================== GET /ADD ==============================
router.get('/add', (req, res) => {
  res.render('article/article_add.hbs');
});

// =============================== GET /VIEW/:ID ==============================
router.get('/view/:id', async (req, res) => {
  const number = req.params.id;
  const article = await Article.findOne({ where: { id: number } });
  article.owner = false;

  if (req.user) {
    if (req.user.id === article.userId) {
      article.owner = true;
    }
  }

  res.render('article/article_view.hbs', { article });
});
// =============================== GET /EDIT/:ID ==============================
router.get('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const article = await Article.findOne({ where: { id } });
  article.owner = false;

  // console.log('userid: ', req.user.id);
  // console.log('articleID : ', article.userId);

  if (req.user) {
    if (userId === article.userId) {
      return res.render('article/article_edit.hbs', { article });
    }
  }
  return res.send('not authorized');
});

// =============================== PUT /EDIT/:ID ==============================

router.put('/edit/:id', (req, res) => {
  upload(req, res, async (err) => {
    const { id, title, text } = req.body;
    const oldArticle = await Article.findOne({ where: { id } });

    const oldImage = oldArticle.image;

    const tempArticle = {
      title,
      text,
      image: oldImage,
      userId: req.user.id,
    };

    if (err) {
      console.log(err);
      res.render('article/article_add.hbs', { err });
    } else if (req.files.length < 1) {
      tempArticle.image = oldImage;
      await Article.create(tempArticle);
    } else {
      tempArticle.image = req.files;
      // console.log(tempArticle.image);
      await Article.create(tempArticle);
    }

    res.redirect('/article');
  });
});

// =============================== DELETE /VIEW/:ID ==============================

router.delete('/:id', auth.checkAuthenticated, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const article = await Article.findOne({ where: { id, userId } });
  if (req.user.id === article.userId) {
    await Article.destroy({ where: { id, userId } });
    return res.redirect('/article');
  }
  return res.send('not authenticated');
});

// =============================== POST /ADD ==============================
router.post('/add', (req, res) => {
  // const errors = [];

  upload(req, res, async (err) => {
    const { title, text } = req.body;

    console.log(req.body);
    

    const tempArticle = {
      title,
      text,
      image: '',
      userId: req.user.id,
    };

    if (err) {
      console.log(err);
      res.render('article/article_add.hbs', { err });
    } else if (!req.files) {
      tempArticle.image = 'noimage.jpg';
      await Article.create(tempArticle);
    } else {
      tempArticle.image = req.files;
      await Article.create(tempArticle);
    }

    res.redirect('/article');
  });
});

module.exports = router;
