'use strict';

// Authentication service for user variables
angular.module('users').service('Authentication', [function () {

    var _this = this;

    this.user = window.user;

    this.setUser = function(user) {
        _this.user = user;
    };

    this.removeUser = function() {
        _this.user = undefined;
    };
}]);