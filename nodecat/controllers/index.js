const axios = require('axios');

const URL = process.env.API_URL;
axios.defaults.headers.origin = process.env.ORIGIN; // origin 헤더 추가

const request = async (req, api) => {
  try {
    if (!req.session.jwt) { // 세션에 토큰이 없으면
      const tokenResult = await axios.post(`${URL}/token`, {
        clientSecret: process.env.CLIENT_SECRET,
      });
      req.session.jwt = tokenResult.data.token; // 세션에 토큰 저장
    }
    return await axios.get(`${URL}${api}`, {
      headers: { authorization: req.session.jwt },
    }); // API 요청
  } catch (error) {
    if (error.response?.status === 419) { // 토큰 만료시 토큰 재발급 받기
      delete req.session.jwt;
      return request(req, api);
    } // 419 외의 다른 에러면
    throw error;
  }
};

// exports.getMyPosts = async (req, res, next) => {
//   try {
//     const result = await request(req, '/posts/my');
//     const posts = result.data.payload;

//     const postList = posts.map((post) => ({
//       nickname: post.User.nick,
//       contentPreview: post.content.substring(0, 50),
//     }));

//     let html = '<div style="font-family: Arial, sans-serif;">';
//     html += '<h2 style="text-align: center;">My Posts</h2>';
//     html += '<ul style="list-style-type: none; padding: 0; margin: 0;">';
    
//     postList.forEach((post) => {
//       html += '<li style="margin-bottom: 20px; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">';
//       html += `<div style="margin: 0;"><strong>${post.nickname}</div><div> </strong>${post.contentPreview}</div>`;
//       html += '</li>';
//     });
    
//     html += '</ul>';
//     html += '</div>';

//     res.send(html);
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// };

// exports.modifyMyPosts = async (req, res, next) => {
//   try {
//     const result = await request(req, '/posts/my');
//     const posts = result.data.payload;

//     const postList = posts.map((post) => ({
//       nickname: post.User.nick,
//       contentPreview: post.content.substring(0, 50),
//     }));

//     let html = '<div style="font-family: Arial, sans-serif;">';
//     html += '<h2 style="text-align: center;">My Posts</h2>';
//     html += '<ul style="list-style-type: none; padding: 0; margin: 0; width:50%">';
    
//     postList.forEach((post) => {
//       html += '<li style="margin-bottom: 20px; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">';
//       html += `<div style="display:flex; justify-content: space-between; margin-bottom: 10px;">`;
//       html += `<div style="font-weight: bold;">${post.nickname}</div>`;
//       html += `<div>`;
//       html += `<button onClick="/delete" style="margin-right: 5px;">삭제하기</button>`;
//       html += `<button '${post.content}')" style="margin-right: 5px;">수정하기</button>`;
//       html += `</div>`;
//       html += `</div>`;
//       html += `<div>${post.contentPreview}</div>`;
//       html += `<textarea id="modifiedContent" style="width: 20%;"></textarea>`;

//       html += '</li>';
//     });
    
//     html += '</ul>';
//     html += '</div>';

//     res.send(html);
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// };

// exports.deleteMyPosts = async (req, res, next) => {
//   try {
//     const result = await request(req, '/posts/delete');
//     const posts = result.data.payload;

//     const postList = posts.map((post) => ({
//       nickname: post.User.nick,
//       contentPreview: post.content.substring(0, 50),
//     }));

//     let html = '<div style="font-family: Arial, sans-serif;">';
//     html += '<h2 style="text-align: center;">My Posts</h2>';
//     html += '<ul style="list-style-type: none; padding: 0; margin: 0; width:50%">';
    
//     postList.forEach((post) => {
//       html += '<li style="margin-bottom: 20px; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">';
//       html += `<div style="display:flex; justify-content: space-between; margin-bottom: 10px;">`;
//       html += `<div style="font-weight: bold;">${post.nickname}</div>`;
//       html += `<div>`;
//       // html += `<button onClick="/delete" style="margin-right: 5px;">삭제하기</button>`;
//       html += `<a href="/delete" style="margin-right: 5px;">Delete</a>`;
//       html += `<button '${post.content}')" style="margin-right: 5px;">수정하기</button>`;
//       html += `</div>`;
//       html += `</div>`;
//       html += `<div>${post.contentPreview}</div>`;
//       html += `<textarea id="modifiedContent" style="width: 20%;"></textarea>`;

//       html += '</li>';
//     });
    
//     html += '</ul>';
//     html += '</div>';

//     res.send(html);
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// };

exports.getMyPosts = async (req, res, next) => {
  try {
    const result = await request(req, '/posts/my');
    res.render('mypost', {
      twits: result.data.payload,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};


exports.deletePost = async(req, res, next) => {
  try {
    const result = await request(req, `/post/${encodeURIComponent(req.params.id)}/deletePost`);
    console.log(result.data);
    res.render('main', {
      twits: result.data.payload,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.updatePost = async(req, res, next) => {
  try {

    const result = await request(req, `/posts/${encodeURIComponent(req.params.id)}/updatePost/${encodeURIComponent(req.query.update)}`);
    console.log(result.data);
    res.render('main', {
      twits: result.data.payload,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// exports.getMyPosts = async (req, res, next) => {
//   try {
//     const result = await request(req, '/posts/my');
//     res.json(result.data);
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// };



exports.searchByHashtag = async (req, res, next) => {
  try {
    const result = await request(
      req, `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`,
    );
    res.json(result.data);
  } catch (error) {
    if (error.code) {
      console.error(error);
      next(error);
    }
  }
};

exports.renderMain = (req, res) => {
  res.render('main', { key: process.env.CLIENT_SECRET });
};
