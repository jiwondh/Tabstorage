var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
  $scope.click = function() {
    $http.get("/ex")
      .then(function(response) {
        console.log('dd')
      });
  };
});
$(document).ready(function() {

  $('.right.demo.sidebar')
    .sidebar({
      dimPage: false,
      transition: 'overlay'
    });
  $('.right.demo.sidebar').first()
    .sidebar('attach events', '.open.button', 'show');
  $('.open.button')
    .removeClass('disabled');

});
