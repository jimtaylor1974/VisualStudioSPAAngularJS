Array.prototype.removeAll = function () {
    while (this.length > 0) {
        this.pop();
    }
};

Array.prototype.remove = function(value) {
    if (this.indexOf(value) !== -1) {
        this.splice(this.indexOf(value), 1);
        return true;
    } else {
        return false;
    };
};