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


const getBusList = () => {
    const BUS_LIST = BASE_URL + '/user/routes?day=' + getCurrentDayInCaps();
    axios.get(BUS_LIST).then((res) => {
        if (res.status === 200) {
            busList.value = res.data;
        }
    }).catch((error) => { console.error(error) });
}
getBusList();


function getCurrentDayInCaps() {
    var currentDate = new Date();
    var currentDayOfWeek = currentDate.getDay();
    var daysOfWeekInCaps = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    var currentDayNameInCaps = daysOfWeekInCaps[currentDayOfWeek];
    return currentDayNameInCaps;
}

const getSeverity = (product) => {
    switch (product.inventoryStatus) {
        case 'INSTOCK':
            return 'success';

        case 'LOWSTOCK':
            return 'warning';

        case 'OUTOFSTOCK':
            return 'danger';

        default:
            return null;
    }
};

</script>





<template>
    <div class="bus-list-container">
        <div class="card">
            <DataView :value="busList" paginator :rows="5">
                <template #list="slotProps">
                    <div class="grid grid-nogutter">
                        <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
                            <div class="flex flex-column sm:flex-row sm:align-items-center p-4 gap-3"
                                :class="{ 'border-top-1 surface-border': index !== 0 }">
                                <div class="md:w-10rem relative">
                                    <img class="block xl:block mx-auto border-round w-full" src="/logo.png"
                                        :alt="item" />
                                    <Tag v-if="item.started === true && item.ended === false" value="Started"
                                        severity="error" class="absolute" style="left: 4px; top: 4px"></Tag>
                                    <Tag v-else-if="item.started === false && item.ended === false" value="Not Started"
                                        severity="warning" class="absolute" style="left: 4px; top: 4px"></Tag>
                                    <Tag v-else value="Completed"
                                        severity="success" class="absolute" style="left: 4px; top: 4px"></Tag>
                                </div>
                                <div
                                    class="flex flex-column md:flex-row justify-content-between md:align-items-center flex-1">
                                    <div
                                        class="flex flex-row md:flex-column justify-content-between align-items-start gap-2">
                                        <div>
                                            <span class="text-xl font-semibold text-900">{{ item.route.startTime }} -
                                                {{ item.route.endTime }}</span>
                                            <div class="text-lg font-medium text-900 mt-2">{{ item.route.startLocation
                                                }}
                                                - {{ item.route.endLocation }}</div>
                                        </div>
                                        <div class="surface-100 p-1" style="border-radius: 30px">
                                            <div class="surface-0 flex align-items-center gap-2 justify-content-center py-1 px-2"
                                                style="border-radius: 30px; box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.04), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)">
                                                <span class="text-900 font-medium text-sm">5</span>
                                                <i class="pi pi-star-fill text-yellow-500"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex flex-column md:align-items-end gap-5">
                                        <span class="font-medium text-secondary text-sm">Bus Owner : {{
                                            item.ownerName }} | Bus
                                            Name : {{ item.busName }}</span>
                                        <div class="flex flex-row-reverse md:flex-row gap-2">
                                            <Button icon="pi pi-shopping-cart" label="Show Route"
                                                :disabled="item.inventoryStatus === 'OUTOFSTOCK'"
                                                class="flex-auto md:flex-initial white-space-nowrap"></Button>
                                            <Button v-if="item.started" icon="pi pi-shopping-cart" label="Current Location"
                                                :disabled="item.inventoryStatus === 'OUTOFSTOCK'"
                                                class="flex-auto md:flex-initial white-space-nowrap"></Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </DataView>
        </div>
    </div>
</template>