//test suite
describe(" ng-trello app test suite", function() {
    var element;
    var $scope;
    
    //inject the app
    beforeEach(module("trelloApp"));
    
    //inject dependencies
    beforeEach(inject(function(_$controller_, _$rootScope_) {
        var $controller = _$controller_;
        var $rootScope = _$rootScope_;
        
        $scope = $rootScope.$new();
        
        //lists data
        $scope.lists = {
                        firstlist: {name:"firstlist",tasks:["firstlist-task1","firstlist-task2"]},
                        secondlist:{name:"secondlist",tasks:["secondlist-task1","secondlist-task2"]},
                        thirdlist:{name:"thirdlist",tasks:["thirdlist-task1"]}
                       };
        
        $controller('TaskController', {'$rootScope' : $rootScope, '$scope': $scope});
        
        $scope.getObjectLength = function(obj) {
            var len = 0;
            for (var o in obj) {
                len++;
            }
            return len;
        }
        
        
    }));

    it(' addlist call with tasklistname should add the list in lists', function() {
        
        var listname = "mylist";
        
        $scope.tasklistname = listname;
        
        $scope.addlist();
        
        expect($scope.lists[listname]).toBeDefined();
    });
    
    it(' addtask should add the task in the given list', function() {
        
        $scope.tasklistname = "mylist";
        
        var task = "this is a test task";
        
        $scope.addTask("mylist", task);
        
        expect($scope.lists[$scope.tasklistname].tasks.indexOf(task)).toBeGreaterThan(-1);
    });
    
    it(' edittask should edit the task in the given list', function() {
        
        $scope.tasklistname = "mylist";
        
        var task = "this is a test task";
        var editedtask = "this is a edited task"
        
        $scope.editTask("mylist", editedtask, 0);
        
        expect($scope.lists[$scope.tasklistname].tasks.indexOf(task)).toBe(-1);
        expect($scope.lists[$scope.tasklistname].tasks.indexOf(editedtask)).toBeGreaterThan(-1);
    });
    
    it(' edittask should edit the task in the given list', function() {
        
        $scope.criteria = "secondlist-";
        
        var filteredlists = $scope.getFilteredLists();
        
        expect($scope.getObjectLength(filteredlists)).toBe(1);
    });
    
});