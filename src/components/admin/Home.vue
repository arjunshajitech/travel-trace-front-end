<script setup>
import { ref } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from "primevue/useconfirm";
import axios from 'axios';

const confirm = useConfirm();
axios.defaults.withCredentials = true;
const toast = useToast();
const display = ref('bus_owners')
const BASE_URL = 'http://localhost:8080/admin'
const busOwnerRequest = ref({})
const errors = ref({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    phone: false
})
const busOwnersList = ref([])


const dt = ref();
const products = [
    {
        id: '1000',
        code: 'kkkk',
        name: 'Bamboo Watch',
        description: 'Product Description',
        image: 'bamboo-watch.jpg',
        price: 65,
        category: 'Accessories',
        quantity: 24,
        inventoryStatus: 'INSTOCK',
        rating: 5
    },
    {
        id: '1000',
        code: 'f230fh0g3',
        name: 'gggggggg Watch',
        description: 'Product Description',
        image: 'bamboo-watch.jpg',
        price: 65,
        category: 'Accessories',
        quantity: 24,
        inventoryStatus: 'INSTOCK',
        rating: 5
    },
    {
        id: '1000',
        code: 'f230fh0g3',
        name: 'Bamboo Watch',
        description: 'Product Description',
        image: 'bamboo-watch.jpg',
        price: 65,
        category: 'Accessories',
        quantity: 24,
        inventoryStatus: 'INSTOCK',
        rating: 5
    }
];
const busOwnerDialog = ref(false);
const deleteProductDialog = ref(false);
const product = ref({});
const selectedProducts = ref();
const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const submitted = ref(false);

const tabMenuItems = ref([
    {
        label: 'Bus Owners', icon: 'pi pi-address-book',
        command: () => {
            display.value = 'bus_owners'
        }
    },
    {
        label: 'Users', icon: 'pi pi-users',
        command: () => {
            display.value = 'users'
        }
    }
]);


const createBusOwner = () => {
    errors.value.firstName = false;
    errors.value.lastName = false;
    errors.value.email = false;
    errors.value.password = false;
    errors.value.phone = false;
    busOwnerRequest.value = {};
    busOwnerDialog.value = true;
};

const hideDialog = () => {
    busOwnerDialog.value = false;
};

const confirmDeleteProduct = (prod) => {
    product.value = prod;
    deleteProductDialog.value = true;
};

const showToast = (content, type) => {
    if (type === 'success')
        toast.add({ severity: 'info', summary: 'Admin', detail: content, group: 'br', life: 3000 });
    else if (type === 'error')
        toast.add({ severity: 'error', summary: 'Admin', detail: content, group: 'br', life: 3000 });
    else if (type === 'warning') {
        toast.add({ severity: 'warn', summary: 'Admin', detail: content, group: 'br', life: 3000 });
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

const validateSaveBusOwner = () => {

    if (Object.keys(busOwnerRequest.value).length === 0) {
        errors.value.firstName = true;
        errors.value.lastName = true;
        errors.value.email = true;
        errors.value.password = true;
        errors.value.phone = true;
        return true;
    } else {
        errors.value.firstName = false;
        errors.value.lastName = false;
        errors.value.email = false;
        errors.value.password = false;
        errors.value.phone = false;
    }

    if (busOwnerRequest.value.firstName === '' ||
        busOwnerRequest.value.firstName === null ||
        busOwnerRequest.value.firstName.length < 3) {
        errors.value.firstName = true;
        return true;
    } errors.value.firstName = false;

    if (busOwnerRequest.value.lastName === '' ||
        busOwnerRequest.value.lastName === null ||
        busOwnerRequest.value.lastName.length === 0) {
        errors.value.lastName = true;
        return true;
    } errors.value.lastName = false;

    if (busOwnerRequest.value.email === '' ||
        busOwnerRequest.value.email === null ||
        !isValidEmail(busOwnerRequest.value.email)) {
        errors.value.email = true;
        return true;
    } errors.value.email = false;

    if (busOwnerRequest.value.password === '' ||
        busOwnerRequest.value.password === null ||
        busOwnerRequest.value.password.length < 6) {
        errors.value.password = true;
        return true;
    } errors.value.password = false;

    if (busOwnerRequest.value.phone === '' ||
        busOwnerRequest.value.phone === null ||
        !isValidPhone(busOwnerRequest.value.phone)) {
        errors.value.phone = true;
        return true;
    } errors.value.phone = false;

    return false;
}

const getAllBusOwners = () => {
    const GET_BUS_OWNER_URL = BASE_URL + '/busowners'
    axios.get(GET_BUS_OWNER_URL).then((response) => {
        if (response.status === 200) {
            busOwnersList.value = response.data;
        }
    }).catch((error) => {
        showToast('Something went wrong.', 'warning');
        console.error(error);
    });
}
getAllBusOwners();

const saveBusOwner = () => {

    if (validateSaveBusOwner()) return;

    const CREATE_BUS_OWNER_URL = BASE_URL + '/bus/owner'
    axios.post(CREATE_BUS_OWNER_URL, busOwnerRequest.value).then((response) => {
        if (response.status === 200) {
            showToast('Bus Owner Created.', 'success')
            getAllBusOwners();
            busOwnerDialog.value = false;
        }
    }).catch((error) => {
        if (error.response.status === 400) {
            showToast('Email or Phone already registered.', 'error');
        } else {
            showToast('Something went wrong.', 'warning');
        }
        console.error(error);
    });
};

const deleteBusOwner = (id) => {
    confirm.require({
        message: 'Do you want to delete bus owner ?',
        header: 'Danger Zone',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancel',
        acceptLabel: 'Delete',
        rejectClass: 'p-button-secondary p-button-outlined',
        acceptClass: 'p-button-danger',
        accept: () => {
            const DELETE_BUS_OWNER_URL = BASE_URL + '/busowner/' + id;
            axios.delete(DELETE_BUS_OWNER_URL).then((response) => {
                if (response.status === 200) {
                    getAllBusOwners();
                    showToast('Bus Owner Deleted.', 'success')
                }
            }).catch((error) => {
                showToast('Something went wrong.', 'warning');
                console.error(error);
            });
        },
        reject: () => {
            showToast('Delete Bus Owner Cancelled.', 'warning')
        }
    });
};

</script>

<template>
    <div class="admin-home">
        <div class="card">
            <TabMenu :model="tabMenuItems" />
        </div>
    </div>

    <div class="admin-list-bus-owners" v-if="display === 'bus_owners'">
        <div class="card">
            <Toast />
            <ConfirmDialog></ConfirmDialog>
            <Toolbar class="mb-4">
                <template #start>
                    <Button label="Create Bus Owner" icon="pi pi-plus" class="mr-2" @click="createBusOwner" />
                </template>
            </Toolbar>

            <DataTable ref="dt" :value="busOwnersList" dataKey="id" :paginator="true" :rows="10" :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} bus owners">
                <template #header>
                    <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
                        <h4 class="m-0">Bus Owners</h4>
                        <IconField iconPosition="left">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column field="firstName" header="First Name" sortable style="min-width:12rem"></Column>
                <Column field="lastName" header="Last Name" sortable style="min-width:12rem"></Column>
                <Column field="email" header="Email" sortable style="min-width:16rem"></Column>
                <Column field="password" header="Password" sortable style="min-width:16rem"></Column>
                <Column field="phone" header="Phone" sortable style="min-width:16rem"></Column>

                <Column :exportable="false" style="min-width:8rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-trash" outlined rounded severity="danger"
                            @click="deleteBusOwner(slotProps.data.id)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="busOwnerDialog" :style="{ width: '450px' }" header="Create Bus Owner" :modal="true"
            class="p-fluid">
            <div class="field">
                <label for="name">First Name</label>
                <InputText id="name" v-model.trim="busOwnerRequest.firstName" required="true" autofocus />
                <small class="p-error" v-if="errors.firstName">Invalid First Name.</small>
            </div>
            <div class="field">
                <label for="name">Last Name</label>
                <InputText id="name" v-model.trim="busOwnerRequest.lastName" required="true" />
                <small class="p-error" v-if="errors.lastName">Invalid Last Name.</small>
            </div>
            <div class="field">
                <label for="email">Email</label>
                <InputText id="email" v-model.trim="busOwnerRequest.email" required="true" />
                <small class="p-error" v-if="errors.email">Invalid Email.</small>
            </div>
            <div class="field">
                <label for="password">Password</label>
                <InputText id="password" v-model.trim="busOwnerRequest.password" required="true" />
                <small class="p-error" v-if="errors.password">Invalid Password. Min length 6</small>
            </div>
            <div class="field">
                <label for="phone">Phone</label>
                <InputText id="phone" v-model.trim="busOwnerRequest.phone" required="true" />
                <small class="p-error" v-if="errors.phone">Invalid Phone. Min and Max length 10</small>
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" text @click="saveBusOwner" />
            </template>
        </Dialog>
    </div>

    <div class="admin-list-users" v-else>
        <div class="card">
            <DataTable ref="dt" :value="products" v-model:selection="selectedProducts" dataKey="id" :paginator="true"
                :rows="10" :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users">
                <template #header>
                    <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
                        <h4 class="m-0">Users</h4>
                        <IconField iconPosition="left">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column field="code" header="Name" sortable style="min-width:12rem"></Column>
                <Column field="name" header="Email" sortable style="min-width:16rem"></Column>
                <Column field="name" header="Password" sortable style="min-width:16rem"></Column>
                <Column field="name" header="Phone" sortable style="min-width:16rem"></Column>

            </DataTable>
        </div>
    </div>
</template>