<script setup>
import { ref } from 'vue';

const display = ref('login');
const name = ref();
const email = ref();
const accept = ref(false);
</script>

<template>
    <div class="user-login" v-if="display === 'login'">
        <div class="card flex justify-content-center p-fluid">
            <div v-focustrap class="w-full" style="max-width: 20rem">
                <div class="field">
                    <h1>On the Road Again: <br> Log In to Track Your Bus</h1>
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
                <p @click="display = 'signup'" class="login-register-link">Create an account ?</p>
            </div>
        </div>
    </div>

    <div class="user-login" v-else-if="display === 'signup'">
        <div class="card flex justify-content-center p-fluid">
            <div v-focustrap class="w-full" style="max-width: 20rem">
                <div class="field">
                    <h1>Seamless Travel: <br> Sign In to Track Your Bus</h1>
                </div>
                <div class="field">
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-user-edit" />
                        </InputIcon>
                        <InputText id="email" v-model="email" type="text" placeholder="Name" autofocus />
                    </IconField>
                </div>
                <div class="field">
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-envelope" />
                        </InputIcon>
                        <InputText id="email" v-model="email" type="email" placeholder="Email" />
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
                <div class="field">
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-phone" />
                        </InputIcon>
                        <InputText id="email" v-model="email" type="text" placeholder="Phone" />
                    </IconField>
                </div>
                <Button type="submit" label="Submit" class="mt-2" />
                <p @click="display = 'login'" class="login-register-link">Already have an account ?</p>
            </div>
        </div>
    </div>

    <div class="user-feedback" v-else-if="display === 'feedback' ">
        <div class="card">
            <Fieldset>
                <template #legend>
                    <div class="flex align-items-center pl-2">
                        <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
                            shape="circle" />
                        <span class="font-bold">Amy Elsner</span>
                    </div>
                </template>
                <p class="m-0">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                    commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur. Excepteur
                    sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
            </Fieldset>
            <Fieldset>
                <template #legend>
                    <div class="flex align-items-center pl-2">
                        <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
                            shape="circle" />
                        <span class="font-bold">Amy Elsner</span>
                    </div>
                </template>
                <p class="m-0">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                    commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur. Excepteur
                    sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
            </Fieldset>
            <Fieldset>
                <template #legend>
                    <div class="flex align-items-center pl-2">
                        <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
                            shape="circle" />
                        <span class="font-bold">Amy Elsner</span>
                    </div>
                </template>
                <p class="m-0">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                    commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur. Excepteur
                    sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
            </Fieldset>
        </div>
    </div>
</template>