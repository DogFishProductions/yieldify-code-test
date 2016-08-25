'use strict';

describe('Service: BallsService', function () {
  var defaultConfig = {
    gravity: 0.1,
    elasticity: 0.5,
    friction: 0.05,
    radius: 5,
    maxSpeed: 10,
    minSpeed: 1,
    maxAngle: 360,
    minAngle: 0
  }

  // instantiate service
  var $balls, $utils,
    init = function () {
      inject(function (_BallsService_, _UtilitiesService_) {
        $balls = _BallsService_;
        $utils = _UtilitiesService_;
      });
    };

  // load the service's module
  beforeEach(module('yieldifyCodeApp'));

  it('should exist', function () {
    init();

    expect(!!$balls).toBe(true);
    expect(!!$utils).toBe(true);
  });

  it('should create a ball using the default configuration if no specific config file supplied', function () {
    var x = 5, y = 10;
    $balls.createBall({ x: x, y: y });
    var list = $balls.balls();
    var ball = list[0];
    expect($balls.ballsInPlay()).toBe(1);
    expect(ball.x).toEqual(x);
    expect(ball.y).toEqual(y);
    expect(ball.radius).toEqual(defaultConfig.radius);
    expect(ball.elasticity).toEqual(defaultConfig.elasticity);
    expect(ball.bouncing).toBe(true);
    expect(ball.radians).not.toBeLessThan(0);
    expect(ball.radians).not.toBeGreaterThan(2 * Math.PI);
    // not exactly definitive but it's the best we can do
    expect(ball.speed).not.toBeLessThan(defaultConfig.minSpeed);
    expect(ball.speed).not.toBeGreaterThan(defaultConfig.maxSpeed);
  });

  it('should create a ball using the supplied configuration', function () {
    var newConfig = {
      gravity: 0.7,
      elasticity: 0.9,
      friction: 0.3,
      radius: 7,
      maxSpeed: 12,
      minSpeed: 11,
      maxAngle: 180,
      minAngle: 90
    }

    module(function (BallsServiceProvider) {
      BallsServiceProvider.setConfig(newConfig);
    });

    init();

    var x = 20, y = 6;
    $balls.createBall({ x: x, y: y });
    var list = $balls.balls();
    var ball = list[0];
    expect($balls.ballsInPlay()).toBe(1);
    expect(ball.x).toEqual(x);
    expect(ball.y).toEqual(y);
    expect(ball.radius).toEqual(newConfig.radius);
    expect(ball.elasticity).toEqual(newConfig.elasticity);
    expect(ball.bouncing).toBe(true);
    expect(ball.radians).not.toBeLessThan(Math.PI / 2);
    expect(ball.radians).not.toBeGreaterThan(Math.PI);
    // not exactly definitive but it's the best we can do
    expect(ball.speed).not.toBeLessThan(newConfig.minSpeed);
    expect(ball.speed).not.toBeGreaterThan(newConfig.maxSpeed);
  });

it('should limit the elasticity coefficient to a value of 1', function () {
    var newConfig = {
      elasticity: 10
    }

    module(function (BallsServiceProvider) {
      BallsServiceProvider.setConfig(newConfig);
    });

    init();

    var x = 20, y = 6;
    $balls.createBall({ x: x, y: y });
    var list = $balls.balls();
    var ball = list[0];
    expect($balls.ballsInPlay()).toBe(1);
    expect(ball.elasticity).toEqual(1);
  });

  it('should remove a ball from play if its horizontal position is less than zero', function () {
    init();

    var x = -20, y = 6;
    $balls.createBall({ x: x, y: y });
    var list = $balls.balls();
    var ball = list[0];
    expect($balls.ballsInPlay()).toBe(1);
    $balls.removeBallsOutsideLimits(10);
    expect($balls.ballsInPlay()).toBe(0);
  });

  it('should remove a ball from play if its horizontal position is greater than the width of the page', function () {
    init();

    var x = 40, y = 40;
    $balls.createBall({ x: x, y: y });
    var list = $balls.balls();
    var ball = list[0];
    expect($balls.ballsInPlay()).toBe(1);
    $balls.removeBallsOutsideLimits(20);
    expect($balls.ballsInPlay()).toBe(0);
  });

  it('should mark a ball as not bouncing if its vertical velocity is close to zero and vertical position is close to the page height', function () {
    init();

    var x = 10, y = 94.1;
    $balls.createBall({ x: x, y: y });
    var list = $balls.balls();
    var ball = list[0];
    ball.velocityY = -0.1;
    expect($balls.ballsInPlay()).toBe(1);
    expect(ball.bouncing).toBe(true);
    $balls.calculatePositions(100);
    expect(ball.bouncing).toBe(false);
    expect(ball.velocityY).toBe(0);
    expect(ball.y).toBe(100 - ball.radius);
  });

  it('should reset the vertical position to the page height\
     (minus ball radius) if the ball is not bouncing and the page has been resized', function () {
    init();

    var x = 10, y = 94.1;
    $balls.createBall({ x: x, y: y });
    var list = $balls.balls();
    var ball = list[0];
    ball.velocityY = -0.1;
    expect($balls.ballsInPlay()).toBe(1);
    expect(ball.bouncing).toBe(true);
    $balls.calculatePositions(100);
    expect(ball.bouncing).toBe(false);
    expect(ball.velocityY).toBe(0);
    expect(ball.y).toBe(100 - ball.radius);
    $balls.updateBallsNotBouncing(200);
    expect(ball.velocityY).toBe(0);
    expect(ball.y).toBe(200 - ball.radius);
  });

});
