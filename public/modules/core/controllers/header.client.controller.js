/**
 * Created by ealvarado on 11/09/2015.
 */
'use strict';

angular.module('core').controller('HeaderController', ['$scope', function($scope) {
        $scope.isCollapsed = false;

        $scope.toggleCollapsibleMenu = function() {
            $scope.isCollapsed = !$scope.isCollapsed;
        };

        // Collapsing the menu after navigation
        $scope.$on('$stateChangeSuccess', function() {
            $scope.isCollapsed = false;
        });
    }
]);