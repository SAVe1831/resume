import { createApp } from 'vue'
import App from './App.vue'

import PrimeVue from 'primevue/config'

import Navbar from '@/components/Navbar.vue'
import router from '@/router/index.js'


import 'primevue/resources/themes/soho-light/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

const app = createApp(App);
app.use(PrimeVue);
app.use(router);

app.component('Navbar', Navbar);


app.mount('#app')