$(document).ready(function () {
  userPage();
});

// 오운완 목록 모달
document.getElementById('postlist').onclick = function (e) {
  e.preventDefault();
  $('#postlistModal').modal('show');
};
document.getElementById('backtopage').onclick = function () {
  $('#postlistModal').modal('hide');
};

// 토큰값 선언
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImlhdCI6MTY5MzQxMDc1NiwiZXhwIjoxNjkzNDE3OTU2fQ.aTidnbLstwJNe_qu9ekr1L7AH4f_FOWtmWt2vCkblZg';

// 사용자 정보조회
async function userPage() {
  const nameTag = $('#nametag');
  const statusTag = $('#statustag');
  const descriptionTag = $('#descriptiontag');
  const pointTag = $('#pointtag');
  const ranksTag = $('#rankstag');
  const friendTag = $('#friendtag');
  const emailTag = $('#emailtag');
  const genderTag = $('#gendertag');
  const bdayTag = $('#birthdaytag');
  const createdAtTag = $('#createdAttag');

  try {
    const { data } = await axios.get(`http://localhost:3000/user/13`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const rankData = await axios.get('http://localhost:3000/user/me/rank', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const myData = data.data.rest;
    const followersInfo = data.data.followersInfo;

    $(nameTag).text(myData.point);
    $(statusTag).text(myData.status);
    $(descriptionTag).text(myData.description);
    $(pointTag).text(myData.point);
    $(ranksTag).text(rankData.data.data);
    $(friendTag).text(followersInfo.length);
    $(emailTag).text(myData.email);
    $(genderTag).text(myData.gender ? myData.gender : '성별을 입력해 주세요');
    $(bdayTag).text(myData.birthday ? myData.birthday : '생일을 입력해 주세요');

    const date = new Date(myData.createdAt);
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const myCreatedAt = `${year}.${month}.${day}`;
    $(createdAtTag).text(myCreatedAt);
  } catch (error) {
    alert(error.response.data.message);
  }
}

// $('#descriptiontag').click(() => {
//   // descriptiontag 클릭했을때
//   $('.author-box-job').text('이름');
// });

// 오운완 목록보기

// 팔로우-언팔로우
const usersCarousel = document.getElementById('users-carousel');
const followButtons = document.querySelectorAll('.follow-btn');
const followingButtons = document.querySelectorAll('.following-btn');

function createCarouselItem(user) {
  return `
    <div>
      <div class="user-item">
        <img
          alt="image"
          src="${user.imgUrl}"
          class="img-fluid"
        />
        <div class="user-details">
          <div class="user-name">${user.name}</div>
          <div class="text-job text-muted">${user.status}</div>
          <div class="user-cta">
            <button
              class="btn btn-primary follow-btn"
              data-user-id="${user.id}"
              data-follow-action="alert('${user.name} followed');"
              data-unfollow-action="alert('${user.name} unfollowed');"
            >
              Follow
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

axios
  .get('http://localhost:3000/users', {
    headers: { Authorization: `Bearer ${token}` },
  })
  .then((response) => {
    const users = response.data; // 서버에서 받아온 사용자 정보 배열

    // 사용자 정보를 기반으로 템플릿을 생성하고 페이지에 추가
    users.forEach((user) => {
      const carouselItem = createCarouselItem(user);
      usersCarousel.insertAdjacentHTML('beforeend', carouselItem);
    });
  });
// 팔로우(친구요청)
followButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    const userId = event.target.getAttribute('data-user-id');
    alert(`Follow button clicked for user ${user.name}`);

    axios
      .post(`http://localhost:3000/follow/${userId}/request`, null, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        alert(`${response.data.name}님에게 친구요청을 보냈습니다.`);
      })
      .catch((error) => {
        console.error('Error message:', error.response.data.message);
      });
  });
});
// 언팔로우(친구취소)
followingButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    const userId = event.target.getAttribute('data-user-id');
    alert(`Following button clicked for user ${user.name}`);

    axios
      .delete(`http://localhost:3000/follow/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert(`${response.data.name}님과 친구 취소되었습니다.`);
      })
      .catch((error) => {
        console.error('Error message:', error.response.data.message);
      });
  });
});

// 오운완 목록조회
const postsTable = document.querySelector('posts-table');
const totalPostsElement = document.querySelector('.total-posts');

axios
  .get('http://localhost:3000/post/user', {
    headers: { Authorization: `Bearer ${token}` },
  })
  .then((response) => {
    const { totalPosts, usersPosts } = response.data;

    totalPostsElement.textContent = `Total Posts: ${totalPosts}`;

    usersPosts.forEach((post) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <th scope="row">${post.postId}</th>
        <td>${post.description}</td>
      `;
      postsTable.querySelector('tbody').appendChild(row);
    });
  })
  .catch((error) => {
    console.error('Error message:', error.response.data.message);
  });
