<script setup>
import { ref } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const display = ref('bus_owners')
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
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
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
    product.value = {};
    submitted.value = false;
    productDialog.value = true;
};

const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
};

const saveProduct = () => {
    submitted.value = true;

    if (product?.value.name?.trim()) {
        if (product.value.id) {
            product.value.inventoryStatus = product.value.inventoryStatus.value ? product.value.inventoryStatus.value : product.value.inventoryStatus;
            products.value[findIndexById(product.value.id)] = product.value;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
        }
        else {
            product.value.id = createId();
            product.value.code = createId();
            product.value.image = 'product-placeholder.svg';
            product.value.inventoryStatus = product.value.inventoryStatus ? product.value.inventoryStatus.value : 'INSTOCK';
            products.value.push(product.value);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
        }

        productDialog.value = false;
        product.value = {};
    }
};

const confirmDeleteProduct = (prod) => {
    product.value = prod;
    deleteProductDialog.value = true;
};

const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < products.value.length; i++) {
        if (products.value[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
};

const createId = () => {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

</script>

<template>
    <div class="admin-home">
        <div class="card">
            <TabMenu :model="tabMenuItems" />
        </div>
    </div>

    <div class="admin-list-bus-owners" v-if="display === 'bus_owners'">
        <div class="card">
            <Toolbar class="mb-4">
                <template #start>
                    <Button label="Create Bus Owner" icon="pi pi-plus" class="mr-2" @click="createBusOwner" />
                </template>
            </Toolbar>

            <DataTable ref="dt" :value="products" v-model:selection="selectedProducts" dataKey="id" :paginator="true"
                :rows="10" :filters="filters"
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

                <Column field="code" header="Name" sortable style="min-width:12rem"></Column>
                <Column field="name" header="Email" sortable style="min-width:16rem"></Column>
                <Column field="name" header="Password" sortable style="min-width:16rem"></Column>
                <Column field="name" header="Phone" sortable style="min-width:16rem"></Column>

                <Column :exportable="false" style="min-width:8rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-trash" outlined rounded severity="danger"
                            @click="confirmDeleteProduct(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Create Bus Owner" :modal="true"
            class="p-fluid">
            <div class="field">
                <label for="name">Name</label>
                <InputText id="name" v-model.trim="product.name" required="true" autofocus />
                <!-- <small class="p-error">Name is required.</small> -->
            </div>
            <div class="field">
                <label for="email">Email</label>
                <InputText id="email" v-model.trim="product.name" required="true" />
                <!-- <small class="p-error">Email is required.</small> -->
            </div>
            <div class="field">
                <label for="password">Password</label>
                <InputText id="password" v-model.trim="product.name" required="true" />
                <!-- <small class="p-error">Password is required.</small> -->
            </div>
            <div class="field">
                <label for="phone">Phone</label>
                <InputText id="phone" v-model.trim="product.name" required="true" />
                <!-- <small class="p-error">Phone is required.</small> -->
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" text @click="saveProduct" />
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