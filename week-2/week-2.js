var canvas, ctx, week2;
var _prevTime = 0;

var MAGNITUDE = 20
var CIRCLE_COUNT = 500
var WIDTH = 500
var HEIGHT = 500
var POINT_OF_REVERSE = 1500

//runs everything
function runWeek2Canvas(){
    week2 = new Week2();
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    window.requestAnimationFrame(loop);
}

//loops the code
function loop(timestamp){
    var delta = timestamp - _prevTime;
    if(_prevTime == 0){
      delta = 16;
    }

    week2.update(delta)
    week2.render(ctx)

    _prevTime = timestamp;
    window.requestAnimationFrame(loop);
}

//defines Week2 object
function Week2(){
    this.circles = []
    this.timer = POINT_OF_REVERSE

    for(var i=0; i < CIRCLE_COUNT; i++){
        var radius = Math.random()*25;
        var fill_color = "rgba(0,0,100," + (25-radius)/25+")";

        var c = new Circle(
            WIDTH/2+(Math.random()*20 - 10),
            HEIGHT/2+ (Math.random()*20 - 10),
            radius,
            fill_color)

        this.circles.push(c);
    }

    this.render = function(ctx){
        //clear our canvas
        ctx.clearRect(0, 0, 500, 500);
        //render all the circles
        for(var i=0; i < this.circles.length; i++){
            this.circles[i].render(ctx)
        }
    }

    this.update = function(delta){
        //update timer
        this.timer--
        //updates all our circles
        for(var i=0; i < this.circles.length; i++){
            this.circles[i].update(delta)
            if(this.timer == 0){
                this.circles[i].reverse()
            }
        }

        if(this.timer == 0){
            this.timer = POINT_OF_REVERSE
        }
    }
}

function Circle(x, y , r, fill_color){
    this.x = x
    this.y = y
    this.r = r
    this.fill_color = fill_color
    //makes the dx and the dy of a circle random
    this.dx = -1 * MAGNITUDE/2 + Math.random() * MAGNITUDE
    this.dy = -1 * MAGNITUDE/2 + Math.random() * MAGNITUDE

    this.fillStyle = this.fill_color;

    this.reverse = function(){
        this.dx = -1*this.dx
        this.dy = -1*this.dy
    }

    //update function for the circle
    this.update = function(delta){
        this.x = this.x + (this.dx * delta/1000)
        this.y = this.y + (this.dy * delta/1000)

    }

    //render function for the circle
    this.render = function(ctx){
        ctx.save()
        ctx.fillStyle = this.fillStyle;
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r,0, Math.PI*2)
        ctx.fill()
        ctx.restore()
    }
}
