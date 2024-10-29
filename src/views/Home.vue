<template>
    <p v-if="taskStore.loadingDoc">Loading docs ...</p>
    <a-row>
        <a-col :span="6">
            <AddTask />
        </a-col>
    </a-row>
    <a-row>
        <a-col :xl="6" :md="12" :xs="24">
            <a-space direction="vertical" style="width:100%" v-if="!taskStore.loadingDoc">
                <a-card 
                v-for="item of taskStore.documents" 
                :title="item.short"  
                :key="item.id">
                    <template #extra><a href="#" @click="router.push(`/ver/${item.id}`)">Ver</a></template>
                    <p>{{ item.desc }}</p>  
                    <template #actions>
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
                                :loading="taskStore.loadingDoc"
                                :disabled="taskStore.loadingDoc"
                                >Eliminar</a-button>
                            </a-popconfirm>
                            <a-button type="default" @click="router.push(`/editar/${item.id}`)">Editar</a-button>
                            <a-button @click="copiarPortapapeles(item.id)">Copiar</a-button>
                        </a-space>
                    </template>      
                </a-card>    
            </a-space>
        </a-col>
        <a-col :xl="6" :md="12" :xs="24"></a-col>
        <a-col :xl="6" :md="12" :xs="24"></a-col>
        <a-col :xl="6" :md="12" :xs="24"></a-col>
    </a-row>
</template>

<script setup>
import { message } from 'ant-design-vue';

import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useTaskStore } from '../stores/tasks'

const router = useRouter()
const userStore = useUserStore()
const taskStore = useTaskStore()

taskStore.getTasks();

const confirm = async (id) => {
    const error = await taskStore.deleteURL(id)    
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