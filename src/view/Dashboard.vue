<script setup>
import Stats from "@/ui/Stats.vue";
import { onMounted, ref } from "vue";
const statPending = ref(0);
const statSale = ref(0);
const statBooking = ref(0);
const bookingToday = ref([]);
const top5Facilities = ref([]);
import {
  collection,
  query,
  count,
  sum,
  getAggregateFromServer,
  getCountFromServer,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import db from "@/firebase/init.js";
import { formatDate } from "../../utils/help.js";
async function getStats() {
  const bookingsRef = await collection(db, "bookings");
  statPending.value = (
    await getCountFromServer(
      query(bookingsRef, where("status", "==", "รอดำเนินการ")),
    )
  ).data().count;

  const aggBooking = (
    await getAggregateFromServer(bookingsRef, {
      statSale: sum("price"),
      statsBooking: count(),
    })
  ).data();

  statBooking.value = aggBooking.statsBooking;
  statSale.value = aggBooking.statSale;
}

async function getTop5Facilities() {
  const facilitiesRef = await collection(db, "facilities");
  const qry = query(facilitiesRef, orderBy("rating", "desc"), limit(5));
  const querySnapshot = await getDocs(qry);

  top5Facilities.value = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

async function getBookingToday() {
  const bookingsRef = collection(db, "bookings");
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const qry = query(
    bookingsRef,
    where("date", ">=", startOfDay),
    where("date", "<=", endOfDay),
  );

  const querySnapshot = await getDocs(qry);
  bookingToday.value = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

onMounted(() => {
  getStats();
  getBookingToday();
  getTop5Facilities();
});
</script>

<template>
  <div class="flex w-full items-center justify-between">
    <h1 class="text-2xl">รายงาน</h1>
    <h3 class="text-sm">ทั้งหมด</h3>
  </div>
  <Stats
    :stat-pending="statPending"
    :stat-booking="statBooking"
    :statSale="statSale"
  />
  <div class="flex w-full flex-auto gap-2">
    <div class="flex w-full flex-auto flex-col rounded-md border p-4">
      <h3>จองวันนี้</h3>
      <div v-show="bookingToday.length" class="overflow-x-auto">
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
            <tr v-for="booking in bookingToday" :key="booking.id">
              <th class="font-medium">{{ booking.facility_name }}</th>
              <td>{{ booking.sports_type }}</td>
              <td>{{ booking.user_name }}</td>
              <td>
                <p>{{ formatDate(booking.date) }}</p>
                <p class="text-xs text-gray-500">{{ booking.time_slot }}</p>
              </td>
              <td class="flex justify-center">
                <span
                  class="mt-2 w-[75px] rounded-md px-2 text-center"
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
      <div
        v-show="!bookingToday.length"
        class="flex w-full flex-auto items-center justify-center text-3xl text-gray-400"
      >
        ยังไม่มี
      </div>
    </div>
    <div class="flex flex-col rounded-md border p-4">
      <h3>Top 5 สถานที่ยอดนิยม</h3>
      <table class="table">
        <thead>
          <tr>
            <th>สถานที่</th>
            <th>คะแนน</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="facility in top5Facilities" :key="facility.id">
            <th class="font-medium">{{ facility.name }}</th>
            <td>{{ facility.rating }}/5</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped></style>
