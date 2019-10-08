var canvas, ctx, week1;
var _prevTime = 0;

var MAX_RADIUS = 20;
//creates the week 1 object
function Week1(){
    this.circles = []

    for(var i=0; i < 500; i++){
        var c = new Circle(Math.random()*500 - 1, Math.random()*500 - 1, 20);
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
      for(var i=0; i < this.circles.length; i++){
          this.circles[i].update(delta)
      }
    }
}

//runs the code
function runWeek1Canvas(){
    week1 = new Week1();
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
   week1.update(delta)
   week1.render(ctx)
   _prevTime = timestamp;
   window.requestAnimationFrame(loop);
}

var MAGNITUDE = 20
//defines Circle
function Circle(x, y , r){
    this.x = x
    this.y = y
    this.r = MAX_RADIUS * Math.random();
    //makes the dx and the dy of a circle random
    this.dx = -1 * MAGNITUDE/2 + Math.random() * MAGNITUDE
    this.dy = -1 * MAGNITUDE/2 + Math.random() * MAGNITUDE

    this.fillStyle = "rgba(0,0,100," +Math.random()+ ")";

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
