const express = require('express');
const { searchByHashtag, getMyPosts, renderMain, modifyMyPosts, deleteMyPosts } = require('../controllers');

const router = express.Router();


router.get('/search/:hashtag', searchByHashtag);

// router.get('/', );

router.get('/', getMyPosts, renderMain);

router.post('/delete', deleteMyPosts);

router.get('/myposts', modifyMyPosts);

module.exports = router;
