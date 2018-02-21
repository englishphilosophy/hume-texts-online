/* create a regular expression from user input */
(() => {

  return query =>
    new RegExp(`\\b(${query})\\b`, 'gi');

})();
