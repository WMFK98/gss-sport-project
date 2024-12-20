<script setup>
import { onMounted, ref } from "vue";
import {
  getDoc,
  doc,
  collection,
  where,
  getDocs,
  query,
} from "firebase/firestore";
import db from "@/firebase/init.js";
import { formatDate } from "../../utils/help.js";
import { useRoute } from "vue-router";
const route = useRoute();
const bookingId = "booking" + route.params.id;
const bookingDetail = ref({});
const userDetail = ref({});
async function getBooking() {
  const bookingRef = await doc(db, "bookings", bookingId);
  const querySnap = await getDoc(bookingRef);
  bookingDetail.value = { id: querySnap.id, ...querySnap.data() };
}

async function getUserByName() {
  const userRef = await collection(db, "account");
  const qry = query(
    userRef,
    where("name", "==", bookingDetail.value.user_name),
  );
  const querySnap = (await getDocs(qry)).docs[0];
  userDetail.value = { id: querySnap.id, ...querySnap.data() };
}

onMounted(async () => {
  await getBooking();
  await getUserByName();
});
</script>

<template>
  <div class="flex w-full items-center justify-between">
    <h1 class="flex items-center gap-2 text-2xl">
      การจอง : {{ bookingDetail.id }}
      <span
        class="w-max rounded-md px-2 text-center text-sm"
        :class="[
          bookingDetail.status === 'ยืนยันแล้ว' &&
            'bg-green-100 text-green-700',
          bookingDetail.status === 'รอดำเนินการ' &&
            'bg-yellow-100 text-yellow-700',
          bookingDetail.status === 'ยกเลิก' && 'bg-red-100 text-red-700',
        ]"
        >{{ bookingDetail.status }}</span
      >
    </h1>
    <button
      @click="$router.back()"
      class="btn btn-ghost btn-sm text-sm text-indigo-700"
    >
      <span class="pi pi-arrow-left" /> ย้อนกลับ
    </button>
  </div>
  <div
    class="flex h-max w-full flex-col gap-3 overflow-hidden rounded-md border pb-4"
  >
    <div
      class="flex h-[57px] items-center justify-between bg-indigo-600 px-4 text-white"
    >
      <h3>สนาม: {{ bookingDetail.facility_name }}</h3>
      <h3>
        <i class="pi pi-calendar-clock" />
        {{ formatDate(bookingDetail.date) }} <i class="pi pi-stopwatch" />
        {{ bookingDetail.time_slot }}
      </h3>
    </div>

    <div class="flex w-full flex-auto flex-col gap-2 px-4 text-sm">
      <div class="flex gap-2">
        <li>{{ bookingDetail.user_name }}</li>
        <li class="text-gray-500">{{ userDetail.email }}</li>
        <li class="text-gray-500">{{ userDetail.phone }}</li>
      </div>

      <p>
        <i class="pi pi-ticket mr-1 text-indigo-700" />
        ประเภทกีฬา : {{ bookingDetail.sports_type }}
      </p>

      <p>
        <i
          class="pi pi-ticket mr-1"
          :class="
            userDetail.is_member
              ? 'pi-check-circle text-green-700'
              : 'pi-times-circle text-red-700'
          "
        />

        เป็นสมาชิก :
        {{ userDetail.is_member ? "ใช่" : "ไม่" }}
      </p>

      <div
        class="mt-10 flex h-[70px] items-center justify-between gap-2 rounded-md px-4"
        :class="[
          bookingDetail.status === 'ยืนยันแล้ว' &&
            'bg-green-100 text-green-700',
          bookingDetail.status === 'รอดำเนินการ' &&
            'bg-yellow-100 text-yellow-700',
          bookingDetail.status === 'ยกเลิก' && 'bg-red-100 text-red-700',
        ]"
      >
        ยอดชำระ <span> {{ bookingDetail.price }} ฿</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
