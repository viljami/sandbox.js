module('object.copy', function(){
  function copyKeyVal(a, o, k){
    o[k] = a[k];
    return o;
  }

  return function(o){
    return Object
    .keys(a)
    .reduce(copyKeyVal.bind(null, o), {});
  };
});