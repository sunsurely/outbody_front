/**
 *
 * You can write your JS code here, DO NOT touch the default style file
 * because it will make it harder for you to update.
 *
 */

'use strict';

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNjkzMjk0NjU0LCJleHAiOjE2OTMyOTgyNTR9.uhiXOiC03OrKhPdt43gq5_O5phJzdVD1PThtvjf5dTQ';

const createButton = document.querySelector('#create-challenge-button');
createButton.addEventListener('click', createChallenge);

// 도전 생성
async function createChallenge() {
  const title = $('#challenge-title').val();
  const description = $('#challenge-description').val();
  if (title === '' || description === '') {
    alert('제목과 내용은 필수 입력값입니다.');
    return;
  }
  let publicView = $('#challenge-publicView').val();
  if (publicView === '전체 공개') {
    publicView = true;
  } else if (publicView === '비공개') {
    publicView = false;
  }
  let weight = $('#challenge-weight').val();
  if (weight === '적용 안함') {
    weight = 0;
  } else {
    weight = parseInt(weight);
  }
  let muscle = $('#challenge-muscle').val();
  if (muscle === '적용 안함') {
    muscle = 0;
  } else {
    muscle = parseInt(muscle);
  }
  let fat = $('#challenge-fat').val();
  if (fat === '적용 안함') {
    fat = 0;
  } else {
    fat = parseInt(fat);
  }
  const data = {
    title,
    description,
    startDate: $('#challenge-startDate').val(),
    challengeWeek: parseInt($('#challenge-week').val()),
    userNumberLimit: parseInt($('#challenge-userNumberLimit').val()),
    publicView,
    attend: parseInt($('#challenge-attend').val()),
    weight,
    muscle,
    fat,
  };
  console.log(data);
  await axios
    .post('http://localhost:3000/challenge', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (response.data.success === true) {
        alert('도전이 생성되었습니다.');
        location.reload();
      }
    })
    .catch((response) => {
      alert(response.response.data.message);
    });
}