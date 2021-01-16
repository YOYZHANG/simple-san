import san from '../src/index';

let MyApp = san.defineComponent({
    template: '<p class="folder" on-click="toggle">Hello!{{name}}</p>',
    toggle: function () {
        this.data.set('name', 'SAN');
    }
});

let myApp = new MyApp();
myApp.attach(document.body);