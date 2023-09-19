import {createApp} from 'vue'
import {createPinia} from 'pinia'
import './assets/theme.css'
import ToastService from 'primevue/toastservice';

import App from './App.vue'
import router from './router'
import axios from "axios";
import VueAxios from "vue-axios";
import Vuelidate from 'vuelidate';

import PrimeVue from 'primevue/config';
import '@/assets/styles.scss';
import piniaPluginPersistedState from "pinia-plugin-persistedstate"

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
import Avatar from "primevue/avatar";
import ProgressBar from "primevue/progressbar";
import Password from "primevue/password";
import Menu from "primevue/menu"
import Toast from "primevue/toast";

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedState)

app.use(pinia)
app.use(router)
app.use(PrimeVue, {ripple:true})
app.use(ToastService);
app.use(Vuelidate);

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
app.component('Menu', Menu)
app.component('Toast', Toast)
app.component('Image', Image)
app.component('Skeleton', Skeleton)
app.component('Avatar', Avatar)
app.component('ProgressBar', ProgressBar)
app.component('Password', Password)

app.mount('#app')
