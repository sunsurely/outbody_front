'use strict';
let nowPage = 1;
let orderList = 'normal';
let totalPages = 0;

$(document).ready(function () {
  initializeChart();
  getBodyResults();
  initializeList(1, 10);
  $('.daterange-cus').daterangepicker({
    startDate: moment().subtract(1, 'years'),
    endDate: moment(),
    locale: {
      format: 'YYYY-MM-DD',
    },
  });
});

const modal = $('#modal-background');

$('.modal-up').on('click', () => {
  $(modal).css('display', 'block');
});

$('.cancle-regist').on('click', () => {
  $(modal).css('display', 'none');
});

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNjkzNTM3NjA0LCJleHAiOjE2OTM1NDEyMDR9.wj6X6wr5rnthyyeIxw5c4LWMOB1kH2wxllHqH8skq6I';

async function initializeChart() {
  const bmrArr = [];
  const weightArr = [];
  const muscleArr = [];
  const fatArr = [];
  const dateArr = [];
  const recentDatas = $('.recent-bodyData');

  try {
    const { data } = await getRecordData(1, 7);

    const records = data.pageinatedUsersRecords;

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
    alert(error.response.data.message);
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

  initChart('myChart', bmrArr, dateArr, 0, '기초대사량(kcal)');
  initChart('myChart2', weightArr, dateArr, 10, '체중(kg)');
  initChart('myChart3', muscleArr, dateArr, 10, '근육량(kg)');
  initChart('myChart4', fatArr, dateArr, 10, '체지방률');
}

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

    const bodyResults = $('.body-result');
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
    alert(error.response.data.message);
  }
}

async function initializeList(page, pageSize) {
  const recordTable = $('#record-table');
  const pagenationTag = $('#record-pagenation');
  const prevButton = `<li id="prev_button" class="page-item"><a class="page-link">Previous</a></li>`;
  const nextButton = `<li id="next_button" class="page-item"><a class="page-link">next</a></li>`;
  let pageNumbers = '';
  let pageNumbersHtml = '';
  let recordsHtml = '';

  orderList = 'normal';
  const data = await getRecordData(page, pageSize);

  const records = data.data.pageinatedUsersRecords;
  totalPages = data.data.totalPages;
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

    const temp = `  <tr style="border-bottom:solid 2px rgba(0,0,0,0.1)">
    <td>
      <div style="margin-top:10px; ">${recordDate}</div>
    </td>
    <td>
      <p href="#" class="font-weight-600" style="margin-top:25px;">${record.weight}kg</p>
    </td>
    <td>
      <p href="#" class="font-weight-600" style="margin-top:25px;">${record.fat}%</p>
    </td>
    <td>
      <p href="#" class="font-weight-600" style="margin-top:25px;">${record.muscle}kg</p>
    </td>
    <td>
      <p href="#" class="font-weight-600" style="margin-top:25px;">${record.bmr}kcal</p>
    </td>
  </tr>`;

    recordsHtml += temp;
  });

  pageNumbersHtml = prevButton + pageNumbers + nextButton;
  recordTable.html(recordsHtml);
  pagenationTag.html(pageNumbersHtml);
  const prevBtn = $('#prev_button');
  const nextBtn = $('#next_button');
  const pages = $('.page_number');

  $(prevBtn).click(async () => {
    if (orderList === 'normal') {
      if (nowPage > 1) {
        try {
          $(pages).find('.page-link').css('background-color', '');
          $(pages).find('.page-link').css('color', '');

          const { data } = await getRecordData(nowPage - 1, 10);
          const records = data.pageinatedUsersRecords;
          setRecordList(records);
          nowPage -= 1;
          recordsHtml = '';

          $(pages)
            .eq(nowPage - 1)
            .find('.page-link')
            .css('background-color', 'blue');
          $(pages)
            .eq(nowPage - 1)
            .find('.page-link')
            .css('color', 'white');
        } catch (error) {
          alert(error.response.data.message);
        }
      }
    }
  });

  $(nextBtn).click(async () => {
    if (orderList === 'normal') {
      if (nowPage > 0 && nowPage < totalPages) {
        $(pages).find('.page-link').css('background-color', '');
        $(pages).find('.page-link').css('color', '');
        try {
          const { data } = await getRecordData(nowPage + 1, 10);
          const records = data.pageinatedUsersRecords;
          setRecordList(records);
          nowPage += 1;
          recordsHtml = '';

          $(pages)
            .eq(nowPage - 1)
            .find('.page-link')
            .css('background-color', 'blue');
          $(pages)
            .eq(nowPage - 1)
            .find('.page-link')
            .css('color', 'white');
        } catch (error) {
          alert(error.response.data.message);
        }
      }
    }
  });

  $(pages).each((idx, page) => {
    $(page).click(async () => {
      if (orderList === 'normal') {
        $(pages).find('.page-link').css('background-color', '');
        $(pages).find('.page-link').css('color', '');

        try {
          const { data } = await getRecordData(
            parseInt($(page).find('.page-link').text()),
            10,
          );
          const records = data.pageinatedUsersRecords;
          setRecordList(records);

          $(page).find('.page-link').css('background-color', 'blue');
          $(page).find('.page-link').css('color', 'white');
          nowPage = parseInt($(page).find('.page-link').text());

          recordsHtml = '';
        } catch (error) {
          alert(error.response.data.message);
        }
      }
    });
  });

  $('.daterange-btn').on('click', async function () {
    $('.page_number').find('.page-link').css('background-color', '');
    $('.page_number').find('.page-link').css('color', '');
    nowPage = 1;
    const recordTable = $('#record-table');
    const pagenationTag = $('#record-pagenation');
    const prevButton = `<li id="prev_button" class="page-item"><a class="page-link">Previous</a></li>`;
    const nextButton = `<li id="next_button" class="page-item"><a class="page-link">next</a></li>`;
    let pageNumbers = '';
    let pageNumbersHtml = '';
    let recordsHtml = '';

    orderList = 'date';
    const range = $('.daterange-cus').data('daterangepicker');
    const startDate = range.startDate.format('YYYY-MM-DD');
    const endDate = range.endDate.format('YYYY-MM-DD');

    const data = await getDateRangeRecord(startDate, endDate, 1);

    const records = data.data.pageinatedUsersRecords;

    totalPages = data.data.totalPages;
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

      const temp = `  <tr style="border-bottom:solid 2px rgba(0,0,0,0.1)">
    <td>
      <div style="margin-top:10px; ">${recordDate}</div>
    </td>
    <td>
      <p href="#" class="font-weight-600" style="margin-top:25px;">${record.weight}kg</p>
    </td>
    <td>
      <p href="#" class="font-weight-600" style="margin-top:25px;">${record.fat}%</p>
    </td>
    <td>
      <p href="#" class="font-weight-600" style="margin-top:25px;">${record.muscle}kg</p>
    </td>
    <td>
      <p href="#" class="font-weight-600" style="margin-top:25px;">${record.bmr}kcal</p>
    </td>
  </tr>`;
      recordsHtml += temp;
    });

    pageNumbersHtml = prevButton + pageNumbers + nextButton;
    recordTable.html(recordsHtml);
    pagenationTag.html(pageNumbersHtml);
    $('.page_number').eq(0).find('.page-link').css('background-color', 'blue');
    $('.page_number').eq(0).find('.page-link').css('color', 'white');
    const prevBtn = $('#prev_button');
    const nextBtn = $('#next_button');
    const pages = $('.page_number');

    $(prevBtn).click(async () => {
      if (orderList === 'date') {
        if (nowPage > 1) {
          const range = $('.daterange-cus').data('daterangepicker');
          const startDate = range.startDate.format('YYYY-MM-DD');
          const endDate = range.endDate.format('YYYY-MM-DD');

          try {
            $(pages).find('.page-link').css('background-color', '');
            $(pages).find('.page-link').css('color', '');

            const { data } = await getDateRangeRecord(
              startDate,
              endDate,
              nowPage - 1,
            );
            const records = data.pageinatedUsersRecords;
            setRecordList(records);
            nowPage -= 1;
            recordsHtml = '';

            $(pages)
              .eq(nowPage - 1)
              .find('.page-link')
              .css('background-color', 'blue');
            $(pages)
              .eq(nowPage - 1)
              .find('.page-link')
              .css('color', 'white');
          } catch (error) {
            alert(error.response.data.message);
          }
        }
      }
    });

    $(nextBtn).click(async () => {
      if (orderList === 'date') {
        if (nowPage > 0 && nowPage < totalPages) {
          const range = $('.daterange-cus').data('daterangepicker');
          const startDate = range.startDate.format('YYYY-MM-DD');
          const endDate = range.endDate.format('YYYY-MM-DD');

          $(pages).find('.page-link').css('background-color', '');
          $(pages).find('.page-link').css('color', '');
          try {
            const { data } = await getDateRangeRecord(
              startDate,
              endDate,
              nowPage + 1,
            );
            const records = data.pageinatedUsersRecords;
            setRecordList(records);
            nowPage += 1;
            recordsHtml = '';

            $(pages)
              .eq(nowPage - 1)
              .find('.page-link')
              .css('background-color', 'blue');
            $(pages)
              .eq(nowPage - 1)
              .find('.page-link')
              .css('color', 'white');
          } catch (error) {
            alert(error.response.data.message);
          }
        }
      }
    });

    $(pages).each((idx, page) => {
      $(page).click(async () => {
        if (orderList === 'date') {
          const range = $('.daterange-cus').data('daterangepicker');
          const startDate = range.startDate.format('YYYY-MM-DD');
          const endDate = range.endDate.format('YYYY-MM-DD');
          $(pages).find('.page-link').css('background-color', '');
          $(pages).find('.page-link').css('color', '');
          nowPage = parseInt($(page).find('.page-link').text());
          try {
            const { data } = await getDateRangeRecord(
              startDate,
              endDate,
              nowPage,
            );
            const records = data.pageinatedUsersRecords;
            setRecordList(records);

            $(page).find('.page-link').css('background-color', 'blue');
            $(page).find('.page-link').css('color', 'white');

            recordsHtml = '';
          } catch (error) {
            alert(error.response.data.message);
          }
        }
      });
    });
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
    await axios.post('http://localhost:3000/record', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    alert('데이터를 등록했습니다.');
    window.location.reload();
  } catch (error) {
    alert(error.response.data.message);
  }
});

async function getRecordData(page, pageSize) {
  const data = await axios(
    `http://localhost:3000/record/page/?page=${page}&pageSize=${pageSize}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  orderList = 'normal';
  return data.data;
}
Chart.register(ChartDataLabels);

async function initChart(chartName, recordArr, dateArr, stepSize, title) {
  var statistics_chart = document.getElementById(chartName).getContext('2d');

  var myChart = new Chart(statistics_chart, {
    type: 'line',
    data: {
      labels: [...dateArr],
      datasets: [
        {
          label: title,
          data: [...recordArr],
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
      plugins: {
        datalabels: {
          align: 'end',
          anchor: 'end',
          formatter: (value, context) => {
            return value + ' kg';
          },
        },
      },
      legend: {
        display: true,
        labels: {
          boxWidth: 0,
          usePointStyle: false,
        },
      },
      scales: {
        yAxes: [
          {
            gridLines: {
              display: true,
              drawBorder: false,
            },
            ticks: {
              stepSize: stepSize,
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

function setRecordList(records) {
  let recordsHtml = '';
  const recordTable = $('#record-table');
  $(recordTable).html('');

  records.forEach((record) => {
    const date = new Date(record.createdAt);
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const recordDate = `${year}.${month}.${day}`;

    const temp = `  <tr style="border-bottom:solid 2px rgba(0,0,0,0.1)">
    <td>
      <div style="margin-top:10px; ">${recordDate}</div>
    </td>
    <td>
      <p href="#" class="font-weight-600" style="margin-top:25px;">${record.weight}kg</p>
    </td>
    <td>
      <p href="#" class="font-weight-600" style="margin-top:25px;">${record.fat}%</p>
    </td>
    <td>
      <p href="#" class="font-weight-600" style="margin-top:25px;">${record.muscle}kg</p>
    </td>
    <td>
      <p href="#" class="font-weight-600" style="margin-top:25px;">${record.bmr}kcal</p>
    </td>
  </tr>`;

    recordsHtml += temp;
  });
  recordTable.html(recordsHtml);
}

async function getDateRangeRecord(startDate, endDate, page) {
  const { data } = await axios.get(
    `http://localhost:3000/record/date/period/page/?page=${page}&pageSize=10&start=${startDate}&end=${endDate}`,

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
}
