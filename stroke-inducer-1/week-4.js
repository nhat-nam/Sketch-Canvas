 var canvas, ctx, week4;
var _prevTime = 0;


function runWeek4Canvas(){
    week4 = new Week4();
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    window.requestAnimationFrame(loop);
}


function loop(timestamp){
   var delta = timestamp - _prevTime;
   if(_prevTime == 0){
      delta = 16;
   }

   week4.render(ctx)

   _prevTime = timestamp;
   //window.requestAnimationFrame(loop);
}

function Week4(){

    this.render = function(ctx){
        r = new Rectangle(0,0,500,500);
        r.render(ctx);
        cutRectVertically(r);
        cutRectHorizontally(r);
        cutRectVertically(r);
        cutRectHorizontally(r);
        cutRectVertically(r);
        cutRectHorizontally(r);;
        cutRectVertically(r);
        cutRectHorizontally(r);
        cutRectVertically(r);
        cutRectHorizontally(r);
        cutRectVertically(r);
        cutRectHorizontally(r);
        cutRectVertically(r);
        cutRectHorizontally(r);
    }

}

function cutRectVertically(r){
    ctx.save();
   	r.fillStyle="rgba("+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+",1)";

    ctx.strokeStyle="rgba(0,0,0,1)";
    ctx.beginPath();
    ctx.moveTo(r.x + r.w/2, r.y);
    ctx.lineTo(r.x+r.w/2, r.y+r.h);
    ctx.stroke();
    ctx.restore();
    ctx.fillRect(600,0,20,20);
    if(Math.random() > .5){
       r.w = r.w/2;
       r.x = r.x + r.w;
    }else{
     	  r.w = r.w/2;
    }
    r.render(ctx);
}
function cutRectHorizontally(r){
    ctx.save();
    r.fillStyle="rgba("+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+",.4)";
    ctx.strokeStyle="rgba(0,0,0,1)";
    ctx.beginPath();
    ctx.moveTo(r.x, r.y+r.h/2);
    ctx.lineTo(r.x+r.w, r.y+r.h/2);
    ctx.stroke();
    ctx.restore();
    if(Math.random() > .5){
      r.h = r.h/2;
      r.y = r.y + r.h;
    }else{
    	  r.h = r.h/2;
    }
    r.render(ctx);
}
class Rectangle{
  constructor(x,y,w,h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
   	this.fillStyle="rgba("+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+",1)";
  }
  render(ctx){
      ctx.save();
    ctx.fillStyle= this.fillStyle;
    ctx.fillRect(this.x,this.y,this.w, this.h);
    ctx.restore();
  }
}
