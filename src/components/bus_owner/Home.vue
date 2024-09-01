<script setup>
import { ref } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from "primevue/useconfirm";
import axios from 'axios';

const confirm = useConfirm();
axios.defaults.withCredentials = true;
const toast = useToast();
const display = ref('buses')
const BASE_URL = 'http://localhost:8080/busowner'
const busOwnersList = ref([])
const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const createBusDialog = ref(false);
const busList = ref([]);
const createBusRequest = ref({})
const createBusError = ref({
    busName: false,
    registrationNumber: false
})

const createRouteDialog = ref(false);
const routeList = ref([])
const createRouteRequest = ref({})
const createRouteError = ref({
    bus: false,
    startLocation: false,
    endLocation: false,
    startTime: false,
    endTime: false,
    weekDay: false
})

const createSubRouteDialog = ref(false);
const subRouteList = ref([])
const createSubRouteRequest = ref({})
const createSubRouteError = ref({
    route: false,
    location: false,
    time: false,
})
const routes = ref([])
const initRoutes = () => {
    routeList.value.forEach(route => {
        const { id } = route;
        routes.value.push({ id });
    });
}

const buses = ref([])
const initBuses = () => {
    busList.value.forEach(bus => {
        const { busName, id } = bus;
        buses.value.push({ busName, id });
    });
}

const locations = ref([
    { name: 'Alappuzha, Kerala' },
    { name: 'Muhamma, Alappuzha, Kerala' },
    { name: 'Mannamcherry, Alappuzha, Kerala' },
    { name: 'Kavungal, Alappuzha, Kerala' },
    { name: 'Thampakachuvad, Alappuzha, Kerala' },
    { name: 'Rodumukku, Alappuzha, Kerala' },
    // Add more locations here
])


const weekDay = ref([
    { name: 'MONDAY' },
    { name: 'TUESDAY' },
    { name: 'WEDNESDAY' },
    { name: 'THURSDAY' },
    { name: 'FRIDAY' },
    { name: 'SATURDAY' },
    { name: 'SUNDAY' }
])


const tabMenuItems = ref([
    {
        label: 'Buses', icon: 'pi pi-address-book',
        command: () => {
            display.value = 'buses'
            getAllBuses();
        }
    },
    {
        label: 'Routes', icon: 'pi pi-users',
        command: () => {
            display.value = 'routes'
            getAllBuses();
            getAllRoutes();
        }
    },
    {
        label: 'Sub Routes', icon: 'pi pi-users',
        command: () => {
            display.value = 'sub_routes'
            getAllBuses();
            getAllRoutes();
            getAllSubRoutes();
        }
    }
]);


const createBus = () => {
    createBusError.value.busName = false
    createBusError.value.registrationNumber = false
    createBusRequest.value = {};
    createBusDialog.value = true;
};

const hideCreateBusDialog = () => {
    createBusDialog.value = false;
};

const hideCreateRouteDialog = () => {
    createRouteDialog.value = false;
};

const createRoute = () => {
    buses.value = []
    initBuses();
    console.log(buses.value)
    createRouteDialog.value = true
    createRouteRequest.value = {}
    createRouteError.value.startLocation = false;
    createRouteError.value.endLocation = false;
    createRouteError.value.startTime = false;
    createRouteError.value.endTime = false;
    createRouteError.value.weekDay = false;
    createRouteError.value.bus = false;
}

const createBusSubRoute = () => {
    routes.value = []
    initRoutes();
    createSubRouteError.value.route = false
    createSubRouteError.value.location = false
    createSubRouteError.value.time = false
    createSubRouteRequest.value = {};
    createSubRouteDialog.value = true;
};

const hideCreateBusSubRouteDialog = () => {
    createSubRouteDialog.value = false;
};


const showToast = (content, type) => {
    if (type === 'success')
        toast.add({ severity: 'info', summary: 'Bus Owner', detail: content, group: 'br', life: 3000 });
    else if (type === 'error')
        toast.add({ severity: 'error', summary: 'Bus Owner', detail: content, group: 'br', life: 3000 });
    else if (type === 'warning') {
        toast.add({ severity: 'warn', summary: 'Bus Owner', detail: content, group: 'br', life: 3000 });
    } else null;
}

const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

const isValidPhone = (phone) => {
    var regex = /^\d{10}$/;
    return regex.test(phone);
}

const convertTime = (timeString) => {
    try {
        const originalDate = new Date(timeString);
        return originalDate.toLocaleTimeString();
    } catch (error) {
        showToast('Please provide a valid time.', 'warning');
    }
}

const validSaveRoute = () => {
    const keys = Object.keys(createRouteRequest.value);
    console.log(keys);
    if (keys.length === 0) {
        createRouteError.value.startLocation = true;
        createRouteError.value.endLocation = true;
        createRouteError.value.startTime = true;
        createRouteError.value.endTime = true;
        createRouteError.value.weekDay = true;
        createRouteError.value.bus = true;
        return true;
    } else {
        createRouteError.value.startLocation = false;
        createRouteError.value.endLocation = false;
        createRouteError.value.startTime = false;
        createRouteError.value.endTime = false;
        createRouteError.value.weekDay = false;
        createRouteError.value.bus = false;
    }

    // if (!keys.includes("id") ||
    //     createRouteRequest.value.id === '' ||
    //     createRouteRequest.value.id === null) {
    //     createRouteError.value.bus = true;
    //     return true;
    // } createRouteError.value.bus = false;
}

const validateSaveBus = () => {
    const keys = Object.keys(createBusRequest.value);
    if (keys.length === 0) {
        createBusError.value.busName = true
        createBusError.value.registrationNumber = true
        return true;
    } else {
        createBusError.value.busName = false
        createBusError.value.registrationNumber = false
    }

    if (!keys.includes("busName") ||
        createBusRequest.value.busName === '' ||
        createBusRequest.value.busName === null ||
        createBusRequest.value.busName.length < 3) {
        createBusError.value.busName = true;
        return true;
    } createBusError.value.busName = false;

    if (!keys.includes("registrationNumber") ||
        createBusRequest.value.registrationNumber === '' ||
        createBusRequest.value.registrationNumber === null ||
        createBusRequest.value.registrationNumber.length < 8) {
        createBusError.value.registrationNumber = true;
        return true;
    } createBusError.value.registrationNumber = false;

    return false;
}

const getAllBuses = () => {
    const GET_BUS = BASE_URL + '/bus'
    axios.get(GET_BUS).then((response) => {
        if (response.status === 200) {
            busList.value = response.data;
        }
    }).catch((error) => {
        showToast('Something went wrong.', 'warning');
        console.error(error);
    });
}
getAllBuses();

const saveBus = () => {

    if (validateSaveBus()) return;

    const CREATE_BUS = BASE_URL + '/bus'
    axios.post(CREATE_BUS, createBusRequest.value).then((response) => {
        if (response.status === 200) {
            showToast('Bus Created.', 'success')
            getAllBuses();
            createBusDialog.value = false;
        }
    }).catch((error) => {
        if (error.response.status === 400) {
            showToast('Registration number already exists.', 'error');
        } else {
            showToast('Something went wrong.', 'warning');
        }
        console.error(error);
    });
};

const deleteBus = (id) => {
    confirm.require({
        message: 'Do you want to delete bus ?',
        header: 'Danger Zone',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancel',
        acceptLabel: 'Delete',
        rejectClass: 'p-button-secondary p-button-outlined',
        acceptClass: 'p-button-danger',
        accept: () => {
            const DELETE_BUS = BASE_URL + '/bus/' + id;
            axios.delete(DELETE_BUS).then((response) => {
                if (response.status === 200) {
                    getAllBuses();
                    showToast('Bus Deleted.', 'success')
                }
            }).catch((error) => {
                showToast('Something went wrong.', 'warning');
                console.error(error);
            });
        },
        reject: () => {
            showToast('Delete Bus Cancelled.', 'warning')
        }
    });
};

const saveRoute = () => {

    // if (!validSaveRoute()) return;

    const CREATE_ROUTE = BASE_URL + '/routes'
    axios.post(CREATE_ROUTE, {
        busId: createRouteRequest.value.id.id,
        startLocation: createRouteRequest.value.startLocation.name,
        endLocation: createRouteRequest.value.endLocation.name,
        startTime: convertTime(createRouteRequest.value.startTime),
        endTime: convertTime(createRouteRequest.value.endTime),
        day: createRouteRequest.value.weekDay.name
    }).then((response) => {
        if (response.status === 200) {
            showToast('Route Created.', 'success')
            getAllRoutes();
            createRouteDialog.value = false;
        }
    }).catch((error) => {
        if (error.response.status === 400) {
            showToast('Please provide a valid bus.', 'error');
        } else {
            showToast('Something went wrong.', 'warning');
        }
        console.error(error);
    });
}

const getAllRoutes = () => {
    const GET_ROUTE = BASE_URL + '/routes'
    axios.get(GET_ROUTE).then((response) => {
        if (response.status === 200) {
            routeList.value = response.data;
        }
    }).catch((error) => {
        showToast('Something went wrong.', 'warning');
        console.error(error);
    });
}

const deleteRoute = (id) => {
    confirm.require({
        message: 'Do you want to delete Route ?',
        header: 'Danger Zone',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancel',
        acceptLabel: 'Delete',
        rejectClass: 'p-button-secondary p-button-outlined',
        acceptClass: 'p-button-danger',
        accept: () => {
            const DELETE_ROUTE = BASE_URL + '/routes/' + id;
            axios.delete(DELETE_ROUTE).then((response) => {
                if (response.status === 200) {
                    getAllRoutes();
                    showToast('Route Deleted.', 'success')
                }
            }).catch((error) => {
                showToast('Something went wrong.', 'warning');
                console.error(error);
            });
        },
        reject: () => {
            showToast('Delete Route Cancelled.', 'warning')
        }
    });
}

const saveSubRoute = () => {


    const CREATE_SUB_ROUTE = BASE_URL + '/sub/routes'
    axios.post(CREATE_SUB_ROUTE, {
        routeId: createSubRouteRequest.value.id.id,
        location: createSubRouteRequest.value.location.name,
        busTime: convertTime(createSubRouteRequest.value.time)
    }).then((response) => {
        if (response.status === 200) {
            showToast('Sub Route Created.', 'success')
            getAllBuses();
            getAllRoutes();
            getAllSubRoutes();
            createSubRouteDialog.value = false;
        }
    }).catch((error) => {
        if (error.response.status === 400) {
            //showToast('Please provide a valid bus.', 'error');
        } else {
            showToast('Something went wrong.', 'warning');
        }
    });
}

const getAllSubRoutes = () => {
    const GET_SUB_ROUTE = BASE_URL + '/sub/routes'
    axios.get(GET_SUB_ROUTE).then((response) => {
        if (response.status === 200) {
            subRouteList.value = response.data;
        }
    }).catch((error) => {
        showToast('Something went wrong.', 'warning');
        console.error(error);
    });
}

const deleteSubRoute = (id) => {
    confirm.require({
        message: 'Do you want to delete Sub Route ?',
        header: 'Danger Zone',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancel',
        acceptLabel: 'Delete',
        rejectClass: 'p-button-secondary p-button-outlined',
        acceptClass: 'p-button-danger',
        accept: () => {
            const DELETE_ROUTE = BASE_URL + '/sub/routes/' + id;
            axios.delete(DELETE_ROUTE).then((response) => {
                if (response.status === 200) {
                    getAllSubRoutes();
                    showToast('Sub Route Deleted.', 'success')
                }
            }).catch((error) => {
                showToast('Something went wrong.', 'warning');
                console.error(error);
            });
        },
        reject: () => {
            showToast('Delete Sub Route Cancelled.', 'warning')
        }
    });
}

</script>

<template>
    <div class="busowner-home">
        <div class="card">
            <TabMenu :model="tabMenuItems" />
        </div>
    </div>

    <div class="busowner-list-bus" v-if="display === 'buses'">
        <div class="card">
            <Toast position="bottom-right" group="br" />
            <ConfirmDialog></ConfirmDialog>
            <Toolbar class="mb-4">
                <template #start>
                    <Button label="Create Bus" icon="pi pi-plus" class="mr-2" @click="createBus" />
                </template>
            </Toolbar>

            <DataTable scrollable scrollHeight="400px" ref="dt" :value="busList" dataKey="id" :paginator="true"
                :rows="10" :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} buses">
                <template #header>
                    <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
                        <h4 class="m-0">Buses</h4>
                        <IconField iconPosition="left">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column field="id" header="Bus Id" sortable style="min-width:12rem"></Column>
                <Column field="busName" header="Bus Name" sortable style="min-width:12rem"></Column>
                <Column field="registrationNumber" header="Registration Number" sortable style="min-width:12rem">
                </Column>

                <Column :exportable="false" style="min-width:8rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-trash" outlined rounded severity="danger"
                            @click="deleteBus(slotProps.data.id)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="createBusDialog" :style="{ width: '450px' }" header="Create Bus" :modal="true"
            class="p-fluid">
            <div class="field">
                <label for="name">Bus Name</label>
                <InputText id="name" v-model.trim="createBusRequest.busName" required="true" autofocus />
                <small class="p-error" v-if="createBusError.busName">Invalid Bus Name.</small>
            </div>
            <div class="field">
                <label for="name">Registration Number</label>
                <InputText id="name" v-model.trim="createBusRequest.registrationNumber" required="true" />
                <small class="p-error" v-if="createBusError.registrationNumber">Invalid Registration Number.</small>
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideCreateBusDialog" />
                <Button label="Save" icon="pi pi-check" text @click="saveBus" />
            </template>
        </Dialog>
    </div>

    <div class="busowner-list-routes" v-else-if="display === 'routes'">
        <div class="card">
            <Toast position="bottom-right" group="br" />
            <ConfirmDialog></ConfirmDialog>
            <Toolbar class="mb-4">
                <template #start>
                    <Button label="Create Routes" icon="pi pi-plus" class="mr-2" @click="createRoute" />
                </template>
            </Toolbar>

            <DataTable scrollable scrollHeight="400px" ref="dt" :value="routeList" dataKey="id" :paginator="true"
                :rows="10" :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} routes">
                <template #header>
                    <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
                        <h4 class="m-0">Routes</h4>
                        <IconField iconPosition="left">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column field="id" header="Route Id" sortable style="min-width:12rem"></Column>
                <Column field="busName" header="Bus Name" sortable style="min-width:12rem"></Column>
                <Column field="startLocation" header="Start Location" sortable style="min-width:12rem"></Column>
                <Column field="endLocation" header="End Location" sortable style="min-width:12rem"></Column>
                <Column field="startTime" header="Start Time" sortable style="min-width:12rem"></Column>
                <Column field="endTime" header="End Time" sortable style="min-width:12rem"></Column>
                <Column field="day" header="WeekDay" sortable style="min-width:12rem">
                </Column>

                <Column :exportable="false" style="min-width:8rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-trash" outlined rounded severity="danger"
                            @click="deleteRoute(slotProps.data.id)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="createRouteDialog" :style="{ width: '450px' }" header="Create Route" :modal="true"
            class="p-fluid">
            <div class="field">
                <label for="name">Select Bus</label>
                <Dropdown v-model="createRouteRequest.id" editable :options="buses" optionLabel="busName"
                    placeholder="Search bus" class="w-full md:w-25rem" />
                <small class="p-error" v-if="createRouteError.bus">Invalid Bus.</small>
            </div>
            <div class="field">
                <label for="name">Start Location</label>
                <Dropdown v-model="createRouteRequest.startLocation" editable :options="locations" optionLabel="name"
                    placeholder="Search location" class="w-full md:w-25rem" />
                <small class="p-error" v-if="createRouteError.startLocation">Invalid Start Location.</small>
            </div>
            <div class="field">
                <label for="name">End Location</label>
                <Dropdown v-model="createRouteRequest.endLocation" editable :options="locations" optionLabel="name"
                    placeholder="Search location" class="w-full md:w-25rem" />
                <small class="p-error" v-if="createRouteError.endLocation">Invalid End Location.</small>
            </div>
            <div class="field">
                <label for="name">Start Time</label>
                <Calendar id="calendar-timeonly" v-model="createRouteRequest.startTime" timeOnly />
                <small class="p-error" v-if="createRouteError.startTime">Invalid Start Time.</small>
            </div>
            <div class="field">
                <label for="name">End Time</label>
                <Calendar id="calendar-timeonly" v-model="createRouteRequest.endTime" timeOnly />
                <small class="p-error" v-if="createRouteError.endTime">Invalid End Time.</small>
            </div>
            <div class="field">
                <label for="name">Week Day</label>
                <Dropdown v-model="createRouteRequest.weekDay" :options="weekDay" optionLabel="name"
                    placeholder="Select Week day" class="w-full md:w-25rem" />
                <small class="p-error" v-if="createRouteError.weekDay">Invalid Week Day.</small>
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideCreateRouteDialog" />
                <Button label="Save" icon="pi pi-check" text @click="saveRoute" />
            </template>
        </Dialog>
    </div>

    <div class="busowner-list-routes" v-else-if="display === 'sub_routes'">
        <div class="card">
            <Toast position="bottom-right" group="br" />
            <ConfirmDialog></ConfirmDialog>
            <Toolbar class="mb-4">
                <template #start>
                    <Button label="Create Sub Routes" icon="pi pi-plus" class="mr-2" @click="createBusSubRoute()" />
                </template>
            </Toolbar>

            <DataTable scrollable scrollHeight="400px" ref="dt" :value="subRouteList" dataKey="id" :paginator="true"
                :rows="10" :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} sub routes">
                <template #header>
                    <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
                        <h4 class="m-0">Sub Routes</h4>
                        <IconField iconPosition="left">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column field="routeId" header="Route Id" sortable style="min-width:12rem"></Column>
                <Column field="busId" header="Bus Id" sortable style="min-width:12rem"></Column>
                <Column field="location" header="Location" sortable style="min-width:12rem"></Column>
                <Column field="busTime" header="Time" sortable style="min-width:12rem"></Column>

                <Column :exportable="false" style="min-width:8rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-trash" outlined rounded severity="danger"
                            @click="deleteSubRoute(slotProps.data.id)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="createSubRouteDialog" :style="{ width: '450px' }" header="Create Sub Route"
            :modal="true" class="p-fluid">
            <div class="field">
                <label for="name">Select Route ID</label>
                <Dropdown v-model="createSubRouteRequest.id" editable :options="routes" optionLabel="id"
                    placeholder="Search route id" class="w-full md:w-25rem" />
                <small class="p-error" v-if="createSubRouteError.route">Invalid Route Id.</small>
            </div>
            <div class="field">
                <label for="name">Location</label>
                <Dropdown v-model="createSubRouteRequest.location" editable :options="locations" optionLabel="name"
                    placeholder="Search location" class="w-full md:w-25rem" />
                <small class="p-error" v-if="createSubRouteError.location">Invalid Location.</small>
            </div>
            <div class="field">
                <label for="name">Time</label>
                <Calendar id="calendar-timeonly" v-model="createSubRouteRequest.time" timeOnly />
                <small class="p-error" v-if="createSubRouteError.time">Invalid Time.</small>
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideCreateBusSubRouteDialog" />
                <Button label="Save" icon="pi pi-check" text @click="saveSubRoute" />
            </template>
        </Dialog>
    </div>


</template>