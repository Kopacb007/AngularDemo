var app = angular.module('itemlistApp', ['ngRoute', 'ngAnimate', 'itemlistCtrlModule']);

app.config(function ($routeProvider) { 

    $routeProvider
    
    .when("/", {
        templateUrl: "views/home.html"
    })

    .when("/itemlist", {
        templateUrl: "views/itemlistview.html",
        controller: "ItemlistCtrl"
    })

    .when("/itemlist/add", {
        templateUrl: "views/add.html",
        controller: "ItemlistCtrl"
    })

    .when("/itemlist/edit/:id", {
        templateUrl: "views/edit.html",
        controller: "ItemlistCtrl"
    })

    .otherwise({
        redirectTo: "/"
    });

 });
 
app.service("ItemsService", function($http){

    var itemsService = {};

    itemsService.myItems = [];

    $http.get("../data/server-data.json")
        .success(function(data){
            itemsService.myItems = data;
        })
        .error(function (data, status) { 
            alert("Things went wrong!")
        });

    itemsService.save = function(entry) {
        var updateItem = itemsService.findById(entry.id);

        if(updateItem) {

            $http.post("data/updated-item.json", entry)
                .then( 
                    function successCallback(response){
                        if(response.data.status == 1) {
                            updateItem.completed = entry.completed;
                            updateItem.itemName = entry.itemName;
                            updateItem.data = entry.data;
                        }
                    },
                    function errorCallback(response){  

                    });
        }else {

            // Server side
            $http.post("data/added-item.json", entry)
                .success(function(data){
                    console.log(data);
                    entry.id = data.newId;
                })
                .error(function(data, status){

                });

            // Client side
            // entry.id = itemsService.getNewId();

            itemsService.myItems.push(entry);
        }   
    };

    itemsService.markCompleted = function(entry) {
        entry.completed = !entry.completed;
    };

    itemsService.removeItem = function(entry) {

        $http.post("data/delete-item.json", { id: entry.id })
                .then( 
                    function successCallback(response){
                        if(response.data.status == 1){
                            var index = itemsService.myItems.indexOf(entry);
                            itemsService.myItems.splice(index, 1);
                        }
                    },
                    function errorCallback(response){  

                    });
                    
    };

    itemsService.findById = function(id) {
        return _.find(itemsService.myItems, function(obj){ return obj.id == id; })
    };

    itemsService.getNewId = function() {
        if (itemsService.newId) {
            itemsService.newId++;
            return itemsService.newId;
        }else {
            // This is from underscorejs lib
            var maxId = _.max(itemsService.myItems, function(entry){ return entry.id; });
            itemsService.newId = maxId.id + 1;
            return itemsService.newId;
        }
    };

    return itemsService;

});
app.directive("koItem", function(){
    return {
        restrict: "E",
        templateUrl: "views/item.html"
    };
});