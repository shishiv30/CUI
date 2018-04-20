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
    var $container = $('.notes');
    var $nextlink = $('.nextlink');
    var $prevlink = $('.prevlink');
    var $navNotes = $('.nav-notes');
    var $topIcon = $('.nav-notes-top .icon-spinner');
    var $bottomIcon = $('.nav-notes-bottom .icon-spinner');
    var index = 0;
    var length = $('.note-item').length;
    var next = function () {
        go(++index);
    };
    var prev = function () {
        go(--index);
    };
    var go = function (index, disableScroll) {
        var scropTop = $.CUI.status.height * index * -1;
        if(disableScroll) {
            $container.data('view').go(scropTop, disableScroll);
        } else {
            $container.data('view').go(scropTop, disableScroll);
        }
    };
    $nextlink.on('click', next);
    $prevlink.on('click', prev);
    $(document).on('dom.load dom.scroll', function () {
        var status = $.CUI.status;
        var scrollTop = $container.data('view').getScrollInfo()[1];
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
    });
    $(document).on('dom.resize', function () {
        go(index, true);
    });
    $(document).trigger('cui.inital');
    $(document).on('notes.overtop', function (e, currPos, offset) {
        $topIcon.css({
            transform: ('rotateZ(' + offset*-1 + 'deg)')
        });
        if(offset > 360){
            $navNotes.addClass('load');
        }else{
            $navNotes.removeClass('load');
        }
    });
    $(document).on('notes.overbottom', function (e, currPos, offset) {
        $bottomIcon.css({
            transform: ('rotateZ(' + offset + 'deg)')
        });
        if(offset > 360){
            $navNotes.addClass('load');
        }else{
            $navNotes.removeClass('load');
        }
    });
    $(document).on('notes.pushtop',function(e, currPos, offset){
        if(offset > 360){
            alert('go back!!!');
            setTimeout(function(){
                $navNotes.removeClass('load');
            },200);
        }
    });
    $(document).on('notes.pushbottom',function(e, currPos, offset){
        if(offset > 360){
            $('.nav-notes-bottom')[0].click();
            setTimeout(function(){
                $navNotes.removeClass('load');
                $(document).trigger('dom.resize');
            },200);
        }
    });
};
var fakeComments = function () {
    return [{
        text: 'ha ha',
        count: 123,
    },
    {
        text: 'looks nice',
        count: 4
    },
    {
        text: 'awesome picture',
        count: 123
    },
    {
        text: 'so sweet',
        count: 23
    },
    {
        text: 'agree with that',
        count: 16
    },
    {
        text: 'have fun on this',
        count: 18
    },
    {
        text: 'best regards to you',
        count: 5
    },
    {
        text: 'hope you can doing better',
        count: 29
    }, {
        text: '"I use to think',
        count: 12
    }
    ];
};
var fakeNotes = function () {
    var notesDemo = [
        {
            type: 'image',
            title: 'Jump in San Mateo Half Moon Bay',
            heartTo: 793,
            dateFromStr: '2014 - 06 - 20',
            dateTo: '2018-02-14',
            img: 'dist/src/visual/src/1_Fotor.jpg',
            isFavorite: false
        }, {
            type: 'image',
            title: 'Jump in San Mateo Half Moon Bay',
            heartTo: 437,
            dateFromStr: '2013 - 11 - 20',
            dateTo: '2016-02-14',
            img: 'dist/src/visual/src/2_Fotor.jpg',
            isFavorite: false
        }, {
            type: 'image',
            title: 'Lovely shadow on the beach',
            heartTo: 130,
            dateFromStr: '2011 - 05 - 13',
            dateTo: '2015-07-09',
            img: 'dist/src/visual/src/3_Fotor.jpg',
            isFavorite: false
        }, {
            type: 'image',
            title: 'Enjoy the back seat.',
            heartTo: 1793,
            dateFrom: '2008-03-15',
            dateFromStr: '2008 - 03 - 15',
            dateTo: '2012-09-05',
            img: 'dist/src/visual/src/4_Fotor.jpg',
            isFavorite: false
        }, {
            type: 'image',
            title: 'Puppy stand on the Rock',
            heartTo: 2793,
            dateFrom: '2005-12-30',
            dateFromStr: '2005 - 12 - 30',
            dateTo: '2006-08-27',
            img: 'dist/src/visual/src/5_Fotor.jpg',
            isFavorite: false
        }
    ];
    var notes = [];
    if(localStorage.length) {
        for(var key in localStorage) {
            var noteString = localStorage.getItem(key);
            if(noteString) {
                notes.push(JSON.parse(noteString));
            }
        }
    } else {
        for(var i = 0; i < notesDemo.length; i++) {
            var item = notesDemo[i];
            item.id = 'note' + +new Date();
            item.comments = fakeComments();
            db.set(item.id, item);
            notes.push(item);
        }
    }
    return notes;
};
var db = {
    set: function (key, value) {
        var dfd = $.Deferred();
        if(localStorage) {
            var data = JSON.stringify(value);
            localStorage.setItem(key, data);
            dfd.resolve(value);
        } else {
            dfd.resolve(null);
        }
        return dfd;
    },
    remove: function (key) {
        var dfd = $.Deferred();
        if(localStorage) {
            localStorage.setItem(key, null);
            dfd.resolve(true);
        } else {
            dfd.resolve(false);
        }
        return dfd;
    },
    get: function (key) {
        var dfd = $.Deferred();
        if(localStorage) {
            var data = JSON.parse(localStorage.getItem(key));
            dfd.resolve(data);
        } else {
            dfd.resolve(null);
        }
        return dfd;
    }
};
var notes = fakeNotes();
new window.Vue({
    el: '#app',
    data: {
        text: 'hello',
        notes: notes,
        updateComment: {
            id: null,
            comments: []
        },
        comment: '',
    },
    mounted: function () {
        setTimeout(function () {
            inital();
        }, 1);
    },
    methods: {
        loadNext: function () {
            this.$set(this, 'notes', this.notes.concat(fakeNotes()));
        },
        sortBy: function (type) {
            if(this.updateComment.comments && this.updateComment.comments.length) {
                this.updateComment.comments.sort(function (a, b) {
                    return a[type] > b[type];
                });
            }
        },
        addComment: function (words, isIncrease) {
            words = words || this.comment;
            if(words) {
                words = words.trim().toLowerCase();
                var updateItem = this.updateComment;
                db.get(updateItem.id).then(function (note) {
                    var item = null;
                    var index = -1;
                    for(var i = 0; i < updateItem.comments.length; i++) {
                        if(words === updateItem.comments[i].text) {
                            item = updateItem.comments[i];
                            index = i;
                            break;
                        }
                    }
                    if(item) {
                        if(isIncrease) {
                            item.count += 1;
                        } else {
                            item.count -= 1;
                        }
                        if(item.count <= 0) {
                            updateItem.comments.splice(index, 1);
                        }
                    } else {
                        updateItem.comments.unshift({
                            text: words,
                            count: 1
                        });
                    }
                    note.comments = updateItem.comments;
                    db.set(note.id, note).then(function () {
                        $(document).trigger('dom.load.transition');
                    });
                });
                this.comment = '';
            }
        },
        toggleComment: function (isOpen, id) {
            var $body = $('body');
            if(isOpen) {
                var vm = this;
                var item = vm.notes.find(function (e) {
                    return id === e.id;
                });
                if(item) {
                    vm.$set(vm.updateComment, 'comments', item.comments || []);
                    vm.$set(vm.updateComment, 'id', item.id);
                    $body.addClass('comment-shown');
                }
            } else {
                $body.removeClass('comment-shown');
            }
        },
        toggleFavorite: function (note) {
            note.isFavorite = !note.isFavorite;
        }
    }
});
