(function() {
  var user = {
    name: 'jiwon',
    age: '23',
    description: '취준생',
    showing: false
  };
  var app = angular.module('tabStorage', []);

  app.controller('UserController', function($scope, $http) {
    var self = this;
    self.info = user;
    var url = "http://52.14.97.63:3000/api/d";
    $http.get(url).success(function(response) {
      self.cnt = response.length;
    });
  });

  app.controller('TabListCtrl', function($scope, $http) {
    var self = this;
    $scope.enter = function(){
      $('.tabCnt').empty().append('<i class="asterisk loading icon"></i>');
      $('.shape')
      .shape('reset')
      .shape('set next side', '.second.side')
      .shape('flip back');
      var url = "http://52.14.97.63:3000/api/tab/length";
      $http.get(url)
      .then(function(response) {
        $('.tabCnt').empty().append(response.data);
      })
      .finally(function() {
      });
    }
    $scope.leave = function(){
      $('.shape')
      .shape('reset')
      .shape('set next side', '.first.side')
      .shape('flip back');
    }
  });
})();
