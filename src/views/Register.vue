<template>
    <a-row>
        <a-col :sm="{span:12, offset:6}">
        <h1>Register</h1>
        <a-form autocomplete="off"
                layout="vertical"
                :model="formState"
                @finish="onFinish">

                <a-form-item
                        name="email"
                        label="Ingresa tu correo"
                        :rules="[{required:true, type:'email', whitespace:true, message: 'Ingresa un email'}]"
                    >
                        <a-input v-model:value="formState.email"></a-input>
                </a-form-item>
            <a-form-item 
                name="password"
                label="Ingrese contraseña"
                :rules="[{required:true, min:6, message: 'Ingresa tu contraseña con 6 caracteres como mínimo'}]"
            >
                <a-input-password v-model:value="formState.password"></a-input-password>
            </a-form-item>
            <a-form-item 
                name="repassword"
                label="Repita la contraseña"
                :rules="[{required:true, min:6, validator:validatePassword}]"
            >
                <a-input-password v-model:value="formState.repassword"></a-input-password>
            </a-form-item>
            <a-form-item name="submit">
                <a-button 
                    type="primary" 
                    html-type="submit"
                    :disabled="userStore.loadingUser"
                >
                    Ingresar
                </a-button>
            </a-form-item>
        </a-form>
        </a-col>
    </a-row>
</template>


<script setup>
import { reactive } from 'vue'
import { useUserStore } from "../stores/user"
//import { useRouter } from "vue-router"

//se usa unplugin, pero message es un addon y si o si hay que importarlo
import { message } from 'ant-design-vue';
//const [messageApi, contextHolder] = message.useMessage();

/* const email = ref('alalala@lala.com')
const password = ref('123123') */

const formState = reactive({
    email: '',
    password: '',
    repassword: '',
})

//const router = useRouter()

const userStore = useUserStore()
const validatePassword= async(rule, value)=>{
    if (value === ''){
        return Promise.reject('Repita contraseña')
    }
    if (value !== formState.password){
        return Promise.reject('Las contraseñas no coinciden')
    }
    return Promise.resolve('')
}

const handleSubmit = async () => {
    /* if(!email.value || password.value.length < 6){
        alert('ingrese user y pass');
    }
    
    await userStore.registerUser(email.value, password.value)
    //router.push('/')

    console.log(email.value)
    console.log(password.value)
    console.log('procesando formulario') */

}
const onFinish = async(values) => {
    console.log('Success:', values)
    const error = await userStore.registerUser(formState.email, formState.password)
    
    if(!error){
        return message.success("Verifica tu correo electrónico");
        
    }
    
    switch(error){
        case "auth/invalid-credential":
            message.error("no existe esa cuenta");
            break;

        case "auth/user-not-found":
            message.error("no existe esa cuenta");
            break;

        case "auth/wrong-password":
            message.error("error de contraseña");
            break;

        default: 
            message.error("algo fallo, intente nuevamente");
            break;
    }
}
const onFinishFailed = (errorInfo) =>{
    console.log('Failed',errorInfo)
}
</script>