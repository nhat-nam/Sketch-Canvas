var canvas, ctx, week8;
var _prevTime = 0;
var GRAVITY_CONSTANT = 5;
var WIDTH = 500;
var HEIGHT = 500;
var PARTICLE_SPAWN_RATE = 4;

var week8_2;
var canvas2, ctx2, canvas3, ctx3;

function runWeek8Canvas(){
    week8 = new Week8();

    week8_2 = new Week8();

    week8_2.color_scheme = "green";
    HEIGHT = HEIGHT/2;
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    canvas.height =HEIGHT;
    canvas.width = WIDTH;
    canvas2 = document.getElementById("canvas2");
    ctx2 = canvas2.getContext("2d");
    canvas2.height =HEIGHT;
    canvas2.width = WIDTH;
    window.requestAnimationFrame(loop);
}


function loop(timestamp){
   var delta = timestamp - _prevTime;
   if(_prevTime == 0){
      delta = 16;
   }

   _prevTime = timestamp;
   window.requestAnimationFrame(loop);
  // ctx.clearRect(0,0,500,500)
   ctx.fillStyle="rgba(0,0,0,.15)";
   ctx.fillRect(0,0,WIDTH,HEIGHT);
   ctx2.fillStyle="rgba(0,0,0,.15 )";
   ctx2.fillRect(0,0,WIDTH,HEIGHT);

   week8.update(delta)
   week8_2.update(delta)
   week8.render(ctx)
   week8_2.render(ctx2)
}

function Week8(){
  this.ticks = 0
  this.fire_balls = []
  this.fire_particles = []
  this.flashes = []
  this.sounds = {}
  this.sounds["fireball_explosion"] = document.getElementById("fireball");

  this.color_scheme = "red";

  this.update = function(delta){
    if(this.ticks % 80 == 0){

      if(this.color_scheme == "red"){
        var fb = new FireBall(randBetween(29, WIDTH-29), randBetween(29, HEIGHT-29), randBetween(15,30))
      }else{
        var fb = new GreenFireBall(randBetween(29, WIDTH-29), randBetween(29, HEIGHT-29), randBetween(15,30))
      }
      fb._week = this;
      fb.color_scheme = this.color_scheme;
      this.fire_balls.push(fb)

    }
    this.ticks++

    for(var i = 0;i < this.fire_balls.length;i++){
      fp = this.fire_balls[i].update(delta)
      if(fp){
        this.fire_particles.push(fp);
      }
      if(this.fire_balls[i].delete){
        this.fire_balls.splice(i, 1)
      }
    }
    for(var i = 0;i < this.fire_balls.length;i++){
      let j = i;
      this.fire_balls[i].checkCollision(this.fire_balls,j+1);
    }
    for(var i = 0;i < this.fire_particles.length;i++){
      this.fire_particles[i].update(delta)
      if(this.fire_particles[i].delete){
        this.fire_particles.splice(i, 1)
      }
    }
    for(var i = 0;i < this.flashes.length;i++){
      this.flashes[i].update(delta)
      if(this.flashes[i].delete){
        this.flashes.splice(i, 1)
      }
    }
  }
  this.render = function(ctx){
    for(var i = 0;i < this.fire_balls.length;i++){
      this.fire_balls[i].render(ctx)
    }
    for(var i = 0;i < this.fire_particles.length;i++){
      this.fire_particles[i].render(ctx)
    }
    for(var i = 0;i < this.flashes.length;i++){
      this.flashes[i].render(ctx)
    }
  }
}

function randBetween(x,y){
  var diff = Math.abs(x-y);
  return Math.random()*diff + Math.min(x,y);
}

class FireBall{
  constructor(x, y, r){
    this.x = x
    this.y = y
    this.radius = r
    this.ticks = 0
    this.dx = 0
    this.dy = 0
    this.bounce_counter = 0
    this.stroke_red = 0
    this.fill_red = 0
    this.heating_up = true
    this.delete = false
    this.calculating = true
    this.line_width = 0

    this.color_scheme = "red";

    this._week = null;
  }
  checkCollision(balls,me){
    // this
    for(var i=me;i<balls.length;i++){
          var b = balls[i];
          if(distTo(this.x, this.y, b.x, b.y) <= this.radius+b.radius){

            if(this.x > b.x){
              this.dx = Math.abs(this.dx);
              b.dx = -1* Math.abs(b.dx);
            }else{
              this.dx = -1*Math.abs(this.dx);
              b.dx = Math.abs(b.dx);
            }
            if(this.y > b.y){
              this.dy = Math.abs(this.dy);
              b.dy = -1* Math.abs(b.dy);
            }else{
              this.dy = -1*Math.abs(this.dy);
              b.dy =Math.abs(b.dy);
            }
            this.bounce_counter++;
            b.bounce_counter++;
          }
    }
  }
  update(delta){
    if(this.heating_up){
      this.fill_red+=0.127
      this.stroke_red++
      this.line_width += 0.0125

    }
    if(this.stroke_red == 255 && this.heating_up){
      this.heating_up = false
      var neg_dx = randBetween(-180,-250)
      var pos_dx = randBetween(180,250)
      var dx_chooser = Math.floor(Math.random()*2)
      if(dx_chooser == 0){
        this.dx = neg_dx
      }else{
        this.dx = neg_dx
      }
      var neg_dy = randBetween(-180,-250)
      var pos_dy = randBetween(180,250)
      var dy_chooser = Math.floor(Math.random()*2)
      if(dy_chooser == 0){
        this.dx = neg_dy
      }else{
        this.dx = neg_dy
      }
      this.dy = 150*randBetween(-1.5, 1.5)
    }

    this.ticks++;

    this.x = this.x + (this.dx * delta/1000)
    this.y = this.y + (this.dy * delta/1000)

    if(this.x - this.radius <= 0){
      this.dx = Math.abs(this.dx)
      this.bounce_counter++
    }
    if(this.x + this.radius >= WIDTH){
      this.dx = -1*Math.abs(this.dx)
      this.bounce_counter++
    }
    if(this.y - this.radius <= 0){
      this.dy = Math.abs(this.dy)
      this.bounce_counter++
    }
    if(this.y + this.radius >= HEIGHT){
      this.dy = -1*Math.abs(this.dy)
      this.bounce_counter++
    }

    if(this.bounce_counter >= 8){
      this.explode()
    }

    if(this.ticks % PARTICLE_SPAWN_RATE == 0){
      if(this.color_scheme === "red"){
        var fp = new FireParticle(
          randBetween(this.x-this.radius, this.x+this.radius),
          randBetween(this.y-this.radius, this.y+this.radius),
          randBetween(30, -30),
          randBetween(30, -30)
        );
      }else{
        var fp = new GreenFireParticle(
          randBetween(this.x-this.radius, this.x+this.radius),
          randBetween(this.y-this.radius, this.y+this.radius),
          randBetween(30, -30),
          randBetween(30, -30)
        );
      }

      return fp;

    }
    return null;
  }
  explode(){
    for(var i = 0; i < 150; i++){
      if(this.color_scheme == "red"){
        var flash = new Flash(this.x, this.y, 2.5*this.radius)
      }else{
        var flash = new GreenFlash(this.x, this.y, 2.5*this.radius);
      }
      this._week.flashes.push(flash)
      if(this.color_scheme === "red"){
        var fp = new FireParticle(
          randBetween(this.x-this.radius, this.x+this.radius),
          randBetween(this.y-this.radius, this.y+this.radius),
          randBetween(245, -245),
          randBetween(245, -245))
      }else{
        var fp = new GreenFireParticle(
          randBetween(this.x-this.radius, this.x+this.radius),
          randBetween(this.y-this.radius, this.y+this.radius),
          randBetween(245, -245),
          randBetween(245, -245))
      }
      fp.from_explosion = true;
      this._week.fire_particles.push(fp)
      this._week.sounds["fireball_explosion"].play()
      this.delete = true
    }




  }
  render(ctx){
    ctx.save()
    ctx.fillStyle = "rgb("+this.fill_red+",0,0)"
    ctx.strokeStyle = "rgb("+this.stroke_red+",0,0)"
    ctx.lineWidth = this.line_width
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius,0, Math.PI*2)
    ctx.stroke()
    ctx.fill()
    ctx.restore()
  }
}
class GreenFireBall extends FireBall{

  render(ctx){
    ctx.save()
    ctx.fillStyle = "rgb(0,"+this.fill_red+",0)"
    ctx.strokeStyle = "rgb(0,"+this.stroke_red+",0)"
    ctx.lineWidth = this.line_width
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius,0, Math.PI*2)
    ctx.stroke()
    ctx.fill()
    ctx.restore()
  }
}
function distTo(x1,y1,x2,y2){


  return Math.sqrt( (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1)  );
}

class FireParticle{
  constructor(x, y, dx, dy){
    this.x = x
    this.y = y
    this.dx = dx
    this.dy = dy
    this.width = 5*Math.random();
    this.height = this.width;//2*Math.random();
    this.alpha = 1
    this.delete = false
    this.from_explosion = false;
  }
  update(delta){
    this.x = this.x + (this.dx * delta/1000)
    this.y = this.y + (this.dy * delta/1000)

    if(this.dy < 15 && !this.from_explosion){
      this.dy+= GRAVITY_CONSTANT
    }else if(this.dy < 300 && this.from_explosion){
      this.dy+= GRAVITY_CONSTANT;
    }

    if(this.dx > 0){
      this.dx -= 0.2
    }else{
      this.dx += 0.2
    }
    this.alpha -= 0.01
    if(this.alpha <= 0.01){
      this.delete = true
    }
  }
  render(ctx){
    ctx.save()
    ctx.fillStyle = "rgba(255,102,25,"+this.alpha+")"
    ctx.strokeStyle= "rgba(255,51,51,"+this.alpha+")"
    ctx.fillRect(this.x, this.y, this.width, this.height)
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.restore()
  }

}
class GreenFireParticle extends FireParticle{

  render(ctx){
    ctx.save()
    ctx.fillStyle = "rgba(102,255,25,"+this.alpha+")"
    ctx.strokeStyle= "rgba(51,255,51,"+this.alpha+")"
      ctx.fillRect(this.x, this.y, this.width, this.height)
      ctx.strokeRect(this.x, this.y, this.width, this.height);
      ctx.restore()
  }

}


class Flash{
  constructor(x,y,r){
    this.x = x;
    this.y = y;
    this.radius = r
    this.ticks = 0
    this.delete = false
  }
  update(delta){
    this.ticks++
    if(this.ticks == 32){
      this.delete = true
    }
  }
  render(ctx){
    ctx.save()
    if(this.ticks <= 4){
      ctx.fillStyle="rgba(255,255,255,"+((32-this.ticks)/1000)+")";
    }else if (this.ticks <= 8){
      ctx.fillStyle="rgba(255,0,0,"+((32-this.ticks)/1000)+")";
    }else if(this.ticks <= 12){
      ctx.fillStyle="rgba(255,255,255,"+((32-this.ticks)/1000)+")";
    }else if (this.ticks <= 16){
      ctx.fillStyle="rgba(255,0,0,"+((32-this.ticks)/1000)+")";
    }else if (this.ticks <= 20){
      ctx.fillStyle="rgba(255,255,255,"+((32-this.ticks)/1000)+")";
    }else if (this.ticks <= 24){
      ctx.fillStyle="rgba(255,0,0,"+((32-this.ticks)/1000)+")";
    }else if (this.ticks <= 28){
      ctx.fillStyle="rgba(255,255,255,"+((32-this.ticks)/1000)+")";
    }else if (this.ticks <= 32){
      ctx.fillStyle="rgba(255,0,0,"+((32-this.ticks)/1000)+")";
    }

    ctx.beginPath()
    ctx.arc(this.x, this.y, (this.radius * (this.ticks/32)),0, Math.PI*2)
    ctx.fill()
    ctx.restore()
  }
}
class GreenFlash extends Flash{
  render(ctx){
    ctx.save()
    if(this.ticks <= 4){
      ctx.fillStyle="rgba(255,255,255,"+((32-this.ticks)/1000)+")";
    }else if (this.ticks <= 8){
      ctx.fillStyle="rgba(0,255,0,"+((32-this.ticks)/1000)+")";
    }else if(this.ticks <= 12){
      ctx.fillStyle="rgba(255,255,255,"+((32-this.ticks)/1000)+")";
    }else if (this.ticks <= 16){
      ctx.fillStyle="rgba(0,255,0,"+((32-this.ticks)/1000)+")";
    }else if (this.ticks <= 20){
      ctx.fillStyle="rgba(255,255,255,"+((32-this.ticks)/1000)+")";
    }else if (this.ticks <= 24){
      ctx.fillStyle="rgba(0,255,0,"+((32-this.ticks)/1000)+")";
    }else if (this.ticks <= 28){
      ctx.fillStyle="rgba(255,255,255,"+((32-this.ticks)/1000)+")";
    }else if (this.ticks <= 32){
      ctx.fillStyle="rgba(0,255,0,"+((32-this.ticks)/1000)+")";
    }

    ctx.beginPath()
    ctx.arc(this.x, this.y, (this.radius * (this.ticks/32)),0, Math.PI*2)
    ctx.fill()
    ctx.restore()
  }
}
