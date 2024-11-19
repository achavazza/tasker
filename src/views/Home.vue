<template>
    <p v-if="taskStore.loadingDoc">Loading docs ...</p>
    <AddTask />
    <div v-if="!taskStore.loadingDoc" class="flex">
        <nested v-model="taskStore.structuredTasks" @end="onDragEnd" />
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useTaskStore } from '../stores/tasks';
import nested from '../components/nested.vue';

const taskStore = useTaskStore();

// Fetch all tasks on mount
onMounted(async () => {
    await taskStore.fetchAllTasks();
});

// Handler for the drag end event
const onDragEnd = () => {
    taskStore.debounceSave();
};

</script>

<style>
.flex > .draggable{
    display:flex;
    flex-flow:row wrap;
}
.top-level-task {
    flex: 0 1 400px;
    border-radius: 5px;
}
</style>
