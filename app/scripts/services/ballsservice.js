'use strict';

/**
 * @ngdoc service
 * @name yieldifyCodeApp.BallsService
 * @description
 * # BallsService
 * Wraps all functionality required for managing bouncing balls.
 */
angular.module('yieldifyCodeApp')
  .provider('BallsService', function() {

    // Private variables
    var self = this;
    var config;

    // Private constructor
    function BallsService(UtilitiesService) {
      var self = this;
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
      var config = defaultConfig;
      var balls = [];
      /** @function addGravity
       *
       *  @summary  Simulates the effect of 'simple' gravity on a given ball in play.
       *
       *  Decrements the vertical velocity by an amount equal to the gravity coefficient defined in the
       *  configuration. To be called on each 'tick' of the event loop.
       *
       *  @param    {Object}  ball - The ball being affected by friction.
       *
       *  @since 1.0.0
       */
      function addGravity(ball) {
        ball.velocityY += config.gravity;
      }

      /** @function addFriction
       *
       *  @summary  Simulates the effect of 'simple' friction on a given ball in play.
       *
       *  @param    {Object}  ball - The ball being affected by friction.
       *
       *  Decrements the horizontal velocity by the current value of that velocity multiplied by the friction
       *  coefficient defined in the configuration. To be called when the ball is in contact with the ground.
       *
       *  @since 1.0.0
       */
      function addFriction(ball) {
        ball.velocityX -= (ball.velocityX * config.friction);
      }

      /** @function initializeVelocity
       *
       *  @summary  Calculates the initial horizontal and vertical velocities of a ball that has just been fired
       *            based on the speed and angle at which it is 'fired'.
       *
       *  @param    {Object}  ball - The ball whose initial velocity is being calculated.
       *
       *  @since 1.0.0
       */
      function initializeVelocity(ball) {
        // if a member variable is to be used more than once I instantiate it to save time
        var radians = ball.radians;
        var speed = ball.speed;
        ball.velocityX = Math.cos(radians) * speed;
        ball.velocityY = Math.sin(radians) * speed;
      }

      /** @function setConfig
       *
       *  @summary Overrides the default configuration object using the parameter passed in.
       *
       *  The parameter must be an associative array but can contain fewer (or more) keys than the default object.
       *
       *  @param    {Object}  configObj - The object containing values to override the default configuration.
       *
       *  @since 1.0.0
       */
      self.setConfig = function(configObj) {
        for (var key in configObj) {
          config[key] = configObj[key];
        }
        // you cannae change the laws of physics captain!
        if (config.elasticity > 1) {
          config.elasticity = 1;
        }
        if (config.friction > 1) {
          config.friction = 1;
        }
      }

      /** @function createBall
       *
       *  @summary Creates a new ball at the provided position. Adds it to the list of balls in play.
       *
       *  Position of the ball is determined by the provided MouseEvent object, speed and angle are determined
       *  randomely within the provided limits.
       *
       *  @param    {Object}  position - The position at which the mouse was clicked.
       *  @param    {number}  position.x - The horizontal starting position for the ball (relative to the canvas left border).
       *  @param    {number}  position.y - The vertical starting position for the ball (relative to the canvas top border).
       *
       *  @since 1.0.0
       */
      self.createBall = function(position) {
        var angle = UtilitiesService.randomConstrainedValue(config.minAngle, config.maxAngle);
        var speed = UtilitiesService.randomConstrainedValue(config.minSpeed, config.maxSpeed);
        var radians = angle * Math.PI / 180;
        var ball = {
          x: position.x,
          y: position.y,
          radians: radians,
          speed: speed,
          radius: config.radius,
          elasticity: config.elasticity,
          bouncing: true
        };
        initializeVelocity(ball);
        balls.push(ball);
      }

      /** @function balls
       *
       *  @summary Returns the array of balls in play.
       *
       *  @since 1.0.0
       *
       *  @returns {Array}  The array containing balls in play.
       */
      self.balls = function() {
        return balls;
      }

      /** @function ballsInPlay
       *
       *  @summary Returns the number of balls in play.
       *
       *  Balls remain in play once created until such time as they move outside the left or right border of the canvas.
       *  At this point they are removed from play as they don't need to be animated any longer.
       *
       *  @since 1.0.0
       *
       *  @returns {Array}  The array containing balls in play.
       */
      self.ballsInPlay = function() {
        return balls.length;
      }

      /** @function removeBallsOutsideLimits
       *
       *  @summary Removes balls that have moved outside the left or right border of the canvas from the list of balls in play.
       *
       *  @since 1.0.0
       *
       *  @param {number}  width  The width of the play area.
       */
      self.removeBallsOutsideLimits = function(width) {
        if (UtilitiesService.isNumber(width)) {
          var currentBall;
          var newBalls = [];
          var deletedBalls = false;
          // a simple for loop is faster than forEach or for..in
          for (var i = 0; i < balls.length; i++) {
            currentBall = balls[i];
            // check whether ball remains in the canvas area
            if (((currentBall.x - currentBall.radius) <= width) &&
                ((currentBall.x + currentBall.radius) >= 0)) {
              newBalls.push(currentBall);
            }
            else {
              // If not, we don't need to animate it longer...
              deletedBalls = true;
            }
          }
          // creating a new array with only the balls to be animated is most efficient.
          // It is very dangerous to iterate over an array that is being modified, so this saves us having to create a copy of
          // the original array to iterate over and deleting balls from the original array which are outside the canvas
          // (especially as this could be time-comsuming - we'd have to delete the element then clean the now undefined
          // element from the array or splice it)
          if (deletedBalls) {
            balls = newBalls;
          }
        }
      }

      /** @function updateBallsNotBouncing
       *
       *  @summary  Resets vertical position of balls that are not bouncing to the bottom of the screen.
       *
       *  Used when the canvas is resized so that balls that are not bouncing are not left floating in the air or
       *  do not disappear off the bottom of the page.
       *
       *  @param    {Object}  ball - The ball being affected by friction.
       *
       *  @since 1.0.0
       */
      self.updateBallsNotBouncing = function(newHeight) {
        if (UtilitiesService.isNumber(newHeight)) {
          var currentBall;
          for (var i = 0; i < balls.length; i++) {
            currentBall = balls[i];
            if (!currentBall.bouncing) {
              currentBall.y = newHeight - currentBall.radius;
            }
          }
        }
      }

      /** @function calculatePositions
       *
       *  @summary  Calculates the current position of all balls in play.
       * 
       *  If a ball doesn't have enough energy to continue bouncing its vertical velocity is set to zero and its
       *  vertical position is set to the 'floor'.  It is marked as no longer bouncing so that it need not be processed
       *  further.
       *
       *  @since 1.0.0
       *
       *  @param  {number}  pageHeight -   The height of the page on which the ball is to be drawn.
       */
      self.calculatePositions = function(pageHeight) {
        if (UtilitiesService.isNumber(pageHeight)) {
          for (var i = 0; i < balls.length; i++) {
            var currentBall = balls[i];
            // set a limit at which the ball is considered to have run out of 'bounce'
            var bounceLimit = config.gravity * currentBall.elasticity;
            // we don't want them bouncing forever...
            if (currentBall.bouncing) {
              addGravity(currentBall);
              if ((Math.abs(pageHeight - (currentBall.y + currentBall.radius)) < 1) &&
                  (Math.abs(currentBall.velocityY) < bounceLimit)) {
                currentBall.y = pageHeight - currentBall.radius;
                currentBall.velocityY = 0;
                currentBall.bouncing = false;
                // it's on the floor now so think about friction
                addFriction(currentBall);
              }
              else if ((currentBall.y + currentBall.radius + currentBall.velocityY) > pageHeight) {
                currentBall.velocityY = -(currentBall.velocityY) * currentBall.elasticity;
                // this stops balls unexpectedly sticking to the ground from a specific launch height
                currentBall.y = pageHeight - currentBall.radius;
                // it's on the floor now so think about friction
                addFriction(currentBall);
              }
              else {
                // we're bouncing
                currentBall.y += currentBall.velocityY;
              }
            } else {
              // we're rolling
              addFriction(currentBall);
            }
            currentBall.x += currentBall.velocityX;
          }
        }
      }
    }

    // Public API for configuration
    self.setConfig = function(configObj) {
      config = configObj;
    }

    // Method for instantiating
    self.$get = ['UtilitiesService',
      function(UtilitiesService) {
        var service = new BallsService(UtilitiesService);
        service.setConfig(config);
        return service;
      }
    ]
  });
