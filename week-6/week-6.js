var canvas, ctx, week6;
var _prevTime = 0;


function runWeek6Canvas(){
    week6 = new Week6();
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    window.requestAnimationFrame(loop)
}


function loop(timestamp){
   var delta = timestamp - _prevTime;
   if(_prevTime == 0){
      delta = 16;
   }

   _prevTime = timestamp;
   window.requestAnimationFrame(loop);

   ctx.clearRect(0, 0, 500, 500)
   week6.update(delta)
   week6.render(ctx)
}

function Week6(){
    this.ticks = 0
    this.exploding_circles = []
    this.circle_particles = []

    this.update = function(delta){

        if(this.ticks % 40 == 0){
            var ec = new ExplodingCircle(Math.random()*470 + 30, Math.random()*470 + 30, Math.random()*25 + 5)
            this.exploding_circles.push(ec)
        }

        this.ticks++

        for(var i = 0; i < this.exploding_circles.length; i++){
            var c = this.exploding_circles[i]
            c.update(delta)
            if(c.delete == true){
                this.exploding_circles.splice(i, 1)
            }
        }
        for(var i = 0; i < this.circle_particles.length; i++){
            var p = this.circle_particles[i]
            p.update(delta)
            if(p.delete == true){
                this.circle_particles.splice(i, 1)
            }

            if(p.y - p.radius <= 0){
                if(p.dy < 0) {
                    p.dy = 0;
                }
            }

            if(p.y + p.radius >= 500){
                if(p.dy > 0){
                    p.dy = 0;
                }
            }

            if(p.x - p.radius <= 0){
                if(p.dx < 0){
                    p.dx = 0;
                }
            }

            if(p.x + p.radius >= 500){
                if(p.dx > 0){
                    p.dx = 0;
                }
            }
        }
    }

    this.render = function(ctx){
        for(var i = 0; i < this.exploding_circles.length; i++){
            this.exploding_circles[i].render(ctx)
        }
        for(var i = 0; i < this.circle_particles.length; i++){
            this.circle_particles[i].render(ctx)
        }
    }

    class ExplodingCircle{
        constructor(x, y, r){
            this.x = x
            this.y = y
            this.radius = r
            this.alpha = 0
            this.delete = false
            this.red = 0
            this.blue = 255
            this.timer = 0
        }
        change_to_red(){
            this.red = 255
            this.blue = 0
        }

        change_to_blue(){
            this.red = 0
            this.blue = 255
        }

        update(delta){
            this.timer += 1
            this.alpha += 0.01
            if(this.timer == 101){
                this.change_to_red()
            }
            if(this.timer == 131){
                this.change_to_blue()
            }
            if(this.timer == 159){
                this.change_to_red()
            }
            if(this.timer == 185){
                this.change_to_blue()
            }
            if(this.timer == 209){
                this.change_to_red()
            }
            if(this.timer == 227){
                this.change_to_blue()
            }
            if(this.timer == 245){
                this.change_to_red()
            }
            if(this.timer == 259){
                this.change_to_blue()
            }
            if(this.timer == 269){
                this.change_to_red()
                this.explode()
            }
        }

        explode(){
            for(var i = 0; i < 30; i++){
                var cp = new CircleParticle(this.x, this.y, Math.random()*100 - 50, Math.random()*100 - 50)
                week6.circle_particles.push(cp)
            }
            this.delete = true
        }

        render(ctx){
            ctx.save()
            ctx.beginPath()
            ctx.fillStyle = "rgba("+this.red+", 0, "+this.blue+","+this.alpha+")";
            ctx.arc(this.x, this.y,this.radius, 0, 2*Math.PI);
            ctx.fill()
            ctx.restore()
        }
    }

    class CircleParticle{
        constructor(x, y, dx, dy){
            this.x = x
            this.y = y
            this.dx = dx
            this.dy = dy
            this.radius = 2
            this.timer = 0
            this.delet = false
        }

        update(delta){
            this.timer++
            this.x = this.x + this.dx*(delta/100);
            this.y = this.y + this.dy*(delta/100);

            if(this.timer >= 200){
                this.delete = true
            }
        }

        render(ctx){
            ctx.save()
            ctx.beginPath()
            ctx.fillStyle = "red";
            ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
            ctx.fill()
            ctx.restore()
        }
    }
}
