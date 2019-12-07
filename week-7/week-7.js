var canvas, ctx, week7;
var _prevTime = 0;
const CIRCLE_COUNT = 1500;
const MAX_SPEED = 30;
function runWeek7Canvas(){
    week7 = new Week7();
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    window.requestAnimationFrame(loop);
}


function loop(timestamp){
   var delta = timestamp - _prevTime;
   if(_prevTime == 0){
      delta = 16;
   }

   _prevTime = timestamp;
   window.requestAnimationFrame(loop);

   ctx.save();
   ctx.fillStyle="rgba(40,40,60,.15)";
   ctx.fillRect(0,0,500,500);
   ctx.restore();

   week7.update(delta)
   week7.render(ctx)
}

function Week7(){
  this.circles = []
  this.ticks=0;
  for(var i = 0; i < CIRCLE_COUNT; i++){
    var c = new Circle( randBetween(248,252), randBetween(248,252), randBetween(0,2));
    this.circles.push(c)
  }

  this.update = function(delta){

    this.ticks++;
    for(var i=0; i < this.circles.length && i<this.ticks*10; i++){
      var c = this.circles[i]
      c.update(delta);
      if(c.x > 500 || c.y > 500 || c.x<0 || c.y<0){
        this.circles.splice(i, 1)
        var c2 = new Circle(randBetween(248,252), randBetween(248,252), randBetween(0,2));
        this.circles.push(c2)
      }
    }



  }
  this.render = function(ctx){
    for(var i=0; i < this.circles.length&& i<this.ticks*10; i++){
      this.circles[i].render(ctx)
    }
  }
}
function randBetween(x,y){


  var diff = Math.abs(x-y);
  return Math.random()*diff + Math.min(x,y);

}

function Circle(x, y , r){
    this.x = x
    this.y = y
    this.r = r
    this.alpha = .1;
    //makes the dx and the dy of a circle random


    this.ddx=0;
    this.ddy=0;
    this.dx = 0;
    this.dy = 0;

    if(this.x < 250){
      this.dx = -1*MAX_SPEED*Math.random();
    }else{
      this.dx = MAX_SPEED *Math.random();
    }

    if(this.y < 250){
      this.dy = -1*MAX_SPEED*Math.random();
    }else{
      this.dy = MAX_SPEED*Math.random();
    }



    this.red = Math.random()*250;
    this.green = Math.random()*250;
    this.blue= Math.random()*250;

    this.fillStyle="blue";

    //update function for the circle
    this.update = function(delta){
      this.x = this.x + (this.dx * delta/1000)
        this.y = this.y + (this.dy * delta/1000)

        this.alpha = Math.max( Math.abs(this.x -250)/500 ,  Math.abs(this.y -250)/500 )

        this.fillStyle = "rgba("+this.red+","+this.green+","+this.blue+","+this.alpha+")";
    }

    //render function for the circle
    this.render = function(ctx){
        ctx.save()
        ctx.fillStyle = this.fillStyle;
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r,0, Math.PI*2)
        ctx.strokeStyle="rgba(50,50,50,"+this.alpha+")";
        ctx.stroke();
        ctx.fill()
        ctx.restore()
    }
}
