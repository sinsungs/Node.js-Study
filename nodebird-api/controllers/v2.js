const jwt = require('jsonwebtoken');
const { Domain, User, Post, Hashtag } = require('../models');

exports.createToken = async (req, res) => {
  const { clientSecret } = req.body;
  try {
    const domain = await Domain.findOne({
      where: { clientSecret },
      include: {
        model: User,
        attribute: ['nick', 'id'],
      },
    });
    if (!domain) {
      return res.status(401).json({
        code: 401,
        message: '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요',
      });
    }
    const token = jwt.sign({
      id: domain.User.id,
      nick: domain.User.nick,
    }, process.env.JWT_SECRET, {
      expiresIn: '30m', // 30분
      issuer: 'nodebird',
    });
    return res.json({
      code: 200,
      message: '토큰이 발급되었습니다',
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }
};

exports.tokenTest = (req, res) => {
  res.json(res.locals.decoded);
};

exports.getMyPosts = (req, res) => {
  Post.findAll({ 
    // where: { userId: res.locals.decoded.id },
    include: {
      model: User,
      attributes: ['id', 'nick'],
    },
  })
    .then((posts) => {
      console.log(posts);
      res.json({
        code: 200,
        payload: posts,
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({
        code: 500,
        message: '서버 에러',
      });
    });
};

exports.deletePost = async (req, res,next) => {  //글 삭제하기
  try{
    const post = await Post.findOne({where: {id:req.params.id}});
    if(post) {
      await post.destroy();
      const posts = await Post.findAll();
      return res.json({
        code: 200,
        payload: posts,
      });
    }else { 
      return res.json({
        code: 404,
      message: '해당하는 게시물이 없습니다.',
      });
    }
  } catch(error) {
    console.error(error);
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const result = await Post.update(
        {content: req.params.update},
        {where: {id: req.params.id}}
      );
      const posts = await Post.findAll();
      return res.json({
        code: 200,
        payload: posts,
      });
    } catch (error) {
    console.error(error);
    next(error);
  }
};

// exports.deletePost = async(req, res, next) => {
//   const postId = req.params.id;

//   try {
//     await Post.destroy({
//       where: { id: postId },
//     });

//     res.send('Post deleted successfully');
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// };

// User.destory({
//   where: { id: 4 }
// });
// User.update({
//   comment: '수정할 내용'
// }, {
//   where: { id: 3 }
// });



exports.getPostsByHashtag = async (req, res) => {
  try {
    const hashtag = await Hashtag.findOne({ where: { title: req.params.title } });
    if (!hashtag) {
      return res.status(404).json({
        code: 404,
        message: '검색 결과가 없습니다',
      });
    }
    const posts = await hashtag.getPosts();
    return res.json({
      code: 200,
      payload: posts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }
};
