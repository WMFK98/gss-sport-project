<script setup>
import { onMounted, ref, watch, watchEffect } from "vue";
import { collection, query, getDocs, where } from "firebase/firestore";
import db from "@/firebase/init.js";
import { deleteField, formatDate } from "../../utils/help.js";
import { useRoute, useRouter } from "vue-router";
const filterSportType = ref([]);
const facilities = ref([]);
const route = useRoute();
const router = useRouter();
const PER_PAGES = 7;
const pageSize = ref(1);
const currentPage = ref(route.query.page - 1 || 0);

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

async function getFacilities() {
  const facilityRef = await collection(db, "facilities");
  const pathQuery = route.query;
  const listQuery = [];
  if (pathQuery.sportType)
    listQuery.push(where("sports_type", "array-contains", pathQuery.sportType));
  const qry = query(facilityRef, ...listQuery);
  facilities.value = (await getDocs(qry)).docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  pageSize.value = Math.ceil(facilities.value.length / PER_PAGES);
  if (currentPage.value > pageSize.value - 1)
    currentPage.value = pageSize.value - 1;
  else if (currentPage.value < 0) currentPage.value = 0;
}

watchEffect(() => {
  if (filterSportType.value) {
    router.push({
      name: "facility",
      query: { ...route.query, sportType: filterSportType.value },
    });
  } else {
    router.push({
      name: "facility",
      query: { ...deleteField(route.query, "sportType") },
    });
  }
  getFacilities();
}, [filterSportType.value]);

onMounted(() => {
  getFacilities();
});
</script>

<template>
  <div class="flex w-full items-center justify-between">
    <h1 class="text-2xl">สถานที่ทั้งหมด</h1>
    <div class="flex gap-2">
      <div class="join">
        <input
          class="btn btn-square join-item btn-sm w-[120px] px-2 checked:bg-red-50"
          type="radio"
          name="options"
          aria-label="ทั้งหมด"
          checked="checked"
          value=""
          v-model="filterSportType"
        />
        <input
          class="btn btn-square join-item btn-sm w-[120px] px-2"
          type="radio"
          name="options"
          value="แบดมินตัน"
          aria-label="แบดมินตัน"
          v-model="filterSportType"
        />
        <input
          class="btn btn-square join-item btn-sm w-[120px] px-2"
          type="radio"
          name="options"
          aria-label="ปิงปอง"
          value="ปิงปอง"
          v-model="filterSportType"
        />
        <input
          class="btn btn-square join-item btn-sm w-[120px] px-2"
          type="radio"
          name="options"
          aria-label="บาสเกตบอล"
          value="บาสเกตบอล"
          v-model="filterSportType"
        />
        <input
          class="btn btn-square join-item btn-sm w-[120px] px-2"
          type="radio"
          name="options"
          value="ฟุตบอล"
          aria-label="ฟุตบอล"
          v-model="filterSportType"
        />
        <input
          class="btn btn-square join-item btn-sm w-[120px] px-2"
          type="radio"
          name="options"
          value="วอลเลย์บอล"
          aria-label="วอลเลย์บอล"
          v-model="filterSportType"
        />
      </div>
    </div>
  </div>

  <div class="overflow-x-auto">
    <table class="table">
      <thead>
        <tr>
          <th>สถานที่</th>
          <th>ประเภทกีฬา</th>
          <th>ที่อยู่</th>
          <th>คะแนน</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="facility in facilities.slice(
            currentPage * PER_PAGES,
            currentPage * PER_PAGES + PER_PAGES,
          )"
          :key="facility.id"
        >
          <th class="font-medium">{{ facility.name }}</th>
          <td>{{ facility.sports_type.join(", ") }}</td>
          <td>
            {{ facility.location.city }}
          </td>

          <td>{{ facility.rating }}/5</td>
          <td>
            <button
              @click="
                $router.push({
                  name: 'detailFacility',
                  params: { id: facility.id.substring(8) },
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
