<script setup>
import { ref } from "vue";

const NavBarItems = ref([
    {
        label: 'Travel Trace | All Rights Reserved.',
        icon: 'pi pi-map-marker'
    },
    {
        label: 'contact@traveltrace.com',
        icon: 'pi pi-at'
    }
])

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