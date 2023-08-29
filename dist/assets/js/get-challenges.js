/**
 *
 * You can write your JS code here, DO NOT touch the default style file
 * because it will make it harder for you to update.
 *
 */

'use strict';

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNjkzMzE2NjcxLCJleHAiOjE2OTMzMjAyNzF9.bR8IjSFybE8e2c9rwOUok4OXLFveo0rGVIbnO48k0t8';

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

      const challengeList = document.querySelector('#challenge-list');
      challengeList.innerHTML = response.data.data
        .map((challenge) => {
          return `<td>${challenge.title}</td>
                  <td>${challenge.startDate} ~ ${challenge.endDate}</td>
                  <td>
                    <button class="btn btn-primary">
                      오운완 출석<span class="badge badge-transparent">3일</span>
                    </button>
                    <button class="btn btn-primary">
                      체중 <span class="badge badge-transparent">-7kg</span>
                    </button>
                    <button class="btn btn-primary">
                      골격근량 <span class="badge badge-transparent">+3kg</span>
                    </button>
                    <button class="btn btn-primary">
                      체지방률 <span class="badge badge-transparent">-5%</span>
                    </button>
                  </td>
                  <td>
                    <button class="btn btn-danger">
                      실패 시<span class="badge badge-transparent">-${challenge.entryPoint}점</span>
                    </button>
                    <button class="btn btn-success">
                      성공 시 최대<span class="badge badge-transparent">+2560점</span>
                    </button>
                  </td>
                  <td>4 / ${challenge.userNumberLimit}명</td>
                  <td>
                    <img alt="image" src="assets/img/avatar/avatar-5.png" class="rounded-circle" width="35"
                      data-toggle="title" title="">
                    <div class="d-inline-block ml-1">김필선</div>
                  </td>
                  <td>2023-08-29</td>`;
        })
        .join('');
    })
    .catch((response) => {
      alert(response.response.data.message);
    });
}
