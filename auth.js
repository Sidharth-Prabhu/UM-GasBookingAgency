// auth.js
import { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, doc, setDoc, getDoc } from './firebase.js';

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email,
        role: 'user',
        balance: 0
      });
      alert('Registration successful! You will receive a confirmation email.');
      sendEmail(email, 'Welcome to Gas Booking System', `Hi ${name}, your account has been created successfully.`);
      window.location.href = 'index.html';
    } catch (error) {
      alert(error.message);
    }
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('userType').value;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      const role = userDoc.exists() ? userDoc.data().role : 'user';
      if (userType === 'admin' && role !== 'admin') {
        alert('Access denied. Not an admin.');
        await signOut(auth);
        return;
      }
      window.location.href = userType === 'admin' ? 'admin.html' : 'user.html';
    } catch (error) {
      alert(error.message);
    }
  });
}

function sendEmail(to, subject, body) {
  console.log(`Email sent to ${to}: Subject: ${subject}, Body: ${body}`);
}