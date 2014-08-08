(function(ng){
    'use strict';

    ng.module('trelloApp', [])

        //this service is responsible to add and retrieve items to localstorage
        .service("$localStorage", ["$window", function($window){
           
            var _localStorage = {};
            
            //save items to localstorage
            _localStorage.save = function(list){
                var tasksList = JSON.stringify(list);
                
                $window.localStorage.setItem("trelloAppTasksList", tasksList);
                
            }
            
            //retrieve items from localstorage
            _localStorage.query = function(){
                var list = $window.localStorage.getItem("trelloAppTasksList");
                
                if(list){
                    list = JSON.parse(list);
                }
                
                return list;
                
            }
            
            return _localStorage;
        }])
    
        //directive to give the proper height to the textarea elements according to the content
        .directive('autoheight', ['$timeout', function($timeout) {
            return {
                restrict: 'AE',
                link: function($scope, element) {
                    var resize = function() {
                        if(element[0].style.height < element[0].scrollHeight){
                            return element[0].style.height = "" + element[0].scrollHeight + "px";
                        }
                    };
                    element.on("blur keyup change", resize);
                    $timeout(resize, 0);
                }
            };
        }])
    
        //application task controller
        .controller("TaskController", ["$scope", "$rootScope", "$localStorage", function($scope, $rootScope, $localStorage){
           
            $scope.showControls = false;
                
            $scope.listname = "";
            
            //retrieve the lists from the localstorage at application start
            $scope.lists = $localStorage.query() || {};
           
            $scope.filteredlists = {};
            
            //show list controls
            $scope.showListAddControls = function(){
                $scope.showControls = true;
            }
            
            //hide add a list controls
            $scope.hideListAddControls = function(){
                $scope.tasklistname = "";
                $scope.showControls = false;
            }
            
            //add list handler
            $scope.addlist = function(){
                if(!$scope.tasklistname) {
                    return;
                }
                $scope.lists[$scope.tasklistname] = {name:$scope.tasklistname, tasks:[]};
                $scope.tasklistname = "";
                $scope.saveLists();
            }
            
            //edit list handler
            $scope.editList = function(list, newlistname) {
                var _list = $scope.lists[list.name];
                delete $scope.lists[list.name];
                
                $scope.lists[newlistname] = list;
                $scope.lists[newlistname].name = newlistname;
                $scope.saveLists();
            }
            
            //saves lists to localstorage
            $scope.saveLists = function() {
                $localStorage.save($scope.lists);
            }
            
            //add task handler
            $scope.addTask = function(listname, taskname){
                if(!taskname) {
                    return;
                }
                $scope.lists[listname].tasks.push(taskname);
                $scope.saveLists();
            }
            
            //edit task handler
            $scope.editTask = function(listname, edittask, index){
                $scope.lists[listname].tasks[index] = edittask;
                $scope.saveLists();
            }
            
            //gets lists filtered by the serach input box's content
            $scope.getFilteredLists = idempotentialize(function() {
                var criteria = $scope.criteria;
                var lists = $scope.lists;
                
                if(!criteria) {
                    return lists;
                }
                
                $scope.filteredlists = {};
                
                ng.forEach(lists, function(list) {
                    var tasks = list.tasks;
                    var filteredTasks = [];
                    ng.forEach(tasks, function(task) {
                        if(task.indexOf(criteria) > -1) {
                            filteredTasks.push(task);
                        }
                    });
                    if(filteredTasks.length > 0) {
                        $scope.filteredlists[list.name] = {name: list.name, tasks: filteredTasks};
                    }
                });
                return $scope.filteredlists;   
            });
            
            //this is to make sure angular doesn't run into infinite loop running digest cycles
            function idempotentialize(f){
                var previous;
                var f_idempotent = function(){
                   var ret = f();
                   if (JSON.stringify(ret)==JSON.stringify(previous))
                      ret = previous;
                   previous = ret;
                   return ret;
                }
                return f_idempotent;
            }
            
        }]);
    
})(angular);
                                   
    