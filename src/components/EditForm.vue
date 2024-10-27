<script setup>
import {reactive} from 'vue';
import { useDatabaseStore } from '../stores/database';
import { message } from 'ant-design-vue';
const databaseStore = useDatabaseStore()
//databaseStore.getUrls();

const formState =  reactive({
    url:''
})
const onFinish = async (value)=>{
    console.log('todo correcto', value);
    const error = await databaseStore.addUrl(formState.url);
    if(!error){
        formState.url = '';
        return message.success('Url agregada');
    }
    switch(error){
        //buscar errores firestore
        default: 
            message.error("algo fallo, intente nuevamente");
            break;
    }
}
</script>
<template>
    <a-form 
    name="addForm"
    autocomplete="off"
    layout="vertical"
    :model="formState"
    @finish="onFinish"
    >
        <a-form-item
            name="url"
            label="Ingresa una url"
            :rules="[{required:true, whitespace:true,pattern:/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/, message: 'Ingresa una url válida'}]"
        >
            <a-input v-model:value="formState.url"></a-input>
        </a-form-item>
        <a-form-item name="submit">
            <a-button 
                type="primary" 
                html-type="submit"
                :loading="databaseStore.loadingDoc"
                :disabled="databaseStore.loadingDoc"
            >
                Editar URL
            </a-button>
        </a-form-item>
    </a-form>
    
</template>
