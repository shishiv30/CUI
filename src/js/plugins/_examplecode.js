//todo example code for create a example
// (function($) {
//     var exampleConfig = {
//         name: 'example',
//         defaultOpt: {},
//         init: function(context) {
//             var opt = context.opt;
//             var $this = context.$element;
//             var $target = context.$target = $(opt.target);
//
//         },
//         exports: {
//             show: function() {
//
//             },
//             hide: function() {
//
//             }
//         },
//         setOptionsBefore: null,
//         setOptionsAfter: null,
//         initBefore: null,
//         initAfter: function(context) {
//             var $this = context.$element;
//             var $target = context.$target;
//             var opt = context.opt;
//             var exports = context.exports;
//
//         },
//         destroyBefore: function(context) {
//             var $this = context.$element;
//         }
//     };
//     $.CUI.plugin(exampleConfig);
//     $(document).on('dom.load.example', function() {
//         $('[data-example]').each(function(index, item) {
//             var $this = $(item);
//             var data = $this.data();
//             $this.example(data);
//             $this.removeAttr('data-example');
//             $this.attr('data-example-load', '');
//             $this.attr('role', 'Plugin');
//         });
//     });
// })(jQuery);