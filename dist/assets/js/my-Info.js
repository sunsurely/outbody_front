const accessToken = localStorage.getItem('cookie');

$(document).ready(function () {
  initMyPage();
  initMessagesBox();
});

// 1. 정보수정 모달
document.getElementById('userInfoEdit').onclick = function (e) {
  e.preventDefault();
  $('#infoEditModal').modal('show');
};
document.getElementById('editcancel').onclick = function () {
  $('#infoEditModal').modal('hide');
};

// 2. 비밀번호수정 모달
document.getElementById('passwordEdit').onclick = function (e) {
  e.preventDefault();
  $('#pwEditModal').modal('show');
};
document.getElementById('passwordcancel').onclick = function () {
  $('#pwEditModal').modal('hide');
};

// 3. 회원탈퇴 모달
document.getElementById('signout').onclick = function (e) {
  e.preventDefault();
  $('#signoutModal').modal('show');
};
document.getElementById('signoutcancel').onclick = function () {
  $('#signoutModal').modal('hide');
};

// 4. 친구찾기 모달
document.getElementById('searchfriend').onclick = function (e) {
  e.preventDefault();
  $('#searchfriendModal').modal('show');
};
document.getElementById('searchfriendCancel').onclick = function () {
  $('#searchfriendModal').modal('hide');
};

// 내 정보 수정 (재용 작성)
$('#update-userInfo-button').click(updateUserInfo);
async function updateUserInfo() {
  const profileImage = $('#profile-image-upload')[0].files[0];
  const birthday = $('#user-birthday').val();
  const description = $('#user-description').val();
  console.log(description);

  const formData = new FormData();
  formData.append('image', profileImage);
  formData.append('birthday', birthday);
  formData.append('description', description);

  await axios
    .patch(`http://localhost:3000/user/me`, formData, {
      headers: {
        Authorization: accessToken,
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      if (response.data.success === true) {
        alert('내 정보 수정이 완료되었습니다.');
        location.reload();
      }
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
}

// 올린 사진 미리보기
const image = document.querySelector('#profile-image-upload');
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

//내 정보 조회
async function initMyPage() {
  const pointTag = $('#my-point');
  const rankTag = $('#my-rank');
  const friendTag = $('#friend-count');
  const nameTag = $('#descriptionName');
  const description = $('#self-description');
  const email = $('#emailaddress');
  const birthday = $('#bdaytag');
  const gender = $('#mygender');
  const createdAt = $('#createdate');
  const myFriends = $('#my-friends-list');
  const profileImg = $('#profile-image');
  try {
    const { data } = await axios.get('http://localhost:3000/user/me/profile', {
      headers: {
        Authorization: accessToken,
      },
    });

    const rankData = await axios.get('http://localhost:3000/user/me/rank', {
      headers: {
        Authorization: accessToken,
      },
    });

    const myData = data.data.rest;
    const followersInfo = data.data.followersInfo;
    $(pointTag).text(myData.point);
    $(friendTag).text(followersInfo.length);
    $(nameTag).text(myData.name);
    $(description).text(myData.description);
    $(rankTag).text(rankData.data.data);
    $(email).text(myData.email);
    $(birthday).text(
      myData.birthday ? myData.birthday : '생일을 입력해 주세요',
    );
    $(gender).text(myData.gender ? myData.gender : '성별을 입력해 주세요');
    let num = 1;
    let followTemp = '';
    for (follower of followersInfo) {
      const temp = `  <tr>
      <th scope="row">${num}</th>
      <td>${follower.name}</td>
      <td>${follower.email}</td>
      <td>${follower.ranking}</td>
    </tr>`;
      followTemp += temp;
      num++;
    }
    $(profileImg).attr(
      'src',
      myData.imgUrl
        ? `https://inflearn-nest-cat.s3.amazonaws.com/${myData.imgUrl}`
        : 'assets/img/avatar/avatar-1.png',
    );
    $(myFriends).html(followTemp);
    const date = new Date(myData.createdAt);
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const myCreatedAt = `${year}.${month}.${day}`;
    $(createdAt).text(myCreatedAt);
  } catch (error) {
    console.error('Error message:', error.response.data.message);
  }
}

// 비밀번호변경 (성공)
async function editPassword() {
  const current = $('#current').val();
  const newpw = $('#newpw').val();
  const confirmpw = $('#confirmpw').val();

  console.log('현재 비밀번호', current);
  console.log('새로운 비밀번호', newpw);
  console.log('컨펌 비밀번호', confirmpw);

  if (current === '') {
    alert('현재 비밀번호를 입력해주세요.');
    return;
  } else if (newpw === '') {
    alert('변경할 비밀번호를 입력해주세요.');
    return;
  } else if (confirmpw === '') {
    alert('변경 비밀번호 확인을 입력해주세요.');
    return;
  } else if (newpw !== confirmpw) {
    alert('변경 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
    return;
  }

  const data = {
    password: current,
    newPassword: newpw,
  };

  await axios
    .patch(`http://localhost:8080/user/me/password`, data, {
      headers: {
        Authorization: accessToken,
      },
    })
    .then((response) => {
      if (response.data) {
        alert(`회원님의 비밀번호가 변경되었습니다.`);
      } else {
        alert('비밀번호 변경에 실패했습니다.');
      }
    })
    .catch((error) => {
      console.error('Error message:', error.response.data.message);
    });
}

//회원탈퇴
const signoutBtn = $('#signout-btn');
$(signoutBtn).click(async () => {
  const password = $('#signoutpassword').val();
  const data = { password };
  try {
    await axios.delete('http://localhost:3000/user/me/signout', {
      data,
      headers: { Authorization: accessToken },
    });

    alert('서비스를 탈퇴하셨습니다');
  } catch (error) {
    console.error('Error message:', error.response.data.message);
  }
});

//친구찾기 , 친구요청 보내기
$('#searchFriendByEmail').on('click', async () => {
  const email = $('#searchEmail').val();
  const searchUser = $('#searched-friend');
  $(searchUser).html('');
  try {
    const response = await axios.get(
      `http://localhost:3000/user/me/searchEmail/?email=${email}`,
      {
        headers: {
          Authorization: accessToken,
        },
      },
    );

    const user = response.data.data;
    const userEmail = user.email;
    const index = userEmail.indexOf('@');
    const preString = userEmail.slice(0, 3);
    const nextString = userEmail.slice(index, index + 3);

    const emailText = `${preString}***${nextString}***`;

    const temp = `<div id=${user.id}><img  class="rounded-circle" src=${
      user.imgUrl ? user.imgUrl : 'assets/img/avatar/avatar-1.png'
    } style="width:50px; margin-right:10px"><span>${
      user.name
    }(${emailText})</span></div> <br/> `;
    $(searchUser).html(temp);

    const userId = user.id;
    $('#send-invite').on('click', async () => {
      const isChecked = $('#invite-checkbox').prop('checked');
      try {
        if (isChecked) {
          await axios.post(
            `http://localhost:3000/follow/${userId}/request`,
            {},
            {
              headers: { Authorization: accessToken },
            },
          );
          alert(`${user.name}(${user.email})님에게 친구요청을 보냈습니다`);
          window.location.reload();
        } else {
          alert('동의 항목에 체크해주세요');
        }
      } catch (error) {
        alert(error.response.data.message);
      }
    });
  } catch (error) {
    alert(error.response.data.message);
  }
});

// 내 도전목록조회 페이지 이동
document.getElementById('findChallenges').onclick = function () {
  window.location.href = `challenge-list.html`;
};

//친구 & 도전  초대 메세지함  , 초대 수락기능 같이 구현
async function initMessagesBox() {
  const messageBox = $('.dropdown-list-message');
  $(messageBox).html('');

  // 1. 친구요청 메시지
  try {
    const response = await axios.get('http://localhost:3000/follow/request', {
      headers: { Authorization: accessToken },
    });
    const messages = response.data.data;

    for (const msg of messages) {
      const now = new Date();
      const msgDate = new Date(msg.createdAt);
      const diffInMilliseconds = now - msgDate;
      const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

      let msgTime;

      if (diffInDays >= 1) {
        msgTime = `${diffInDays}일전`;
      } else {
        msgTime = `${diffInHours}시간전`;
      }
      const id = msg.userId;
      const temp = `
   
       <a href="user-info.html?userId=${msg.userId}">
          <img
            alt="image"
            src="${msg.imgUrl ? msg.imgUrl : 'assets/img/avatar/avatar-1.png'}"
            class="rounded-circle"
            style="width:50px; htight:50px;"
          />
       </a>
        <div class="is-online"></div>
    
      <div class="dropdown-item-desc">      
        <p id="inviteUserMessage" style="margin-bottom:0px;"><span style="font-weight:bold;">${
          msg.name
        }</span>(${msg.email})님이 친구요청을 보냈습니다.</p>
   
        <button id="accept${id}"
          class="btn btn-sm btn accept-friend"
          style="margin-bottom:20px; margin-left:250px"
        >
          수락
        </button>
        <button
        id="cancel${id}"
          class="btn btn-sm btn deny-friend" 
          style="margin-bottom:20px;"
        >
          거절
        </button>
        <span style="font-size:12px; margin-top:0px; margin-left:10px; font-weight:bold"; >${msgTime}</span>
      </div>
    `;

      $(messageBox).append(temp);
    }

    $('.accept-friend').each(function (idx, acc) {
      $(acc).on('click', async function (e) {
        e.preventDefault();
        const tagId = $(this).attr('id');
        const id = tagId.charAt(tagId.length - 1);
        const data = { response: 'yes' };
        await axios.post(`http://localhost:3000/follow/${id}/accept`, data, {
          headers: { Authorization: accessToken },
        });

        alert('친구요청을 수락했습니다.');
        window.location.reload();
      });
    });

    $('.deny-friend').each(function (idx, acc) {
      $(acc).on('click', async function (e) {
        e.preventDefault();
        const tagId = $(this).attr('id');
        const id = tagId.charAt(tagId.length - 1);
        const data = { response: 'no' };
        await axios.post(`http://localhost:3000/follow/${id}/accept`, data, {
          headers: { Authorization: accessToken },
        });

        alert('친구요청을 거절했습니다.');
      });
    });
  } catch (error) {
    console.error('Error message:', error.response.data.message);
  }

  // 2. 도전방 초대메시지

  try {
    const response = await axios.get(
      'http://localhost:3000/challenge/invite/list',
      {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      },
    );
    const mesages = response.data.data;
    console.log('messages', messages);
    console.log('response.data', response.data);
    const userId = response.data.data[0].userId;
    console.log('userId', userId);

    for (const msg of messages) {
      const email = msg.email;
      const index = email.indexOf('@');
      const preString = email.slice(0, index);
      const nextString = email.slice(index, index + 3);
      const emailText = `${preString}${nextString}...`;

      const now = new Date();
      const msgDate = new Date(msg.createdAt);
      const diffInMilliseconds = now - msgDate;
      const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

      let msgTime;

      if (diffInDays >= 1) {
        msgTime = `${diffInDays}일전`;
      } else {
        msgTime = `${diffInHours}시간전`;
      }
      // const challengeId = msg.challengeId;
      const userId = msg.userId;
      console.log('userId', userId);

      const temp = `
       <a href="user-info.html?userId=${userId}">
          <img
            alt="image"
            src="${msg.imgUrl ? msg.imgUrl : 'assets/img/avatar/avatar-2.png'}"
            class="rounded-circle"
            style="width:50px; htight:50px;"
          />
       </a>
        <div class="is-online"></div>
      </div>
      <div class="dropdown-item-desc">
        <p id="challengeMessage" style="margin-bottom:0px;"><span style="font-weight:bold;">${
          msg.name
        }</span>님이 도전방에 초대했습니다. 수락하시겠습니까?.</p>

        <button 
        class="btn btn-sm btn accept-challenge"
        data-user-id="${userId}"
        style="margin-bottom: 20px; margin-left: 250px"
        >
          수락
        </button>
        <button
        class="btn btn-sm btn deny-challenge"
        data-user-id="${userId}"
        style="margin-bottom: 20px;"
        >
          거절
        </button>
        <span style="font-size:12px; margin-top:0px; margin-left:10px; font-weight:bold"; >${msgTime}</span>
      </div>
    `;

      $(messageBox).append(temp);
    }

    const acceptButtons = document.querySelectorAll('.accept-challenge');
    acceptButtons.forEach((acceptButton) => {
      acceptButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const userId = acceptButton.getAttribute('data-user-id');
        const data = { response: 'yes' };
        try {
          await axios.post(
            `http://localhost:3000/challenge/${userId}/accept`,
            data,
            {
              headers: { Authorization: `Bearer ${storedToken}` },
            },
          );

          alert(`도전방 초대를 수락했습니다.`);
        } catch (error) {
          alert(error.response.data.message);
        }
      });
    });

    $('.deny-challenge').each(function (idx, acc) {
      const userId = $(acc).attr('data-user-id');
      $(acc).on('click', async function (e) {
        e.preventDefault();
        const data = { response: 'no' };
        try {
          await axios.post(
            `http://localhost:3000/challenge/${userId}/accept`,
            data,
            {
              headers: { Authorization: `Bearer ${storedToken}` },
            },
          );

          alert(`도전방 초대를 거절했습니다.`);
        } catch (error) {
          alert(error.response.data.message);
        }
      });
    });
  } catch (error) {
    alert(error.response.data.message);
  }
}
