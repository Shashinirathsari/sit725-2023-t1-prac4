// script.js

const addToCartButtons = document.querySelectorAll('.add-to-cart');

addToCartButtons.forEach(button => {
    button.addEventListener('click', addToCart);
});

function addToCart(event) {
    const product = event.target.parentElement;
    const productName = product.querySelector('h2').textContent;
    const productPrice = parseFloat(product.querySelector('p').textContent.replace('$', ''));
    
    const cartItem = {
        name: productName,
        price: productPrice,
    };
    
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems.push(cartItem);
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    alert('Item added to cart!');
}
    // Send the search query to the server
    fetch(`/api/search-products?q=${searchInput}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        // Handle the search results
        // Update the product list on the client side
        console.log(data); // Log the search results to the console
    })
    .catch(error => {
        console.error(error);
        console.error('An error occurred while searching');
    });

    function addToCart(event) {
        // ... (Your existing code for adding to the cart)
      
        // Send the cart item data to the server
        fetch('/api/add-to-cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            productId: productId,
            quantity: 1 // Change this value based on your requirement
          })
        })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              alert(data.message);
            } else {
              alert('Failed to add item to cart');
            }
          })
          .catch(error => {
            console.error(error);
            alert('An error occurred');
          });
      }

function searchProducts() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const products = document.querySelectorAll(".product");

    // Send the search query to the server
  fetch(`/api/search-products?q=${searchInput}`, {
    method: 'GET'
})
.then(response => response.json())
.then(data => {
    // Handle the search results
    // Update the product list on the client side
    console.log(data); // Log the search results to the console
})
.catch(error => {
    console.error(error);
    alert('An error occurred while searching');
});

    products.forEach(product => {
        const productName = product.querySelector("h2").textContent.toLowerCase();
        
        if (productName.includes(searchInput)) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
}
