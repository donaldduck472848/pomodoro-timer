// Simple pomodoro timer: 25 minutes work, 5 minutes break.
var WORK_SECONDS = 25 * 60;
var BREAK_SECONDS = 5 * 60;
var remaining = WORK_SECONDS;
var mode = 'work';
var sessions = 0;
var timerId = null;

function fmt(seconds) {
  var m = Math.floor(seconds / 60);
  var s = seconds % 60;
  return (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
}

function render() {
  document.getElementById('time').textContent = fmt(remaining);
  document.getElementById('mode').textContent = (mode === 'work' ? 'Work' : 'Break') + ' — ' + sessions + ' session' + (sessions === 1 ? '' : 's') + ' done';
}

function beep() {
  var ctx = new (window.AudioContext || window.webkitAudioContext)();
  var osc = ctx.createOscillator();
  osc.connect(ctx.destination);
  osc.frequency.value = 880;
  osc.start();
  osc.stop(ctx.currentTime + 0.4);
}

function tick() {
  remaining -= 1;
  if (remaining <= 0) {
    clearInterval(timerId);
    timerId = null;
    beep();
    document.getElementById('start').textContent = 'Start';
    if (mode === 'work') {
      sessions += 1;
      mode = 'break';
      remaining = BREAK_SECONDS;
    } else {
      mode = 'work';
      remaining = WORK_SECONDS;
    }
  }
  render();
}

document.getElementById('start').addEventListener('click', function () {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
    this.textContent = 'Start';
  } else {
    timerId = setInterval(tick, 1000);
    this.textContent = 'Pause';
  }
});

document.getElementById('reset').addEventListener('click', function () {
  clearInterval(timerId);
  timerId = null;
  document.getElementById('start').textContent = 'Start';
  remaining = mode === 'work' ? WORK_SECONDS : BREAK_SECONDS;
  render();
});

render();
