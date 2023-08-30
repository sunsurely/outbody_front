$(document).ready(function () {
  initMyPage();
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

// // 5. 내 도전목록조회 페이지 이동
// document.getElementById('findChallenges').onclick = function () {
//   window.location.href = 'challenge-list.html';
// };

// 토큰 저장
const storedToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjkzMzk4MzMzLCJleHAiOjE2OTM0MzQzMzN9.7_VVpqGRN2iBGx-rTfbwpr9T1nBKWfAeSLgGOD_pY-g';
// localStorage.setItem('jwtToken', jwtToken);

// 저장된 JWT토큰 가져오기 = storedToken
// const storedToken = localStorage.getItem('jwtToken');

// Profile 정보수정
// document.getElementById('submitmyInfo').addEventListener('click', function () {
//   const photo = document.querySelector('#image-upload');
//   const Bday = document.getElementById('bday').value;
//   const description = document.getElementById('description').value;

//   if (Bday === '') {
//     alert('생년월일을 입력해주세요.');
//     return;
//   } else if (description === '') {
//     alert('자기소개 내용을 입력해주세요.');
//     return;
//   }

//   const formData = new FormData();
//   formData.append('birthday', Bday); //new Date(Bday).toISOString()
//   formData.append('description', description);

//   // 이미지 파일이 선택되었을 때
//   if (photo.files.length > 0) {
//     formData.append('imgUrl', photo.files[0]);
//   }
//   //내정보수정(업로드)
//   axios
//     .patch(`http://localhost:8080/user/me`, formData, {
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

// // 내정보 조회2 (description, birthday, image(x), username, email, Gender, CreatedAt, point, friendList)
// axios
//   .get('http://localhost:8080/me/profile', {
//     headers: {
//       Authorization: `Bearer ${storedToken}`,
//     },
//   })
//   .then((response) => {
//     const userInfo = response.data;

//     // 내정보
//     const selfDescriptionElement = document.getElementById('self-description'); //자기소개
//     const bdayTagElement = document.getElementById('bdaytag'); //생일
//     const greetingElement = document.getElementById('greeting'); // 이름1 (제목 이름)
//     const descriptionNameElement = document.getElementById('descriptionName'); // 이름2 (자기소개 위 이름)
//     const informationNameElement = document.getElementById('informationName'); // 이름3 (카드 위 이름)
//     const statusElement = document.getElementById('status'); // 내 상태
//     const emailaddressElement = document.getElementById('emailaddress'); // 내 이메일
//     const mygenderElement = document.getElementById('mygender'); // 내 성별
//     const createdateElement = document.getElementById('createdate'); // 생성일
//     const pointElement = document.getElementById('myPoint'); // 내 포인트

//     selfDescriptionElement.innerText = userInfo.description;
//     const bday = new Date(userInfo.birthday).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//     bdayTagElement.innerText = bday;
//     greetingElement.innerText = `${userInfo.name}님, 안녕하세요!`;
//     descriptionNameElement.innerText = userInfo.name;
//     informationNameElement.innerText = `${userInfo.name}'s Information`;
//     statusElement.innerText = userInfo.status;
//     emailaddressElement.innerText = userInfo.email;
//     mygenderElement.innerText = userInfo.gender;
//     const create = new Date(userInfo.createdAt).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//     createdateElement.textContent = create;

//     // 친구정보
//   })
//   .catch((error) => {
//     console.log('Error message:', error.response.data.message);
//   });

// // 이미지 파일 선택 시에 호출되는 부분
// document.querySelector('#image-upload').addEventListener('change', function () {
//   const imageLabel = document.querySelector('#image-label');
//   if (this.files.length > 0) {
//     imageLabel.textContent = this.files[0].name; // 선택한 파일명을 표시
//   } else {
//     imageLabel.textContent = 'Choose File';
//   }
// });

//   const data = {
//     password: current,
//     newPassword: newpw,
//   };

//   await axios
//     .patch(`http://localhost:8080/user/me/password`, data, {
//       headers: {
//         Authorization: `Bearer ${storedToken}`,
//       },
//     })
//     .then((response) => {
//       if (response.data) {
//         alert(`회원님의 비밀번호가 ${newpw}로 성공적으로 변경되었습니다.`);
//       } else {
//         alert('비밀번호 변경에 실패했습니다.');
//       }
//     })
//     .catch((error) => {
//       console.log('Error message:', error.response.data.message);
//     });
// }

// // 친구 찾기
// document.addEventListener('DOMContentLoaded', function () {
//   const searchButton = document.getElementById('searchFriendByEmail'); // 유저검색
//   const searchEmailInput = document.getElementById('searchEmail'); // 검색에넣은 Email값
//   const requestEmailInput = document.getElementById('requestEmail'); //친구요청보낸 Email값
//   const requestFriendButton = document.getElementById('requestFriendByEmail'); // 친구요청

//   // 이메일로 유저 검색
//   searchButton.addEventListener('click', function () {
//     const searchEmail = searchEmailInput.value;
//     const data = { email: searchEmail };

//     axios
//       .get('http://localhost:8080/user/me/searchEmail', data, {
//         headers: {
//           Authorization: `Bearer ${storedToken}`,
//         },
//       })
//       .then((response) => {
//         const userId = response.data.userId;
//         if (userId) {
//           alert(`Email: ${searchEmail} 유저가 존재합니다.`);
//         } else {
//           alert(`Email: ${searchEmail} 유저가 존재하지 않습니다.`);
//         }
//         requestFriendButton.setAttribute('searched-userId', userId);
//       })
//       .catch((error) => {
//         console.error('Error message:', error.response.data.message);
//       });
//   });

//   // 친구 요청
//   requestFriendButton.addEventListener('click', function () {
//     const userId = this.getAttribute('searched-userId'); // 검색해서 나온 유저아이디
//     const requestEmail = requestEmailInput.value;

//     axios
//       .post(`http://localhost:8080/follow/${userId}/request`, {
//         headers: {
//           Authorization: `Bearer ${storedToken}`,
//         },
//       })
//       .then((response) => {
//         if (response.data.success) {
//           alert(`E-mail: ${requestEmail} 유저에게 친구 요청을 보냈습니다`);
//         } else {
//           alert(`친구 요청에 실패했습니다.`);
//         }
//       })
//       .catch((error) => {
//         console.error('Error message:', error.response.data.message);
//       });
//   });
// });

// //친구수 조회
// // const friendCountElement = document.getElementById('friendCount');
// // axios
// .get('http://localhost:8080/user/me/friendCount', {
//   headers: {
//     Authorization: `Bearer ${storedToken}`,
//   },
// })
// //   .then((response) => {
// //     const friendCount = response.data;
// //     friendCountElement.innerText = friendCount;
// //   })
// //   .catch((error) => {
// //     console.error('Error message:', error.response.data.message);
// //   });

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
  };

// 포인트 조회
