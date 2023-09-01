$(document).ready(function () {
  rankPage();
});

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImlhdCI6MTY5MzUzMTQzOCwiZXhwIjoxNjkzNTM4NjM4fQ.bjAz9dNWEbS6BpBAVtwjn648O04FFzr2Owr8LfWnmUI';

async function rankPage() {
  // 초기 페이지 설정
  let currentPage = 1;
  const pageSize = 10; // 한 페이지당 보여줄 아이템 수

  // 전체랭킹 페이지 이동 버튼 클릭 이벤트 핸들러
  $('#total-prev-btn').on('click', function () {
    if (currentPage > 1) {
      currentPage--;
      fetchTotalRank(currentPage); // 전체랭킹 조회 호출
    }
  });

  $('#total-next-btn').on('click', function () {
    currentPage++;
    fetchTotalRank(currentPage);
  });

  // 친구랭킹 페이지 이동 버튼 클릭 이벤트 핸들러
  $('#friend-prev-btn').on('click', function () {
    if (currentPage > 1) {
      currentPage--;
      fetchFriendRank(currentPage); // 친구랭킹 조회 호출
    }
  });

  $('#friend-next-btn').on('click', function () {
    currentPage++;
    fetchFriendRank(currentPage);
  });

  // 전체랭킹 조회
  async function fetchTotalRank(page) {
    try {
      const response = await axios.get(
        `http://localhost:3000/rank/total?page=${page}&pageSize=${pageSize}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const userData = response.data.paginationTotalRanks; // paginationTotalRanks 이게 백엔드에 있는데, 조회가 안됨!
      populateTable('#total-rank-table', userData, (page - 1) * pageSize);
    } catch (error) {
      alert('Error message:', error.response.data.message);
    }
  }

  // 친구랭킹 조회
  async function fetchFriendRank(page) {
    try {
      const response = await axios.get(
        `http://localhost:3000/rank/followings?page=${page}&pageSize=${pageSize}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const friendRankings = response.data.paginationFollowerRanks;
      populateTable(
        '#friend-rank-table',
        friendRankings,
        (page - 1) * pageSize,
      );
    } catch (error) {
      alert('Error message:', error.response.data.message);
    }
  }

  function populateTable(tableId, data) {
    const table = $(tableId);
    table.empty(); // 기존 행 삭제

    data.forEach(function (user, index) {
      const level =
        user.point >= 15000
          ? 'Gold'
          : user.point >= 12000
          ? 'Silver'
          : user.point >= 9000
          ? 'Bronze'
          : 'Iron';

      const row = `
        <tr>
          <td>${(currentPage - 1) * pageSize + index + 1}</td>
          <td>${user.name}</td>
          <td>${user.createdAt}</td>
          <td>
            <div class="level">${level}</div>
          </td>
          <td>${user.point}</td>
        </tr>
      `;

      table.append(row);
    });
  }

  // 초기 페이지 로드 시 데이터 조회
  fetchTotalRank(currentPage);
  fetchFriendRank(currentPage);
}
