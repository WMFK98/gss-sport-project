<script setup>
import { onMounted, ref } from "vue";
import {
  getDoc,
  doc,
  collection,
  where,
  getDocs,
  limit,
  query,
} from "firebase/firestore";
import db from "@/firebase/init.js";
import { formatDate } from "../../utils/help.js";
import { useRoute } from "vue-router";
const route = useRoute();
const facilityId = "facility" + route.params.id;
const facilityDetail = ref({});
const reviews = ref([]);

async function getFacility() {
  const facilityRef = await doc(db, "facilities", facilityId);
  const querySnap = await getDoc(facilityRef);
  facilityDetail.value = { id: querySnap.id, ...querySnap.data() };
}

async function getReviewsByFacilityId() {
  const reviewsRef = await collection(db, "reviews");
  const qry = query(reviewsRef, where("facility_id", "==", facilityId));
  const querySnap = await getDocs(qry);
  reviews.value = querySnap.docs.map((review) => ({
    id: review.id,
    ...review.data(),
  }));
}

onMounted(() => {
  getFacility();
  getReviewsByFacilityId();
});
</script>

<template>
  <div class="flex w-full items-center justify-between">
    <h1 class="text-2xl">รายละเอียดสถานที่ : {{ facilityDetail.id }}</h1>
    <button
      @click="$router.back()"
      class="btn btn-ghost btn-sm text-sm text-indigo-700"
    >
      <span class="pi pi-arrow-left" /> ย้อนกลับ
    </button>
  </div>
  <div class="flex w-full gap-2">
    <div
      class="flex-ma flex w-full flex-col gap-3 overflow-hidden rounded-md border pb-4"
    >
      <div
        class="flex h-[57px] items-center justify-between bg-indigo-600 px-4 text-white"
      >
        <h3>ชื่อ: {{ facilityDetail.name }}</h3>
        <h3>คะแนน {{ facilityDetail.rating }}/5</h3>
      </div>

      <div class="flex w-full flex-auto flex-col gap-2 px-4">
        <div>
          <p>สถานที่</p>
          <p class="text-sm">{{ facilityDetail.location?.city }}</p>
        </div>
        <div class="flex flex-auto justify-between gap-3">
          <div class="flex-auto overflow-x-auto">
            <table class="table">
              <thead>
                <tr>
                  <th class="w-full">ประเภทกีฬา</th>
                  <th>ราคา (ชั่วโมง)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="sportsType in facilityDetail.sports_type">
                  <td>{{ sportsType }}</td>
                  <td>{{ facilityDetail?.price_per_hour[sportsType] }} ฿</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="h-full w-[1px] bg-gray-300"></div>

          <div class="flex-1 space-y-3">
            <table class="table">
              <thead>
                <tr>
                  <th>ช่วงเวลาจอง (กีฬาทุกประเภท)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="availableTime in facilityDetail.available_times">
                  <td>{{ availableTime }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <h1 class="text-2xl">รีวิว</h1>
  <div class="flex w-full flex-auto gap-2 overflow-y-auto">
    <div
      class="flex w-full flex-auto flex-col overflow-y-scroll rounded-md border p-4"
    >
      <table v-show="reviews.length" class="table">
        <thead>
          <tr>
            <th>ชื่อ</th>
            <th>ความเห็น</th>
            <th>วันที่</th>
            <th>คะแนน</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="review in reviews">
            <td>{{ review.user_name }}</td>
            <td>{{ review.comment }}</td>
            <td>{{ formatDate(review.created_at) }}</td>
            <td>{{ review.rating }}</td>
          </tr>
        </tbody>
      </table>
      <div
        v-show="!reviews.length"
        class="flex w-full flex-auto items-center justify-center text-3xl text-gray-400"
      >
        ยังไม่มีรีวิว
      </div>
    </div>
  </div>
</template>
