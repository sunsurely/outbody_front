// 오운완 목록 모달
document.getElementById('postlist').onclick = function (e) {
  e.preventDefault();
  $('#postlistModal').modal('show');
};
document.getElementById('backtopage').onclick = function () {
  $('#postlistModal').modal('hide');
};
