  // Import required libraries
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // Import body-parser
const app = express();
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Product = require('./models/product'); // Import your Product model
const User = require('./models/user'); // Import your User model
const productRouter = require('./routes/product'); // Import your product router
const userRouter = require('./routes/user'); // Adjust the path to user.js

  // Use userRouter for user-related routes
  app.use('/user', userRouter);

  // bodyParser middleware to parse JSON data in requests
app.use(bodyParser.json());

  // Connect to MongoDB using MongoClient
MongoClient.connect('mongodb://localhost:27017/stationery_store', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(client => {
  const db = client.db('stationery_store'); // Use the 'stationery_store' database


  // Define a route for the homepage
  app.get('/', (req, res) => {
    res.send('Welcome to Stationery Haven');
  });

  // Define a route to get all products
  app.get('/api/products', async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  // Define a route to get a specific product by ID
  app.get('/api/products/:productId', async (req, res) => {
    try {
      const product = await Product.findById(req.params.productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  // Define API routes for adding items to the cart and searching for products
    app.post('/api/add-to-cart', (req, res) => {
    
      // Return a response indicating success or failure
    res.json({ success: true, message: 'Item added to cart successfully' });
  });

  app.post('/api/add-to-cart', async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id; // Assuming the user is authenticated

    try {
      // Find the user by their ID
      const user = await User.findById(userId);

      const existingCartItem = user.cart.find(item => item.product.equals(productId));

      if (existingCartItem) {
        existingCartItem.quantity += quantity;
      } else {
        user.cart.push({ product: productId, quantity });
      }
      await user.save();

    res.json({ success: true, message: 'Item added to cart successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

    // Create a new cart item object
    const cartItem = {
      product: productId,
      quantity: quantity
    };

    // Add the cart item to the user's cart array
    user.cart.push(cartItem);

  app.get('/api/search-products', async (req, res) => {
    const searchQuery = req.query.q;
  
    try {
      const matchedProducts = await Product.find({
        name: { $regex: searchQuery, $options: 'i' }
      });
  
      res.json(matchedProducts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while searching' });
    }
  });
  passport.use(new LocalStrategy(
    (username, password, done) => {
      if (username === 'user' && password === 'password') {
        return done(null, { id: 1, username: 'user' });
      }
      return done(null, false, { message: 'Incorrect username or password' });
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    if (id === 1) {
      return done(null, { id: 1, username: 'user' });
    }
    return done(null, null);
  });

  app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  }));

  app.use('/api', productRouter);

  // Initialize Passport and session middleware
  app.use(passport.initialize());
  app.use(passport.session());

  // Serve CSS files from the main directory
  app.use(express.static(__dirname));

  // Serve images from the 'jpg' directory
  app.use('/images', express.static(path.join(__dirname, 'jpg')));

  // Route to render login form
  app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
  });

  // Route to handle login form submission
  app.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
  }));

  // Route to access protected content
  app.get('/dashboard', (req, res) => {
    if (req.isAuthenticated()) {
      res.send('Welcome to the dashboard');
    } else {
      res.redirect('/login');
    }
  });

  // Route to log out
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
  });

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  }

  // Example of protecting a route
  app.get('/protected-route', ensureAuthenticated, (req, res) => {
    res.send('This route is protected.');
  });

  // Route to render registration form
  app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'registration.html'));
  });

  // Route to handle registration form submission
  app.post('/register', (req, res) => {
    // Implement the logic to validate and add new users to the database
    const { username, password } = req.body;
    if (username && password) {
      // Store the user in the database or any other storage
      // For example, you can use MongoDB to store user information
      // Redirect to the login page after successful registration
      res.redirect('/login');
    } else {
      res.send('Invalid registration data');
    }
  });

  // ... Start the server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Error connecting to MongoDB:', error);
});
