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

// href="userinfo.html"
// param에 userId

// const urlParams = new URLSearchParams(window.location.search);
// const challengeId = urlParams.get('id');"
// http://localhost:3000/challenge/${challengeId}

// 비동기함수 //

// 친구 검색모달
$(document).ready(function () {
  const searchFriendButton = $('#searchFriendByEmail');
  const searchEmailInput = $('#searchEmail');
  const searchfriendCancel = $('#searchfriendCancel');

  // 검색 버튼 클릭 시
  searchFriendButton.click(function () {
    const email = searchEmailInput.val();

    // 서버로 이메일 전송하여 사용자 정보 조회
    axios
      .get(`http://localhost:3000/user/me/searchEmail?email=${email}`)
      .then((response) => {
        const userId = response.data.id;

        // 유저 정보 조회
        axios
          .get(`http://localhost:3000/user/${userId}`)
          .then((userInfo) => {
            // 유저 정보를 이용하여 모달 내용 업데이트
            // 예시: $('#username').text(userInfo.data.name);
            // ...
          })
          .catch((error) => {
            alert('유저 정보 조회 중 에러가 발생했습니다.');
            console.error(error);
          });
      })
      .catch((error) => {
        alert('존재하지 않는 유저입니다.');
        console.error(error);
      });
  });

  // 취소 버튼 클릭 시
  searchfriendCancel.click(function () {
    // 모달 닫기
    $('#searchfriendModal').modal('hide');
  });
});

// 토큰값 선언
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImlhdCI6MTY5MzQ0OTEzNCwiZXhwIjoxNjkzNDU2MzM0fQ.45__UIi0zWP6mKTdm2RjWSm0FSO1XHzbsQOlU7rsX8Y';

// 모달로부터 받은 친구정보

document.addEventListener('DOMContentLoaded', function () {
  // const searchButton = document.getElementById('searchFriendByEmail'); // 유저검색
  const searchEmailInput = document.getElementById('searchEmail'); // 검색에넣은 Email값
  const requestEmailInput = document.getElementById('requestEmail'); //친구요청보낸 Email값
  const requestFriendButton = document.getElementById('requestFriendByEmail'); // 친구요청

  // 이메일로 유저 검색
  searchButton.addEventListener('click', function () {
    const searchEmail = searchEmailInput.value;
    const data = { email: searchEmail };

    axios
      .get('http://localhost:3000/user/me/searchEmail', data, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
      .then((response) => {
        const userId = response.data.userId;
        if (userId) {
          alert(`Email: ${searchEmail} 유저가 존재합니다.`);
        } else {
          alert(`Email: ${searchEmail} 유저가 존재하지 않습니다.`);
        }
        requestFriendButton.setAttribute('searched-userId', userId);
      })
      .catch((error) => {
        console.error('Error message:', error.response.data.message);
      });
  });

  // 친구 요청
  requestFriendButton.addEventListener('click', function () {
    const userId = this.getAttribute('searched-userId'); // 검색해서 나온 유저아이디
    const requestEmail = requestEmailInput.value;

    axios
      .post(`http://localhost:3000/follow/${userId}/request`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
      .then((response) => {
        if (response.data.success) {
          alert(`E-mail: ${requestEmail} 유저에게 친구 요청을 보냈습니다`);
        } else {
          alert(`친구 요청에 실패했습니다.`);
        }
      })
      .catch((error) => {
        console.error('Error message:', error.response.data.message);
      });
  });
});

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
    const { data } = await axios.get(`http://localhost:3000/user/${userId}`, {
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
