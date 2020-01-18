var canvas, ctx, week10;
var _prevTime = 0;


function runWeek10Canvas(){
    week10 = new Week10();
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
   ctx.fillStyle="rgba(0,0,100,1)"
   ctx.clearRect(0,0,500,500)
   //ctx.fillRect(0,0,500,500);
   week10.update(delta)
   week10.render(ctx)
}

function Week10(){
  this.fireworks = [];
  this.stars = []
  this.ticks = 0
  for(var i =0; i<100;i++){
    var s = new Star(Math.random()*500,Math.random()*180)
    this.stars.push(s)
  }
  this.update = function(d){
    if(this.ticks%75==0){
      var f = new FireWork(Math.random()*500,500)
      this.fireworks.push(f)
    }
    this.ticks++
    for(var i=0;i<this.fireworks.length;i++){
      this.fireworks[i].update(d);

    }
  }
  this.render = function(ctx){
    ctx.save();

    for(var i=0;i<this.stars.length;i++){
      this.stars[i].render(ctx);
    }
    for(var i=0;i<this.fireworks.length;i++){
      this.fireworks[i].render(ctx);
    }
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = 'red';
    ctx.font = "900 60px Arial"
    ctx.fillText("Happy",150,200);
    ctx.fillText("New Year!",100, 270);

    ctx.restore();
  }
}

class FireWork{
  constructor(x, y){
    this.x = x
    this.y = y



    this.dx =  ((250-this.x)/150) *Math.random()*50;
    this.dy = -1 * Math.random()*100 - 100;

    this.angle = Math.atanh(-1*this.dx/this.dy);

    this.timer = 1000000;//Math.random()*150+20;
    this.ticks =0;
    this.radius = 10
    this.timer_started = false;
    this.color = { red: 0, green: Math.random()*255, blue: Math.random()*255};
    this.explosion =null;
    this.has_exploded = false;
    this.img = new Image()
    this.img.src = "./firework.png"
  }
  render(ctx){
    if(this.explosion){
      this.explosion.render(ctx);
    }else{
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.drawImage(this.img,0, 0);
      ctx.restore();
    }
  }
  update(d){
    this.ticks++;
    if(this.y< 200 && !this.timer_started){
      this.ticks = 0;
      this.timer = Math.random()*20+30;
      this.timer_started = true;
    }
    if(this.ticks > this.timer && !this.has_exploded){
      this.explosion = new Explosion(this.x, this.y);
      this.explosion.color= this.color;
      this.has_exploded = true;
    }
    if(this.explosion){
      this.explosion.update(d);
    }else{
      //
      this.x = this.x + this.dx*d/1000;
      this.y = this.y + this.dy*d/1000;
    }
  }
}

class Explosion{
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.particles =[];
    this.ticks = 0
    this.radius = 40
    this.color = {
      red: 0,
      green: 0,
      blue: 200
    };

  }
  render(ctx){
    if(this.ticks < 3){
      ctx.save()
      ctx.fillStyle = "white"
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius,0, Math.PI*2)
      ctx.fill()
      ctx.restore()
    }
    for(var i=0;i<this.particles.length;i++){
      this.particles[i].render(ctx);
    }
  }
  update(d){
    this.ticks++
    if(this.ticks > 2 && this.ticks<4){
      for(var i=0;i<70;i++){
          this.particles.push(new Particle(this.x, this.y, this.color));
      }
    }
    for(var i=0;i<this.particles.length;i++){
      this.particles[i].update(d);
      if(this.particles[i].delete){
        this.particles.splice(i,1);
      }
    }
  }
}



class Particle{
  constructor(x,y, color){
    this.x = x;
    this.y = y;
    this.ticks = 0;
    this.dx = -150 + Math.random()*300
    this.dy = -150 + Math.random()*300
    this.color = color;
    this.trail = [];
    this.is_trail = false;
    this.delete = false;
    this.opacity = 1;


  }
  render(ctx){
    ctx.save();
    ctx.fillStyle="rgba("+this.color.red+","+this.color.green+","+this.color.blue+","+this.opacity+")";
    ctx.fillRect(this.x, this.y, 5,5);
    for(var i=0;i<this.trail.length;i++){
      if(!this.trail[i].delete)
        this.trail[i].render(ctx);
    }
    ctx.restore();
  }
  update(d){
    this.ticks++;
    if(this.ticks % 1 == 0 && !this.is_trail){
      var x = this.x;
      var y = this.y;
      var p = new Particle(x,y, this.color);
      p.dx = 0;
      p.dy = 0;
      p.opacity = this.opacity
      p.is_trail = true;
      this.trail.push(p);
      this.opacity-=.01*Math.random();

      if(this.opacity < .05){
        this.delete = true;
      }
    }else if(this.is_trail && this.ticks > 30){
      this.delete = true;
    }else if(this.is_trail){
      this.opacity-=.05;
    }else{

      this.opacity-=.01*Math.random();
    }

    this.dy = this.dy + 150*d/1000;
    this.x = this.x + this.dx*d/1000;
    this.y = this.y + this.dy*d/1000;
    for(var i=0;i<this.trail.length;i++){
      this.trail[i].update(d);
      if(this.trail[i].delete){
        this.trail.splice(i,1);
      }
    }

  }
}
class Star{
  constructor(x, y){
    this.x = x
    this.y = y
    this.img = new Image()
    this.img.src = "./star.png"
  }
  render(ctx){
    ctx.save()
    ctx.drawImage(this.img, this.x, this.y)
    ctx.restore()
  }
}
