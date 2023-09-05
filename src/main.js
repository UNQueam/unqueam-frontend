import {createApp} from 'vue'
import {createPinia} from 'pinia'
import './assets/theme.css'

import App from './App.vue'
import router from './router'
import axios from "axios";
import VueAxios from "vue-axios";

import PrimeVue from 'primevue/config';
import '@/assets/styles.scss';

//Primevue imports
import DataView from 'primevue/dataview';
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions';
import Dropdown from 'primevue/dropdown';
import Rating from 'primevue/rating';
import Button from 'primevue/button';
import InputText from "primevue/inputtext";
import PickList from 'primevue/picklist';
import OrderList from 'primevue/orderlist';
import Dialog from 'primevue/dialog';
import Chip from "primevue/chip";
import Image from "primevue/image";
import Skeleton from "primevue/skeleton";

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {ripple:true})

app.use(VueAxios, axios);
app.provide("axios", app.config.globalProperties.axios);

//Primevue components
app.component('DataView', DataView);
app.component('DataViewLayoutOptions', DataViewLayoutOptions);
app.component('Dropdown', Dropdown);
app.component('Rating', Rating);
app.component('Button', Button);
app.component('PickList', PickList);
app.component('OrderList', OrderList);
app.component('InputText', InputText);
app.component('Dialog', Dialog);
app.component('Chip', Chip)
app.component('Image', Image)
app.component('Skeleton', Skeleton)


app.mount('#app')
