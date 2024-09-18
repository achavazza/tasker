<script setup>
import { reactive, ref } from 'vue';
import { supabase } from '@/supabase';
import router from '@/router/index.js';
import { useUserStore } from "../stores/user"

/*
const email = ref('lalala@lalala.com');
const password = ref('lalala');
const isSigningIn = ref(false);
*/

const formState = reactive({
    email: 'alalala@lala.com',
    password: 'lalala'
})

const userStore = useUserStore()

/*
async function signIn() {
  isSigningIn.value = true;
  try {

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    });

    if (error) {
      throw error;
    } else {
      console.log('User signed in:', data);
      router.push('/');
    }
  } catch (error) {
    console.error(error);
    alert('Sign in failed. Check the console for more details.');
  } finally {
    isSigningIn.value = false;
  }
}*/
const handleSubmit = async () => {
    /* if(!email.value || password.value.length < 6){
        alert('ingrese user y pass');
    } */
    
   //router.push('/')
   
   /* console.log(formState.email)
   console.log(formState.password)
   console.log('procesando formulario') */
   await userStore.loginUser(formState.email, formState.password)
   
}
</script>

<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <input name="email" v-model="formState.email" type="email" placeholder="Email" />
      <input name="password" v-model="formState.password" type="password" placeholder="Password" />
      <button type="submit">Sign In</button>
      <p v-if="isSigningIn">Signing in, please wait...</p>
    </form>
  </div>
</template>
