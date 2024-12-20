<script setup>
import Logo from "@/ui/Logo.vue";
import MenuSidebar from "@/ui/MenuSidebar.vue";
</script>

<template>
  <aside
    id="sidebar"
    class="bg-gray-0 flex h-screen w-[168px] flex-col gap-10 border-r-[1px] border-gray-100 px-2 py-4"
  >
    <Logo />
    <MenuSidebar />
  </aside>
</template>

<style scoped></style>
