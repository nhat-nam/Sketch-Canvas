var canvas, ctx, content;
var _prevTime = 0;


function runContentCanvas(){
    content = new Content();
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    window.requestAnimationFrame(loop);
}

function loop(timestamp){
    var delta = timestamp - _prevTime;
    if(_prevTime == 0){
      delta = 16;
    }

    content.update(delta)
    ctx.clearRect(0, 0, 500, 500);
    content.render(ctx)

    _prevTime = timestamp;
    window.requestAnimationFrame(loop);
}

function Content(){
  this.hearts = []
  this.ticks = 0
  this.state = "waiting"
  this.sounds = []
  this.sounds["background_sound"] = document.getElementById("sound");


  this.update = function(delta){
    if(this.state == "playing"){
      if(this.ticks%8==0){
        var h = new Heart(randBetween(0,500),500,randBetween(-20,-30))
        this.hearts.push(h)
      }
      this.ticks++
      for(var i = 0; i < this.hearts.length; i++){
        this.hearts[i].update(delta)
        if(this.hearts[i].delete){
          this.hearts.splice(i,1)
        }
      }
    }
  }

  this.render = function(ctx){
    if(this.state == "playing"){
      ctx.save()
      for(var i = 0; i < this.hearts.length; i++){
        this.hearts[i].render(ctx)
      }

      ctx.globalCompositeOperation = 'source-atop';

      ctx.fillStyle = 'white';
      ctx.font = "700 40px Arial"
      ctx.fillText("Goodbye",170,300);
      ctx.fillText("Alex",200, 360);
      ctx.restore()
    }else{
      ctx.save()
      ctx.fillStyle = 'white';
      ctx.font = "600 30px Arial"
      ctx.fillText("Press [SPACE] to Start",100,250);
      ctx.restore()
    }
  }
}

function randBetween(x,y){
  var diff = Math.abs(x-y);
  return Math.random()*diff + Math.min(x,y);
}

class Heart{
  constructor(x,y,dy){
    this.x = x
    this.y = y
    this.dx = this.dxChooser()
    this.dy = dy
    this.angle = 5
    this.delete = false
    this.counter = 0
    this.img = new Image()
    this.img.src = "./heart.png"
  }
  dxChooser(){
    var dx = 0
    if(this.x<250){
      dx = randBetween(5,10)
    }else if(this.x>250){
      dx = randBetween(-5,-10)
    }else{
      dx = 0
    }
    return dx
  }

  update(delta){
    this.x = this.x + this.dx*(delta/100);
    this.y = this.y + this.dy*(delta/100);

    if(this.y-40 >= 500){
      this.counter++
    }
    if(this.counter == 2){
      this.delete =true
    }

    this.dy += 0.2
    this.angle -= 0.1
  }
  render(ctx){
    ctx.save()
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.drawImage(this.img,-40,-40)
    ctx.restore()
  }
}

window.onkeydown = function(e){
  if(e.key==" "){
    content.state="playing"
    setTimeout(function(){
      content.sounds["background_sound"].play()
    },100)
  }
}
