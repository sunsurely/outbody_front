$(document).ready(function () {
  rankPage();
});

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImlhdCI6MTY5MzQxMDc1NiwiZXhwIjoxNjkzNDE3OTU2fQ.aTidnbLstwJNe_qu9ekr1L7AH4f_FOWtmWt2vCkblZg';

async function rankPage() {
  // 전체랭킹 조회
  const table = $('#rank-table');
  try {
    const response = await axios.get('http://localhost:3000/rank/total', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const userData = response.data;
    populateTable(userData);
  } catch (error) {
    alert('Error message:', error.response.data.message);
  }

  function populateTable(data) {
    const table = $('#rank-table');

    data.forEach(function (user, index) {
      if (user.point >= 15000) {
        user.level = 'Gold';
      } else if (user.point >= 12000) {
        user.level = 'Silver';
      } else if (user.point >= 9000) {
        user.level = 'Bronze';
      } else {
        user.level = 'Iron';
      }

      const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${user.name}</td>
        <td>${user.createdAt}</td>
        <td>
          <div class="badge badge-success">${user.level}</div>
        </td>
        <td>${user.point}</td>
      </tr>
    `;
      table.append(row);
    });
  }

  // 친구랭킹 조회
  try {
    const response = await axios.get('http://localhost:3000/rank/followings', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const friendRankings = response.data;
    populateTable(friendRankings);
  } catch (error) {
    alert('Error message:', error.response.data.message);
  }
}

function populateTable(data) {
  const table = $('#friend-rank-table');

  data.forEach(function (user, index) {
    if (user.point >= 15000) {
      user.level = 'Gold';
    } else if (user.point >= 12000) {
      user.level = 'Silver';
    } else if (user.point >= 9000) {
      user.level = 'Bronze';
    } else {
      user.level = 'Iron';
    }

    const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${user.name}</td>
        <td>${user.createdAt}</td>
        <td>
          <div class="badge badge-success">${user.level}</div>
        </td>
        <td>${user.point}</td>
      </tr>
    `;
    table.append(row);
  });
}
