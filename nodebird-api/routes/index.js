const express = require('express');
const { renderLogin, createDomain, reviewCount, reviewList, reviewIsbn, reviewCreate} = require('../controllers');
const { isLoggedIn } = require('../middlewares');

const router = express.Router();

router.get('/1801005', reviewCount);

router.get('/reviews1801005', reviewList)

router.get('/reviews1801005/:isbn', reviewIsbn)

router.post('/reviews1801005', reviewCreate)

module.exports = router;
