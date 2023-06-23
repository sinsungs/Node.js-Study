const express = require('express');

const { verifyToken, apiLimiter, corsWhenDomainMatches } = require('../middlewares');
const { createToken, tokenTest, getMyPosts, getPostsByHashtag , deletePost, updatePost} = require('../controllers/v2');

const router = express.Router();

router.use(corsWhenDomainMatches);

// POST /v2/token
router.post('/token', apiLimiter, createToken);

// POST /v2/test
router.get('/test', apiLimiter, verifyToken, tokenTest);

// GET /v2/posts/my
router.get('/posts/my', apiLimiter, verifyToken, getMyPosts);

// GET /v2/posts/my
// router.get('/posts/delete', deletePost);
// router.get('/posts/update', updatePost);

// GET /v2/posts/hashtag/:title
router.get('/posts/hashtag/:title', apiLimiter, verifyToken, getPostsByHashtag);

router.get('/post/:id/deletePost', apiLimiter, verifyToken, deletePost);

router.get('/posts/:id/updatePost/:update', apiLimiter, verifyToken, updatePost);

module.exports = router;
