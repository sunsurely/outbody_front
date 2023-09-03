// 로그인
const login = async () => {
  if (!$('#email').val()) {
    alert('계정(e-mail)을 입력해주세요');
    return;
  }
  if (!$('#password').val()) {
    alert('비밀번호를 입력해주세요');
    return;
  }

  console.log($('#email').val());
  console.log($('#password').val());

  await axios
    .post('http://localhost:3000/auth/login', {
      email: $('#email').val(),
      password: $('#password').val(),
    })
    .then((response) => {
      console.log(response.data.data);
      localStorage.setItem(
        `cookie`,
        `Bearer ${response.data.data.accessToken}`,
      );
      // setCookie('Authorization', response.data.data.accessToken, 2);
      alert('반갑습니다 회원님!');
      location.href = `index-0.html?id=${response.data.data.userId}`;
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
};
$('#login-btn').click(login);

// function setCookie(cookieName, cookieValue, expirationHour) {
//   const date = new Date();
//   date.setTime(date.getTime() + expirationHour * 60 * 60 * 1000);
//   const expires = `expires=${date.toUTCString()}`;
//   document.cookie = `${cookieName}=${encodeURIComponent(
//     `Bearer ${cookieValue}`,
//   )}; ${expires}; path=/`;
// }

// function getCookie() {
//   const cookies = document.cookie.split(';');
//   for (const cookie of cookies) {
//     const [name, value] = cookie.trim().split('=');
//     if (name === 'Authorization') {
//       return decodeURIComponent(value);
//     }
//   }
// }

// function deleteCookie() {
//   const cookies = document.cookie.split(';');
//   for (const cookie of cookies) {
//     const [name, value] = cookie.trim().split('=');
//     if (name.trim() === 'Authorization') {
//       document.cookie = `${name}=; expires=Sat, 01 Jan 2000 00:00:00 UTC; path=/;`;
//     }
//   }
// }

// 카카오 로그인
const kakaoLogin = async () => {
  try {
    await axios.get(`http://localhost:3000/auth/kakao/redirect`);
  } catch (error) {
    // alert(error.response.data.message);
    console.error('Error message:', error);
  }
};
$('.kakao-btn').click(kakaoLogin);
