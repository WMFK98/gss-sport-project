<script setup>
import Stat from "@/ui/Stat.vue";

defineProps(["statPending", "statBooking", "statSale"]);
</script>

<template>
  <div class="flex w-full items-center justify-between gap-2">
    <Stat
      icon="pi-hourglass"
      icon-color="text-yellow-700"
      icon-bg-color="bg-yellow-100"
      label="รอดำเนินการ"
      :value="statPending"
    />
    <Stat
      icon="pi-address-book"
      icon-color="text-blue-700"
      icon-bg-color="bg-blue-100"
      label="ยอดจอง"
      :value="statBooking"
    />
    <Stat
      icon="pi-wallet"
      icon-color="text-green-700"
      icon-bg-color="bg-green-100"
      label="ยอดขาย"
      :value="statSale + ' ฿'"
    />
  </div>
</template>

<style scoped></style>
