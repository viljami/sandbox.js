module('array.flatten', function(){
  return function flatten (a){
    return a.reduce(function(b, c){
      return b.concat(Array.isArray(c) ? flatten(c) : c);
    }, []);
  };
});
