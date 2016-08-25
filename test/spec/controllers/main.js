'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('yieldifyCodeApp'));

  var mockService;
  var MainCtrl, BallsService, window, DOMService;

  beforeEach(module(function($provide){
    mockService = { 
      canvas: null,
      getCanvas: function() {
        return this.canvas;
      },
      getContext: function() {
        return {
          fillRect: function() {
            // do Nothing
          },
          strokeRect: function() {
            // do Nothing
          },
          beginPath: function() {
            // do Nothing
          },
          arc: function() {
            // do Nothing
          },
          closePath: function() {
            // do Nothing
          },
          fill: function() {
            // do Nothing
          }
        };
      },
      setCanvas: function(canvas) {
        this.canvas = canvas;
      }
    };
    $provide.value('DOMService', mockService);
  }));

  beforeEach(inject(function($controller, _BallsService_, $window, _DOMService_) {
    BallsService = _BallsService_;
    window = $window;
    var canv = window.document.createElement('canvas');
    canv.width = 500;
    canv.height = 500;
    DOMService = _DOMService_
    DOMService.setCanvas(canv);
    
    MainCtrl = $controller('MainCtrl', {
      window: window,
      DOMService: DOMService
    });
  }));

  it('should respond to a window resize event', function() {
    expect(!!MainCtrl).toBe(true);
    var w = angular.element(window);
    spyOn(BallsService, 'updateBallsNotBouncing');
    window.innerWidth = 900;
    window.innerHeight = 700;
    w.triggerHandler('resize');
    expect(BallsService.updateBallsNotBouncing).toHaveBeenCalled();
  });

  it('should respond to a canvas click event', function() {
    expect(BallsService.ballsInPlay()).toBe(0);
    angular.element(DOMService.getCanvas()).triggerHandler('click');
    expect(BallsService.ballsInPlay()).toBe(1);
  });
});
