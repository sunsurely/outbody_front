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

// 2. 비밀번호수정 모달 dddd
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

// 토큰 저장
const storedToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImlhdCI6MTY5MzU2MzYwNSwiZXhwIjoxNjkzNTcwODA1fQ.0ITkltfHHFSeK5vr7LF9iU5oA9giuUBJYwuirVaq0ww';
// localStorage.setItem('jwtToken', jwtToken);

// 저장된 JWT토큰 가져오기 = storedToken
// const storedToken = localStorage.getItem('jwtToken');

//   // 이미지 파일이 선택되었을 때
//   if (photo.files.length > 0) {
//     formData.append('imgUrl', photo.files[0]);
//   }
//   //내정보수정(업로드)
//   axios
//     .patch(`http://localhost:3000/user/me`, formData, {
//       headers: {
//         // 'Content-Type': 'multipart/form-data',
//         Authorization: `Bearer ${storedToken}`,
//       },
//     })
//     .then((response) => {
//       if (response.data.success) {
//         alert('내 정보가 업데이트되었습니다.');
//       }
//     })
//     .catch((error) => {
//       console.log('Error message:', error.response.data.message);
//     });
// });

// 이미지 파일 선택 시에 호출되는 부분
// document.querySelector('#image-upload').addEventListener('change', function () {
//   const imageLabel = document.querySelector('#image-label');
//   if (this.files.length > 0) {
//     imageLabel.textContent = this.files[0].name; // 선택한 파일명을 표시
//   } else {
//     imageLabel.textContent = 'Choose File';
//   }
// });

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
  try {
    const { data } = await axios.get('http://localhost:3000/user/me/profile', {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    });

    const rankData = await axios.get('http://localhost:3000/user/me/rank', {
      headers: {
        Authorization: `Bearer ${storedToken}`,
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

    $(myFriends).html(followTemp);
    const date = new Date(myData.createdAt);
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const myCreatedAt = `${year}.${month}.${day}`;
    $(createdAt).text(myCreatedAt);
  } catch (error) {
    alert(error.response.data.message);
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
        Authorization: `Bearer ${storedToken}`,
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
      console.log('Error message:', error.response.data.message);
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
      headers: { Authorization: `Bearer ${storedToken}` },
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
          Authorization: `Bearer ${storedToken}`,
        },
      },
    );

    const user = response.data.data;

    const temp = `<div id=${user.id}><img src=${user.imgUrl}><span>${user.name}(${user.email})</span></div> <br/>`;
    $(searchUser).html(temp);
    console.log(storedToken);
    const userId = user.id;

    $('#send-invite').on('click', async () => {
      try {
        axios.post(
          `http://localhost:3000/follow/${userId}/request`,
          {},
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          },
        );
        alert(`${user.name}(${user.email})님에게 친구요청을 보냈습니다`);
      } catch (error) {
        console.error('Error message:', error.response.data.message);
      }
    });
  } catch (error) {
    console.error('Error message:', error.response.data.message);
  }
});

// 내 도전목록조회 페이지 이동
document.getElementById('findChallenges').onclick = function () {
  window.location.href = `challenge-list.html`;
};

//친구 & 도전  초대 메세지함  , 초대 수락기능 같이 구현
async function initMessagesBox() {
  // 친구초대 메시지함
  const messageBox = $('.dropdown-list-message');
  $(messageBox).html('');
  try {
    const response = await axios.get('http://localhost:3000/follow/request', {
      headers: { Authorization: `Bearer ${storedToken}` },
    });

    const messages = response.data.data;
    console.log(messages);
    let messagesHtml = '';
    for (msg of messages) {
      const date = new Date(msg.createdAt);
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const id = msg.id;
      const temp = `<div>${msg.message}           
       <button
       class="btn btn-primary"
       style="display: inline-block"
     >
       수락
     </button>       <button
     class="btn btn-primary"
     style="display: inline-block"
   >
     거절
   </button></div>`;

      $(messageBox).append(temp);
    }
    $(messageBox).html(messagesHtml);
  } catch (error) {
    console.error('Error message:', error.response.data.message);
  }
}
