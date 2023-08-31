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
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImlhdCI6MTY5MzQ4NTM3NCwiZXhwIjoxNjkzNDkyNTc0fQ.GKTkl-SAAcWta52fxNiVc2o0HIVT06n0Bjg-173wiLI';

// 나에게 온 친구요청 확인메시지 (우측상단 메시지함)
const requestlists = $('#requestlists');

$(requestlists).click(() => {
  try {
    const response = axios.get('http://localhost:3000/follow/request', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const messages = response.data;

    const messagesContainer = $('.dropdown-list-message');
    messagesContainer.empty();

    messages.forEach((message) => {
      const messageItem = `
      <a href="#" class="dropdown-item dropdown-item-unread">
          <div class="dropdown-item-avatar">
            <img alt="image" src="assets/img/avatar/avatar-1.png" class="rounded-circle" />
            <div class="is-online"></div>
          </div>
          <div class="dropdown-item-desc">
            <b id="inviteUserName">${message.name}</b>
            <b id="inviteUserEmail">${message.email}</b>
            <p id="inviteUserMessage">${message.message}</p>
            <div id="inviteUsercreatedAt">${message.createdAt}</div>
            <button class="btn btn-sm btn accept-friend" data-follower-id="${message.userId}">수락</button>
            <button class="btn btn-sm btn deny-friend" data-follower-id="${message.userId}">거절</button>
          </div>
        </a>
      `;
      messagesContainer.append(messageItem);
    });

    // 수락 버튼을 클릭했을 경우
    $('#accept-friend').click(function () {
      const followerId = $(this).data('follower-id');
      try {
        const response = axios.post(
          `http://localhost:3000/follow/${followerId}/accept`,
          {
            response: 'yes',
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        alert(`${followId.name}님의 친구 요청을 수락했습니다.`);
        console.log('친구 수락:', response.data);
      } catch (error) {
        console.error(error.response.data.message);
      }
    });

    //거절 버튼을 클릭했을 경우
    $('#deny-friend').click(function () {
      const followerId = $(this).data('follower-id');
      try {
        const response = axios.post(
          `http://localhost:3000/follow/${followerId}/accept`,
          {
            response: 'no',
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        alert(`${followId.name}님의 친구 요청을 거절했습니다.`);
        console.log('친구 거절:', response.data);
      } catch (error) {
        console.error(error.response.data.message);
      }
    });
  } catch (error) {
    console.error(
      'Error loading invitation messages:',
      error.response.data.message,
    );
  }
});

// 비동기함수 //

// 모달로부터 받은 친구정보

// 사용자 정보조회
async function userPage() {
  // href="userinfo.html"
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('id');

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

//

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
