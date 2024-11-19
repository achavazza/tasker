<template>
    <a-card v-if="task" :title="task.desc">
        <template #extra><a-popconfirm
            title="Are you sure delete this task?"
            ok-text="Yes"
            cancel-text="No"
            @confirm="deleteTask(task.id)"
            @cancel="cancel"
        ><a href="#">eliminar</a></a-popconfirm></template>
        <draggable :list="subTasks" :group="{ name: 'task', pull: 'clone', put: false }" tag="transition-group">
            <template #item="{element}">
                <TaskCard :task="element" />
            </template>
        </draggable>
        <a-button @click="addSubTask(task.id)">Add Sub-task</a-button>
    </a-card>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useTaskStore } from '../stores/tasks';
import { message } from 'ant-design-vue';

const taskStore = useTaskStore();

// Props
const props = defineProps({
    task: {
        type: Object,
        required: true
    }
});

// State for handling nested sub-tasks
const cancel = ref();
const deleteTask = (id) => {
    message.error('tarea eliminada');
    taskStore.deleteTask(id);
};

// State for handling nested sub-tasks
const subTasks = computed(() => 
    taskStore.tasks.filter(t => t.parentId === props.task.id)
);

// Method to add a sub-task
const addSubTask = async (parentId) => {
    const desc = prompt("Enter a description for the sub-task");
    if (desc) {
        await taskStore.addTask(desc, parentId);
    }
};

</script>
<style>.w100{width:100%}</style>