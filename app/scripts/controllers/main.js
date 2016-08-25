'use strict';

/**
 * @ngdoc function
 * @name yieldifyCodeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the yieldifyCodeApp
 */
angular.module('yieldifyCodeApp')
  .controller('MainCtrl', ['$window', '$timeout', 'DOMService', 'BallsService', 'UtilitiesService',
    function(window, timeout, DOMService, BallsService, UtilitiesService) {
      // Set references to elements
      var theCanvas = DOMService.getCanvas();
      var context = DOMService.getContext();

      /** @function canvasSupport
       *
       *  @summary Uses 3rd-party library 'Modernizr' (https://modernizr.com/) to determine whether browser supports
       *  HTML5 canvas component.
       *
       *  @since 1.0.0
       *
       *  @returns  {boolean}   'true' if browser supports HTML5 canvas, 'false' otherwise.
       */
      function canvasSupport() {
        // using third-party library 'Modernizr' to check whether browser supports HTML5 canvas
        // This library will not be available when unit testing so return true by default.
        var Modernizr = Modernizr || { canvas: true };
        return Modernizr.canvas;
      }

      // stop processing at this point if canvas is not supported by the browser.
      if (!canvasSupport()) {
        return;
      }

      /** @function drawCanvas
       *
       *  @summary Draws the canvas background and border.
       *
       *  @since 1.0.0
       */
      function drawCanvas() {
        // background
        context.fillStyle = '#EEEEEE';
        context.fillRect(0, 0, theCanvas.width, theCanvas.height);
        // border
        context.strokeStyle = '#000000';
        context.strokeRect(1, 1, theCanvas.width - 2, theCanvas.height - 2);
      }

      /** @function drawBalls
       *
       *  @summary Draws the balls currently in play on the canvas.
       *
       *  @since 1.0.0
       */
      function drawBalls() {
        context.fillStyle = '#000000';
        var balls = BallsService.balls();
        var currentBall;
        for (var i = 0; i < balls.length; i++) {
          currentBall = balls[i];
          context.beginPath();
          context.arc(currentBall.x, currentBall.y, currentBall.radius, 0, Math.PI * 2, true);
          context.closePath();
          context.fill();
        }
      }

      /** @function drawScreen
       *
       *  @summary Draws the current state of the canvas as follows:
       *    - Draw the background canvas (it may have been resized).
       *    - Add the effects of gravity.
       *    - Calculate the new ball position(s).
       *    - Draw the balls on the canvas.
       *
       *  @since 1.0.0
       */
      function drawScreen() {
        // Canvas
        drawCanvas();
        // Balls
        BallsService.calculatePositions(theCanvas.height);
        drawBalls();
      }

      /** @function eventCanvasClicked
       *
       *  @summary  Responds to the 'click' event on the canvas.
       *
       *  Creates a new ball at the mouse position when the click occurred and adds it to the array of balls in play.
       *  Starts the event loop if it isn't already started.
       *
       *  @param    {MouseEvent}  mouseEvent - The 'onclick' event passed in by the canvas.
       *  @param    {number}      mouseEvent.offsetX - The horizontal position of the mouse on click (relative to the canvas
       *                          left border).
       *  @param    {number}      mouseEvent.offsetY - The vertical position of the mouse on click (relative to the canvas
       *                          top border).
       *
       *  @since 1.0.0
       */
      function eventCanvasClicked(mouseEvent) {
        var startPosition = {};
        // add default values to allow for unit testing
        startPosition.x = mouseEvent.offsetX || 20;
        startPosition.y = mouseEvent.offsetY || 30;
        BallsService.createBall(startPosition);
        if (!tOut) {
          eventLoop();
        }
      }

      /** @function eventWindowResized
       *
       *  @summary Responds to an 'resize' event in the window.
       *
       *  Resizes the canvas to match the window limits and re-draws the canvas.
       *
       *  @since 1.0.0
       */
      function eventWindowResized() {
        resizeCanvas(window.innerWidth, window.innerHeight);
        BallsService.updateBallsNotBouncing(theCanvas.height);
        drawCanvas();
      }

      /** @function eventWindowResized
       *
       *  @summary Responds to a 'resize' event in the window.
       *
       *  Resizes the canvas to match the window limits and re-draws the canvas.
       *
       *  @since 1.0.0
       */
      function resizeCanvas(width, height) {
        // set default values if necessary
        var cWidth = (UtilitiesService.isNumber(width) ? Math.max(0, width) : 500);
        var cHeight = (UtilitiesService.isNumber(height) ? Math.max(0, height) : 500);
        theCanvas.width = cWidth;
        theCanvas.height = cHeight;
      }

      var tOut;

      /** @function eventLoop
       *
       *  @summary Redraws the canvas every 20ms when there are balls in play.
       *
       *  Balls which have exited the left or right border of the canvas are now irrelevant and are removed
       *  from the list of balls to be animated.  If there are no balls left to be animated the event loop stops
       *  and the variable holding the time out is set to undefined so that it can start again if the mouse is clicked.
       *
       *  @since 1.0.0
       */
      function eventLoop() {
        BallsService.removeBallsOutsideLimits(theCanvas.width);
        if (BallsService.ballsInPlay() > 0) {
          tOut = timeout(eventLoop, 20);
          drawScreen();
        }
        else {
          timeout.cancel(tOut);
          tOut = undefined;
        }
      }

      angular.element(window).bind('resize', eventWindowResized);
      angular.element(theCanvas).bind('click', eventCanvasClicked);
      // resize the cavas to fit the window
      resizeCanvas(window.innerWidth, window.innerHeight);
      // draw the canvas
      drawCanvas();
    }
  ]);
