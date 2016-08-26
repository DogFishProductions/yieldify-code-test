# Yieldify Coding Test

This app has been written using [AngularJS](https://angularjs.org/). It has all been written by me, [Paul Nebel](http://paulnebel.io) with the exception of the 3rd-party library [Modernizr](https://modernizr.com/) which has only been used to check the compatibility of the host browser with HTML5 Canvas. Angular was chosen as a framework to ensure good structure and extensibility even though it is something of a sledgehammer to crack a nut in this particular instance.

As requested, whenever the user clicks on the page a circle is 'fired' from the clicked position at a random speed and angle. My solution handles multiple balls being fired and bouncing at the same time. When the projectile reaches the bottom of the browser window it bounces until it stops.

I have used a simple model for gravity (a constant value is subtracted from the vertical velocity every time the event loop runs).  I have also used a simple model for friction (every time a ball touches the 'ground' the horizontal velocity is reduced by a constant multiplied by the current horizontal velocity).  I have not accounted for 'wind resistance'.  Elasticity is modeled by reversing the vertical velocity and multiplying it by a constant whenever a ball hits the ground.

When balls go out of play they are removed from the animation loop for performance purposes.  A ball is considered out of play if it moves outside the left or right margins of the page.  This solution is reactive, and will respond to re-sizing of the window during animation (although the animation may stutter due to the computational load).  Balls may bounce beyond the top of the page.  They will eventually return provided they do not go out of play while they are off the screen.

The values for gravity, elasticity and friction are set to default values, as are the ball radius, minimum and maximum ball speed on firing and minimum and maximum ball angle on firing.  It is possible to override some or all of these values at startup in the app configuration section.  Elasticity is limited to a value of 1 (if the default is set to a higher value it will be overridden). The same is true of friction. Elasticity is set as a variable on a ball instance.  Currently, each ball instance has the same elasticity and radius but this allows for an extension of the functionality whereby different balls have different elasticities and radii.

# yieldify-code-test

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.15.1.

## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.
