var admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");
const bookings = require("./bookings.json");
const facilities = require("./facilities.json");
const users = require("./users.json");
const reviewsCollection = require("./reviewsCollection.json");

var serviceAccount = require("./serviceAccountKey.json");
const { deleteField } = require("../utils/help.js");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://int305fb-default-rtdb.firebaseio.com",
});

var db = getFirestore();

bookings.forEach(function (obj) {
  db.collection("bookings")
    .doc(obj.booking_id)
    .set({
      ...deleteField(obj, "booking_id"),
      date: new Date(obj.date),
    })
    .then((docRef) => {
      console.log("bookings Document written with ID : " + docRef.id);
    });
});

facilities.forEach(function (obj) {
  db.collection("facilities")
    .doc(obj.facility_id)
    .set({
      ...deleteField(obj, "facility_id"),
    })
    .then((docRef) => {
      console.log("bookings Document written with ID : " + docRef.id);
    });
});

users.forEach(function (obj) {
  db.collection("account")
    .doc(obj.user_id)
    .set({
      ...deleteField(obj, "user_id"),
      is_member: Math.random() >= 0.5,
      recent_bookings: obj.recent_bookings
        ? obj.recent_bookings.map((booking) => ({
            ...booking,
            date: new Date(booking.date),
          }))
        : [],
    })
    .then((docRef) => {
      console.log("bookings Document written with ID : " + docRef.id);
    });
});

reviewsCollection.forEach(function (obj) {
  db.collection("reviews")
    .doc(obj.review_id)
    .set({
      ...deleteField(obj, "review_id"),
      created_at: new Date(obj.created_at),
    })
    .then((docRef) => {
      console.log("bookings Document written with ID : " + docRef.id);
    });
});

myproducts.forEach(function (obj) {
  if (obj.category == "Books") {
    db.collection("myproducts")
      .add({
        title: obj.title,
        price: obj.price,
        category: obj.category,
        author: obj.author,
        pages: obj.pages,
        keywords: obj.keywords,
      })
      .then((docRef) => {
        console.log("Book Document written with ID : " + docRef.id);
      });
  } else {
    db.collection("myproducts")
      .add({
        title: obj.title,
        price: obj.price,
        category: obj.category,
        brand: obj.brand,
        memory: obj.memory,
        colors: obj.colors,
      })
      .then((docRef) => {
        console.log("Phone Document written with ID : " + docRef.id);
      });
  }
});
