/**
 *
 * You can write your JS code here, DO NOT touch the default style file
 * because it will make it harder for you to update.
 *
 */

'use strict';

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjkzMzgwODk2LCJleHAiOjE2OTMzODQ0OTZ9.BIsSCR5vfNLl2xUPBZQu0m2Uf7sPHIeGviAPTOv59mo';

window.onload = function () {
  getChallenges();
};

// 도전 목록 조회
async function getChallenges() {
  axios
    .get('http://localhost:3000/challenge', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log(response.data.data);

      const challengeTable = document.querySelector('#challenge-table');
      challengeTable.innerHTML += response.data.data
        .map((challenge) => {
          const startDate = new Date(challenge.startDate);
          startDate.setDate(startDate.getDate() + 1);
          const formattedstartDate = startDate.toISOString().split('T')[0];

          const endDate = new Date(challenge.endDate);
          endDate.setDate(endDate.getDate() + 1);
          const formattedendDate = endDate.toISOString().split('T')[0];

          const createdAt = new Date(challenge.createdAt);
          createdAt.setDate(createdAt.getDate() + 1);
          const formattedCreatedAt = createdAt.toISOString().split('T')[0];

          let publicView = challenge.publicView;
          if (publicView === 1) {
            publicView = '전체';
          } else if (publicView === 0) {
            publicView = '비공개';
          }

          return `<tr id="${challenge.id}">
          <td>${challenge.title}</td>
          <td>${formattedstartDate} ~ ${formattedendDate}</td>
          <td>
            <button class="btn btn-primary">
              오운완 출석<span class="badge badge-transparent">${
                challenge.attend
              }일</span>
            </button>
            <button class="btn btn-primary">
              체중 <span class="badge badge-transparent">-${
                challenge.weight
              }kg</span>
            </button>
            <button class="btn btn-primary">
              골격근량 <span class="badge badge-transparent">+${
                challenge.muscle
              }kg</span>
            </button>
            <button class="btn btn-primary">
              체지방률 <span class="badge badge-transparent">-${
                challenge.fat
              }%</span>
            </button>
          </td>
          <td>
            <button class="btn btn-danger">
              실패 시<span class="badge badge-transparent">-${
                challenge.entryPoint
              }점</span>
            </button>
            <button class="btn btn-success">
              성공 시 최대<span class="badge badge-transparent">+${
                challenge.entryPoint * challenge.userNumber
              }점</span>
            </button>
          </td>
          <td>${challenge.userNumber} / ${challenge.userNumberLimit}명</td>
          <td>
            <img alt="image" src="assets/img/avatar/avatar-5.png" class="rounded-circle" width="35"
              data-toggle="title" title="">
            <div class="d-inline-block ml-1">${challenge.hostName}</div>
          </td>
          <td>${formattedCreatedAt}</td>
          <td>${publicView}</td>
          <td>
            <a href="get-one-challenge.html?id=${challenge.id}">
              <button class="btn btn-primary" style="border-radius: 15px;">
                보기
              </button>
            </a>
          </td>
          </tr>`;
        })
        .join('');
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
}
