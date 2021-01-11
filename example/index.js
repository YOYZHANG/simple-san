import san from '../src/index';

let MyApp = san.defineComponent({
    template: '<p>Hello!</p>',
    initData: function () {
        return {};
    }
});

let myApp = new MyApp();
// myApp.data.assign({name: 'SAN'}, {silent: true});
myApp.attach(document.body);