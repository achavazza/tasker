<template>
  <VueDraggable 
    class="draggable"
    :class="{'drag-area': level >= 3}"
    tag="ul" 
    v-model="list" 
    group="{ name: 'g1', pull: true, put: true }" 
    :childrenProp="'children'"
    :nested="true"
    :animation="150"
    handle=".handle"
    >
    <li v-for="el in list" :key="el.id" :class="{'top-level-task': isTopLevelTask(el)}">
      {{ el.id }}
      {{ el.status }}
      {{ el.parentId }}
      <div class="handle cursor-move"></div>
      <input type="text" v-model="el.desc" />
      <a-button class="cursor-pointer" @click="newTask()" v-if="parentId == null">+</a-button>
      <a-button class="cursor-pointer" @click="deleteTask(el.id)">-</a-button>
      
      <!-- Only render nested component if there are children 
      <nested v-model="el.children" @end="onDragEnd"/>
      <nested v-model="el.children" @update:modelValue="onDragEnd"/>
      -->
      <nested v-model="el.children" :parentId="el.id" :level="level+1"/>
    </li>
  </VueDraggable>
</template>

<script setup>
import { VueDraggable } from 'vue-draggable-plus'
import { computed, watch } from 'vue'

import { useTaskStore } from '../stores/tasks';
const taskStore = useTaskStore();

const props = defineProps({
  modelValue: {
    type: Array,
    required: true
  },
  parentId: {
    type: [String, Number],
    default: null
  },
  level: {
    type: Number,
    default: 1
  }
})

const deleteTask = (taskId) =>{
  taskStore.deleteTask(taskId);
}

const emits = defineEmits(['update:modelValue'])

// Create a two-way binding for list
const list = computed({
  get: () => props.modelValue,
  set: value => emits('update:modelValue', value)
})

// Watch for changes in list to update parentId automatically
watch(() => list.value, (newList) => {
    updateParentIds(newList, props.parentId);
});

// Determine if a task is top-level (not nested)
const isTopLevelTask = (task) => task.parentId === null;

// Helper function to recursively update `parentId` in the list structure
const updateParentIds = (tasks, parentId) => {
  tasks.forEach(task => {
    if (task.parentId !== parentId) {
      task.parentId = parentId;  // Update task's parentId
      taskStore.updateTasksOrder(task.id, parentId); // Sync with the store
    }
  });
};

const onDragEnd = () => {
  taskStore.debounceSave();
};
</script>

<style scoped>
.drag-area{
  background:#666;
  border-radius:5px
}
.sortable-ghost{
  background:#aaa;
}
.draggable {
  list-style: none;
  padding:0
}
.draggable .draggable {
  padding-left:20px;
}
.handle {
  width:20px;
  height:20px;
  background:blue;
}
.draggable li {
    list-style:none
}
</style>
