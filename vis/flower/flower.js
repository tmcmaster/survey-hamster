(function(d3, CodeFlower) {
    d3.flower = function(selector, datafile) {
        var createCodeFlower = function(json) {
          new CodeFlower(selector, 600, 600).update(json);
        };
    
        d3.json(datafile, createCodeFlower);
    }
})(window.d3, window.CodeFlower)