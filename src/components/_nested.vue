<template>
    <draggable
        class="dragArea"
        tag="ul"
        :list="tasks"
        :group="{ name: 'g1' }"
        item-key="name"
    >
    <template #item="{ element }">
        <li>
            <p>{{ element.name }}</p>
            <nested :tasks="element" />
        </li>
    </template>
    </draggable>
</template>
<script setup>
import draggable from 'vuedraggable';
import { defineProps } from 'vue';
const props = defineProps({
  tasks: {
    type: Array,
    required: true
  }
})
</script>
<style scoped>
.draggable {
    cursor: move;
}
.dragArea {
  min-height: 50px;
  outline: 1px dashed;
}
</style>