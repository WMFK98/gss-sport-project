<script setup>
import ButtonSidebar from "@/ui/ButtonSidebar.vue";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const selected = ref();
selected.value = window.location.pathname.split("/")[1] || "dashboard";
console.log(selected.value);
const router = useRouter();
function handleClick(value) {
  selected.value = value;
  router.push({ name: value });
}
</script>

<template>
  <menu class="flex flex-col items-center gap-1">
    <ButtonSidebar
      id="dashboard"
      @click="handleClick('dashboard')"
      icon="pi-home"
      :selected="selected"
    >
      <span>หน้าหลัก</span>
    </ButtonSidebar>
    <ButtonSidebar
      id="booking"
      @click="handleClick('booking')"
      icon="pi-book"
      :selected="selected"
    >
      <span>การจอง</span>
    </ButtonSidebar>
    <ButtonSidebar
      id="facility"
      @click="handleClick('facility')"
      icon="pi-table"
      :selected="selected"
    >
      <span>สถานที่</span>
    </ButtonSidebar>
  </menu>
</template>
