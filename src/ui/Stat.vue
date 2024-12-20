<script setup>
defineProps(["icon", "label", "value", "iconBgColor", "iconColor"]);
</script>

<template>
  <div
    class="flex h-[70px] flex-auto items-center gap-4 rounded-md border px-4"
  >
    <div
      :class="`flex h-[50px] w-[50px] items-center justify-center rounded-full ${iconBgColor}`"
    >
      <i :class="`pi ${icon} text-2xl ${iconColor}`" />
    </div>
    <div class="flex flex-col">
      <h3>{{ label }}</h3>
      <h2 class="text-lg font-bold">{{ value }}</h2>
    </div>
  </div>
</template>
