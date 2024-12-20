<script setup>
import Sidebar from "@/ui/Sidebar.vue";
import Navbar from "@/ui/Navbar.vue";
</script>

<template>
  <div
    id="container"
    class="font-poppins-kanit flex max-h-screen min-h-screen overflow-hidden"
  >
    <Sidebar />
    <div class="flex flex-auto flex-col">
      <Navbar />
      <main
        class="flex h-full w-full flex-auto flex-col gap-5 overflow-y-auto px-[10%] py-[5%]"
      >
        <router-view />
      </main>
    </div>
  </div>
</template>
