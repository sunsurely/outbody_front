const login = async () => {
  try {
    if (!$('#email').val()) {
      alert('이메일을 입력해주세요');
      return;
    }
    if (!$('#password').val()) {
      alert('비밀번호를 입력해주세요');
      return;
    }

    await axios.post('http://localhost:3000/auth/login', {
      email: $('#email').val(),
      password: $('#password').val(),
    });

    alert('로그인이 되었습니다.');
    location.href = 'index-0.html';
  } catch (error) {
    console.log(error);
  }
};
$('#login-btn').click(login);
