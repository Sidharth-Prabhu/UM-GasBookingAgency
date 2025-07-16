// user.js
import { auth, db, signOut, onAuthStateChanged, collection, addDoc, getDocs, query, where, doc, getDoc } from './firebase.js';

const userName = document.getElementById('userName');
const logout = document.getElementById('logout');
const bookingForm = document.getElementById('bookingForm');
const bookingHistory = document.getElementById('bookingHistory');
const balance = document.getElementById('balance');
const paytmQR = document.getElementById('paytmQR');

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = 'index.html';
    return;
  }
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  userName.textContent = userDoc.data().name;
  balance.textContent = `Balance: ₹${userDoc.data().balance}`;
  loadBookingHistory(user.uid);
});

logout.addEventListener('click', async () => {
  await signOut(auth);
  window.location.href = 'index.html';
});

bookingForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const cylinders = parseInt(document.getElementById('cylinders').value);
  const paymentMethod = document.getElementById('paymentMethod').value;
  const cost = cylinders * 800; // Assuming ₹800 per cylinder
  try {
    const bookingRef = await addDoc(collection(db, 'bookings'), {
      userId: auth.currentUser.uid,
      cylinders,
      paymentMethod,
      cost,
      status: 'pending',
      timestamp: new Date()
    });
    if (paymentMethod === 'paytm') {
      paytmQR.style.display = 'block';
    }
    alert('Booking placed! You will receive a confirmation email.');
    sendEmail(auth.currentUser.email, 'Booking Confirmation', `Your booking for ${cylinders} cylinder(s) has been placed. Total: ₹${cost}.`);
    bookingForm.reset();
    loadBookingHistory(auth.currentUser.uid);
  } catch (error) {
    alert(error.message);
  }
});

async function loadBookingHistory(userId) {
  bookingHistory.innerHTML = '';
  const q = query(collection(db, 'bookings'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const booking = doc.data();
    const li = document.createElement('li');
    li.textContent = `${booking.cylinders} cylinder(s) - ₹${booking.cost} - ${booking.paymentMethod} - ${booking.status} - ${new Date(booking.timestamp.toDate()).toLocaleString()}`;
    bookingHistory.appendChild(li);
  });
}

function sendEmail(to, subject, body) {
  console.log(`Email sent to ${to}: Subject: ${subject}, Body: ${body}`);
}