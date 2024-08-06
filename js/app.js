// js/app.js
import { auth, db } from './firebase.js';
import { collection, addDoc, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

// Add event listeners to "Add to Cart" buttons
document.addEventListener('DOMContentLoaded', () => {
  const addToCartButtons = document.querySelectorAll('[data-action="add-to-cart"]');

  addToCartButtons.forEach(button => {
    button.addEventListener('click', async (event) => {
      console.log('Add to cart button clicked');
      const productElement = event.target.closest('.product');
      const productName = productElement.querySelector('.product-name').textContent;
      const productPrice = productElement.querySelector('.product-price').textContent;

      console.log(`Adding product: ${productName}, Price: ${productPrice}`);

      if (auth.currentUser) {
        await addToCart(auth.currentUser.uid, productName, productPrice);
      } else {
        alert('Please sign in to add items to the cart.');
      }
    });
  });

  // Load cart items on page load
  if (auth.currentUser) {
    loadCart(auth.currentUser.uid);
  }
});

// Function to add an item to the cart
async function addToCart(userId, productName, productPrice) {
  try {
    const cartRef = collection(db, 'carts');
    await addDoc(cartRef, {
      userId: userId,
      productName: productName,
      productPrice: productPrice,
      timestamp: new Date()
    });
    alert('Item added to cart!');
    loadCart(userId); // Reload cart items
  } catch (error) {
    console.error('Error adding item to cart:', error);
  }
}

// Function to load cart items
async function loadCart(userId) {
  try {
    const cartRef = collection(db, 'carts');
    const q = query(cartRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    querySnapshot.forEach(doc => {
      const data = doc.data();
      const cartItemHTML = `
        <div class="col-sm-6 col-md-6 col-lg-6 col-xs-6">
          <div class="shadow-sm card mb-3 product">
            <img class="product-img" src="./img/placeholder.jpg" alt="product"/>
            <div class="card-body">
              <h5 class="card-title text-info bold product-name">${data.productName}</h5>
              <p class="card-text text-success product-price">${data.productPrice}</p>
            </div>
          </div>
        </div>
      `;
      cartItemsContainer.innerHTML += cartItemHTML;
    });
  } catch (error) {
    console.error('Error loading cart items:', error);
  }
}

// Sign out function
document.getElementById('sign-out-btn').addEventListener('click', async () => {
  try {
    await auth.signOut();
    document.getElementById('sign-in-section').style.display = 'block';
    document.getElementById('main-content').style.display = 'none';
    alert('Signed out successfully!');
  } catch (error) {
    console.error('Error signing out:', error);
  }
});

// Update visibility based on authentication status
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById('sign-in-section').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
    loadCart(user.uid);
  } else {
    document.getElementById('sign-in-section').style.display = 'block';
    document.getElementById('main-content').style.display = 'none';
  }
});
