# E-Commerce Website

A full-stack E-Commerce Website developed as a Web Development Major Project using Node.js, Express.js, MongoDB, Mongoose, EJS, Bootstrap and JavaScript.

## Features

### User Features

- User registration and login
- Role-based authentication
- Product browsing
- Product search and category filtering
- Product details
- Add products to cart
- Update cart quantities
- Remove products from cart
- Stock validation
- Checkout with customer details
- Cash on Delivery (COD)
- Order placement
- Order success confirmation
- View order history
- View order details
- Logout

### Admin Features

- Admin login
- Admin dashboard
- Add products
- Product image upload
- View products
- View customers
- View all orders
- View order details
- Update order status
- Admin logout

## Technologies Used

- HTML
- CSS
- Bootstrap 5
- JavaScript
- Node.js
- Express.js
- EJS
- MongoDB
- Mongoose
- bcrypt
- Express Session
- connect-mongo
- Multer

## Admin Login

Use the following demo credentials to access the Admin Panel:

**Email:** `admin@ecommerce.com`  
**Password:** `Admin@123`

After logging in, the admin can access:

- Admin Dashboard
- Add Products
- View Products
- View Customers
- View Orders
- Update Order Status

## Payment

The project currently supports:

Cash on Delivery (COD)

## Database

The application uses MongoDB with Mongoose.

The default local database configuration is:
```text
mongodb://127.0.0.1:27017/ecommerceDB

## Environment Variables

The project uses the following environment variables:
```text
PORT
MONGO_URI
SESSION_SECRET

A .env.example file is included as a configuration template.

The actual .env file is not included in the GitHub repository for security reasons.

## Project Purpose

This project was developed as a college Web Development Major Project to demonstrate practical implementation of:

Front-end development
Server-side development
Database integration
Authentication and authorization
CRUD operations
Shopping cart functionality
Order management
Admin management
File uploads
Session management

## Author

Sneha Saini
## Project Structure

```text
ecommerce-project/
│
├── config/
├── controllers/
├── middleware/
├── models/
├── public/
│   ├── css/
│   ├── js/
│   └── images/
├── routes/
├── uploads/
├── views/
│   ├── admin/
│   ├── auth/
│   ├── partials/
│   └── user/
│
├── .env
├── .env.example
├── .gitignore
├── app.js
├── package.json
└── README.md