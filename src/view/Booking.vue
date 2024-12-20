<script setup>
import { onMounted, ref, watch, watchEffect } from "vue";
import {
  collection,
  query,
  getDocs,
  getCountFromServer,
  orderBy,
  where,
} from "firebase/firestore";

import db from "@/firebase/init.js";
import { deleteField, formatDate } from "../../utils/help.js";
import { useRoute, useRouter } from "vue-router";

const bookings = ref([]);

const route = useRoute();
const PER_PAGES = 7;
const pageSize = ref(1);
const currentPage = ref(route.query.page - 1 || 0);
const filterStatus = ref(route.query.status || "");
const sortBy = ref(route.query.sortBy || "date-desc");
const router = useRouter();

watch(() => {
  if (filterStatus.value) {
    router.push({
      name: "booking",
      query: { ...route.query, status: filterStatus.value },
    });
  } else {
    router.push({
      name: "booking",
      query: { ...deleteField(route.query, "status") },
    });
  }
  getBookings();
}, [filterStatus.value]);

watch(() => {
  if (sortBy.value !== "date-desc") {
    router.push({
      name: "booking",
      query: { ...route.query, sortBy: sortBy.value },
    });
  } else {
    router.push({
      name: "booking",
      query: { ...deleteField(route.query, "sortBy") },
    });
  }

  getBookings();
}, [sortBy.value]);

function nextPage() {
  if (currentPage.value + 1 >= pageSize.value) return;
  currentPage.value = currentPage.value + 1;
  console.log(currentPage.value);
  router.push({
    name: "booking",
    query: { ...route.query, page: currentPage.value + 1 },
  });
}

function previousPage() {
  if (currentPage.value - 1 < 0) return;
  currentPage.value = currentPage.value - 1;
  if (currentPage.value === 0) {
    router.push({
      name: "booking",
      query: { ...deleteField(route.query, "page") },
    });
  } else {
    router.push({
      name: "booking",
      query: { ...route.query, page: currentPage.value + 1 },
    });
  }
}

async function getBookings() {
  const bookingRef = await collection(db, "bookings");
  const pathQuery = route.query;
  const listQuery = [];
  if (pathQuery.status) listQuery.push(where("status", "==", pathQuery.status));
  if (pathQuery.sortBy) {
    const [sort, destination] = pathQuery.sortBy.split("-");
    listQuery.push(orderBy(sort, destination));
  } else listQuery.push(orderBy("date", "desc"));
  const qry = query(bookingRef, ...listQuery);
  const allBookings = (
    await getCountFromServer(query(bookingRef, ...listQuery))
  ).data().count;
  pageSize.value = Math.ceil(allBookings / PER_PAGES);
  if (currentPage.value > pageSize.value - 1)
    currentPage.value = pageSize.value - 1;
  else if (currentPage.value < 0) currentPage.value = 0;

  if (currentPage.value === 0) {
    router.push({
      name: "booking",
      query: { ...deleteField(route.query, "page") },
    });
  } else {
    router.push({
      name: "booking",
      query: { ...route.query, page: currentPage.value + 1 },
    });
  }

  bookings.value = (await getDocs(qry)).docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

onMounted(() => {
  getBookings();
});
</script>

<template>
  <div class="flex w-full items-center justify-between">
    <h1 class="text-2xl">การจองทั้งหมด</h1>
    <div class="flex gap-2">
      <div class="join">
        <input
          v-model="filterStatus"
          class="btn btn-square join-item btn-sm w-[100px] px-2 checked:bg-red-50"
          type="radio"
          name="options"
          aria-label="ทั้งหมด"
          checked="checked"
          value=""
        />
        <input
          v-model="filterStatus"
          class="btn btn-square join-item btn-sm w-[100px] px-2"
          type="radio"
          name="options"
          aria-label="รอดำเนินการ"
          value="รอดำเนินการ"
        />
        <input
          v-model="filterStatus"
          class="btn btn-square join-item btn-sm w-[100px] px-2"
          type="radio"
          name="options"
          aria-label="ยืนยันแล้ว"
          value="ยืนยันแล้ว"
        />
        <input
          v-model="filterStatus"
          class="btn btn-square join-item btn-sm w-[100px] px-2"
          type="radio"
          name="options"
          aria-label="ยกเลิก"
          value="ยกเลิก"
        />
      </div>
      <select v-model="sortBy" class="select select-bordered select-sm">
        <option value="date-desc" selected>เรียงตามเวลา (ล่าสุด)</option>
        <option value="date-asc">เรียงตามเวลา (เก่าสุด)</option>
        <option value="price-desc">เรียงตามยอดชำระ (มากสุด)</option>
        <option value="price-asc">เรียงตามยอดชำระ (น้อยสุด)</option>
      </select>
    </div>
  </div>

  <div class="overflow-x-auto">
    <table class="table">
      <thead>
        <tr>
          <th>สถานที่</th>
          <th>ประเภทกีฬา</th>
          <th>ผู้จอง</th>
          <th>เวลาจอง</th>
          <th class="text-center">สถานะ</th>
          <th class="text-center">ยอดชำระ</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="booking in bookings.slice(
            currentPage * PER_PAGES,
            currentPage * PER_PAGES + PER_PAGES,
          )"
          :key="booking.id"
        >
          <th class="font-medium">{{ booking.facility_name }}</th>
          <td>{{ booking.sports_type }}</td>
          <td>{{ booking.user_name }}</td>
          <td>
            <p>{{ formatDate(booking.date) }}</p>
            <p class="text-xs text-gray-500">{{ booking.time_slot }}</p>
          </td>
          <td class="flex justify-center">
            <span
              class="mt-2 w-[100px] rounded-md px-2 text-center"
              :class="[
                booking.status === 'ยืนยันแล้ว' &&
                  'bg-green-100 text-green-700',
                booking.status === 'รอดำเนินการ' &&
                  'bg-yellow-100 text-yellow-700',
                booking.status === 'ยกเลิก' && 'bg-red-100 text-red-700',
              ]"
              >{{ booking.status }}</span
            >
          </td>
          <td class="text-center">{{ booking.price }} ฿</td>
          <td>
            <button
              @click="
                $router.push({
                  name: 'detailBooking',
                  params: { id: booking.id.substring(7) },
                })
              "
              class="btn btn-sm"
            >
              รายละเอียด
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="flex w-full justify-end">
    <div class="join">
      <button @click="previousPage()" class="btn join-item btn-sm">«</button>
      <button class="btn join-item btn-sm text-xs">
        Page {{ currentPage + 1 }}/{{ pageSize }}
      </button>
      <button @click="nextPage()" class="btn join-item btn-sm">»</button>
    </div>
  </div>
</template>

<style scoped></style>
