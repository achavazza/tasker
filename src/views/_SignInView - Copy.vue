<script setup>
import { ref } from 'vue';
import { supabase } from '@/supabase';

const isSigningIn = ref(false);

async function signIn() {
  try {
    isSigningIn.value = true;

    // Use the updated method for OAuth sign-in
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    localStorage.removeItem('redirectRoute');
    console.error(error);
    alert('Something went wrong! Check the console for more details');
  } finally {
    isSigningIn.value = false;
  }
}
</script>

<template>
  <p v-if="isSigningIn">Please wait...</p>
  <button v-else @click="signIn">Sign in via Github</button>
</template>
