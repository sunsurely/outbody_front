const urlParams = new URLSearchParams(window.location.search);
const challengeId = urlParams.get('id');

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjkzMzgwODk2LCJleHAiOjE2OTMzODQ0OTZ9.BIsSCR5vfNLl2xUPBZQu0m2Uf7sPHIeGviAPTOv59mo';

window.onload = function () {
  getOneChallenge();
};

// 도전 상세 조회
async function getOneChallenge() {
  axios
    .get(`http://localhost:3000/challenge/${challengeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log(response.data.data);
      const challenge = response.data.data;

      const challengeDetail = document.querySelector('#challenge-detail');
      challengeDetail.innerHTML = `<div class="card card-primary">
          <div class="card-header">
            <h4>${challenge.title}</h4>
            <div class="card-header-action">
              <a class="btn btn-primary" style="color: white;">도전 참여</a>
              <a class="btn btn-primary" style="color: white;">도전 퇴장</a>
              <a class="btn btn-primary" style="color: white;">친구 초대</a>
              <a class="btn btn-danger" style="color: white;">삭제</a>
            </div>
          </div>
          <divclass="card-body">
            <div class="section-title mt-0">설명</div>
            <p>${challenge.description}</p>
            <div class="section-title mt-0">기간</div>
            <p>${challenge.startDate} ~ ${challenge.endDate}</p>
            <div class="section-title mt-0" style="margin-bottom: 20px;">목표</div>
            <button class="btn btn-primary" style="margin-bottom: 20px;">
              오운완 출석<span class="badge badge-transparent">${
                challenge.goal.attend
              }일</span>
            </button>
            <button class="btn btn-primary" style="margin-bottom: 20px;">
              체중 <span class="badge badge-transparent">-${
                challenge.goal.weight
              }kg</span>
            </button>
            <button class="btn btn-primary" style="margin-bottom: 20px;">
              골격근량 <span class="badge badge-transparent">+${
                challenge.goal.muscle
              }kg</span>
            </button>
            <button class="btn btn-primary" style="margin-bottom: 20px;">
              체지방률 <span class="badge badge-transparent">-${
                challenge.goal.fat
              }%</span>
            </button>
            <div class="section-title mt-0" style="margin-bottom: 20px;">점수</div>
            <button class="btn btn-danger" style="margin-bottom: 10px;">
              실패 시<span class="badge badge-transparent">-${
                challenge.entryPoint
              }점</span>
            </button>
            <button class="btn btn-success" style="margin-bottom: 10px;">
              성공 시 최대<span class="badge badge-transparent">+${
                challenge.userNumber * challenge.entryPoint
              }점</span>
            </button>
          </div>
          <div class="card-footer bg-whitesmoke">
            <ul class="list-unstyled list-unstyled-border" style="margin-top: 20px;">
              <li class="media">
                <img alt="image" class="mr-3 rounded-circle" width="50" src="assets/img/avatar/avatar-1.png">
                <div class="media-body">
                  <div class="mt-0 mb-1 font-weight-bold">${
                    challenge.user.name
                  }</div>
                  <div class="font-1000-bold"><i class="fas fa-circle"></i> ${
                    challenge.user.point
                  }점</div>
                </div>
              </li>
            </ul>
          </div>
        </div>`;
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
}
