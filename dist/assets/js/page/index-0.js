'use strict';

$(document).ready(function () {
  initializeChart();
  getBodyResults();
  initializeList(1);
});

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjkzMzE0MDM5LCJleHAiOjE2OTMzMjEyMzl9.P2xkAmZz-mT9fqYmCiJCTMn-RjeQaSeITPwFUGFwQeY';

const bmrArr = [];
const weightArr = [];
const muscleArr = [];
const fatArr = [];
const dateArr = [];
const recentDatas = $('.recent-bodyData');

async function initializeChart() {
  try {
    const { data } = await axios(
      'http://localhost:3000/record/page/?page=1&pageSize=7',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const records = data.data.pageinatedUsersRecords;

    for (const rec of records) {
      bmrArr.push(rec.bmr);
      weightArr.push(rec.weight);
      muscleArr.push(rec.muscle);
      fatArr.push(rec.fat);

      const date = new Date(rec.createdAt);
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');

      const recordDate = `${year}.${month}.${day}`;

      dateArr.push(recordDate);
    }
  } catch (error) {
    console.error('데이터 불러오기 실패:', error);
  }
  dateArr.reverse();
  bmrArr.reverse();
  weightArr.reverse();
  muscleArr.reverse();
  fatArr.reverse();

  $(recentDatas[0]).text(bmrArr[6]);
  $(recentDatas[1]).text(weightArr[6]);
  $(recentDatas[2]).text(fatArr[6]);
  $(recentDatas[3]).text(muscleArr[6]);

  var statistics_chart = document.getElementById('myChart').getContext('2d');

  var myChart = new Chart(statistics_chart, {
    type: 'line',
    data: {
      labels: [...dateArr],
      datasets: [
        {
          label: '기초대사량(kcal)',
          data: [...bmrArr],
          borderWidth: 2,
          borderColor: '#6777ef',
          backgroundColor: 'transparent',
          pointBackgroundColor: '#fff',
          pointBorderColor: 'red',
          pointRadius: 2,
          tension: 0,
        },
      ],
    },
    options: {
      legend: {
        display: false,
      },
      scales: {
        yAxes: [
          {
            gridLines: {
              display: true,
              drawBorder: false,
            },
            ticks: {
              stepSize: 150,
            },
          },
        ],
        xAxes: [
          {
            gridLines: {
              color: '#fbfbfb',
              lineWidth: 2,
            },
          },
        ],
      },
    },
  });

  var statistics_chart = document.getElementById('myChart2').getContext('2d');

  var myChart = new Chart(statistics_chart, {
    type: 'line',
    data: {
      labels: [...dateArr],
      datasets: [
        {
          label: '체중(kg)',
          data: [...weightArr],
          borderWidth: 2,
          borderColor: '#6777ef',
          backgroundColor: 'transparent',
          pointBackgroundColor: '#fff',
          pointBorderColor: 'red',
          pointRadius: 2,
          tension: 0,
        },
      ],
    },
    options: {
      legend: {
        display: false,
      },
      scales: {
        yAxes: [
          {
            gridLines: {
              display: true,
              drawBorder: false,
            },
            ticks: {
              stepSize: 10,
            },
          },
        ],
        xAxes: [
          {
            gridLines: {
              color: '#fbfbfb',
              lineWidth: 2,
            },
          },
        ],
      },
    },
  });

  var statistics_chart = document.getElementById('myChart3').getContext('2d');

  var myChart = new Chart(statistics_chart, {
    type: 'line',
    data: {
      labels: [...dateArr],
      datasets: [
        {
          label: '골격근량(kg)',
          data: [...muscleArr],
          borderWidth: 2,
          borderColor: '#6777ef',
          backgroundColor: 'transparent',
          pointBackgroundColor: '#fff',
          pointBorderColor: 'red',
          pointRadius: 2,
          tension: 0,
        },
      ],
    },
    options: {
      legend: {
        display: false,
      },
      scales: {
        yAxes: [
          {
            gridLines: {
              display: true,
              drawBorder: false,
            },
            ticks: {
              stepSize: 10,
            },
          },
        ],
        xAxes: [
          {
            gridLines: {
              color: '#fbfbfb',
              lineWidth: 2,
            },
          },
        ],
      },
    },
  });

  var statistics_chart = document.getElementById('myChart4').getContext('2d');

  var myChart = new Chart(statistics_chart, {
    type: 'line',
    data: {
      labels: [...dateArr],
      datasets: [
        {
          label: '체지방률(%)',
          data: [...fatArr],
          borderWidth: 2,
          borderColor: '#6777ef',
          backgroundColor: 'transparent',
          pointBackgroundColor: '#fff',
          pointBorderColor: 'red',
          pointRadius: 2,
          tension: 0,
        },
      ],
    },
    options: {
      legend: {
        display: false,
      },
      scales: {
        yAxes: [
          {
            gridLines: {
              display: true,
              drawBorder: false,
            },
            ticks: {
              stepSize: 20,
            },
          },
        ],
        xAxes: [
          {
            gridLines: {
              color: '#fbfbfb',
              lineWidth: 2,
            },
          },
        ],
      },
    },
  });
}

const bodyResults = $('.body-result');
async function getBodyResults() {
  try {
    const { data } = await axios.get(
      'http://localhost:3000/record/result/detail',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const stdWeight = data.data.stdWeight;
    const stdFat = data.data.stdFat;
    const stdMuscle = data.data.stdMuscle;

    const resWeight = data.data.resWeight;
    const resFat = data.data.resFat;
    const resMuscle = data.data.resMuscle;

    $(bodyResults[0]).text(`${stdWeight}kg`);
    $(bodyResults[1]).text(
      resWeight < 0 ? `${resWeight}kg` : `+${resWeight}kg`,
    );
    $(bodyResults[2]).text(`${stdFat}kg`);
    $(bodyResults[3]).text(resFat < 0 ? `${resFat}kg` : `+${resFat}kg`);
    $(bodyResults[4]).text(`${stdMuscle}kg`);
    $(bodyResults[5]).text(
      resMuscle < 0 ? `${resMuscle}kg` : `+${resMuscle}kg`,
    );
  } catch (error) {
    console.error('데이터 수신 실패');
  }
}

const recordTable = $('#record-table');
const pagenationTag = $('#record-pagenation');
const prevButton = `<li id="prev_button" class="page-item"><a class="page-link">Previous</a></li>`;
const nextButton = `<li id="next_button class="page-item"><a class="page-link">next</a></li>`;
let pageNumbers = '';
let pageNumbersHtml = '';
let recordsHtml = '';

let nowPage = 5;
let orderList = 'normal';

async function initializeList(page) {
  orderList = 'normal';
  const data = await getRecordData(page);

  const records = data.data.pageinatedUsersRecords;

  for (let i = 1; i <= data.data.totalPages; i++) {
    pageNumbers += `<li class="page-item page_number">
    <a class="page-link">${i}</a>
  </li>`;
  }

  records.forEach((record) => {
    const date = new Date(record.createdAt);
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const recordDate = `${year}.${month}.${day}`;

    const temp = `  <tr>
    <td>
      <div>${recordDate}</div>
      <div class="table-links">
        in <a href="#">Web Development</a>
        <div class="bullet"></div>
        <a href="#">View</a>
      </div>
    </td>
    <td>
      <p href="#" class="font-weight-600">${record.weight}kg</p>
    </td>
    <td>
      <p href="#" class="font-weight-600">${record.fat}%</p>
    </td>
    <td>
      <p href="#" class="font-weight-600">${record.muscle}kg</p>
    </td>
    <td>
      <p href="#" class="font-weight-600">${record.bmr}kcal</p>
    </td>
  </tr>`;

    recordsHtml += temp;
  });

  pageNumbersHtml = prevButton + pageNumbers + nextButton;
  recordTable.html(recordsHtml);
  pagenationTag.html(pageNumbersHtml);
  const prevBtn = $('#prev_button');
  const nextBtn = $('#next_button');
  $(prevBtn).click(async () => {
    if (orderList === 'normal') {
      if (nowPage > 1) {
        try {
          const { data } = await getRecordData(nowPage - 1);
          const records = data.pageinatedUsersRecords;

          nowPage -= 1;
          recordsHtml = '';
          records.forEach((record) => {
            const date = new Date(record.createdAt);
            const year = date.getFullYear().toString().slice(-2);
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');

            const recordDate = `${year}.${month}.${day}`;

            const temp = `  <tr>
            <td>
              <div>${recordDate}</div>
              <div class="table-links">
                in <a href="#">Web Development</a>
                <div class="bullet"></div>
                <a href="#">View</a>
              </div>
            </td>
            <td>
              <p href="#" class="font-weight-600">${record.weight}kg</p>
            </td>
            <td>
              <p href="#" class="font-weight-600">${record.fat}%</p>
            </td>
            <td>
              <p href="#" class="font-weight-600">${record.muscle}kg</p>
            </td>
            <td>
              <p href="#" class="font-weight-600">${record.bmr}kcal</p>
            </td>
          </tr>`;

            recordsHtml += temp;
          });

          recordTable.html(recordsHtml);
        } catch (error) {
          console.error('데이터 수신 실패');
        }
      }
    }
  });

  $(nextBtn).click(async () => {
    if (orderList === 'normal') {
      if (nowPage > 1) {
        try {
          const { data } = await getRecordData(nowPage - 1);
          const records = data.pageinatedUsersRecords;

          nowPage -= 1;
          recordsHtml = '';
          records.forEach((record) => {
            const date = new Date(record.createdAt);
            const year = date.getFullYear().toString().slice(-2);
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');

            const recordDate = `${year}.${month}.${day}`;

            const temp = `  <tr>
            <td>
              <div>${recordDate}</div>
              <div class="table-links">
                in <a href="#">Web Development</a>
                <div class="bullet"></div>
                <a href="#">View</a>
              </div>
            </td>
            <td>
              <p href="#" class="font-weight-600">${record.weight}kg</p>
            </td>
            <td>
              <p href="#" class="font-weight-600">${record.fat}%</p>
            </td>
            <td>
              <p href="#" class="font-weight-600">${record.muscle}kg</p>
            </td>
            <td>
              <p href="#" class="font-weight-600">${record.bmr}kcal</p>
            </td>
          </tr>`;

            recordsHtml += temp;
          });

          recordTable.html(recordsHtml);
        } catch (error) {
          console.error('데이터 수신 실패');
        }
      }
    }
  });
}

$('.regist-record').click(async () => {
  const bodyDatas = $('.body-data');
  const height = parseInt($(bodyDatas[0]).val());
  const weight = parseInt($(bodyDatas[1]).val());
  const fat = parseInt($(bodyDatas[2]).val());
  const muscle = parseInt($(bodyDatas[3]).val());
  const bmr = parseInt($(bodyDatas[4]).val());

  const data = { height, weight, fat, muscle, bmr };

  try {
    const result = await axios.post('http://localhost:3000/record', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    alert('데이터를 등록했습니다.');
    window.location.reload();
  } catch (error) {
    console.error('데이터 전송 실패');
  }
});

async function getRecordData(page) {
  const data = await axios(
    `http://localhost:3000/record/page/?page=${page}&pageSize=10`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data.data;
}
