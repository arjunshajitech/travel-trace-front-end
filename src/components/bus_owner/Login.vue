<script setup>
import { ref } from 'vue';

const name = ref();
const email = ref();
const accept = ref(false);
</script>

<template>
    <div class="busowner-login">
        <div class="card flex justify-content-center p-fluid">
            <div v-focustrap class="w-full" style="max-width: 20rem">
                <div class="field">
                    <h1>Bus Onwer Panel Login</h1>
                </div>
                <div class="field">
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-envelope" />
                        </InputIcon>
                        <InputText id="email" v-model="email" type="email" placeholder="Email" autofocus />
                    </IconField>
                </div>
                <div class="field">
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-key" />
                        </InputIcon>
                        <InputText id="input" v-model="password" type="password" placeholder="Password" />
                    </IconField>
                </div>
                <Button type="submit" label="Submit" class="mt-2" />
            </div>
        </div>
    </div>
</template>