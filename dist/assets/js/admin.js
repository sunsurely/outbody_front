const urlParams = new URLSearchParams(window.location.search);
const adminToken = localStorage.getItem('cookie');

// 1. 블랙리스트 생성모달
document.getElementById('addBlackList').onclick = function (e) {
  e.preventDefault();
  $('#blackListUseradd').modal('show');
};
document.getElementById('cancelBlackList').onclick = function () {
  $('#blackListUseradd').modal('hide');
};

// 2. 회원탈퇴 생성모달
document.getElementById('removeUser').onclick = function (e) {
  e.preventDefault();
  $('#withdrawal').modal('show');
};
document.getElementById('canceldelete').onclick = function () {
  $('#withdrawal').modal('hide');
};

// 이메일로 회원 조회 & 블랙리스트 생성 (성공)
$('#findBlackList').on('click', async () => {
  const email = $('#searchEmail').val();
  if (!email) {
    alert('E-mail을 입력해주세요');
    return;
  }
  const searchedUser = $('#searched-user');
  $(searchedUser).html('');
  try {
    const response = await axios.get(
      `http://localhost:3000/user/me/searchEmail/?email=${email}`,
      {
        headers: {
          Authorization: adminToken,
        },
      },
    );
    const user = response.data.data;
    const userEmail = user.email;
    const userId = user.id;

    const temp = `<div id=${userId}><img  class="rounded-circle" src=${
      user.imgUrl ? user.imgUrl : 'assets/img/avatar/avatar-1.png'
    } style="width:50px; margin-right:10px"><span>${
      user.name
    }(${userEmail})</span></div> <br/> `;
    $(searchedUser).html(temp);

    $('#createBlackList').on('click', async () => {
      const email = $('#searchEmail').val();
      const description = $('#description').val();
      if (!description) {
        alert('신고 사유를 입력해주세요');
        return;
      }
      const data = { email, description };
      try {
        await axios.post(`http://localhost:3000/blacklist`, data, {
          headers: { Authorization: adminToken },
        });
        alert(`${user.name}(${user.email})님을 블랙리스트에 등록했습니다.`);
        window.location.reload();
      } catch (error) {
        alert(error.response.data.message);
      }
    });
  } catch (error) {
    alert(error.response.data.message);
  }
});

// 이메일로 블랙리스트 조회 (블랙리스트만 조회가능) & 강제 탈퇴
$('#findwithdrawal').on('click', async () => {
  const email = $('#withdrawalEmail').val();
  if (!email) {
    alert('E-mail을 입력해주세요');
    return;
  }
  const withdrawUser = $('searched-withdraw-user');
  $(withdrawUser).html('');
  try {
    const response = await axios.get(
      `http://localhost:3000/blacklist/detail/?email=${email}`,
      {
        headers: {
          Authorization: adminToken,
        },
      },
    );
    console.log('response', response);
    const user = response.data.data;
    const userEmail = user.email;
    const userId = user.id;

    const userInfoHTML = `
    <div id=${userId}>
      <span>Email: ${userEmail}</span><br />
      <span>User ID: ${userId}</span><br />
      <span>Created At: ${user.createdAt}</span>
    </div> <br/>`;
    $(withdrawUser).html(userInfoHTML);

    $('#deleteUser').on('click', async () => {
      const email = $('#searchEmail').val();
      const description = $('#withdrawaldescription').val();
      if (!description) {
        alert('해당 회원의 계정삭제 사유를 입력해주세요');
        return;
      }
      const data = { email, description };
      try {
        await axios.delete(`http://localhost:3000/blacklist/withdraw`, data, {
          headers: { Authorization: adminToken },
        });
        alert(`${user.email} 해당 계정을 OutBody 서비스에서 삭제했습니다.`);
        window.location.reload();
      } catch (error) {
        alert(error);
      }
    });
  } catch (error) {
    alert(error);
  }
});

$(document).ready(function () {
  normalUserPage(1, 10);
  blacklistPage(1, 10);
  recordPage(1, 10);
});

('use strict');
let nowPage = 1;
let orderList = 'normal';
let totalPages = 0;

// 일반유저 전체조회 (페이지네이션)
async function normalUserPage(page, pageSize) {
  const normalTable = $('#normal-table');
  const normalPagenationTag = $('#normal-pagenation');
  const normalPrevButton = `<li id="prev_button" class="page-item"><a class="page-link">◀</a></li>`;
  const normalNextButton = `<li id="next_button" class="page-item"><a class="page-link">▶</a></li>`;
  let pageNumbers = '';
  let pageNumbersHtml = '';
  let totalUserHtml = '';

  orderList = 'normal';
  const data = await getNormalUsersdata(page, pageSize);

  const totalUsers = data.data.pageinatedUsers;
  totalPages = data.data.totalPages;

  for (let i = 1; i <= data.data.totalPages; i++) {
    pageNumbers += `<li class="page-item page_number">
    <a class="page-link">${i}</a>
  </li>`;
  }

  let num = 1;
  let totalTemp = '';
  for (user of totalUsers) {
    const temp = `<tr>
 <th scope="row">${num}</th>
 <td >${user.id}</td>
 <td>${user.name}</td>
 <td>${user.birthday}</td>
 <td>${user.email}</td>
 <td>${user.gender}</td>
 <td>${user.point}</td>
 <td>${user.createdAt}</td>
</tr> `;
    totalTemp += temp;
    num++;
  }

  pageNumbersHtml = normalPrevButton + pageNumbers + normalNextButton;
  normalTable.html(totalTemp);
  normalPagenationTag.html(
    `<ul class="pagination justify-content-center">${pageNumbersHtml}</ul>`,
  );
  const prevBtn = $('#prev_button');
  const nextBtn = $('#next_button');
  const pages = $('.page_number');

  $(prevBtn).click(async () => {
    if (orderList === 'normal') {
      if (nowPage > 1) {
        $(pages).find('.page-link').css('background-color', '');
        $(pages).find('.page-link').css('color', '');

        try {
          const { data } = await getNormalUsersdata(nowPage - 1, 10);
          const normalUsers = data.pageinatedUsers;
          setNormalUserList(normalUsers);
          nowPage -= 1;
          totalUserHtml = '';

          $(pages)
            .eq(nowPage - 1)
            .find('.page-link')
            .css('background-color', 'blue');
          $(pages)
            .eq(nowPage - 1)
            .find('.page-link')
            .css('color', 'white');
        } catch (error) {
          console.log('Error Message', error.response.data.message);
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
          const { data } = await getNormalUsersdata(nowPage + 1, 10);
          const normalUsers = data.pageinatedUsers;
          setNormalUserList(normalUsers);
          nowPage += 1;
          totalUserHtml = '';

          $(pages)
            .eq(nowPage - 1)
            .find('.page-link')
            .css('background-color', 'blue');
          $(pages)
            .eq(nowPage - 1)
            .find('.page-link')
            .css('color', 'white');
        } catch (error) {
          console.log('Error Message', error.response.data.message);
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
          const pageNumber = parseInt($(page).find('.page-link').text());
          const { data } = await getNormalUsersdata(pageNumber, pageSize);
          const normalUsers = data.pageinatedUsers;
          setNormalUserList(normalUsers);

          $(page).find('.page-link').css('background-color', 'blue');
          $(page).find('.page-link').css('color', 'white');
          nowPage = pageNumber;

          totalUserHtml = '';
        } catch (error) {
          console.error('Error message:', error.response.data.message);
        }
      }
    });
  });
}
async function getNormalUsersdata(page, pageSize) {
  const data = await axios.get(
    `http://localhost:3000/user/allusers/?page=${page}&pageSize=${pageSize}`,
    {
      headers: {
        Authorization: adminToken,
      },
    },
  );
  console.log('data', data);
  orderList = 'normal';
  return data.data;
}

// 블랙리스트 전체조회 (페이지네이션)
async function blacklistPage(page, pageSize) {
  const blackTable = $('#black-table');
  const blackPagenationTag = $('#blacklist-pagenation');
  const blackPrevButton = `<li id="prev_button" class="page-item"><a class="page-link">◀</a></li>`;
  const blackNextButton = `<li id="next_button" class="page-item"><a class="page-link">▶</a></li>`;
  let pageNumbers = '';
  let pageNumbersHtml = '';
  let totalUserHtml = '';

  orderList = 'normal';
  const data = await getBlackListdata(page, pageSize);
  const blackusers = data.data.pageinatedBlacklist;
  totalPages = data.data.totalPages;

  for (let i = 1; i <= data.data.totalPages; i++) {
    pageNumbers += `<li class="page-item page_number">
    <a class="page-link">${i}</a>
  </li>`;
  }

  let num = 1;
  let totalTemp = '';
  for (user of blackusers) {
    const temp = `<tr>
 <th scope="row">${num}</th>
 <td>${user.id}</td>
 <td>${user.name}</td>
 <td>${user.birthday}</td>
 <td>${user.email}</td>
 <td>${user.gender}</td>
 <td>${user.point}</td>
 <td>${user.createdAt}</td>
</tr> `;
    totalTemp += temp;
    num++;
  }
  pageNumbersHtml = blackPrevButton + pageNumbers + blackNextButton;
  blackTable.html(totalTemp);
  blackPagenationTag.html(
    `<ul class="pagination justify-content-center">${pageNumbersHtml}</ul>`,
  );
  const prevBtn = $('#prev_button');
  const nextBtn = $('#next_button');
  const pages = $('.page_number');

  $(prevBtn).click(async () => {
    if (orderList === 'normal') {
      if (nowPage > 1) {
        $(pages).find('.page-link').css('background-color', '');
        $(pages).find('.page-link').css('color', '');

        try {
          const { data } = await getBlackListdata(nowPage - 1, 10);
          const blackUsers = data.pageinatedUsers;
          setBlackUserList(blackUsers);
          nowPage -= 1;
          totalUserHtml = '';

          $(pages)
            .eq(nowPage - 1)
            .find('.page-link')
            .css('background-color', 'blue');
          $(pages)
            .eq(nowPage - 1)
            .find('.page-link')
            .css('color', 'white');
        } catch (error) {
          console.log('Error Message', error.response.data.message);
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
          const { data } = await getBlackListdata(nowPage + 1, 10);
          const blackUsers = data.pageinatedUsers;
          setBlackUserList(blackUsers);
          nowPage += 1;
          totalUserHtml = '';

          $(pages)
            .eq(nowPage - 1)
            .find('.page-link')
            .css('background-color', 'blue');
          $(pages)
            .eq(nowPage - 1)
            .find('.page-link')
            .css('color', 'white');
        } catch (error) {
          console.log('Error Message', error.response.data.message);
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
          const pageNumber = parseInt($(page).find('.page-link').text());
          const { data } = await getBlackListdata(pageNumber, pageSize);
          const blackUsers = data.pageinatedUsers;
          setBlackUserList(blackUsers);

          $(page).find('.page-link').css('background-color', 'blue');
          $(page).find('.page-link').css('color', 'white');
          nowPage = pageNumber;

          totalUserHtml = '';
        } catch (error) {
          console.error('Error message:', error.response.data.message);
        }
      }
    });
  });
}
async function getBlackListdata(page, pageSize) {
  const data = await axios.get(
    `http://localhost:3000/blacklist?page=${page}&pageSize=${pageSize}`,
    {
      headers: {
        Authorization: adminToken,
      },
    },
  );
  orderList = 'normal';
  return data.data;
}

// 신고기록 목록 조회 (페이지네이션)
async function recordPage(page, pageSize) {
  await axios
    .get(`http://localhost:3000/report?page=${page}&pageSize=${pageSize}`, {
      headers: {
        Authorization: adminToken,
      },
    })
    .then((response) => {
      console.log(response.data.data);

      const reportTable = document.querySelector('#report-table');
      reportTable.innerHTML = `<tr>
      <th>Id</th>
      <th>description</th>

      <th></th>
    </tr>`;

      reportTable.innerHTML += response.data.data
        .map((report) => {
          return `<tr id="${report.id}">
      <td>${report.description}</td>

      <a href="#" id="${report.id}">
      <button class="btn btn-primary" style="border-radius: 15px;">
      블랙리스트 추가
      </button>
      </a>
      </tr>`;
        })
        .join('');
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
}
