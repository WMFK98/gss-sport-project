<script setup>
const { selected, id } = defineProps(["icon", "selected", "id"]);
console.log(selected, id);
</script>

<template>
  <button
    class="btn-md btn btn-ghost group block w-full space-x-3 text-start hover:bg-gray-50"
  >
    <span
      :class="`pi ${icon} ${selected === id ? 'text-indigo-700' : ''} group-hover:text-indigo-700`"
    ></span>
    <slot> </slot>
  </button>
</template>

<style scoped></style>
