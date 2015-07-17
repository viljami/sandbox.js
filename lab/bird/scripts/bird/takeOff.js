module('bird.takeOff', function(){

  var times = [
    {stamp: 1000, duration: 1000, holdStill: true},
    {stamp: 2000, duration: 200},
    {stamp: 2500, duration: 300},
    {stamp: 3000, duration: 400},
    {stamp: 4000, duration: 500},
    {stamp: 5600, duration: 600},
    {stamp: 7000, duration: 700},
    {stamp: 8500, duration: 900},
    {stamp: 10000, duration: 1000},
    {stamp: 12000, duration: 1300},
    {stamp: 14000, duration: 1500},
    {stamp: 0, duration: 900}
  ];

  return function takeOff (){
    var timeLapse = 0;
    return function (dt) {
      timeLapse += dt;
      return times.filter(function(t){ return t.stamp > timeLapse; })[0] ||
        times[times.length - 1];
    };
  };
});
