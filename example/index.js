import san from '../src/index';

let MyApp = san.defineComponent({
    template: '<p>Hello!{{name}}</p>',
    initData: function () {
        return {
            name: 111
        };
    },
    inited() {
        console.log('inited');
    },
    compiled() {
        console.log('compiled');
    },
    attached() {
        console.log('attached');
    }
});

let myApp = new MyApp();
myApp.data.set('name', 'SAN');
myApp.attach(document.body);