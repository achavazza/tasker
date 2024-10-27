<template>
    <div>
        <h1>Editar id:{{route.params.id}}</h1>

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
                    :rules="[{required:true, whitespace:true,pattern:/https?:\/\/(?:w{1,3}\.)?[^\s.]+(?:\.[a-z]+)*(?::\d+)?(?![^<]*(?:<\/\w+>|\/?>))/, message: 'Ingresa una url válida'}]"
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
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { useDatabaseStore } from '@/stores/database';


const route = useRoute();
const databaseStore = useDatabaseStore();

/*const handleSubmit = () => {
    //console.log('Editar')
    databaseStore.updateURL(route.params.id, url.value);
}*/
const formState =  reactive({
    url:''
})

onMounted(async() => {
    formState.url = await databaseStore.leerURL(route.params.id)
})

const onFinish = async (value)=>{
    console.log('todo correcto', value);
    const error = await databaseStore.updateURL(route.params.id, formState.url);
    if(!error){
        formState.url = '';
        return message.success('Url editada');
    }
    switch(error){
        //buscar errores firestore
        default: 
            message.error("Algo fallo, intente nuevamente");
            break;
    }
}

</script>