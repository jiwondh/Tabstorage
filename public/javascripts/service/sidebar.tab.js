var colorArray = ["red", "orange", "yellow", "olive", "green", "teal", "blue", "violet", "purple", "pink", "brown", "grey", "white"]

function Sidebar() {

}
// 사이드바 세팅
Sidebar.prototype.setSidebar = function() {
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


/* 사이드바에서 탭 회차 가져오기 */
Sidebar.prototype.getTabs = function() {

  var beforeTime = 0,       // 이전 회차 생성시간
      sameTabTimeCnt = 1,   // 생성시간이 같은 페이지 개수
      tapNum = 0;           // 생성시간 단위 묶음 개수

  $.ajax({
    type: "GET",
    url: "http://52.14.97.63:3000/api/d",
    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
    cache: false,
    datatype: "json", // expecting JSON to be returned
    success: function(result) {

      var allTabs = JSON.parse(result); // 저장된 모든 탭
      $('.tabList').empty();

      for (var i = 0; i < allTabs.length; i++) {

        var tab = allTabs[i]._source;     // 각각의 탭
        var TAB_DATE_TIME = tab.DateTime; // 각각의 탭이 저장된 시간

        if (TAB_DATE_TIME != beforeTime) {

          var $newTabListItem = $("<div class='tabListItem' data-date = '"
                                + TAB_DATE_TIME + "'></div>");
              $newTabItem = $("<a class='item tabItem'>" + (tapNum + 1) + "</a>");
              $newIcon =  $("<i class='"+ colorArray[tapNum % 13]
                          + " paw icon'><i>");

          $newTabItem.prepend($newIcon);
          $newTabListItem.append($newTabItem);
          $('.tabList').append($newTabListItem);

          sameTabTimeCnt = 1;        // 같은 회차 페이지수 초기화
          beforeTime = TAB_DATE_TIME; // 생성시간을 이전 회차 생성시간에 저장
          tapNum++;                   // 생성 시간 단위 묶음 개수 증가

        } else { //  이전회차의 생성시간과 같으면

          sameTabTimeCnt++; //같은 회차 페이지수 증가

        }
      }// for
    },
    error: function(error) {
      console.log('tab 데이터 가져오기 실패')
    }
  }).done(function() {

    var $newModal = $("<div class='ui active inverted dimmer'></div>");
        $newLoader = $("<div class='ui text loader'>Loading</div>");

    $newModal.append($newLoader);

    $(".tabListItem").on('click', function() {

      var TAB_LIST_ITEM_DATE = $(this).data("date");

      $('.ui.modal').empty().append($newModal);
      $('.ui.modal').modal('show');

      $.ajax({
        type: "GET",
        url: "http://52.14.97.63:3000/api/datetime?q=" + TAB_LIST_ITEM_DATE,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        cache: false,
        datatype: "json", // expecting JSON to be returned
        success: function(result) {

          var allTabs = JSON.parse(result);
          $('.ui.modal').empty();

          for (var i = 0; i < allTabs.length; i++) {

            var tab = allTabs[i]._source;
            $('.ui.modal').append(tab.PageTitle);

          }
        },
        error: function(error) {

          console.log('track 데이터 가져오기 실패')

        }
      }).done(function() {

      });

    });
  }); //done
}

$(document).ready(function() {

  var rightSidebar = new Sidebar();
  rightSidebar.setSidebar();

  // 탭 저장 숫자 버튼 누르면
  $(".open.button").on('click', function() {

    rightSidebar.getTabs();
  });
});
