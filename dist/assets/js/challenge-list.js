'use strict';

$(document).ready(function () {
  challengeListPage();
});

const thattoken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImlhdCI6MTY5MzU2MzYwNSwiZXhwIjoxNjkzNTcwODA1fQ.0ITkltfHHFSeK5vr7LF9iU5oA9giuUBJYwuirVaq0ww';

async function challengeListPage() {
  const titleTag = $('.challengeTitle');
  const startDateTag = $('.challengeStartDate');
  const endDateTag = $('.challengeEndDate');
  const challengeWeekTag = $('.challengeChallengeWeek');
  const descriptionTag = $('.challengeDescription');
  const createdAtTag = $('.chellengeCreatedAt');
  try {
    const { data } = await axios.get(
      'http://localhost:3000/challenge/user/list',
      {
        headers: { Authorization: `Bearer ${thattoken}` },
      },
    );
    const challengeData = data.data;
    console.log(challengeData);

    // $(titleTag).text(challengeData.title);
    // $(startDateTag).text(challengeData.startDate);
    // $(endDateTag).text(challengeData.endDate);
    // $(challengeWeekTag).text(challengeData.challengeWeek);
    // $(descriptionTag).text(challengeData.description);

    $(titleTag).text(challengeData[0].title);
    $(startDateTag).text(challengeData[0].startDate);
    $(endDateTag).text(challengeData[0].endDate);
    $(challengeWeekTag).text(challengeData[0].challengeWeek);
    $(descriptionTag).text(challengeData[0].description);

    // 생성날짜
    const date = new Date(challengeData.createdAt);
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const myCreatedAt = `${year}.${month}.${day}`;
    $(createdAtTag).text(myCreatedAt);

    let num = 1;
    let challengeTemp = '';
    for (challenge of challengeData) {
      const temp = `
      <th scope="row">${num}</th>
      <div class="activity">
        <div class="activity-icon bg-primary text-white shadow-primary">
          <i class="fas fa-comment-alt"></i>
        </div>
        <div class="activity-detail">
          <div class="mb-2">
            <span class="challengeTitle">${challenge.title}</span>
            <span class="bullet"></span>
            <div class="float-right dropdown">
              <div class="dropdown-menu">
                <div class="dropdown-title">Options</div>
                <a href="#" class="dropdown-item has-icon">
                  <i class="fas fa-list"></i> Detail
                </a>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item has-icon text-danger"
                  data-confirm="Wait, wait, wait...|This action can't be undone. Want to take risks?"
                  data-confirm-text-yes="Yes, IDC"
                >
                  <i class="fas fa-trash-alt"></i> Archive
                </a>
              </div>
            </div>
          </div>
          <p class="challengeStartDate">${challenge.startDate}</p>
          <p class="challengeEndDate">${challenge.endDate}</p>
          <p class="challengeChallengeWeek">${challenge.challengeWeek}</p>
          <p class="challengeDescription">${challenge.description}</p>
          <p class="chellengeCreatedAt">${challenge.createdAt}</p>
        </div>
      </div>
    `;
      challengeTemp += temp;
      num++;
    }
  } catch (error) {
    console.log(error);
    // alert(error);
  }
  // 상단 날짜. 현재 날짜 (September 2023 이런식으로) 객체 생성
  const currentDate = new Date();
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // 날짜와 월 이름 설정
  const day = currentDate.getDate();
  const month = monthNames[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  // 원하는 형식으로 표시하여 엘리먼트 내용 업데이트
  const currentTitle = `${day}${ordinalSuffix(day)} ${month} ${year}`;
  const today = $('#currentDate');
  $(today).text(currentTitle);

  // 일자에 맞는 서수(suffix) 반환 함수
  function ordinalSuffix(i) {
    const j = i % 10;
    const k = i % 100;
    if (j === 1 && k !== 11) {
      return 'st';
    }
    if (j === 2 && k !== 12) {
      return 'nd';
    }
    if (j === 3 && k !== 13) {
      return 'rd';
    }
    return 'th';
  }
}
