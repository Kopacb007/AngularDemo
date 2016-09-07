angular.module('itemlistCtrlModule', [])

.controller('ItemlistCtrl', ['$scope','$routeParams', '$location', 'ItemsService' , 
                    function($scope, $routeParams, $location, ItemsService){

    
    $scope.groceryItems = ItemsService.myItems;

    if(!$routeParams.id) {

        var fullDate = new Date();
        var year = fullDate.getFullYear().toString();
        var month = (fullDate.getMonth() + 1).toString();
        var day = fullDate.getDate().toString();

        $scope.newItem = {
            id: undefined, 
            completed: false,
            itemName: undefined,  
            data:  year + "/" + month + "/" + day
        };
    }else {
        $scope.newItem = _.clone(ItemsService.findById(parseInt($routeParams.id)));
    }

    $scope.save = function(){
        ItemsService.save($scope.newItem);
        $location.path("/itemlist");
    };

    $scope.removeItem = function(item){
        ItemsService.removeItem(item);
    };

    $scope.markCompleted = function(item){
        ItemsService.markCompleted(item);
    };

    $scope.$watch( function () { return ItemsService.myItems; }, function (myItems) { 
        $scope.groceryItems = myItems;
     });

    console.log($scope.groceryItems);
}]);