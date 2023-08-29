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

// 5. 내 도전목록조회 페이지 이동
document.getElementById('findChallenges').onclick = function () {
  window.location.href = '04.ChallengeList.html';
};

// Profile 정보수정
async function infoPost() {
  const photo = document.querySelector('#image-upload');
  const Bday = $('#bday').val();
  const description = $('description').val();
  if (Bday === '') {
    alert('생년월일을 입력해주세요.');
    return;
  } else if (description === '') {
    alert('자기소개 내용을 입력해주세요.');
    return;
  }

  const formData = new FormData();
  formData.append('imgUrl', photo.files[0]);
  formData.append('birthday', Date(Bday));
  formData.append('description', description);

  axios
    .patch(`http://localhost:3000/user/me`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      const { rest, newRefreshToken } = response.data;
      alert('내 정보가 업데이트되었습니다.');
    })
    .catch((error) => {
      console.log(error);
      alert('서버 오류가 발생했습니다.');
    });
}

// 비밀번호변경
async function editPassword() {
  const current = $('#current').val();
  const newpw = $('#newpw').val();
  const confirmpw = $('#confirmpw').val();

  console.log('현재 비밀번호', current);
  console.log(newpw);
  console.log(confirmpw);

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
    .patch(`http://localhost:3000/user/me/password`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (response.data) {
        alert(`회원님의 비밀번호가 ${newpw}로 성공적으로 변경되었습니다.`);
      } else {
        alert('비밀번호 변경에 실패했습니다.');
      }
    })
    .catch((error) => {
      console.log(error);
      alert('비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.');
    });
}

// 회원탈퇴
async function signout() {
  const password = $('#signoutpassword').val();

  if (password === '') {
    alert('비밀번호를 입력해주세요.');
    return;
  }
  const data = { password: password };
  console.log('data', data);
  await axios
    .delete(`http://localhost:3000/user/me/signout`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (response.data.success) {
        alert('회원 탈퇴가 완료되었습니다.');
      } else {
        alert('비밀번호가 올바르지 않습니다.');
      }
    })
    .catch((error) => {
      console.log(error);
      alert('서버 오류가 발생했습니다.');
    });
}

let userId;
// 이메일로 친구찾기
// 버튼에 onclick대신, 클래스나 아이디로 불러서 해보기.
async function searchFriend() {
  const searchEmail = $('#searchEmail').val();
  if (searchEmail === '') {
    alert('이메일을 입력해주세요.');
    return;
  }
  const data = { email: searchEmail };

  await axios
    .get(`http://localhost:3000/user`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      const userData = response.data;
      const userId = response.data.userId;
      console.log('userId', userId);

      if (userData) {
        alert(`Email: ${searchEmail} 유저가 존재합니다.`);
      } else {
        alert('해당 이메일로 등록된 유저를 찾을 수 없습니다.');
      }
    })
    .catch((error) => {
      console.log(error);
      alert('서버 오류가 발생했습니다.');
    });
}

// 친구요청 보내기
async function requestFriend() {
  const requestEmail = $('#requestEmail').val();
  if (requestEmail === '') {
    alert('이메일을 입력해주세요.');
    return;
  }
  const data = {
    requestEmail,
  };
  const userId = requestEmail.userId;

  await axios
    .get(`http://localhost:3000/follow/${userId}/request`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (response.data) {
        alert(`E-mail: ${requestEmail} 유저에게 친구 요청을 보냈습니다.`);
      } else {
        alert('친구 요청을 보내는데 실패했습니다.');
      }
    })
    .catch((error) => {
      console.log(error);
      alert('서버 오류가 발생했습니다.');
    });
}
