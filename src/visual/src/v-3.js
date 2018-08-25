var scroe = {
    //人生观
    spirit: {
        ego: 0,
        superego: 0,
        id: 0,
    },
    //价值观
    judgement: {
        Uderstanding: 0,
        Reason: 0,
        Perception: 0
    },
    //世界观
    values: {
        Science: 0,
        philosophy: 0,
        religion: 0
    }
};
var questions = [{
    id: 'q1',
    title: '一个骑三轮车的老爷爷刮花了名牌轿车,车主正在与他商讨调解,你的第一反应是',
    answers: [{
        value: 'A',
        text: '与我无关,管他谁对谁错',
        map: ['ego']
    },
    {
        value: 'B',
        text: '都那么有钱还斤斤计较?算了吧...',
        map: ['Perception', 'superego']
    },
    {
        value: 'C',
        text: '最讨厌那些站着求情不腰疼的,如果换成你的车被刮花,我看你还有没有这么大方',
        map: ['ego', 'Uderstanding']
    },
    {
        value: 'D',
        text: '如果是大爷违规在先,该怎么罚就怎么罚,至于愿不愿意原谅大爷是人家自己的事,我就不评论了',
        map: ['Reason', 'ego']
    }]
}, {
    id: 'q2',
    title: '你是否相信鬼神',
    answers: [{
        value: 'A',
        text: '我不信,都是假的',
        map: ['Science']
    },
    {
        value: 'B',
        text: '事上确有不可证伪也不可证实的东西,还是不要冒犯的好',
        map: ['Science']
    },
    {
        value: 'C',
        text: '人类的认识水平还远没有达到洞悉宇宙万物的水平,也许那些生活在高维生物鬼神看我们就像我们看漫画里的人物一样',
        map: ['Reason', 'philosophy']
    },
    {
        value: 'D',
        text: '就算不信,至少要敬而远之,这些东西好说的',
        map: ['Perception', 'religion']
    }
    ]
}, {
    id: 'q3',
    title: '如何看待爱情与婚姻',
    answers: [{
        value: 'A',
        text: '都说婚姻是爱情的坟墓,我可不想沦为传宗接代工具,还没享受够呢',
        map: ['id', 'Perception']
    },
    {
        value: 'B',
        text: '这年头想找个合适的对象太难了,还是宅家里撸猫吧',
        map: ['ego', 'Uderstanding']
    },
    {
        value: 'C',
        text: '在真爱出现之前我会选择一直等待,绝不将就',
        map: ['Reason', 'ego']
    },
    {
        value: 'D',
        text: '命中注定缺爱,这辈子是不指望了',
        map: ['Perception', 'religion']
    }
    ]
}];
var inital = function () {
    $(document).trigger('cui.inital');
};
new window.Vue({
    el: '#app',
    data: {
        questions: questions,
        result: {}
    },
    mounted: function () {
        setTimeout(function () {
            inital();
        }, 1);
    },
    methods: {
        next: function (q, a, index) {
            this.result[q.id] = a.map;
            var nextIndex = index + 1;
            if(this.questions.length > nextIndex) {
                location.href = ('#' + this.questions[nextIndex].id);
            }
        }
    }
});
