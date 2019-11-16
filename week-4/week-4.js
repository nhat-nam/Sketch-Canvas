var canvas, ctx, week4;
var _prevTime = 0;
EARTH_VELOCITY = .01


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
   ctx.clearRect(0,0,500,500)
   week4.update(delta);
   week4.render(ctx);
   _prevTime = timestamp;
   window.requestAnimationFrame(loop);
}

function Week4(){
    this.planets = []
    this.planets.push(new Planet(240,0,10));
    this.planets.push(new Star(0,0,100))
    this.planets.push(new Venus(200,0,10));
    this.planets.push(new Mercury(150,0,5));
    this.planets.push(new Mars(270, 0, 7))
    this.planets.push(new Jupiter(330, 0, 25))
    this.planets.push(new Saturn(400, 0, 15))
    this.planets.push(new Uranus(450, 0, 9))
    this.planets.push(new Neptune(490, 0, 9))
    this.update = function(delta){
        for(var i = 0; i < this.planets.length; i++){
            this.planets[i].update(delta)
        }
    }

    this.render = function(ctx){
        for(var i = 0; i < this.planets.length; i++){
            this.planets[i].render(ctx)
        }
    }
}

class Planet{
    constructor(x, y, r){
        this.x = x
        this.y = y
        this.r = r
        this.angular_velocity = EARTH_VELOCITY;
        this.center_world_x =250;
        this.center_world_y = 250;
        this.angle = 0;
    }

    update(delta){
      this.angle = this.angle + this.angular_velocity;
    }
    drawPlanet(ctx){
        ctx.beginPath();
        ctx.fillStyle="blue";
        ctx.arc(this.x, 0, this.r, 0, 2*Math.PI);
        ctx.fill();
    }
    render(ctx){
        ctx.save();
        ctx.translate(this.center_world_x, this.center_world_y);
        ctx.rotate(this.angle);
        ctx.scale(.4,.4);

        ctx.strokeStyle="rgba(0,180,180,.8)";
        ctx.beginPath();
        ctx.arc(0,0,this.x,0, Math.PI*2);
        ctx.stroke();

        this.drawPlanet(ctx);

        ctx.restore();
    }
}

class Star extends Planet{
    constructor(x, y, r){
        super(x,y,r);
        this.angular_velocity =0;
    }
    drawPlanet(ctx){
        ctx.beginPath();
        ctx.fillStyle="yellow";
        ctx.arc(this.x, 0, this.r, 0, 2*Math.PI);
        ctx.fill();
    }

}

class Venus extends Planet{
    constructor(x, y, r){
        super(x,y,r);
        this.angular_velocity = EARTH_VELOCITY /.616;
    }
    drawPlanet(ctx){
        ctx.beginPath();
        ctx.fillStyle="red";
        ctx.arc(this.x, 0, this.r, 0, 2*Math.PI);
        ctx.fill();
    }

}

class Mercury extends Planet{
    constructor(x, y, r){
        super(x,y,r);
        this.angular_velocity = EARTH_VELOCITY * 4.14;
    }
    drawPlanet(ctx){
        ctx.beginPath();
        ctx.fillStyle="orange";
        ctx.arc(this.x, 0, this.r, 0, 2*Math.PI);
        ctx.fill();
    }
}

class Mars extends Planet{
    constructor(x, y, r){
        super(x,y,r);
        this.angular_velocity = EARTH_VELOCITY * .538;
    }
    drawPlanet(ctx){
        ctx.beginPath();
        ctx.fillStyle="brown";
        ctx.arc(this.x, 0, this.r, 0, 2*Math.PI);
        ctx.fill();
    }
}

class Jupiter extends Planet{
    constructor(x, y, r){
        super(x,y,r);
        this.angular_velocity = EARTH_VELOCITY/12;
    }
    drawPlanet(ctx){
        ctx.beginPath();
        ctx.fillStyle="rgba(216,175,113,1)";
        ctx.arc(this.x, 0, this.r, 0, 2*Math.PI);
        ctx.fill();
    }
}

class Saturn extends Planet{
    constructor(x, y, r){
        super(x,y,r);
        this.angular_velocity = EARTH_VELOCITY/29;
    }
    drawPlanet(ctx){
        ctx.beginPath();
        ctx.fillStyle="rgba(121,113,101,1)";
        ctx.arc(this.x, 0, this.r, 0, 2*Math.PI);
        ctx.fill();
        ctx.strokeStyle=ctx.fillStyle;

        ctx.beginPath();
        ctx.arc(this.x, 0, this.r+5, 0, 2*Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.x, 0, this.r+2, 0, 2*Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.x, 0, this.r+8, 0, 2*Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.x, 0, this.r+10, 0, 2*Math.PI);
        ctx.stroke();

    }
}

class Uranus extends Planet{
    constructor(x, y, r){
        super(x,y,r);
        this.angular_velocity = EARTH_VELOCITY/8;
    }
    drawPlanet(ctx){
        ctx.beginPath();
        ctx.fillStyle="rgba(156,249,249,1)";
        ctx.arc(this.x, 0, this.r, 0, 2*Math.PI);
        ctx.fill();
    }
}

class Neptune extends Planet{
    constructor(x, y, r){
        super(x,y,r);
        this.angular_velocity = EARTH_VELOCITY/165;
    }
    drawPlanet(ctx){
        ctx.beginPath();
        ctx.fillStyle="rgba(0,20,255,1)";
        ctx.arc(this.x, 0, this.r, 0, 2*Math.PI);
        ctx.fill();
    }
}
