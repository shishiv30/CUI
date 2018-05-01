// For use moment.js convenience
Date.prototype.format = function(mask) {
    return moment(this).format(mask);
};

String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined' ? args[number] : match;
    });
};

// Polyfill Number.isNaN(value)
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN
if (!Number.isNaN) {
    Number.isNaN = function(value) {
        return typeof value === 'number' && value !== value;
    };
}

window.requestAnimFrame = (function(fn){
    return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(){
              setTimeout(fn, 17);
          };
})(),
window.cancelAnimFrame =(function(id){
    return window.cancelAnimationFrame       ||
          window.webkitCancelAnimationFrame ||
          window.mozCancelAnimationFrame    ||
          window.oCancelAnimationFrame      ||
          window.msCancelAnimationFrame     ||
          function() {
              clearTimeout(id);
          };
})();
