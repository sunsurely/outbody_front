// 1. 블랙리스트 생성모달
document.getElementById('addBlackList').onclick = function (e) {
  e.preventDefault();
  $('#blackListUseradd').modal('show');
};
document.getElementById('cancelBlackList').onclick = function () {
  $('#blackListUseradd').modal('hide');
};

addBlackList;
