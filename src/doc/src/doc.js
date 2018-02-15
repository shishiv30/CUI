function submit() {
    var msg = 'error!';
    var $form = $('#form').data('form');
    if ($form.isValid()) {
        msg = JSON.stringify($form.getValue());
        alert(msg);
    }
}
var getMoveText = function (startPoint, endPoint) {
    var str1;
    var str2;
    if (startPoint.touches.length) {
        var start = Array.prototype.slice.call(startPoint.touches);
        str1 = start.reduce(function (pre, next, index) {

            return pre + 'Y:' + next.pageY + 'X:' + next.pageX + ' ';
        }, '(Start) ');
    }
    if (endPoint.touches.length) {
        var end = Array.prototype.slice.call(endPoint.touches);
        str2 = end.reduce(function (pre, next, index) {
            return pre + 'Y:' + next.pageY + 'X:' + next.pageX + ' ';
        }, '(End) - ');
    }

    return str1 + '<br>' + str2;
};
$('#eventDiv').on('moving', function (t, start, end) {
    $(this).html('moving... <br>' + getMoveText(start, end));
});
$('#eventDiv').on('pinchin', function (t, start, end) {
    $(this).html('pinchin <br>' + getMoveText(start, end));
});
$('#eventDiv').on('pinchout', function (t, start, end) {
    $(this).html('pinchout <br>' + getMoveText(start, end));
});
$('#eventDiv').on('swipeleft', function (t, start, end) {
    $(this).html('swipeleft <br>' + getMoveText(start, end));
});
$('#eventDiv').on('swiperight', function (t, start, end) {
    $(this).html('swiperight <br>' + getMoveText(start, end));
});
$('#eventDiv').on('swipedown', function (t, start, end) {
    $(this).html('swipedown <br>' + getMoveText(start, end));
});
$('#eventDiv').on('swipeup', function (t, start, end) {
    $(this).html('swipeup <br>' + getMoveText(start, end));
});
$('#loadingSection').on('click', function () {
    $('.skeleton').html('After Content Loaded, It will show the real content with real height');
});
$(document).one('datatable.inital', function (e, element, obj) {
    obj.setOptions({
        columns: [{
            key: 'name',
            type: 'string',
            display: 'Name'
        }, {
            key: 'age',
            type: 'number',
            display: 'Age',
            sortable: true
        }, {
            key: 'birthday',
            type: 'date',
            format: 'Y-M-D',
            display: 'Birthday',
            sortable: true
        }, {
            key: 'id',
            type: 'number',
            display: 'Description',
            sortable: true,
            template: 'Salary ${{salary}} per day. {{name}} is {{position}}'
        }],
        data: [{
            id: '1',
            name: 'Conjee',
            age: '30',
            birthday: '09/05/1986',
            salary: '80',
            position: 'Designer'
        }, {
            id: '2',
            name: 'Steven',
            age: '18',
            birthday: '09/05/2001',
            salary: '50',
            position: 'Engieener'
        }, {
            id: '3',
            name: 'Shadow',
            age: '33',
            birthday: '09/05/1983',
            salary: '100',
            position: 'S Engieener'
        }]
    });
});
$('.circle-item').each(function (index, item) {
    var $item = $(item);
    $item.text($item.css('backgroundColor').replace('rgb', ''));
});
$(document).one('initialMap', function (d, e, t) {
    t.addMarker({
        lat: -34.397,
        lng: 150.644,
        html: true,
        popTmp:'<div><h1>{{words}}</h1></div>',
        popData:{
            words:'hello'
        },
        onclick: function () {
            console.log('click!!!!!');
        }
    });
});
