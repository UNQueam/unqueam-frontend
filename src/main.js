import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config';
import '@/assets/styles.scss';

//Primevue imports
import DataView from 'primevue/dataview';
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions';
import Dropdown from 'primevue/dropdown';
import Rating from 'primevue/rating';
import Button from 'primevue/button';
import PickList from 'primevue/picklist';
import OrderList from 'primevue/orderlist';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {ripple:true})

//Primevue components
app.component('DataView', DataView);
app.component('DataViewLayoutOptions', DataViewLayoutOptions);
app.component('Dropdown', Dropdown);
app.component('Rating', Rating);
app.component('Button', Button);
app.component('PickList', PickList);
app.component('OrderList', OrderList);


app.mount('#app')
