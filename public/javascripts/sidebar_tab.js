var colorArray = ["red", "orange", "yellow", "olive", "green", "teal", "blue", "violet", "purple", "pink", "brown", "grey", "white"]

function Sidebar(){

}
// 사이드바 세팅
Sidebar.prototype.setSidebar = function(){
  $('.right.demo.sidebar')
    .sidebar({
      dimPage: false,
      transition: 'overlay'
    });
  $('.right.demo.sidebar').first()
    .sidebar('attach events', '.open.button', 'show');
  $('.open.button')
    .removeClass('disabled');
}
// 사이드바에서 탭 회차 가져오기
Sidebar.prototype.getTabs = function(){
  var beforeTime = 0; //  이전 회차 생성시간
  var samePageTimeCnt = 1; //  생성시간이 같은 페이지 개수
  var tapNum=0;
  //$('.open.button').unbind('click');
  $.ajax({
    type: "GET",
    url: "http://52.14.97.63:3000/api/d",
    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
    cache: false,
    datatype: "json", // expecting JSON to be returned
    success: function(result) {
      var pages = JSON.parse(result);
      console.log(pages);
      $('.tabList').empty();
      for (var i = 0; i < pages.length; i++) {
        var page = pages[i]._source;
        console.log(page.PageTitle)
        if (page.DateTime != beforeTime) {
          //  같은 회차 페이지수 초기화
          samePageTimeCnt = 1;
          beforeTime = page.DateTime; //생성시간을 이전 회차 생성시간에 저장
          $('.tabList').append('<div class="tabListItem" data-date = "'+page.DateTime+'"> <a class="item tabItem"><i class="'+colorArray[tapNum%13]+' paw icon"></i>'+(tapNum+1)+'</a><a class="ui item pageListItem transition hidden"></a></div>')
          tapNum++;
          console.log(beforeTime)
        } else { //  이전회차의 생성시간과 같으면
          samePageTimeCnt++; //같은 회차 페이지수 증가

        }
      }
    },
    error: function(error) {
      console.log('track 데이터 가져오기 실패')
    }
  }).done(function() {
    $(".tabListItem").on('click', function(){
      var date = $(this).data("date");
      console.log(date);
      $('.ui.modal').empty();
      $('.ui.modal').append(date);
      $('.ui.modal')
        .modal('show')
      ;
    });
  });
}

$(document).ready(function() {
  var rightSidebar = new Sidebar();
  rightSidebar.setSidebar();
  // 탭 저장 숫자 버튼 누르면
  $(".open.button").on('click', function() {
    rightSidebar.getTabs();
  });
});
