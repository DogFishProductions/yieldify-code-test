'use strict';

/**
 * @ngdoc service
 * @name yieldifyCodeApp.UtilitiesService
 * @description
 * # UtilitiesService
 * Provides common methods for other services/controllers etc.
 */
angular.module('yieldifyCodeApp')
  .service('UtilitiesService', function() {
    var self = this;

    /** @function isNumber
     *
     *  @summary  Checks whether a supplied parameter is a number or not.
     *
     *  @param    {number}  n - The value to be checked.
     *
     *  @since 1.0.0
     *
     *  @returns  {boolean}  'true' if value is a number, 'false' otherwise.
     */
    self.isNumber = function(n) {
      return !Array.isArray(n) && !isNaN(parseFloat(n)) && isFinite(n);
    }

    /** @function randomConstrainedValue
     *
     *  @summary  Creates a random value between min and max.
     *
     *  If the parameters are not provided or are not numbers they will set to default values.
     *  If the min value is greater than or equal to the max number it will be set to the max number - 1.
     *
     *
     *  @param    {number}  min - The minimum value of the returned number.
     *  @param    {number}  max - The maximum value of the returned number.
     *
     *  @since 1.0.0
     *
     *  @returns  {number}  A random number between min and max.
     */
     self.randomConstrainedValue = function(min, max) {
      // set default values if necessary
      var minimum = (self.isNumber(min) ? min : 0);
      var maximum = (self.isNumber(max) ? max : 100);
      if (minimum >= maximum) {
        minimum = maximum - 1;
      }
      return (Math.random() * (maximum - minimum)) + minimum;
    }
  });
