<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import axios from 'axios';

axios.defaults.withCredentials = true;
const router = useRouter();
const toast = useToast();
const BASE_URL = 'http://localhost:8080/admin'

const email = ref('admin@admin.com')
const password = ref('Password@1')
const errors = ref({
    email: false,
    password: false
})

const clearSession = () => {
    const LOGOUT_URL = BASE_URL + '/logout'
    axios.get(LOGOUT_URL).then(() => { }).catch((error) => { console.error(error) });
}
clearSession();

const showToast = (content, type) => {
    if (type === 'success')
        toast.add({ severity: 'info', summary: 'Admin', detail: content, group: 'br', life: 3000 });
    else if (type === 'error')
        toast.add({ severity: 'error', summary: 'Admin', detail: content, group: 'br', life: 3000 });
    else null
}

const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

const isValidPhone = (phone) => {
    var regex = /^\d{10}$/;
    return regex.test(phone);
}

const validateAdminLogin = () => {
    if (email.value === null || email.value === '' || !isValidEmail(email.value)) {
        showToast('Incorrect email or password.', 'error')
        errors.value.email = true;
        return true;
    } else errors.value.email = false;
    if (password.value === null || password.value === '' || password.value.length < 6) {
        showToast('Incorrect email or password.', 'error')
        errors.value.password = true;
        return true;
    } else errors.value.password = false;

    return false;
}

const login = () => {
    if (validateAdminLogin()) return;
    const LOGIN_URL = BASE_URL + '/login'

    axios.post(LOGIN_URL, {
        emailOrPhone: email.value,
        password: password.value
    }).then((response) => {
        if (response.status === 200) {
            showToast('Login Success.', 'success')
            setTimeout(() => {
                router.push('/admin/home');
            }, 600);
        }
    }).catch((error) => {
        showToast('Bad Credentials.', 'error')
        console.error(error);
    });

}

</script>

<template>
    <div class="admin-login">
        <Toast position="bottom-right" group="br" />
        <div class="card flex justify-content-center p-fluid">
            <div v-focustrap class="w-full" style="max-width: 20rem">
                <div class="field">
                    <h1>Admin Panel Login</h1>
                </div>
                <div class="field">
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-envelope" />
                        </InputIcon>
                        <InputText id="email" v-model="email" type="email" placeholder="Email" autofocus
                            :invalid="errors.email" />
                    </IconField>
                </div>
                <div class="field">
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-key" />
                        </InputIcon>
                        <InputText id="input" v-model="password" type="password" placeholder="Password"
                            :invalid="errors.password" />
                    </IconField>
                </div>
                <Button @click="login" type="submit" label="Continue" class="mt-2" />
            </div>
        </div>
    </div>
</template>