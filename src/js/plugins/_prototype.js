// For use moment.js convenience
Date.prototype.format = function(mask, utc) {
    return moment(this, mask, utc);
};

// Polyfill Number.isNaN(value)
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN
if (!Number.isNaN) {
    Number.isNaN = function(value) {
        return typeof value === 'number' && value !== value;
    };
}