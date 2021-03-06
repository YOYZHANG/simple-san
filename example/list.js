import san from '../src/index';

let MyApp = san.defineComponent({
    template: '<ul><li san-for="item in list">{{item}}</li></ul>',
    initData: function() {
        return {
            list: ['san']
        };
    },
    attached: function () {
        this.data.set('list', ['san', 'er', 'esui', 'etpl', 'esl']);
    }
});

var myApp = new MyApp();
myApp.attach(document.body);