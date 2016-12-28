window.utils = {};
(function (cmp) {
    cmp.genUuid = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
})(window.utils);