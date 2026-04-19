# Role-Based eCommerce Admin Dashboard

A secure admin panel for a basic eCommerce backend built with AdminJS, Sequelize, and PostgreSQL, featuring JWT authentication, role-based access control, and customizable dashboard pages.

## Tech Stack

- **Backend**: Node.js + Express
- **Database**: PostgreSQL with Sequelize ORM
- **Admin Interface**: AdminJS
- **Authentication**: JWT + bcrypt
- **Security**: Password hashing with bcryptjs

## Project Structure

```
src/
├── config/          # Database configuration
├── models/          # Sequelize models
├── routes/          # API endpoints
├── middleware/      # Authentication & authorization middleware
├── controllers/     # Business logic
└── server.js        # Main server file
```

## Features

- ✅ Secure authentication with JWT
- ✅ Role-based access control (Admin/User)
- ✅ AdminJS integration with all models
- ✅ Custom dashboard with system summary
- ✅ Settings page for configuration management
- ✅ Password field hidden from views
- ✅ Relationship management between entities

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Change8_Ltd-_ssignment_
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Create PostgreSQL database:
```sql
CREATE DATABASE ecommerce_db;
```

5. Start the development server:
```bash
npm run dev
```

6. Access the admin panel at `http://localhost:3000/admin`

## Default Admin Credentials

Email: `admin@example.com`
Password: `admin123` (will be set in database seed)

## API Endpoints

### Authentication
- `POST /api/login` - Login with email and password

## Models

- **User**: System users with roles (admin/user)
- **Category**: Product categories
- **Product**: E-commerce products
- **Order**: Customer orders
- **OrderItem**: Items in an order
- **Setting**: Application configuration settings

## Role-Based Access

### Admin Users
- Access all AdminJS resources
- Can add/edit/delete users and entities
- View custom admin dashboard
- Manage system settings

### Regular Users
- Can log in but with limited access
- Cannot see Users or Settings tables
- View limited dashboard (personal info/recent orders)

## Development

Start development server with hot reload:
```bash
npm run dev
```

## Deployment

See deployment section for production deployment guidelines.

## License

ISC
