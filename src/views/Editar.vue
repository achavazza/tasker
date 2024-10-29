<template>
<h1>Editar id:{{route.params.id}}</h1>
<a-form 
    name="addForm"
    autocomplete="off"
    layout="vertical"
    :model="formState"
    @finish="onFinish"
    >
        <a-form-item
            desc="desc"
            label="Ingresa una tarea"
        >
            <a-textarea v-model:value="formState.desc"></a-textarea>
        </a-form-item>
        <a-form-item
            desc="time"
            label="Agregar tiempo"
        >
            <a-popover title="Agregar tiempo" trigger="click" placement="right">
                <template #content>
                    <a @click="timeAdd">Agregar</a>
                </template>
                <a-input-number v-model:value="formState.time" />
            </a-popover>
        </a-form-item>
        <a-form-item name="submit">
            <a-button 
                type="primary" 
                html-type="submit"
                :loading="taskStore.loadingDoc"
                :disabled="taskStore.loadingDoc"
            >
                Editar Tarea
            </a-button>
        </a-form-item>
    </a-form>
</template>

<script setup>
import { message } from 'ant-design-vue';

import { useRoute } from 'vue-router';
import { reactive, onMounted } from 'vue';
import { useTaskStore } from '@/stores/tasks';


const route = useRoute();
const taskStore = useTaskStore();

const formState =  reactive({
    id:0,
    desc:'',
    time:0,
})
onMounted(async() => {
    let data = await taskStore.readTask(route.params.id);
    formState.short = data.short;
    formState.desc  = data.desc;
    formState.user  = data.user;
    formState.time  = data.time;
})
const timeAdd = ()=>{
    //let data = await taskStore.readTask(route.params.id);
    formState.time;
}
const onFinish = async (value)=>{
    //console.log('todo correcto', value);
    let data = {
        desc: formState.desc,
        time: formState.time,
    }
    const error = await taskStore.updateTask(route.params.id, data);
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
}

</script>