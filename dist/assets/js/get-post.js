const urlParams = new URLSearchParams(window.location.search);
const challengeId = urlParams.get('id');

$(document).ready(function () {
  getPosts();
});

let token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNjkzNjQ0MzY2LCJleHAiOjE2OTM2NDc5NjZ9.J6v08T1_fxnVWRQ62qGl_FJrBPxV3jIVr9ChfMCC2LU';

// 오운완 전체 조회
// challengeId 받아오는거 아직 안함.
const getPosts = async () => {
  try {
    const response = await axios.get(
      `http://localhost:3000/challenge/${challengeId}/post?page=1&pageSize=6`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    let allPosts = '';
    response.data.data.forEach((post) => {
      if (post.comment === null) {
        post.comment = '';
      }
      if (post.imgUrl === '') {
        post.imgUrl =
          'https://play-lh.googleusercontent.com/1-7v30iLJqe5WHewpiMJ2pe8wU1GJrxG8KRdJ92I71xaYwx2F50gxbNwulS2k-9-Iw=w240-h480-rw';
      }
      if (post.userImg === null) {
        post.userImg =
          'data:image/png;base64,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';
      }

      let temphtml = `<div class="col-12 col-md-4 col-lg-4">
                        <article class="article article-style-c">
                          <div class="article-header">
                            <div class="article-image" style="background-image: url(${post.imgUrl});">
                            </div>
                          </div>
                            <div class="article-details">
                              <div class="article-title">
                                <h2><a href="http://localhost:3000/challenge/3/post/${post.id}">${post.description}</a></h2>
                              </div>
                              <div class="article-user">
                                <img alt="image" userId=${post.userId} src="${post.userImg}">
                                <div class="article-user-details">
                                  <div class="user-detail-remove">
                                    <a href="#" class="btn btn-icon btn-primary"><i class="fas fa-times delPost-btn" postId=${post.id}></i></a>
                                  </div>
                                  <div class="user-detail-name">
                                    <a href="http://localhost:3000/user/${post.userId}">${post.username}</a>
                                  </div>
                                    <div class="text-job">${post.comment}</div>
                                  </div>
                              </div>
                            </div>
                        </article>
                      </div>`;
      allPosts += temphtml;
    });
    $('.row').html(allPosts);
  } catch (error) {
    console.error('Error message:', error.response.data.message);
  }
};

// 오운완 생성
// challengeId 받아오기 필요
const createPost = async () => {
  try {
    if (!$('.desc_input').val()) {
      alert('내용을 입력해주세요');
      return;
    }

    const response = await axios.post(
      `http://localhost:3000/challenge/${challengeId}/post`,
      { description: $('.desc_input').val(), imgUrl: $('.url_input').val() },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    alert('오운완 생성이 완료되었습니다.');
    location.reload();
  } catch (error) {
    console.error('Error message:', error.response.data.message);
    alert(error.response.data.message);
    location.reload();
  }
};
$('#createBtn').click(createPost);

// 오운완 삭제
// challengeId 받아오기 필요
const deletePost = async (postId) => {
  try {
    await axios.delete(
      `http://localhost:3000/challenge/${challengeId}/post/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    alert('오운완 삭제가 완료 되었습니다.');
    location.reload();
  } catch (error) {
    console.error('Error message:', error.response.data.message);
    alert(error.response.data.message);
    location.reload();
  }
};
$(document).on('click', '.delPost-btn', function () {
  deletePost($(this).attr('postid'));
});
