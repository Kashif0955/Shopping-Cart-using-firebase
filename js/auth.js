// js/auth.js
import { auth, GoogleAuthProvider, signInWithPopup, signOut } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
  const signInBtn = document.getElementById('sign-in-btn');
  const signOutBtn = document.getElementById('sign-out-btn');

  signInBtn.addEventListener('click', async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('User signed in:', result.user);
    } catch (error) {
      console.error('Sign In Error:', error);
    }
  });

  signOutBtn.addEventListener('click', async () => {
    try {
      await signOut(auth);
      console.log('User signed out');
    } catch (error) {
      console.error('Sign Out Error:', error);
    }
  });

  auth.onAuthStateChanged(user => {
    if (user) {
      document.getElementById('sign-in-section').style.display = 'none';
      document.getElementById('main-content').style.display = 'block';
      document.getElementById('sign-out-btn').style.display = 'block'; // Show Sign-Out button
      initializeCart();
    } else {
      document.getElementById('sign-in-section').style.display = 'block';
      document.getElementById('main-content').style.display = 'none';
      document.getElementById('sign-out-btn').style.display = 'none'; // Hide Sign-Out button
    }
  });
});
