// (function($) {
//     $.fn.facebooklink = function() {
//         var $this = $(this);
//         var namespace = {
//             go: function() {
//                 var keyword = $this.data('keyword');
//                 var url = encodeURIComponent(location.href);
//                 if (keyword)
//                     url = url + '&t=' + encodeURIComponent(keyword);
//                 window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, 'facebook-share-dialog', 'sharer', 'toolbar=0,status=0,width=626,height=436');
//             }
//         };
//         $this.click(namespace.go);
//         $this.data('facebooklink', namespace);
//         return namespace;
//     };
//     $.fn.googlepluslink = function() {
//         var $this = $(this);
//         var namespace = {
//             go: function() {
//                 window.open('https://plus.google.com/share?url=' + encodeURIComponent(location.href), 'googlesharer', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
//             }
//         };
//         $this.data('googlepluslink', namespace);
//         return namespace;
//     };
//     $.fn.twitterlink = function() {
//         var $this = $(this);
//         var namespace = {
//             go: function() {
//                 window.open('http://twitter.com/share?text=Check out this house I found on @Conjee&url=' + encodeURIComponent(location.href));
//             }
//         };
//         $this.click(namespace.go);
//         $this.data('twitterlink', namespace);
//         return namespace;
//     };
//     $.fn.phonecall = function() {
//         var $this = $(this);
//         var number = $this.data('phonecall');
//         var namespace = {
//             go: function() {
//                 window.location.href = 'tel:1' + number;
//             }
//         };
//         $this.click(namespace.go);
//         $this.data('phonecall', namespace);
//         return namespace;
//     };
//     $.fn.mailto = function() {
//         var $this = $(this);
//         var mail = $this.data('mailto');
//         var params = $this.data('params');
//         var namespace = {
//             go: function() {
//                 var link = 'mailto:' + mail;
//                 if (params) {
//                     link = link + '?' + params;
//                 }
//                 window.location.href = link;
//             }
//         };
//         $this.click(namespace.go);
//         $this.data('mailto', namespace);
//         return namespace;
//     };
//     $.fn.msgto = function() {
//         var $this = $(this);
//         var text = $this.data('msgto');
//         var smsChar = (browser && browser.versions && browser.versions.ios) ? '&' : '?';
//         var namespace = {
//             go: function() {
//                 window.location.href = 'sms:' + smsChar + 'body=' + text;
//             }
//         };
//         $this.click(namespace.go);
//         $this.data('msgto', namespace);
//         return namespace;
//     };
//     $(document).on('click', '[data-link]', function() {
//         var $this = $(this);
//         var type = $this.attr('data-link');
//         var target = $this.attr('data-target');
//         switch (type) {
//             case 'facebook':
//                 $this.facebooklink().go();
//                 break;
//             case 'googleplus':
//                 $this.googlepluslink().go();
//                 break;
//             case 'twitter':
//                 $this.twitterlink().go();
//                 break;
//             case 'phonecall':
//                 $this.phonecall().go();
//                 break;
//             case 'mailto':
//                 $this.mailto().go();
//                 break;
//             case 'msgto':
//                 $this.msgto().go();
//                 break;
//             case 'focuson':
//                 var timer = setTimeout(function() {
//                     $(target).focus();
//                 }, 100);
//                 $this.on('click', function() {
//                     if (timer) {
//                         clearTimeout(timer);
//                     }
//                     timer = setTimeout(function() {
//                         $(target).focus();
//                     }, 100);
//                 });
//                 break;
//             case 'utm':
//                 $this.utmlink().go();
//                 return false;
//             default:
//                 $.sendRequest($this.attr('href'), {
//                     type: 'redirect'
//                 });
//                 break;
//         }
//         $this.removeAttr('data-link');
//     });
// })(jQuery);
