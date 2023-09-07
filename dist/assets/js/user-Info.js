const userInfoParams = new URLSearchParams(window.location.search);
const accessTokenForUser = localStorage.getItem('cookie');

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

// 자동실행함수, 사용자 정보조회
async function userPage() {
  const userId = userInfoParams.get('id');
  console.log('userId', userId);

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
        Authorization: accessTokenForUser,
      },
    });
    const rankData = await axios.get('http://localhost:3000/user/me/rank', {
      headers: {
        Authorization: accessTokenForUser,
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
    console.error(error.response.data.message);
  }

  // 유저 추천목록 (나와 follow관계가 아닌 유저들 추천목록)
  try {
    const response = await axios.get(
      'http://localhost:3000/user/me/recommendation',
      {
        headers: {
          Authorization: accessTokenForUser,
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
                headers: { Authorization: accessTokenForUser },
              },
            )
            .then((response) => {
              alert(`${response.data.name}님에게 친구요청을 보냈습니다.`);
            });

          //친구취소(unfollow)
        } else if (action === 'unfollow') {
          await axios
            .delete(`http://localhost:3000/follow/${Number(targetUserId)}`, {
              headers: { Authorization: accessTokenForUser },
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
    console.error('Error:', error.response.data.message);
  }
}
