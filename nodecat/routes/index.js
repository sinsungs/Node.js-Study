const express = require('express');
const { deletePost, updatePost, searchByHashtag, getMyPosts, renderMain, modifyMyPosts, deleteMyPosts } = require('../controllers');

const router = express.Router();


router.get('/search/:hashtag', searchByHashtag);

// router.get('/', );
router.get('/myposts', getMyPosts);
// router.get('/', getMyPosts);

// router.post('/delete', deleteMyPosts);

// router.get('/myposts', modifyMyPosts);

router.get('/', renderMain);

router.get('/post/:id/deletePost', deletePost);

router.get('/posts/:id/updatePost', updatePost);

module.exports = router;
