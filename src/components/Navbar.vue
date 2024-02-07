<template>
    <div>
        <Menubar class="mbr" :model="items">
            <template #item="{ item, props }">
                <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                    <Button class="btn" :href="href" v-bind="props.action" @click="navigate">
                        <span :class="item.icon"/>
                        <span class="ml-2">{{ item.label }}</span>
                    </Button>
                </router-link>
                <Button v-else class="btn" :href="item.url" :target="item.target" v-bind="props.action">
                    <span :class="item.icon"/>
                    <span class="ml-2 btn-text">{{ item.label }}</span>
                </Button>
            </template>
        </Menubar>
    </div>
</template>

<script>
import Menubar from 'primevue/menubar'


export default {
    
    data() {
        return {
            items: [
                {
                    label: 'Главная',
                    icon: 'fa-solid fa-igloo',
                    command: () => {
                        this.$router.push('/');
                    }
                },
                {
                    label: 'Образование',
                    icon: 'fa-solid fa-graduation-cap',
                    command: () => {
                        this.$router.push('/education');
                    }
                },
                {
                    label: 'Опыт работы',
                    icon: 'fa-solid fa-address-card',
                    command: () => {
                        this.$router.push('/experience');
                    }
                },
                {
                    label: 'Портфолио',
                    icon: 'fa-solid fa-folder-open',
                    command: () => {
                        this.$router.push('/portfolio');
                    }
                },
                {
                    label: 'О себе',
                    icon: 'fa-solid fa-user-check',
                    command: () => {
                        this.$router.push('/about');
                    }
                },
                {
                    label: 'Контакты',
                    icon: 'fa-solid fa-envelope',
                    command: () => {
                        this.$router.push('/contacts');
                    }
                },
                
            ]
        };
    },
    components: {
        Menubar
    }   
};
</script>




<style>
.mbr {
    background-color: rgb(113, 194, 224);
    border: 1px solid #043d75;
    justify-content: center;
} 
.btn {
    background-color: rgb(113, 194, 224);
    border-radius: 15%;
    border: none;
    padding: 10px 12px;
    margin-left: 10px;
    text-transform: uppercase;
    transition: 0.4s;
}
.btn:hover {
    box-shadow: 0 20px 40px 0 rgba(11, 99, 246, 1);
    background: rgba(180, 221, 238, 0.996);
}
.p-menubar-root-list, .p-menuitem-content, .p-icon {
    background: rgb(113, 194, 224);
}
.p-menubar-button {
    background: rgb(92, 191, 237);
}
.p-menubar.p-menubar-mobile {
    justify-content: flex-start;
}
.btn-text {
    margin-left: 5px;
  } 
</style>