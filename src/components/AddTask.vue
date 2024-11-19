<template>
    <a-form 
        name="addForm"
        autocomplete="off"
        layout="vertical"
        :model="formState"
        @finish="onFinish"
    >   
        <a-form-item label="Descripción" name="desc">
            <a-textarea v-model:value="formState.desc"></a-textarea>
        </a-form-item>

        <a-form-item label="Estado" name="status">
            <a-select v-model:value="formState.status" placeholder="Selecciona un estado">
                <a-select-option value="pendiente">Pendiente</a-select-option>
                <a-select-option value="en progreso">En progreso</a-select-option>
                <a-select-option value="completado">Completado</a-select-option>
            </a-select>
        </a-form-item>

        <a-form-item label="Tiempo registrado (horas)" name="trackedTime">
            <a-input-number v-model:value="formState.trackedTime" min="0" :step="0.5" />
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
import { reactive } from 'vue';
import { useTaskStore } from '../stores/tasks';
import { message } from 'ant-design-vue';

const taskStore = useTaskStore();
const formState = reactive({
    desc: '',
    status: 'pendiente',  // Default status
    trackedTime: 0  // Default tracked time
});

const onFinish = async () => {
    if (!formState.desc.trim()) {
        return message.warning('Ingrese una descripción para la tarea');
    }

    const error = await taskStore.addTask(formState.desc, formState.status, formState.trackedTime);
    if (!error) {
        formState.desc = ''; 
        formState.status = 'pendiente';
        formState.trackedTime = 0;
        message.success('Tarea agregada');
    } else {
        message.error("Ocurrió un error, intente nuevamente");
    }
};
</script>
