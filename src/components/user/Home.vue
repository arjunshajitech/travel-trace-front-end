<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import axios from 'axios';

const BASE_URL = 'http://localhost:8080'
axios.defaults.withCredentials = true;
const toast = useToast();
const router = useRouter();

const busList = ref([]);
const subRouteList = ref([]);
const showBusRoute = ref(false);

function getCurrentDayInCaps() {
    var currentDate = new Date();
    var currentDayOfWeek = currentDate.getDay();
    var daysOfWeekInCaps = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    var currentDayNameInCaps = daysOfWeekInCaps[currentDayOfWeek];
    return currentDayNameInCaps;
}

const isToday = ref(true)
const today = ref();
today.value = getCurrentDayInCaps();

const getBusList = async (today) => {
    const BUS_LIST = BASE_URL + '/user/routes?day=' + today;
    await axios.get(BUS_LIST).then((res) => {
        if (res.status === 200) {
            const sortedBusList = res.data.sort((a, b) => {
                if (a.started === true && b.started === false) {
                    return -1;
                } else if (a.started === false && b.started === true) {
                    return 1;
                } else {
                    if (a.ended === false && b.ended === true) {
                        return -1;
                    } else if (a.ended === true && b.ended === false) {
                        return 1;
                    }
                    return 0;
                }
            });

            // Assign the sorted list to busList.value
            busList.value = sortedBusList;
        }
    }).catch((error) => { console.error(error) });
}
getBusList(today.value);






const showRoute = (id) => {
    showBusRoute.value = true;
    showSubRoute(id);
}


const showSubRoute = (id) => {
    const SUB_ROUTE_LIST = BASE_URL + '/user/sub/routes/' + id;
    axios.get(SUB_ROUTE_LIST).then((res) => {
        if (res.status === 200) {
            subRouteList.value = res.data;
        }
    }).catch((error) => { console.error(error) });
}


const weekday = ref();
const sorted = ref();
const weekdays = ref([
    { name: 'MONDAY', code: 'NY' },
    { name: 'TUESDAY', code: 'RM' },
    { name: 'WEDNESDAY', code: 'LDN' },
    { name: 'THURSDAY', code: 'IST' },
    { name: 'FRIDAY', code: 'PRS' },
    { name: 'SATURDAY', code: 'IST' },
    { name: 'SUNDAY', code: 'PRS' }
]);

const sort = ref([
    { name: 'STARTED', code: 'NY' },
    { name: 'COMPLETED', code: 'RM' },
    { name: 'NOT STARTED', code: 'LDN' },
]);

const sortChange = async () => {
    let day = getCurrentDayInCaps();
    let val = sorted.value.name;
    await getBusList(day);

    if (val === 'STARTED') {
        busList.value = busList.value.filter(bus => bus.started === true && bus.ended === false);
    } else if (val === 'NOT STARTED') {
        busList.value = busList.value.filter(bus => bus.started === false && bus.ended === false);
    } else if (val === 'COMPLETED') {
        busList.value = busList.value.filter(bus => bus.started === false && bus.ended === true);
    }
}


const handleChange = () => {
    sorted.value = ''
    if (weekday.value.name === getCurrentDayInCaps()) {
        isToday.value = true;
    } else {
        isToday.value = false;
    }
    getBusList(weekday.value.name);
}

</script>





<template>
    <div class="bus-list-container">
        

        <div class="select-weekday mt-2">
            <div class="card flex justify-content-center">
                <Dropdown @change="handleChange" v-model="weekday" :options="weekdays" optionLabel="name"
                    placeholder="View Buses" class="w-full md:w-14rem mr-3" />
                <Dropdown @change="sortChange" v-model="sorted" v-if="isToday" :options="sort" optionLabel="name"
                    placeholder="Sort Started.., Completed.., Not Started.." class="w-full md:w-14rem" />
            </div>
        </div>

        <div class="card mt-5">
            <Toast position="bottom-right" group="br" />
            <ConfirmDialog></ConfirmDialog>
            <DataView :value="busList" paginator :rows="4">
                <template #list="slotProps">
                    <div class="grid grid-nogutter">
                        <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
                            <div class="flex flex-column sm:flex-row sm:align-items-center p-4 gap-3"
                                :class="{ 'border-top-1 surface-border': index !== 0 }">
                                <div class="md:w-10rem relative">
                                    <img class="block xl:block mx-auto border-round w-full" src="/logo.png"
                                        :alt="item" />
                                    <div v-if="isToday">
                                        <Tag v-if="item.started === true && item.ended === false" value="Started"
                                            severity="success" class="absolute" style="left: 4px; top: 4px"></Tag>
                                        <Tag v-else-if="item.started === false && item.ended === false"
                                            value="Not Started" severity="warning" class="absolute"
                                            style="left: 4px; top: 4px"></Tag>
                                        <Tag v-else value="Completed" severity="error" class="absolute"
                                            style="left: 4px; top: 4px"></Tag>
                                    </div>
                                </div>
                                <div
                                    class="flex flex-column md:flex-row justify-content-between md:align-items-center flex-1">
                                    <div
                                        class="flex flex-row md:flex-column justify-content-between align-items-start gap-2">
                                        <div>
                                            <span class="text-xl font-semibold text-900">{{ item.route.startTime }} {{
                                                item.startTime }} --->
                                                {{ item.route.endTime }} {{ item.endTime }}</span>
                                            <div class="text-lg font-medium text-900 mt-2"> {{ item.route.startLocation
                                                }}
                                                ---> {{ item.route.endLocation }}</div>
                                        </div>
                                        <div class="surface-100 p-2" style="border-radius: 20px">
                                            <!-- <div class="surface-0 flex align-items-center gap-2 justify-content-center py-1 px-2"
                                                style="border-radius: 30px; box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.04), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)">
                                                <span class="text-900 font-medium text-sm">5</span>
                                                <i class="pi pi-star-fill text-yellow-500"></i>
                                            </div> -->
                                            <span class="font-medium text-secondary text-sm">Bus Owner Name : {{
                                                item.ownerName }} | Bus
                                                Name : {{ item.busName }} | Ph : {{ item.phone }}</span>
                                        </div>
                                    </div>
                                    <div class="flex flex-column md:align-items-end gap-5">
                                        <!-- <span class="font-medium text-secondary text-sm">Bus Owner : {{
                                            item.ownerName }} | Bus
                                            Name : {{ item.busName }}</span> -->
                                        <div class="flex flex-row-reverse md:flex-row gap-2">
                                            <Button icon="pi pi-directions" label="Show Route"
                                                @click="showRoute(item.route.id)"
                                                :disabled="item.inventoryStatus === 'OUTOFSTOCK'"
                                                class="flex-auto md:flex-initial white-space-nowrap"></Button>
                                            <!-- <Button v-if="item.started" icon="pi pi-angle-double-up"
                                                label="Current Location"
                                                :disabled="item.inventoryStatus === 'OUTOFSTOCK'"
                                                class="flex-auto md:flex-initial white-space-nowrap"></Button> -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </DataView>
        </div>

        <Dialog v-model:visible="showBusRoute" :style="{ width: '450px' }" header="Bus Routes" :modal="true"
            class="p-fluid">
            <div class="card">
                <Timeline :value="subRouteList">
                    <template #opposite="slotProps">
                        <small class="p-text-secondary">{{ slotProps.item.subRoute.busTime }}
                            {{ slotProps.item.times }}</small>
                    </template>
                    <template #content="slotProps">
                        <small v-if="slotProps.item.completed === false" class="p-text-secondary red-color">{{
                            slotProps.item.subRoute.location }}</small>
                        <small v-else class="p-text-secondary color-green">{{ slotProps.item.subRoute.location
                            }}</small>
                    </template>
                </Timeline>
            </div>
        </Dialog>
    </div>
</template>