#  QuickBite - Online Food Delivery System

QuickBite is a full-stack MERN application that enables users to browse foods, add items to cart, securely pay with stripe. Admins can manage order statuas, menus, and oversee orders.

##  Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- stripe API Integration

---
ADMIN ACCESS

Admin deployed URL : https://quickbite-adminapp.netlify.app/
Admin Source code : https://github.com/kmroja/QuickBite-admin.git

Stripe Test Payments (Test Mode)

When testing Stripe integrations in **Test Mode**, use the following cards to simulate payments without processing real transactions:

| Scenario                  | Test Card Number               | Notes                            |
|--------------------------|--------------------------------|----------------------------------|
| Successful Payment (US)  | `4242 4242 4242 4242`          | Use any future expiry & CVC       |
| Visa (International)**   | See link below                 | Multiple countries supported      |

**International Test Cards (Visa)**  
Stripe provides test cards across many countries. For details, see Stripe's official documentation:  
[Stripe International Test Cards](https://docs.stripe.com/testing#international-cards)  
