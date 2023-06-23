const { v4: uuidv4 } = require('uuid');
const { User, Domain, Reviews } = require('../models');

exports.reviewCount = async (req, res, next) => {
  Reviews.findAndCountAll({ 
    // where: { userId: res.locals.decoded.id },
    // include: {
    //   model: Reviews,
      // attributes: ['id', 'isbn', 'title', 'comment'],
    // },
  })
    .then((reviews) => {
      console.log(reviews.count);
      const 
      reviewCount = reviews.count
      res.json({
        // code: 200,
        reviewCount
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({
        code: 500,
        message: '서버 에러',
      });
    });
}

exports.reviewList = async (req, res, next) => {
  Reviews.findAll({ 
    // where: { userId: res.locals.decoded.id },
    // include: {
    //   model: Reviews,
      attributes: ['id', 'isbn', 'title', 'comment'],
    // },
  })
    .then((reviews) => {
      console.log(reviews);
      res.json({
        // code: 200,
        reviews,
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({
        code: 500,
        message: '서버 에러',
      });
    });
}

exports.reviewIsbn = async (req, res, next) => {
  Reviews.findAll({ 
    
    where: {isbn: req.params.isbn},
    // include: {
    //   model: Reviews,
      attributes: ['id', 'isbn', 'title', 'comment'],
    // },
  })
    .then((reviews) => {
      console.log(reviews);
      res.json({
        // code: 200,
        reviews,
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({
        code: 500,
        message: '서버 에러',
      });
    });
}

exports.reviewCreate = async (req, res, next) => {
  try {
    const review = await Reviews.create({
      isbn: req.body.isbn,
      title: req.body.title,
      comment: req.body.comment,
    });
    res.status(200).json({
      review
    });
    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
}

