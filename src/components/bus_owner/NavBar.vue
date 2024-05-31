<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import axios from 'axios';

axios.defaults.withCredentials = true;
const toast = useToast();
const router = useRouter();
const showLogoutButton = ref(false);
const CURRENT_URL = window.location.href;
const BASE_URL = 'http://localhost:8080/busowner'
const FRONT_END_BASE_URL = "http://localhost:5173"

const sessionCheck = () => {
    if (FRONT_END_BASE_URL + "/busowner/home" === CURRENT_URL) {
        const PROFILE_URL = BASE_URL + '/me'
        axios.get(PROFILE_URL).then(() => {
            showLogoutButton.value = true;
        }).catch((error) => {
            showLogoutButton.value = false;
            router.push('/busowner')
            console.error(error)
        });
    }
}
sessionCheck();

const NavBarItems = ref([
    {
        label: 'Travel Trace',
        icon: 'pi pi-carr',
    },
    {
        label: 'Bus Owner Panel',
        icon: 'pi pi-home'
    },
    {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => {
            logout();
        },
        visible: showLogoutButton
    }
]);

const showToast = (content, type) => {
    if (type === 'success')
        toast.add({ severity: 'info', summary: 'Bus Owner', detail: content, group: 'br', life: 3000 });
    else if (type === 'error')
        toast.add({ severity: 'error', summary: 'Bus Owner', detail: content, group: 'br', life: 3000 });
    else if (type === 'warning') {
        toast.add({ severity: 'warn', summary: 'Bus Owner', detail: content, group: 'br', life: 3000 });
    } else null;
}

const logout = () => {
    const LOGOUT_URL = BASE_URL + '/logout'
    axios.get(LOGOUT_URL).then((res) => {
        if (res.status === 200) {
            showToast('Logout Success.', 'success')
            setTimeout(() => {
                router.push('/busowner');
            }, 600);
        }
    }).catch((error) => { console.error(error) });
}
</script>


<template>
    <div class="busowner-navbar">
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