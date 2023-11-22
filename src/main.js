import {createApp} from 'vue'
import {createPinia} from 'pinia'
import './assets/theme.css'
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';

import App from './App.vue'
import router from './router'
import axios from "axios";
import VueAxios from "vue-axios";
import Vuelidate from 'vuelidate';
import Tooltip from 'primevue/tooltip';
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
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Galleria from 'primevue/galleria';
import Card from "primevue/card";
import MultiSelect from "primevue/multiselect";
import Calendar from "primevue/calendar";
import InputNumber from "primevue/inputnumber";
import Slider from "primevue/slider";
import TriStateCheckbox from "primevue/tristatecheckbox";
import Tag from "primevue/tag";
import Password from "primevue/password";
import Menu from "primevue/menu"
import Toast from "primevue/toast";
import InlineMessage from "primevue/inlinemessage";
import ConfirmDialog from "primevue/confirmdialog";
import Paginator from "primevue/paginator";
import Textarea from "primevue/textarea";
import FileUpload from "primevue/fileupload";
import Chips from "primevue/chips";
import Editor from 'primevue/editor';
import OverlayPanel from "primevue/overlaypanel";

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedState)

app.use(pinia)
app.use(router)
app.use(PrimeVue, {ripple:true})
app.use(ToastService);
app.use(ConfirmationService);
app.use(Vuelidate);

app.use(VueAxios, axios);
app.provide("axios", app.config.globalProperties.axios);

//Primevue components
app.component('DataView', DataView);
app.component('Chips', Chips);
app.component('Textarea', Textarea);
app.component('FileUpload', FileUpload);
app.component('InlineMessage', InlineMessage);
app.component('OverlayPanel', OverlayPanel);
app.component('Editor', Editor);
app.component('DataViewLayoutOptions', DataViewLayoutOptions);
app.component('Dropdown', Dropdown);
app.component('Paginator', Paginator);
app.component('ConfirmDialog', ConfirmDialog);
app.component('Button', Button);
app.component('PickList', PickList);
app.component('OrderList', OrderList);
app.component('Rating', Rating);
app.component('InputText', InputText);
app.component('Dialog', Dialog);
app.component('Chip', Chip)
app.component('Menu', Menu)
app.component('Card', Card)
app.component('Toast', Toast)
app.component('DataTable', DataTable)
app.component('Image', Image)
app.component('Skeleton', Skeleton)
app.component('Avatar', Avatar)
app.component('ProgressBar', ProgressBar)
app.component('Column', Column)
app.component('MultiSelect', MultiSelect)
app.component('Calendar', Calendar)
app.component('InputNumber', InputNumber)
app.component('Galleria', Galleria)
app.component('Slider', Slider)
app.component('TriStateCheckbox', TriStateCheckbox)
app.component('Tag', Tag)
app.directive('tooltip', Tooltip);

app.component('Password', Password)

app.mount('#app')
