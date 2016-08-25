'use strict';

/**
 * @ngdoc service
 * @name yieldifyCodeApp.DOMService
 * @description
 * # DOMService
 * Provides access to HTML elements.  Allows for service to be mocked in testing.
 *
 * @since 1.0.0
 */
angular.module('yieldifyCodeApp')
  .service('DOMService', function() {
    var self = this;
    var theCanvas = document.getElementById('canvasOne');
    var context = theCanvas.getContext('2d');
    self.getCanvas = function() {
      return theCanvas;
    }
    self.getContext = function() {
      return context;
    }
  });
