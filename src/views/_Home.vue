<template>
    <div>
        <h1>Inicio</h1>

        <AddForm />
        <!--
            <form @submit.prevent="handleSubmit">
                <input type="text" name="" placeholder="ingrese url" v-model="url">
                <button type="submit">Agregar</button>
            </form>
            -->


        <p v-if="databaseStore.loadingDoc">Loading docs ...</p>
        
        
        <a-space direction="vertical" style="width:100%" v-if="!databaseStore.loadingDoc">
            <a-card 
            v-for="item of databaseStore.documents" 
            :title="item.short"  
            :key="item.id">
                <template #extra>
                    <a-space>
                        <a-popconfirm
                        title="Seguro que deseas eliminarlo?"
                        ok-text="Si, quiero eliminarlo"
                        cancel-text="Cancelar"
                        @confirm="confirm(item.id)"
                        @cancel="cancel"
                        >
                            <a-button 
                            danger
                            :loading="databaseStore.loadingDoc"
                            :disabled="databaseStore.loadingDoc"
                            >Eliminar</a-button>
                        </a-popconfirm>
                        <a-button type="default" @click="router.push(`/editar/${item.id}`)">Editar</a-button>
                        <a-button @click="copiarPortapapeles(item.id)">Copiar</a-button>
                    </a-space>
                </template>
                <p>{{ item.id }}</p>        
                <p>{{ item.name }}</p>        
            </a-card>    
        </a-space>
        
    </div>
</template>

<script setup>
import { useUserStore } from '../stores/user'
import { useDatabaseStore } from '../stores/database'
//import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { message } from 'ant-design-vue';

const router = useRouter()

const userStore = useUserStore()
const databaseStore = useDatabaseStore()

databaseStore.getUrls();

/*
const url = ref()
const handleSubmit = () => {
    //cuando usas compAPI+setup agregas .value cuando queres leer componentes de vistas, no en las vistas
    databaseStore.addUrl(url.value);
}
*/
const confirm = async (id) => {
    const error = await databaseStore.deleteURL(id)
    
    if(!error){
        message.success('Se elimino con éxito')
    }else{
        return message.error(error)
    }
}
const cancel = () => {
    message.info('No se eliminó')
}

const copiarPortapapeles = async (id) => {
    console.log(id);
    if(!navigator.clipboard){
        message.error('No se pudo copiar al portapapeles')
        return
    }
    
    const path = `${window.location.origin}/${id}`
    const err = await navigator.clipboard.writeText(path)
    if(err){    
        message.error(`Ocurrió un error ${err}`)
    }else{
        message.success('Se copió al portapapeles')
    }

    

}

</script>