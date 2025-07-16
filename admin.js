// admin.js
import { auth, db, signOut, onAuthStateChanged, collection, getDocs, query, where, updateDoc, doc, getDoc } from './firebase.js';

const logout = document.getElementById('logout');
const pendingBookings = document.getElementById('pendingBookings');
const userList = document.getElementById('userList');

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = 'index.html';
    return;
  }
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (userDoc.data().role !== 'admin') {
    alert('Access denied.');
    await signOut(auth);
    window.location.href = 'index.html';
    return;
  }
  loadPendingBookings();
  loadUsers();
});

logout.addEventListener('click', async () => {
  await signOut(auth);
  window.location.href = 'index.html';
});

async function loadPendingBookings() {
  pendingBookings.innerHTML = '';
  const q = query(collection(db, 'bookings'), where('status', '==', 'pending'));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async (doc) => {
    const booking = doc.data();
    const userDoc = await getDoc(doc(db, 'users', booking.userId));
    const li = document.createElement('li');
    li.textContent = `${userDoc.data().name} - ${booking.cylinders} cylinder(s) - ₹${booking.cost} - ${booking.paymentMethod}`;
    const approveBtn = document.createElement('button');
    approveBtn.textContent = 'Approve';
    approveBtn.onclick = async () => {
      await updateDoc(doc.ref, { status: 'approved' });
      loadPendingBookings();
      sendEmail(userDoc.data().email, 'Booking Approved', `Your booking for ${booking.cylinders} cylinder(s) has been approved.`);
    };
    const denyBtn = document.createElement('button');
    denyBtn.textContent = 'Deny';
    denyBtn.onclick = async () => {
      await updateDoc(doc.ref, { status: 'denied' });
      loadPendingBookings();
      sendEmail(userDoc.data().email, 'Booking Denied', `Your booking for ${booking.cylinders} cylinder(s) has been denied.`);
    };
    li.appendChild(approveBtn);
    li.appendChild(denyBtn);
    pendingBookings.appendChild(li);
  });
}

async function loadUsers() {
  userList.innerHTML = '';
  const querySnapshot = await getDocs(collection(db, 'users'));
  querySnapshot.forEach((doc) => {
    const user = doc.data();
    const li = document.createElement('li');
    li.textContent = `${user.name} - ${user.email} - Balance: ₹${user.balance}`;
    userList.appendChild(li);
  });
}

function sendEmail(to, subject, body) {
  console.log(`Email sent to ${to}: Subject: ${subject}, Body: ${body}`);
}