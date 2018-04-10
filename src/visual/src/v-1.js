var inital = function () {
    $(document).on('img.load.success', function (e, $img) {
        if($img.length) {
            $img.closest('.note-item').addClass('load');
            if($img[0].naturalHeight > $img[0].naturalWidth) {
                $img.closest('.note-item').addClass('y');
            } else {
                $img.closest('.note-item').addClass('x');
            }
        }
    });
    var $nextlink = $('.nextlink');
    var $prevlink = $('.prevlink');
    var index = 0;
    var length = $('.note-item').length;
    $(document).on('dom.load dom.scroll', function () {
        var status = $.CUI.status;
        var scrollTop = status.scrollTop;
        index = Math.round(scrollTop / status.height);
        if(index <= 0) {
            $prevlink.hide();
        } else if(index >= (length - 1)) {
            $nextlink.hide();
        } else {
            $prevlink.show();
            $nextlink.show();
        }
        var $item = $('[data-id="' + index + '"]');
        if(!$item.hasClass('active')) {
            $('.note-item.active').removeClass('active');
            $item.addClass('active');
        }
        $('.note-item').eq(index).addClass('active');
    });
    var next = function () {
        go(++index);
    };
    var prev = function () {
        go(--index);
    };
    var go = function (index) {
        var scropTop = $(window).height() * index;
        $('html,body').stop().animate({
            scrollTop: scropTop
        }, 500);
    };
    $nextlink.on('click', next);
    $prevlink.on('click', prev);
    $(document).trigger('dom.load');
};
var fakeComments =function(){
    return [
        {
            text:'looks nice',
            count:4
        },
        {
            text:'awesome picture',
            count:123
        },
        {
            text:'so sweet',
            count:23
        },
        {
            text: 'agree with that',
            count:16
        },
        {
            text:'have fun on this',
            count:18
        },
        {
            text:'best regards to you',
            count:5
        },
        {
            text:'hope you can doing better',
            count:29
        },
    ];
};
var fakeNotes = function () {
    var notesDemo = [
        {
            title: 'Jump in San Mateo Half Moon Bay',
            heartTo: 793,
            heartFrom: 9,
            commentTo: 32,
            commentFrom: 0,
            dateFrom: '2014-06-20',
            dateFromStr: '2014 - 06 - 20',
            dateTo: '2018-02-14',
            img: 'dist/src/visual/src/1_Fotor.jpg',
            isFavorite:false
        }, {
            title: 'Jump in San Mateo Half Moon Bay',
            heartTo: 437,
            heartFrom: 12,
            commentTo: 62,
            commentFrom: 0,
            dateFrom: '2013-11-20',
            dateFromStr: '2013 - 11 - 20',
            dateTo: '2016-02-14',
            img: 'dist/src/visual/src/2_Fotor.jpg',
            isFavorite:false
        }, {
            title: 'Lovely shadow on the beach',
            heartTo: 130,
            heartFrom: 0,
            commentTo: 11,
            commentFrom: 4,
            dateFrom: '2011-05-13',
            dateFromStr: '2011 - 05 - 13',
            dateTo: '2015-07-09',
            img: 'dist/src/visual/src/3_Fotor.jpg',
            isFavorite:false
        }, {
            title: 'Enjoy the back seat.',
            heartTo: 1793,
            heartFrom: 13,
            commentTo: 82,
            commentFrom: 12,
            dateFrom: '2008-03-15',
            dateFromStr: '2008 - 03 - 15',
            dateTo: '2012-09-05',
            img: 'dist/src/visual/src/4_Fotor.jpg',
            isFavorite:false
        }, {
            title: 'Puppy stand on the Rock',
            heartTo: 2793,
            heartFrom: 21,
            commentTo: 121,
            commentFrom: 35,
            dateFrom: '2005-12-30',
            dateFromStr: '2005 - 12 - 30',
            dateTo: '2006-08-27',
            img: 'dist/src/visual/src/5_Fotor.jpg',
            isFavorite:false
        }
    ];
    var notes = [];
    for(var i = 0; i < 20; i++) {
        notes.push(notesDemo[i % 5]);
    }
    return notes;
};
new window.Vue({
    el: '#app',
    data: {
        text: 'hello',
        notes: fakeNotes(),
        comments: fakeComments(),
        comment:'',
    },
    mounted: function () {
        setTimeout(function () {
            inital();
        }, 10);
    },
    methods: {
        addComment: function (words) {
            words = words||this.comment;
            if(words){
                words = words.trim().toLowerCase();
                var item = this.comments.find(function(e){
                    return words === e.text;
                });
                if(item){
                    item.count += 1;
                }
            } else if(words){
                this.comments.push({
                    text: words,
                    count: 1
                });
                this.comment='';
            }
            this.toggleComment(close);
        },
        toggleComment:function(isOpen){
            var $body = $('body');
            if(isOpen) {
                $body.addClass('comment-shown');
            } else {
                $body.removeClass('comment-shown');
            }
        },
        toggleFavorite:function(note){
            note.isFavorite = !note.isFavorite;
        }
    }
});
