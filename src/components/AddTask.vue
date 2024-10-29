<template>
    <a-form 
    name="addForm"
    autocomplete="off"
    layout="vertical"
    :model="formState"
    @finish="onFinish"
    >   
        <a-form-item
            name="desc"
            label="Ingresa una tarea"
        >
            <a-textarea v-model:value="formState.desc"></a-textarea>
        </a-form-item>
        <a-form-item name="submit">
            <a-button 
                type="primary" 
                html-type="submit"
                :loading="taskStore.loadingDoc"
                :disabled="taskStore.loadingDoc"
            >
                Agregar
            </a-button>
        </a-form-item>
    </a-form>
</template>
<script setup>
import {reactive} from 'vue';
import { useTaskStore } from '../stores/tasks';
import { message } from 'ant-design-vue';
const taskStore = useTaskStore()
//databaseStore.getUrls();

const formState =  reactive({
    task:''
})
const onFinish = async (value)=>{
    //const error = console.log(formState)
    const error = await taskStore.addTask(formState.desc);
    if(!error){
        formState.desc = '';
        return message.success('Tarea agregada');
    }
    switch(error){
        //buscar errores firestore
        default: 
            message.error("Ocurrió un error, intente nuevamente");
            break;
    }
}
</script>