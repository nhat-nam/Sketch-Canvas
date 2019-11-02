var canvas, ctx, week2;
var _prevTime = 0;

var MAGNITUDE = 20
var WIDTH = 500
var HEIGHT = 500


//runs everything
function runWeek3Canvas(){
    week3 = new Week3();
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

    week3.update(delta)
    week3.render(ctx)

    _prevTime = timestamp;
    window.requestAnimationFrame(loop);
}

//defines Week3 object
function Week3(){
    this.timer = 0
    this.lines = []



    this.render = function(ctx){
        //clear our canvas
        ctx.clearRect(0, 0, 500, 500);
        for(var i = 0; i < this.lines.length; i++){
            this.lines[i].render(ctx)
        }
    }

    this.update = function(delta){
        if(this.timer % 50 == 0){
            var l = new Line(Math.random()*500 - 1, Math.random()*500 - 1, Math.random()*350, Math.random()*500 + 100)
            this.lines.push(l)
        }
        this.timer++
        for(var i = 0; i < this.lines.length; i++){
            this.lines[i].update(delta)
            if(this.lines[i].alpha <= 0){
                this.lines.splice(i,1);
            }
        }
    }
}

function Line(x, y, length, line_timer){
    this.x = x
    this.y = y
    this.length = length
    this.line_timer = line_timer
    this.alpha = 1
    this.width = Math.random()*5;
    this.angle = 0;

    this.start_disappearing = function(){
        this.alpha = this.alpha - 0.01;
        this.line_timer = Math.floor(Math.random()*25);
    }

    this.update = function(delta){
        this.line_timer--
        if(this.line_timer <= 0){
            this.start_disappearing();
        }
        this.angle+=(.1*(1-this.alpha));
    }

    this.render = function(ctx){
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.strokeStyle  = "rgba(0,0,100,"+this.alpha+")";
        ctx.fillStyle  = "rgba(0,0,100,"+this.alpha+")";
        ctx.beginPath();
        ctx.lineWidth =this.width;
        ctx.arc(0,0,this.width,0,Math.PI*2);
        ctx.moveTo(0, -1*this.length/2);
        ctx.lineTo(0, this.length/2);
        //ctx.moveTo(this.x, this.y)
        //ctx.lineTo(this.x, this.y + this.length)
        ctx.stroke();
        ctx.restore();
    }
}
