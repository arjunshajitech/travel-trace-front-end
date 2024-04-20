<script setup>
import { ref } from "vue";

const NavBarItems = ref([
    {
        label: 'Bus Trace',
        icon: 'pi pi-map-marker'
    },
    {
        label: 'Home',
        icon: 'pi pi-home'
    },
    {
        label: 'About',
        icon: 'pi pi-map'
    },
    {
        label: 'Feedbacks',
        icon: 'pi pi-star',
        badge : 5
    },
    {
        label: 'Logout',
        icon: 'pi pi-sign-out'
    }
]);
</script>


<template>
    <div class="user-navbar">
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