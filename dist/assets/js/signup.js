// 회원가입
const signUp = async () => {
  try {
    const name = $('#name').val();
    const email = $('#email').val();
    const password = $('#password').val();
    const confirmPassword = $('#confirm_password').val();
    const gender = $('#gender').val();

    if (!name) {
      alert('이름을 입력해주세요');
      return;
    }
    if (!email) {
      alert('이메일을 입력해주세요');
      return;
    }
    if (!password) {
      alert('비밀번호를 입력해주세요');
      return;
    }
    if (!confirmPassword) {
      alert('비밀번호 확인란을 입력해주세요');
      return;
    }
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (gender === '-- 선택 --') {
      alert('성별을 선택해주세요');
      return;
    }

    await axios.post(`http://localhost:3000/user/signup`, {
      name,
      email,
      password,
      gender,
    });

    alert('회원가입이 완료되었습니다.');
    location.reload();
  } catch (error) {
    alert(error.response.data.message);
    console.error('Error message:', error);
  }
};
$('#signUp_btn').click(signUp);
