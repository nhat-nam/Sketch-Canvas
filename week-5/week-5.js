var canvas, ctx, week5;
var _prevTime = 0;
MIN_WIDTH = 5
LIMIT_OF_RECTANGLES = 500


function runWeek5Canvas(){
    week5 = new Week5();
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    window.requestAnimationFrame(loop);
}


function loop(timestamp){
   var delta = timestamp - _prevTime;
   if(_prevTime == 0){
      delta = 16;
   }

   ctx.clearRect(0,0,500,500);
   week5.update(delta)
   week5.render(ctx)

   _prevTime = timestamp;
   window.requestAnimationFrame(loop);
}

function Week5(){
    this.rectangles = []
    this.limit_reached = false

    r = new Rectangle(20, 20, 260, 260)
    this.rectangles.push(r)

    this.update = function(delta){
        new_rects = [];
        if(this.rectangles.length >= LIMIT_OF_RECTANGLES){
          this.limit_reached = true
        }
        for(var i = 0; i < this.rectangles.length; i++){
            var r = this.rectangles[i];
            r.update(delta);

            if(r.x <= 0 ){
              r.dx = Math.abs(r.dx);

              //split
              if(r.height > MIN_WIDTH && r.height >= r.width && !this.limit_reached){
                r2 = new Rectangle(r.x, r.y + r.height/2, r.width, r.height/2);
                r2.dx = Math.abs(r2.dx);
                r.height = r.height/2;
                new_rects.push(r2);

                r.opacity = r.opacity/1.25;
                r2.opacity = r.opacity
              }

            }

            if(r.x + r.width >= 500){
              r.dx = -1*Math.abs(r.dx);

              //split
              if(r.height > MIN_WIDTH && r.height >= r.width && !this.limit_reached){
                r2 = new Rectangle(r.x, r.y + r.height/2, r.width, r.height/2);
                r2.dx = Math.abs(r2.dx);
                r.height = r.height/2;
                new_rects.push(r2);

                r.opacity = r.opacity/1.25;
                r2.opacity = r.opacity
              }
            }
            if(r.y <= 0){
              r.dy = Math.abs(r.dy);

              //split
              if(r.width > MIN_WIDTH && r.width >= r.height && !this.limit_reached){
                r2 = new Rectangle(r.x+r.width/2, r.y , r.width/2, r.height);
                r2.dx = Math.abs(r2.dx);
                r.width = r.width/2;
                r.opacity = r.opacity/1.25;
                r2.opacity = r.opacity
                new_rects.push(r2);//this.rectangles.push(r2);
              }
            }
            if(r.y + r.height >= 500){
              r.dy = -1*Math.abs(r.dy);

              //split
              if(r.width > MIN_WIDTH && r.width >= r.height && !this.limit_reached){
                r2 = new Rectangle(r.x+r.width/2, r.y , r.width/2, r.height);
                r2.dx = Math.abs(r2.dx);
                r.width = r.width/2;
                r.opacity = r.opacity/1.25;
                r2.opacity = r.opacity
                new_rects.push(r2);//this.rectangles.push(r2);
              }
            }
        }
        for(var i=0;i<new_rects.length;i++){
          this.rectangles.push(new_rects[i]);
        }
    }

    this.render = function(ctx){
        for(var i = 0; i < this.rectangles.length; i++){
            this.rectangles[i].render(ctx)
        }
    }
}

class Rectangle{
    constructor(x, y, w, h){
        this.x = x
        this.y = y
        this.width = w
        this.height = h
        this.dx = Math.random()*60-30;
        this.dy = Math.random()*60-30;
        this.opacity = 1;
    }

    update(delta){
        this.x = this.x + this.dx*(delta/100);
        this.y = this.y + this.dy*(delta/100);
    }

    render(ctx){
        ctx.save()
        ctx.fillStyle = "rgba(0,0,255,"+this.opacity+")";
        ctx.strokeStyle="rgba(0,0,0,.2)";
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.restore()
    }
}
