<template>
<h1>Ver</h1>
    {{route.params.id}}
    {{ formState.short }}
    {{ formState.desc }}
    {{ formState.user }}
    {{ formState.time }}
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();

import { message } from 'ant-design-vue';

import { useTaskStore } from '@/stores/tasks';
const taskStore = useTaskStore();

const formState =  reactive({
    id:0,
    desc:'',
})
onMounted(async() => {
    let data = await taskStore.readTask(route.params.id);
    formState.short = data.short;
    formState.desc  = data.desc;
    formState.user  = data.user;
    formState.time  = data.time;
})
/*
const onFinish = async (value)=>{
    console.log('todo correcto', value);
    const error = await taskStore.updateTask(route.params.id, formState.desc);
    if(!error){
        formState.desc = '';
        return message.success('Tarea editada');
    }
    switch(error){
        //buscar errores firestore
        default: 
            message.error("Algo fallo, intente nuevamente");
            break;
    }
}*/

</script>