<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import axios from 'axios';

axios.defaults.withCredentials = true;
const toast = useToast();
const router = useRouter();
const CURRENT_URL = window.location.href;
const BASE_URL = 'http://localhost:8080'
const FRONT_END_BASE_URL = "http://localhost:5173"

const showLogout = ref(false);

const NavBarItems = ref([
    {
        label: 'Home',
        icon: 'pi pi-home'
    },
    {
        label: 'Bus Trace',
        icon: 'pi pi-map-marker'
    },
    // {
    //     label: 'About',
    //     icon: 'pi pi-map'
    // },
    // {
    //     label: 'Feedbacks',
    //     icon: 'pi pi-star',
    //     badge: 5
    // },
    {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => {
            logout();
        },
        visible: showLogout
    }
]);

const showToast = (content, type) => {
    if (type === 'success')
        toast.add({ severity: 'info', summary: 'User', detail: content, group: 'br', life: 3000 });
    else if (type === 'error')
        toast.add({ severity: 'error', summary: 'User', detail: content, group: 'br', life: 3000 });
    else if (type === 'warning') {
        toast.add({ severity: 'warn', summary: 'User', detail: content, group: 'br', life: 3000 });
    } else null;
}

const logout = () => {
    const LOGOUT_URL = BASE_URL + '/user/logout'
    axios.get(LOGOUT_URL).then((res) => {
        if (res.status === 200) {
            showToast('Logout Success.', 'success')
            setTimeout(() => {
                showLogout.value = false;
                router.push('/')
            }, 600);
        }
    }).catch((error) => { console.error(error) });
}


const sessionCheck = () => {
    if (FRONT_END_BASE_URL + "/home" === CURRENT_URL) {
        const PROFILE_URL = BASE_URL + '/user/me'
        axios.get(PROFILE_URL).then(() => {
            showLogout.value = true;
        }).catch((error) => {
            showLogout.value = false;
            router.push('/')
        });
    }
}
sessionCheck();
</script>


<template>
    <div class="user-navbar">
        <Toast position="bottom-right" group="br" />
        <div class="card">
            <Menubar :model="NavBarItems">
                <template #item="{ item, props, hasSubmenu, root }">
                    <a v-ripple class="flex align-items-center" v-bind="props.action">
                        <span :class="item.icon" />
                        <span class="ml-2">{{ item.label }}</span>
                        <Badge v-if="item.badge" :class="{ 'ml-auto': !root, 'ml-2': root }" :value="item.badge" />
                        <span v-if="item.shortcut"
                            class="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{{
                                item.shortcut }}</span>
                        <i v-if="hasSubmenu"
                            :class="['pi pi-angle-down', { 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root }]"></i>
                    </a>
                </template>
            </Menubar>
        </div>
    </div>
</template>