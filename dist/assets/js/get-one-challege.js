const urlParams = new URLSearchParams(window.location.search);
const challengeId = urlParams.get('id');

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjkzNzMwNDgxLCJleHAiOjE2OTM3MzQwODF9.ssoKprK0b0rZlHMPk4kL_2_H-S49SvuTifkUaxZUREM';

window.onload = function () {
  getChallengeDetail();
  getChallengers();
};

// 도전 상세 조회 (도전)
async function getChallengeDetail() {
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
              <a id="enter-challenge" class="btn btn-primary" style="color: white;">도전 입장</a>
              <a id="leave-challenge" class="btn btn-primary" style="color: white;">도전 퇴장</a>
              <a class="btn btn-secondary" style="color: white;">${
                challenge.userNumber
              } / ${challenge.userNumberLimit}명</a>
              <a id="delete-challenge" class="btn btn-danger" style="color: white;">삭제</a>
            </div>
          </div>
          <div class="card-body">
            <div class="section-title mt-0">설명</div>
            <p>${challenge.description}</p>
            <div class="section-title mt-0">기간</div>
            <p>${challenge.startDate} ~ ${challenge.endDate}</p>
            <div class="section-title mt-0" style="margin-bottom: 20px;">목표</div>
            <button class="btn btn-primary" style="margin-bottom: 20px;">
              오운완 출석<span class="badge badge-transparent">${
                challenge.goalAttend
              }일</span>
            </button>
            <button class="btn btn-primary" style="margin-bottom: 20px;">
              체중 <span class="badge badge-transparent">-${
                challenge.goalWeight
              }kg</span>
            </button>
            <button class="btn btn-primary" style="margin-bottom: 20px;">
              골격근량 <span class="badge badge-transparent">+${
                challenge.goalMuscle
              }kg</span>
            </button>
            <button class="btn btn-primary" style="margin-bottom: 20px;">
              체지방률 <span class="badge badge-transparent">-${
                challenge.goalFat
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
                <img alt="image" class="mr-3 rounded-circle" width="50" src="https://inflearn-nest-cat.s3.amazonaws.com/${
                  challenge.userImageUrl
                }">
                <div class="media-body">
                  <div class="mt-0 mb-1 font-weight-bold">${
                    challenge.userName
                  }</div>
                  <div class="font-1000-bold"><i class="fas fa-circle"></i> ${
                    challenge.userPoint
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

// 도전 상세 조회 (도전자)
async function getChallengers() {
  axios
    .get(`http://localhost:3000/challenge/${challengeId}/challengers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log(response.data.data);

      const challengerCardHeader = document.querySelector(
        '#challenger-card-header',
      );
      challengerCardHeader.innerHTML = `
        <div class="card card-primary">
          <div class="card-header">
            <h4>참가자 목록</h4>
            <div class="card-header-action">
              <a id="send-invitation-button" href="get-post.html?id=${challengeId}" class="btn btn-primary" style="color: white;">오운완 인증</a>
              <a class="btn btn-primary" style="color: white;" data-toggle="modal" data-target="#createModal">친구 초대</a>
            </div>
          </div>
          <div class="card-body">
            <ul id="challenger-list" class="list-unstyled list-unstyled-border">
            </ul>
          </div>
        </div>`;
      const challengerList = document.querySelector('#challenger-list');
      challengerList.innerHTML += response.data.data
        .map((challenger) => {
          return `<li class="media">
            <img alt="image" class="mr-3 rounded-circle" width="50"
            src="https://inflearn-nest-cat.s3.amazonaws.com/${challenger.userImageUrl}">
            <div class="media-body">
              <div class="mt-0 mb-1 font-weight-bold">${challenger.userName}</div>
              <div class="font-1000-bold"><i class="fas fa-circle"></i> ${challenger.userPoint}점</div>
            </div>
          </li>`;
        })
        .join('');
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
}

// 도전 입장
document.addEventListener('click', async (event) => {
  const target = event.target;

  if (target.matches('#enter-challenge')) {
    await axios
      .post(`http://localhost:3000/challenge/${challengeId}/enter`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.success === true) {
          alert('도전 입장 완료');
          location.reload();
        }
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  }
});

// 도전 퇴장
document.addEventListener('click', async (event) => {
  const target = event.target;

  if (target.matches('#leave-challenge')) {
    const leaveConfirm = confirm('정말로 퇴장하시겠습니까?');

    if (leaveConfirm) {
      await axios
        .delete(`http://localhost:3000/challenge/${challengeId}/leave`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data.success === true) {
            alert('도전 퇴장 완료');
            location.reload();
          }
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    }
  }
});

// 도전 삭제
document.addEventListener('click', async (event) => {
  const target = event.target;

  if (target.matches('#delete-challenge')) {
    const deleteConfirm = confirm('정말로 삭제하시겠습니까?');

    if (deleteConfirm) {
      await axios
        .delete(`http://localhost:3000/challenge/${challengeId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          alert('도전 삭제 완료');
          window.location.href = 'get-challenges.html';
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    }
  }
});

// 도전 초대
$('#send-invitation-button').on('click', async () => {
  const emailInput = $('#search-email-input').val();

  const searchedFriend = $('#searched-friend');
  $(searchedFriend).html('');

  try {
    const response = await axios.get(
      `http://localhost:3000/user/me/searchEmail/?email=${emailInput}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const friend = response.data.data;

    const temp = `
    <div class="card card-primary">
      <div class="card-body">
        <div id=${friend.id}>
          <img src="" />
          <span> ${friend.name}(${friend.email})</span>
        </div>
      </div>
    </div>`;
    $(searchedFriend).html(temp);

    $('#send-invitation').on('click', async () => {
      const data = {
        email: friend.email,
      };

      await axios
        .post(`http://localhost:3000/challenge/${challengeId}/invite`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          alert(
            `${friend.name}(${friend.email})님에게 도전 초대문을 보냈습니다.`,
          );
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    });
  } catch (error) {
    alert(error.response.data.message);
  }
});
