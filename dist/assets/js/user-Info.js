const accessToken = localStorage.getItem('cookie');

$(document).ready(function () {
  userPage();
});

// 오운완 목록 모달
$('#postlist').click(function (e) {
  e.preventDefault();
  $('#postlistModal').modal('show');
});

$('#backtopage').click(function () {
  $('#postlistModal').modal('hide');
});

// 나에게 온 친구요청 확인메시지 (화면 우측상단 메시지함)
const requestlists = $('#requestlists');

$(requestlists).click(async () => {
  try {
    const response = await axios.get('http://localhost:3000/follow/request', {
      headers: { Authorization: accessToken },
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

    // 친구요청 수락
    $('.accept-friend').click(async function () {
      const followerId = $(this).data('follower-id');
      console.log('followerId', followerId);
      try {
        const yes = response.data;
        const data = { response: 'yes' };
        const response = await axios.post(
          `http://localhost:3000/follow/${Number(followerId)}/accept`,
          data,
          {
            headers: { Authorization: accessToken },
          },
        );
        alert(`${response.data.name}님의 친구 요청을 수락했습니다.`);
        console.log('친구 수락:', response.data);
      } catch (error) {
        console.error(error.response.data.message);
      }
    });

    // 친구요청 거절
    $('.deny-friend').click(async function () {
      const followerId = $(this).data('follower-id');
      console.log('followerId', followerId);
      try {
        const data = { response: 'no' };
        const response = await axios.post(
          `http://localhost:3000/follow/${Number(followerId)}/accept`,
          data,
          {
            headers: { Authorization: accessToken },
          },
        );
        alert(`${response.data.name}님의 친구 요청을 거절했습니다.`);
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

// 자동실행함수, 사용자 정보조회
async function userPage() {
  // href="userinfo.html" // 연오님이 오운완에서 userId보내면 연결시키면 됨
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
    const { data } = await axios.get(
      `http://localhost:3000/user/${Number(userId)}`,
      {
        headers: {
          Authorization: accessToken,
        },
      },
    );
    const rankData = await axios.get('http://localhost:3000/user/me/rank', {
      headers: {
        Authorization: accessToken,
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

  // 유저 추천목록 (나와 follow관계가 아닌 유저들 추천목록)
  try {
    const response = await axios.get(
      'http://localhost:3000/user/me/recommendation',
      {
        headers: {
          Authorization: accessToken,
        },
      },
    );
    const recommendations = response.data;
    const usersCarousel = $('#users-carousel');
    recommendations.forEach((user) => {
      const userItem = `
        <div class="user-item">
          <img alt="image" src="${user.imgUrl}" class="img-fluid" />
          <div class="user-details">
            <div class="user-name">${user.name}</div>
            <div class="user-email">${user.email}</div>
            <div class="user-cta">
              <button class="btn ${
                user.followed
                  ? 'btn-danger following-btn'
                  : 'btn-primary follow-btn'
              }"
                      data-user-id="${user.id}"
                      data-action="${user.followed ? 'unfollow' : 'follow'}">
                ${user.followed ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>
        </div>
      `;
      usersCarousel.append(userItem);
    });
    // Follow 또는 Unfollow 버튼 클릭 처리
    // (follow-btn: 친구요청), (following-btn: 현재 친구상태, 누르면 친구취소)
    $('.follow-btn, .following-btn').on('click', async function () {
      const action = $(this).data('action');
      const targetUserId = $(this).data('user-id');

      try {
        //친구요청(follow)
        if (action === 'follow') {
          await axios
            .post(
              `http://localhost:3000/follow/${Number(targetUserId)}/request`,
              null,
              {
                headers: { Authorization: accessToken },
              },
            )
            .then((response) => {
              alert(`${response.data.name}님에게 친구요청을 보냈습니다.`);
            });

          //친구취소(unfollow)
        } else if (action === 'unfollow') {
          await axios
            .delete(`http://localhost:3000/follow/${Number(targetUserId)}`, {
              headers: { Authorization: accessToken },
            })
            .then((response) => {
              alert(`${response.data.name}님과 친구 취소되었습니다.`);
            });
        }

        // 버튼 상태 변경 및 메시지 출력 (버튼이 2개있는게 아니라, 버튼1개로 누를때마다 follow(친구요청), following(친구취소)이 바뀌는 형태)
        const buttonText = action === 'follow' ? 'Following' : 'Follow';
        $(this)
          .removeClass('btn-primary btn-danger')
          .addClass(action === 'follow' ? 'btn-danger' : 'btn-primary');
        $(this).text(buttonText);
        alert(
          `${action === 'follow' ? 'Followed' : 'Unfollowed'} ${
            recommendations.find((user) => user.id === targetUserId).name
          }`,
        );
      } catch (error) {
        console.error('Error:', error.response.data.message);
      }
    });
  } catch (error) {
    alert('Error:', error.response.data.message);
  }
}
