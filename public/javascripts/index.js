var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
  $scope.click = function() {
    $http.get("/ex")
      .then(function(response) {
        console.log('dd')
      });
  };
});
//pageList 너비, 높이 설정
function setPageList() {
  //$('.tabList').top($('.headerBar').height());
}

function hoversidebar(){
  $('.right.demo.sidebar').hover(
    function() {
      console.log('hover')
      if($('.pageList').hasClass('hidden')){
        $('.pageList')
          .transition('fade in');
      }
    },
    function() {

    }
  );

  $('.pageList').hover(
    function() {

    },
    function() {
      if(!$('.right.demo.sidebar').is(':hover')){
        $('.pageList')
          .transition('fade out');
      }
    }
  );
}

$(document).ready(function() {
  setPageList();

});
