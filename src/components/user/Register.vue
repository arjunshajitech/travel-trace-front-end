<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import axios from 'axios';

axios.defaults.withCredentials = true;
const router = useRouter();
const toast = useToast();
const BASE_URL = 'http://localhost:8080/user'

const display = ref('login');
const name = ref();
const email = ref();
const accept = ref(false);


const clearSession = () => {
    const LOGOUT_URL = BASE_URL + '/logout'
    axios.get(LOGOUT_URL).then(() => { }).catch((error) => { console.error(error) });
}
clearSession();

const showToast = (content, type) => {
    if (type === 'success')
        toast.add({ severity: 'info', summary: 'User', detail: content, group: 'br', life: 3000 });
    else if (type === 'error')
        toast.add({ severity: 'error', summary: 'User', detail: content, group: 'br', life: 3000 });
    else if (type === 'warning') {
        toast.add({ severity: 'warn', summary: 'User', detail: content, group: 'br', life: 3000 });
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


/* ---------- signup ------------ */
const signupRequest = ref({})

const signup = () => {

    const SIGNUP_URL = BASE_URL + '/signup'

    if (Object.keys(signupRequest.value).length != 5) {
        showToast('Fill the fileds.', 'warning');
        return;
    }

    if (!isValidEmail(signupRequest.value.email)) {
        showToast('Invalid email.', 'warning');
        return;
    }

    if (!isValidPhone(signupRequest.value.phone)) {
        showToast('Invalid phone. Max and Min 10 Numbers.', 'warning');
        return;
    }

    axios.post(SIGNUP_URL, signupRequest.value).then((response) => {
        if (response.status === 200) {
            showToast('Signup Success.', 'success')
            setTimeout(() => {
                display.value = 'login';
                signupRequest.value = {};
            }, 1000);
        }
    }).catch((error) => {
        if (error.response.status === 400) {
            showToast('Email or Phone Already Exists.', 'error');
        } else {
            showToast('Something went wrong.', 'warning');
        }
    });
}
/* ---------- signup ------------ */




/* ---------- login ------------ */
const loginRequest = ref({})

const login = () => {
    const LOGIN_URL = BASE_URL + '/login'

    if (Object.keys(loginRequest.value).length != 2) {
        showToast('Invalid Email or Password.', 'error');
        return;
    }

    if (!isValidEmail(loginRequest.value.emailOrPhone)) {
        showToast('Invalid Email or Password.', 'error');
        return;
    }

    axios.post(LOGIN_URL, loginRequest.value).then((response) => {
        if (response.status === 200) {
            showToast('Login Success.', 'success')
            setTimeout(() => {
                router.push("/home")
                loginRequest.value = {};
            }, 1000);
        }
    }).catch((error) => {
        if (error.response.status === 400) {
            showToast('Bad Credentials.', 'error');
        } else {
            showToast('Something went wrong.', 'warning');
        }
    });
}

/* ---------- login ------------ */


</script>

<template>
    <div class="register-container">
        <div class="register-1">
            <Image src="/logo.png" alt="Image" width="650" />
        </div>
        <div class="register-2">
            <div class="user-login" v-if="display === 'login'">
                <Toast position="bottom-right" group="br" />
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
                                <InputText id="email" v-model="loginRequest.emailOrPhone" type="email" placeholder="Email"
                                    autofocus />
                            </IconField>
                        </div>
                        <div class="field">
                            <IconField>
                                <InputIcon>
                                    <i class="pi pi-key" />
                                </InputIcon>
                                <InputText id="input" v-model="loginRequest.password" type="password" placeholder="Password" />
                            </IconField>
                        </div>
                        <Button type="submit" label="Submit" class="mt-2" @click="login" />
                        <p @click="display = 'signup'" class="login-register-link">Create an account ?</p>
                    </div>
                </div>
            </div>
        
            <div class="user-login" v-else-if="display === 'signup'">
                <Toast position="bottom-right" group="br" />
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
                                <InputText id="email_1" v-model="signupRequest.firstName" type="text" placeholder="First Name"
                                    autofocus />
                            </IconField>
                        </div>
                        <div class="field">
                            <IconField>
                                <InputIcon>
                                    <i class="pi pi-user-edit" />
                                </InputIcon>
                                <InputText id="email" v-model="signupRequest.lastName" type="text" placeholder="Last Name" />
                            </IconField>
                        </div>
                        <div class="field">
                            <IconField>
                                <InputIcon>
                                    <i class="pi pi-envelope" />
                                </InputIcon>
                                <InputText id="email" v-model="signupRequest.email" type="email" placeholder="Email" />
                            </IconField>
                        </div>
                        <div class="field">
                            <IconField>
                                <InputIcon>
                                    <i class="pi pi-key" />
                                </InputIcon>
                                <InputText id="input" v-model="signupRequest.password" type="password" placeholder="Password" />
                            </IconField>
                        </div>
                        <div class="field">
                            <IconField>
                                <InputIcon>
                                    <i class="pi pi-phone" />
                                </InputIcon>
                                <InputText id="email" v-model="signupRequest.phone" type="text" placeholder="Phone" />
                            </IconField>
                        </div>
                        <Button type="submit" label="Submit" class="mt-2" @click="signup()" />
                        <p @click="display = 'login'" class="login-register-link">Already have an account ?</p>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <!-- <div class="user-feedback" v-else-if="display === 'feedback'">
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
    </div> -->
</template>