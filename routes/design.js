// =============================== DESIGN ROUTES ==============================
// =============================== DESIGN ROUTES ==============================
// =============================== DESIGN ROUTES ==============================

const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const auth = require('../config/auth');
const User = require('../models/User');
const Design = require('../models/Design');
const fs = require('fs');

// =============================== MULTER ==============================
const storage = multer.diskStorage({
  destination: './public/uploads/imgs/design',
  filename: (req, file, cb) => {
    if (file) {
      cb(null, `${file.originalname}_${Date.now()}${path.extname(file.originalname)}`);
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
}).any();

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

router.get('/view', async (req, res) => {
  const sample = await Design.findAll({
    limit: 1,
    order: [['createdAt', 'DESC']],
  });

  console.dir(sample);

  res.render('design/design_view.hbs', { sample });
});

router.get('/add', (req, res) => {
  res.render('design/design_home.hbs');
});

router.get('/sample', async (req, res) => {
  const sample = {
    category1: 'design',
    category2: 'logo',
    category3: 'category3_A1',
    design_name: '11111111111111',
    price1: '10000',
    quantity: '2222222',
    timeperitem: '333333333',
    fee: '444444444',
    fixfreechance: '55555',
    fixprice: '6666666',
    baseprice: '7777777',
    skills: ['JPG', 'PNG'],
    colorformat: 'RGB',
    width: '888888',
    height: '9999999',
    format: 'px',
    dpi: '10',
    keyword: '키워드키워드키워드키워드키워드키워드키워드키워드키워드',
    maindescription:
      '상품안내상품안내상품안내상품안내상품안내상품안내상품안내상품안내상품안내상품안내상품안내상품안내상품안내상품안내상품안내',
    options: [
      {
        optiontype: 'single',
        isrequired: "on",
        optionname: '옵션명옵션명옵션명옵션명옵션명옵션명옵션명옵션명',
        optiondescription: '안내문안내문안내문안내문안내문안내문',
        suboptions: [
          { suboption1: '1111111', suboption2: 'plus', suboption3: '222222', suboption4: 'krw' },
          { suboption1: '111111', suboption2: 'minus', suboption3: '222222', suboption4: 'krw' },
        ],
        image_option: '로그인버튼@3x.png_1603091559721.png',
      },
      {
        optiontype: 'multiple',
        isrequired: "on",
        optionname: 'ㅁㅁㅁㅁㅁㅁㅁㅁㅁ',
        optiondescription: 'ㅠㅠㅠㅠ',
        suboptions: [
          { suboption1: '11111', suboption2: 'plus', suboption3: '222', suboption4: 'usd' },
        ],
        image_option: '네이버버튼.png_1603089988113.png',
      },
    ],
    image_main: '페이스북 버튼@3x.png_1603091559711.png',
    image_sub: [
      '로그인버튼@3x.png_1603091559717.png',
      '네이버버튼.png_1603091559717.png',
      'on@2x.png_1603091559718.png',
    ],
  };

  let result = await Design.create(sample);

  console.log(result);

  res.send(result);
});

router.post('/add', (req, res) => {
  upload(req, res, async (err) => {
    const { data } = req.body;
    const subImagesArr = [];
    const files = req.files;
    let testresult = '';
    // console.log(data);
    let formData = JSON.parse(req.body.mainformval);
    // console.dir(b);

    // Object.keys(result).filter((key) =>
    //   /optionimage\d+$/.test(key).forEach((key) => console.log(key, test[key]))
    // );
    console.log('===============================================');
    console.log('===============================================');

    if (files) {
      for (let key of files) {
        let { fieldname, filename } = key;
        if (/optionimage\d+$/.test(fieldname)) {
          let index = fieldname.replace('optionimage', '');
          index = parseInt(index);
          formData.options[index].image_option = filename;
        }

        switch (fieldname) {
          case 'mainimage':
            formData.image_main = filename;
            break;

          case 'subimage':
            subImagesArr.push(filename);
            break;
        }
      }
      formData.image_sub = subImagesArr;
    }

    console.log('===============================================');
    console.log('===============================================');

    testresult = formData;

    console.log(testresult);
    fs.writeFileSync(`./${Date.now}_a.txt`, JSON.stringify(formData));
    return res.send(testresult);
  });
});

module.exports = router;
