var canvas, ctx, week9;
var _prevTime = 0;
NUMBER_OF_SNOW_SURFACES = 50;


function runWeek9Canvas(){
    week9 = new Week9();
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
   ctx.clearRect(0, 0, 500, 500);

   week9.update(delta)
   week9.render(ctx)
}

function Week9(){
  this.snow_flakes = []
  this.snow_surfaces = []
  this.ticks = 0
  this.interval = 70
  this.santa = new Santa();
  var x = 0
  for(var i = 0; i < NUMBER_OF_SNOW_SURFACES; i++){
    var s_s = new SnowSurface(x);
    this.snow_surfaces.push(s_s)
    x += 500/NUMBER_OF_SNOW_SURFACES;
  }
  this.message = new Message(500, 0.005)

  this.update = function(delta){
    if(this.ticks % this.interval == 0){
      z = 0;
      while( z < 3){
      var s = new SnowFlake(randBetween(2, 498), randBetween(-5, 5), randBetween(15, 25))
      this.snow_flakes.push(s)
      var s = new SnowFlake(randBetween(2, 498), randBetween(-5, 5), randBetween(15, 25))
      this.snow_flakes.push(s)
      var s = new SnowFlake(randBetween(2, 498), randBetween(-5, 5), randBetween(15, 25))
      this.snow_flakes.push(s)
        z++;
      }
    }
    this.ticks++
    if(this.interval > 10)
      this.interval -= 0.5
    this.message.update(delta)
    for(var i = 0; i < this.snow_flakes.length; i++){
      var si = this.snow_flakes[i]
      si.update(delta);
      if(!si.fallen){
        si.checkFallen(this.snow_surfaces)
      }
      if(si.delete == true){
        this.snow_flakes.splice(i, 1)
      }

    }
    for(var i = 0; i < this.snow_surfaces.length; i++){
      this.snow_surfaces[i].update(delta)
    }
    this.santa.update(delta);
  }

  this.render = function(ctx){
    this.santa.render(ctx);

    this.message.render(ctx)
    for(var i = 0; i < this.snow_flakes.length; i++){
      this.snow_flakes[i].render(ctx)
    }
    //
    ctx.strokeStyle="white";
    ctx.fillStyle="white";
    ctx.beginPath();
    for(var i = 0; i < this.snow_surfaces.length; i++){
      //this.snow_surfaces[i].render(ctx)
      ctx.lineTo(this.snow_surfaces[i].x,this.snow_surfaces[i].y);
    }
    ctx.lineTo(500,this.snow_surfaces[this.snow_surfaces.length-1].y);
    ctx.lineTo(500,500);
    ctx.lineTo(0,500);
    ctx.stroke();
    ctx.fill();
  }
}

//convenience functions *
function distTo(x1,y1,x2,y2){
  return Math.sqrt( (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1)  );
}

function randBetween(x,y){
  var diff = Math.abs(x-y);
  return Math.random()*diff + Math.min(x,y);
}


class Santa{
  constructor(){
    this.img = document.getElementById("santa");
    this.x = 735;
    this.y = 455;
    this.dx = -1;
    this.dy = -.5;
    this.w = 100;
    this.h = 50;

  }

  update(delta){
    this.x += this.dx;
    this.y += this.dy;

    if(this.x > 600){
      this.dx = -1;
      this.y = 355;
    }
    if(this.x < -100){
      this.x = -50;
      this.dx = 1;
      this.y = 355;
    }
  }

  render(ctx){
    ctx.save();
    ctx.translate(this.x, this.y);
    if(this.dx >0){
      ctx.scale(-1,1);
    }
    ctx.drawImage(this.img, this.w/-2, this.h/-2, this.w, this.h);
    ctx.restore();
  }
}

//*
class SnowFlake{
  constructor(x, dx, dy){
    this.x = x
    this.y = -3
    this.dx = dx
    this.dy = dy*3;
    this.radius = 1
    this.delete_timer = 200
    this.fallen = false
    this.delete = false
  }

  checkFallen(snow_surfaces){
    for(var i = 0; i < snow_surfaces.length; i++){
      var ssi = snow_surfaces[i];
      if(this.y >= ssi.y){
//      if(distTo(this.x, this.y-this.radius, ssi.x, ssi.y) <= ssi.height){

        if(this.x - this.radius >= ssi.x
        && this.x + this.radius <= ssi.x + ssi.width  ){

          this.delete = true
          this.fallen = true

          //check left....
          if(i>0 && snow_surfaces[i-1].height < ssi.height-2){
            snow_surfaces[i-1].height++;
            snow_surfaces[i-1].y--;
          }else if(i<snow_surfaces.length-1 && snow_surfaces[i+1].height < ssi.height-2){
            snow_surfaces[i+1].height++;
            snow_surfaces[i+1].y--;
          }else{

            ssi.height += 1;
            ssi.y -= 1;
          }
          break;
        }
      }
    }
  }

  update(delta){
    this.x = this.x + (this.dx * delta/1000)
    this.y = this.y + (this.dy * delta/1000)

    if(this.x - this.radius >= 500
    || this.x + this.radius <= 0){
      this.delete = true
    }
  }

  render(ctx){
    ctx.save()
    ctx.fillStyle = "white"
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius,0, Math.PI*2)
    ctx.stroke()
    ctx.fill()
    ctx.restore()
  }
}

class SnowSurface{
  constructor(x){
    this.x = x
    this.y = 498
    this.width = 500/NUMBER_OF_SNOW_SURFACES;
    this.height = 2
    this.delete = false
  }

  update(delta){

  }

  render(ctx){
    ctx.save()
    ctx.fillStyle = "white"
    ctx.fillRect(this.x, this.y, this.width, this.height)
    ctx.restore()
  }
}

class Message{
  constructor(waiting_time, alpha_increment){
    this.waiting_time = waiting_time
    this.alpha_increment = alpha_increment
    this.alpha = 0
  }

  update(delta){
    if(this.waiting_time > 0){
      this.waiting_time--
    }else{
      this.alpha += this.alpha_increment
    }
  }

  render(ctx){
    ctx.save()
    ctx.fillStyle = "rgba(255,255,255,"+this.alpha+")"
    ctx.font = "900 33px Arial"
    ctx.fillText("Merry Christmas!", 125, 250)
    ctx.restore()
  }
}
