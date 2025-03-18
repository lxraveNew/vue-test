import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createVuetify } from 'vuetify' // Импортируем createVuetify
import 'vuetify/styles' // Импортируем стили Vuetify
import { VApp, VContainer, VRow, VCol, VCard, VCardTitle, VCardSubtitle, VCardText, VCardActions, VBtn, VDataTable, VTextField, VForm, VDialog  } from 'vuetify/components'


import Home from './components/Home.vue'

const routes = [
    { path: '/', component: Home },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

const vuetify = createVuetify({
    components: {
        VApp, VContainer, VRow, VCol, VCard, VCardTitle, VCardSubtitle, VCardText, VCardActions, VBtn, VDataTable, VTextField, VForm, VDialog
    }
}) // Создаем Vuetify экземпляр

const app = createApp(App)
app.use(router)
app.use(vuetify) // Подключаем Vuetify
app.mount('#app')
