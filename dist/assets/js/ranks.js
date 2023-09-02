$(document).ready(function () {
  totalrankPage();
  friendRankPage();
});

// // 전체랭킹 페이지 이동 버튼 클릭 이벤트 핸들러
// $('#total-prev-btn').on('click', function () {
//   if (currentPage > 1) {
//     currentPage--;
//     fetchTotalRank(currentPage); // 전체랭킹 조회 호출
//   }
// });

// $('#total-next-btn').on('click', function () {
//   currentPage++;
//   fetchTotalRank(currentPage);
// });

// // 친구랭킹 페이지 이동 버튼 클릭 이벤트 핸들러
// $('#friend-prev-btn').on('click', function () {
//   if (currentPage > 1) {
//     currentPage--;
//     fetchFriendRank(currentPage); // 친구랭킹 조회 호출
//   }
// });

// $('#friend-next-btn').on('click', function () {
//   currentPage++;
//   fetchFriendRank(currentPage);
// });

const thistoken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImlhdCI6MTY5MzU2MzYwNSwiZXhwIjoxNjkzNTcwODA1fQ.0ITkltfHHFSeK5vr7LF9iU5oA9giuUBJYwuirVaq0ww';

//전체랭킹
async function totalrankPage() {
  // 초기 페이지 설정
  let currentPage = 1;
  const pageSize = 10;

  const fetchTotalRankings = (page) => {
    try {
      const { data } = axios.get(
        `http://localhost:3000/rank/total`, //?page=${page}&pageSize=${pageSize}`,
        {
          headers: { Authorization: `Bearer ${thistoken}` },
        },
      );

      $('#total-rank-table tbody').empty();
      console.log('data', data.data);
      console.log('paginationTotalRanks', data.data.paginationTotalRanks);

      paginationTotalRanks.forEach((user, index) => {
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
                    <td>${(page - 1) * pageSize + index + 1}</td>
                    <td>${user.name}</td>
                    <td>${user.createdAt}</td>
                    <td>
                        <div class="level">${level}</div>
                    </td>
                    <td>${user.point}</td>
                </tr>
            `;
        $('#total-rank-table tbody').append(row);
      });
      updatePagination(totalPages, currentPage);
    } catch (error) {
      console.error('Error fetching user rankings:', error);
    }
  };

  // 버튼업데이트
  const updatePagination = (totalPages, currentPage) => {
    $('#totalPagination').empty();

    // 현재 페이지를 중심으로 좌우로 일정 개수의 페이지 버튼을 표시. 최소값1, 양쪽 4페이지씩
    // 페이지네이션 버튼의 끝 페이지를 계산. totalPages를 넘어가면 안 되므로 totalPages와 startPage + 9 중에서 작은 값을 선택
    const startPage = Math.max(1, currentPage - 4);
    const endPage = Math.min(totalPages, startPage + 9);

    // previous버튼 추가
    if (currentPage > 1) {
      $('#totalPagination').append(`
        <li class="page-item">
            <a class="page-link" href="#" id="total-prev-btn"><i class="fas fa-chevron-left"></i></a>
        </li>
    `);
    }

    // Next버튼 추가
    if (currentPage < totalPages) {
      $('#totalPagination').append(`
        <li class="page-item">
            <a class="page-link" href="#" id="total-next-btn"><i class="fas fa-chevron-right"></i></a>
        </li>
    `);
    }

    // 숫자가 적힌 버튼 추가
    for (let i = startPage; i <= endPage; i++) {
      const liClass = i === currentPage ? 'active' : '';
      const li = `
        <li class="page-item ${liClass}">
            <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>
    `;
      $('#totalPagination').append(li);
    }

    // 페이지네이션 버튼 클릭 이벤트핸들러
    $('#totalPagination').on('click', '.page-link', function (event) {
      event.preventDefault();
      const pageClicked = parseInt($(this).data('page'));
      if (!isNaN(pageClicked) && pageClicked !== currentPage) {
        currentPage = pageClicked;
        fetchTotalRankings(currentPage);
      }
    });
  };

  //"Next", "Previous" 버튼 클릭 이벤트핸들러
  $('#totalPagination').on('click', '#total-prev-btn', function (event) {
    event.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      fetchTotalRankings(currentPage);
    }
  });

  $('#totalPagination').on('click', '#total-next-btn', function (event) {
    event.preventDefault();
    currentPage++;
    fetchTotalRankings(currentPage);
  });

  //초기페이지 로드 시 데이터 조회
  fetchTotalRankings(currentPage);
}

// 친구랭킹
async function friendRankPage() {
  $(document).ready(function () {
    const pageSize = 10;
    let currentPage = 1;

    const fetchFriendRankings = (page) => {
      axios
        .get(
          `http://localhost:3000/rank/followings?page=${page}&pageSize=${pageSize}`,
        )
        .then((response) => {
          const { totalPages, paginationFollowerRanks } = response.data;
          console.log('friendtotalPages', totalPages);
          console.log('paginationFollowerRanks', paginationFollowerRanks);

          $('#friend-rank-table tbody').empty();

          paginationFollowerRanks.forEach((user, index) => {
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
                <td>${(page - 1) * pageSize + index + 1}</td>
                <td>${user.name}</td>
                <td>${user.createdAt}</td>
                <td>
                  <div class="level">${level}</div>
                </td>
                <td>${user.point}</td>
              </tr>
            `;
            $('#friend-rank-table tbody').append(row);
          });

          updatePagination(totalPages, currentPage);
        })
        .catch((error) => {
          console.error('Error fetching friend rankings:', error);
        });
    };

    //버튼 업데이트
    const updatePagination = (totalPages, currentPage) => {
      $('#friendPagination').empty();

      // 버튼 수 계산
      const startPage = Math.max(1, currentPage - 4);
      const endPage = Math.min(totalPages, startPage + 9);

      // "Previous" 버튼
      if (currentPage > 1) {
        $('#friendPagination').append(`
          <li class="page-item">
            <a class="page-link" href="#" id="friend-prev-btn"><i class="fas fa-chevron-left"></i></a>
          </li>
        `);
      }

      // 숫자적힌 버튼 추가
      for (let i = startPage; i <= endPage; i++) {
        const liClass = i === currentPage ? 'active' : '';
        const li = `
          <li class="page-item ${liClass}">
            <a class="page-link" href="#" data-page="${i}">${i}</a>
          </li>
        `;
        $('#friendPagination').append(li);
      }

      // "Next" 버튼 추가
      if (currentPage < totalPages) {
        $('#friendPagination').append(`
          <li class="page-item">
            <a class="page-link" href="#" id="friend-next-btn"><i class="fas fa-chevron-right"></i></a>
          </li>
        `);
      }

      // 페이지네이션버튼 클릭 이벤트핸들러
      $('#friendPagination').on('click', '.page-link', function (event) {
        event.preventDefault();
        const pageClicked = parseInt($(this).data('page'));
        if (!isNaN(pageClicked) && pageClicked !== currentPage) {
          currentPage = pageClicked;
          fetchFriendRankings(currentPage);
        }
      });
    };

    $('#friendPagination').on('click', '#friend-prev-btn', function (event) {
      event.preventDefault();
      if (currentPage > 1) {
        currentPage--;
        fetchFriendRankings(currentPage);
      }
    });

    $('#friendPagination').on('click', '#friend-next-btn', function (event) {
      event.preventDefault();
      currentPage++;
      fetchFriendRankings(currentPage);
    });

    fetchFriendRankings(currentPage);
  });
}
