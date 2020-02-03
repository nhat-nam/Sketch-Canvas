var canvas, ctx, week----N;
var _prevTime = 0;


function runWeek---NCanvas(){
    //week---N = new WeekN();
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

   week---N.update(delta)
   week---N.render(ctx)
}

function Week#(){

}
