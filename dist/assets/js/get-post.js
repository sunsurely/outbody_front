const urlParams = new URLSearchParams(window.location.search);
const challengeId = urlParams.get('id');

const accessToken = localStorage.getItem('cookie');

$(document).ready(function () {
  getPosts();
});

// 오운완 전체 조회
const getPosts = async () => {
  try {
    const response = await axios.get(
      `http://localhost:3000/challenge/${challengeId}/post?page=1&pageSize=6`,
      {
        headers: {
          Authorization: accessToken,
        },
      },
    );

    let allPosts = '';
    response.data.data.forEach((post) => {
      const profileImage = post.userImageUrl
        ? `https://inflearn-nest-cat.s3.amazonaws.com/${post.userImageUrl}`
        : `assets/img/avatar/avatar-1.png`;

      let temphtml = `<div class="col-12 col-md-4 col-lg-2">
          <article class="article article-style-c">
            <div class="article-header">
              <div class="article-image"
              style="background-image: url(https://inflearn-nest-cat.s3.amazonaws.com/${post.imgUrl});
              background-position: center; background-size: cover;">
              </div>
            </div>
            <div class="article-details">
              <div class="article-title">
                <h2 class="ellipsis">
                  <a href="post-comment.html?cid=${challengeId}&pid=${post.id}">${post.description}</a>
                </h2>
              </div>
              <div class="article-user">
                <img alt="image" src="${profileImage}">
                <div class="article-user-details">
                  <div class="user-detail-remove">
                    <a href="#" class="btn btn-icon btn-primary"><i class="fas fa-times delPost-btn" postId=${post.id}></i></a>
                  </div>
                  <div class="user-detail-name">
                    <a href="http://localhost:3000/user/${post.userId}">${post.userName}</a>
                    <div class="font-1000-bold"><i class="fas fa-circle"></i> ${post.userPoint}점</div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>`;
      allPosts += temphtml;
    });
    $('.row').html(allPosts);
  } catch (error) {
    alert(error.response.data.message);
  }
};

// 오운완 생성 (재용 수정)
const createPost = async () => {
  try {
    const description = $('.desc_input').val();
    if (!description) {
      alert('내용을 입력해주세요');
      return;
    }

    const postImage = $('#post-image-upload')[0].files[0];
    if (!postImage) {
      alert('사진을 선택해주세요');
      return;
    }

    const formData = new FormData();
    formData.append('image', postImage);
    formData.append('description', description);

    await axios
      .post(`http://localhost:3000/challenge/${challengeId}/post`, formData, {
        headers: {
          Authorization: accessToken,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        alert('오운완 생성이 완료되었습니다.');
        location.reload();
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  } catch (error) {
    alert(error.response.data.message);
  }
};
$('#create-button').click(createPost);

// 올린 사진 미리보기
const image = document.querySelector('#post-image-upload');
image.addEventListener('change', (event) => {
  const reader = new FileReader();
  reader.readAsDataURL(event.target.files[0]);

  reader.onload = function (event) {
    const profileImage = document.createElement('img');
    profileImage.setAttribute('src', event.target.result);
    profileImage.style.maxWidth = '50%';
    profileImage.style.display = 'block';
    profileImage.style.margin = '0 auto';
    document.querySelector('#image-container').appendChild(profileImage);
  };
});

// 오운완 삭제
const deletePost = async (postId) => {
  try {
    await axios.delete(
      `http://localhost:3000/challenge/${challengeId}/post/${postId}`,
      {
        headers: {
          Authorization: accessToken,
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
