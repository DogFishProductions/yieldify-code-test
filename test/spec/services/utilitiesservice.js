'use strict';

describe('Service: UtilitiesService', function () {

  // load the service's module
  beforeEach(module('yieldifyCodeApp'));

  // instantiate service
  var UtilitiesService;
  beforeEach(inject(function (_UtilitiesService_) {
    UtilitiesService = _UtilitiesService_;
  }));

  it('should return true when testing whether a positive integer is a number', function () {
    expect(UtilitiesService.isNumber(1)).toBe(true);
  });

  it('should return true when testing whether a negative integer is a number', function () {
    expect(UtilitiesService.isNumber(-1)).toBe(true);
  });

  it('should return true when testing whether a positive float is a number', function () {
    expect(UtilitiesService.isNumber(1.0)).toBe(true);
  });

  it('should return true when testing whether a negative float is a number', function () {
    expect(UtilitiesService.isNumber(-1.0)).toBe(true);
  });

  it('should return false when testing whether a string character is a number', function () {
    expect(UtilitiesService.isNumber('a')).toBe(false);
  });

  it('should return true when testing whether a string digit is a number', function () {
    expect(UtilitiesService.isNumber('1')).toBe(true);
  });

  it('should return false when testing whether an array is a number', function () {
    expect(UtilitiesService.isNumber([1])).toBe(false);
  });

  it('should return false when testing whether undefined is a number', function () {
    expect(UtilitiesService.isNumber(undefined)).toBe(false);
  });

  it('should return false when testing whether null is a number', function () {
    expect(UtilitiesService.isNumber(null)).toBe(false);
  });

  // randomConstrainedValue can never be tested for sure since we're returning a random number, right?
  // However, looping 100 times gives us some reassurance.
  it('should return a random number within the supplied min and max constraints', function () {
    for (var i = 0; i < 99; i++) {
      var min = 1;
      var max = 5;
      var result = UtilitiesService.randomConstrainedValue(min, max);
      expect(result).not.toBeLessThan(min);
      expect(result).not.toBeGreaterThan(max);
    }
  });

  it('should return a random number within the supplied min and default max constraints\
      when the supplied max constraint is not a number', function () {
    for (var i = 0; i < 99; i++) {
      var min = 1;
      var default_max = 100;
      var invalid_max = 'five';
      var result = UtilitiesService.randomConstrainedValue(min, invalid_max);
      expect(result).not.toBeLessThan(min);
      expect(result).not.toBeGreaterThan(default_max);
    }
  });

  it('should return a random number within the supplied min and default max constraints\
      when no max constraint is supplied', function () {
    for (var i = 0; i < 99; i++) {
      var min = 1;
      var default_max = 100;
      var result = UtilitiesService.randomConstrainedValue(min);
      expect(result).not.toBeLessThan(min);
      expect(result).not.toBeGreaterThan(default_max);
    }
  });

  it('should return a random number within the default min and supplied max constraints\
      when the supplied min constraint is not a number', function () {
    for (var i = 0; i < 99; i++) {
      var default_min = 0;
      var invalid_min = 'five';
      var max = 5;
      var result = UtilitiesService.randomConstrainedValue(invalid_min, max);
      expect(result).not.toBeLessThan(default_min);
      expect(result).not.toBeGreaterThan(max);
    }
  });

});
