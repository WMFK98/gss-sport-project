import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "@/view/Dashboard.vue";
import Booking from "@/view/Booking.vue";
import Facility from "@/view/Facility.vue";
import DetailBooking from "@/view/DetailBooking.vue";
import Detailfacility from "@/view/Detailfacility.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: { name: "dashboard" },
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
    },
    {
      path: "/booking",
      name: "booking",
      component: Booking,
    },
    {
      path: "/booking/:id",
      name: "detailBooking",
      component: DetailBooking,
    },
    {
      path: "/facility",
      name: "facility",
      component: Facility,
    },
    {
      path: "/facility/:id",
      name: "detailFacility",
      component: Detailfacility,
    },
  ],
});

export default router;
