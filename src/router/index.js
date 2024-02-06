import { createRouter, createWebHistory } from "vue-router";

import Home from "@/pages/Home.vue";
import Education from "@/pages/Education.vue";
import Experience from "@/pages/Experience.vue";
import Portfolio from "@/pages/Portfolio.vue";
import AboutMe from "@/pages/AboutMe.vue";
import Contacts from "@/pages/Contacts.vue";




const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/education',
        name: 'education',
        component: Education
    },
    {
        path: '/experience',
        name: 'experience',
        component: Experience
    },
    {
        path: '/portfolio',
        name: 'portfolio',
        component: Portfolio
    },
    {
        path: '/about',
        name: 'about',
        component: AboutMe
    },
    {
        path: '/contacts',
        name: 'contacts',
        component: Contacts
    }
]


const router = createRouter({
    routes,
    hash: createWebHistory()
})

export default router;