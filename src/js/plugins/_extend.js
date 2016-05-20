if (!String.prototype.format) {
  String.prototype.format = function () {
      var args = arguments;
      return this.replace(/{(\d+)}/g, function (match, number) {
          return typeof args[number] != 'undefined'
            ? args[number]
            : match
          ;
      });
  };
}
(function($){
  $.isMobile =function(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      return true;
    }else{
      return false;
    }
  }
})(jQuery);
