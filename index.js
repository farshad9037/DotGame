"use strict";

const winX = window.outerWidth;
const winY = window.outerHeight;
const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");
let dotArr = [];

const MIN_DOT_RADIUS = 10;
const MAX_DOT_RADIUS = 100;

canvas.width = winX;
canvas.height = winY;

class Dot {
  constructor() {
    this.color = 'blue';
    this.radius = getRndInteger(1, 10) * MIN_DOT_RADIUS;
    this.x = getRndInteger(MAX_DOT_RADIUS, winX - MAX_DOT_RADIUS); // returns a random integer between 100 and winX - 100
    this.y = 0;
  }

  update() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    c.fillStyle = this.color;
    c.fill();
  }
}

function start() {
  document.getElementById('startBtn').style.display = 'none';
  dotArr.push(new Dot())
  animate();
  setInterval(function() {
    // Only 2 dots at a time on the screen
    if (dotArr.length > 1) {
      dotArr.splice(0, 1);
    }
    dotArr.push(new Dot());
  }, 1000);
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, winX, winY);
  // Max array length will be 2 
  dotArr.forEach(each => {
    each.update();
    each.y += 10;
  });
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

