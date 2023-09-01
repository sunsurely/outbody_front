$(document).ready(function () {
  getPosts();
});

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNjkzNDYzODcxLCJleHAiOjE2OTM0NzEwNzF9.sj0I0utdHzygTezZDi8ROM0d3jbhOPiwEOxgsaVtO_4';

// 오운완 전체 조회
// challengeId 받아오는거 아직 안함.
const getPosts = async () => {
  try {
    const response = await axios.get(
      `http://localhost:3000/challenge/1/post?page=1&pageSize=6`,
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

      let temphtml = `<div class="col-12 col-md-4 col-lg-4">
                        <article class="article article-style-c">
                          <div class="article-header">
                              <div class="article-image" data-background="${post.imgUrl}">
                                </div>
                                  </div>
                                  <div class="article-details">
                                      <div class="article-title">
                                          <h2><a href="#">${post.description}</a></h2>
                                      </div>
                                      <div class="article-user">
                                          <img alt="image" src="assets/img/avatar/avatar-3.png">
                                          <div class="article-user-details">
                                          <div class="user-detail-remove">
                                            <a href="#" class="btn btn-icon btn-primary"><i class="fas fa-times delPost-btn" postId=${post.id}></i></a>
                                          </div>
                                          <div class="user-detail-name">
                                          <a href="#">${post.username}</a>
                                          </div>
                                          <div class="text-job">${post.comment}</div>
                                          </div>
                                          </div>
                              </div>
                          </article>
                      </div>`;
      allPosts += temphtml;
      $('.row').html(allPosts);
    });
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
      'http://localhost:3000/challenge/1/post',
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
    await axios.delete(`http://localhost:3000/challenge/1/post/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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