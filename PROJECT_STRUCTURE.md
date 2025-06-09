# PageTurn Project Structure

This document outlines the complete file structure and organization of the PageTurn Educational Bookstore Platform.

## 📁 Root Directory Structure

```
online-bookstore/
├── 📁 backend/                 # Node.js backend server
├── 📁 public/                  # Static assets and HTML template
├── 📁 resources/               # Original dataset and references
├── 📁 src/                     # React frontend source code
├── 📄 .env.example             # Environment variables template
├── 📄 .gitignore               # Git ignore rules
├── 📄 CHANGELOG.md             # Version history and changes
├── 📄 LICENSE                  # MIT license
├── 📄 package.json             # Frontend dependencies and scripts
├── 📄 PROJECT_STRUCTURE.md     # This file
└── 📄 README.md                # Project documentation
```

## 🔧 Backend Structure (`/backend/`)

```
backend/
├── 📁 config/                  # Configuration files
│   ├── 📄 database.js          # MySQL database configuration
│   ├── 📄 db.js                # Database connection pool
│   └── 📄 stripe.js            # Payment configuration (future)
├── 📁 database/                # Database files and schemas
│   ├── 📄 bookstore.db         # SQLite database (legacy)
│   ├── 📄 bookstore_schema.sql # Database schema
│   ├── 📄 sample_data.sql      # Sample data
│   └── 📄 schema.sql           # Additional schema
├── 📁 middleware/              # Express middleware
│   └── 📄 auth.js              # Authentication middleware
├── 📁 routes/                  # API route handlers
│   ├── 📄 books.js             # Books CRUD operations
│   ├── 📄 cart.js              # Shopping cart management
│   ├── 📄 categories.js        # Category management
│   ├── 📄 newsletter.js        # Newsletter subscriptions
│   ├── 📄 payment.js           # Payment processing (future)
│   └── 📄 users.js             # User authentication
├── 📁 scripts/                 # Utility scripts
│   ├── 📄 addFeaturedBooks.js  # Add featured books
│   ├── 📄 analyze-books.js     # Analyze book data
│   ├── 📄 check-books.js       # Check book count
│   ├── 📄 convert-to-50-lkr.js # Currency conversion
│   ├── 📄 fix-availability.js  # Fix book availability
│   ├── 📄 load-all-books.js    # Load book data
│   └── 📄 set-student-friendly-prices.js # Set pricing
├── 📄 .env.example             # Backend environment template
├── 📄 index.js                 # Alternative entry point
├── 📄 init-db.js               # Database initialization
├── 📄 package.json             # Backend dependencies
└── 📄 server.js                # Main server file
```

## 🎨 Frontend Structure (`/src/`)

```
src/
├── 📁 components/              # Reusable React components
│   ├── 📄 Navigation.js        # Navigation bar component
│   ├── 📄 NewsletterSubscription.js # Newsletter form
│   ├── 📄 Toast.js             # Toast notification component
│   └── 📄 index.js             # Component exports
├── 📁 constants/               # Application constants
│   └── 📄 index.js             # API endpoints, configs, etc.
├── 📁 context/                 # React Context providers
│   ├── 📄 CartContext.js       # Shopping cart state
│   └── 📄 ToastContext.js      # Toast notifications state
├── 📁 pages/                   # Page components
│   ├── 📄 AboutUs.js           # About page
│   ├── 📄 BrowseList.js        # Browse books page
│   ├── 📄 BuySell.js           # Buy/Sell marketplace
│   ├── 📄 CheckoutPage.js      # Checkout process
│   ├── 📄 ContactUs.js         # Contact page
│   ├── 📄 CreateAccount.js     # User registration
│   ├── 📄 Help.js              # Help and support
│   └── 📄 Login.js             # User login
├── 📁 services/                # API service layer
│   └── 📄 api.js               # API calls and endpoints
├── 📁 styles/                  # CSS stylesheets
│   ├── 📄 Checkout.css         # Checkout page styles
│   ├── 📄 about.css            # About page styles
│   ├── 📄 auth.css             # Authentication styles
│   ├── 📄 browse.css           # Browse page styles
│   ├── 📄 buysell.css          # Buy/Sell page styles
│   ├── 📄 contact.css          # Contact page styles
│   ├── 📄 home.css             # Homepage styles
│   ├── 📄 navigation.css       # Navigation styles
│   └── 📄 toast.css            # Toast notification styles
├── 📁 utils/                   # Utility functions
│   └── 📄 index.js             # Helper functions
├── 📄 App.js                   # Main App component
├── 📄 HomePage.js              # Homepage component
├── 📄 index.css                # Global styles
└── 📄 index.js                 # React entry point
```

## 🌐 Public Assets (`/public/`)

```
public/
├── 📁 assets/                  # Organized assets
│   └── 📁 images/              # Image files
│       ├── 📄 abt_img1.png     # About page image 1
│       ├── 📄 abt_img2.png     # About page image 2
│       ├── 📄 best-price.png   # Best price icon
│       ├── 📄 best_book.png    # Best book icon
│       ├── 📄 comm.png         # Community icon
│       ├── 📄 credit-card.png  # Payment icon
│       ├── 📄 expand.png       # Expand icon
│       ├── 📄 logo.webp        # Logo image
│       ├── 📄 logo192.png      # App icon 192px
│       ├── 📄 logo512.png      # App icon 512px
│       ├── 📄 shipped.png      # Shipping icon
│       ├── 📄 slider2.jpg      # Hero slider image
│       ├── 📄 trust_seller.png # Trust icon
│       └── 📄 welcome.jpg      # Welcome image
├── 📄 favicon.ico              # Website favicon
├── 📄 index.html               # HTML template
├── 📄 manifest.json            # PWA manifest
└── 📄 robots.txt               # SEO robots file
```

## 📚 Resources (`/resources/`)

```
resources/
├── 📄 E-Commerce_Bookstore_Dataset.sql # Original dataset
├── 📄 cart.html                # Cart reference
├── 📄 payment-transactions.html # Payment reference
└── 📁 previous_code/           # Previous implementations
```

## 🔧 Configuration Files

### Root Level
- **`.env.example`** - Environment variables template for frontend
- **`.gitignore`** - Git ignore rules for both frontend and backend
- **`package.json`** - Frontend dependencies, scripts, and metadata
- **`LICENSE`** - MIT license file
- **`README.md`** - Comprehensive project documentation
- **`CHANGELOG.md`** - Version history and feature changes

### Backend Level
- **`backend/.env.example`** - Backend environment variables template
- **`backend/package.json`** - Backend dependencies and scripts
- **`backend/server.js`** - Main Express server configuration

## 📋 Key Features by Directory

### `/backend/routes/`
- **Books API**: CRUD operations, filtering, pagination, featured books
- **Categories API**: Category management with book counts
- **Users API**: Authentication, registration, profile management
- **Cart API**: Shopping cart operations
- **Newsletter API**: Email subscription management

### `/src/components/`
- **Navigation**: Responsive navigation with dropdowns
- **Toast**: User feedback notifications
- **Newsletter**: Email subscription form

### `/src/pages/`
- **HomePage**: Hero carousel, featured books, search
- **BrowseList**: Advanced book filtering and search
- **BuySell**: Marketplace for buying and selling
- **CreateAccount/Login**: User authentication
- **About/Contact/Help**: Information pages

### `/src/styles/`
- **Responsive Design**: Mobile-first approach
- **Professional Styling**: Consistent color scheme
- **Component-specific**: Modular CSS organization

## 🚀 Development Workflow

### Frontend Development
```bash
npm start          # Start development server (port 3001)
npm run build      # Build for production
npm test           # Run tests
```

### Backend Development
```bash
cd backend
npm start          # Start backend server (port 3002)
npm run dev        # Start with nodemon (auto-restart)
```

### Database Management
```bash
cd backend
npm run load-books        # Load sample books
npm run check-books       # Check book count
npm run analyze-books     # Analyze database
npm run fix-availability  # Fix book availability
```

## 📊 File Statistics

- **Total Files**: 50+ organized files
- **React Components**: 15+ reusable components
- **API Endpoints**: 20+ RESTful endpoints
- **CSS Files**: 10+ modular stylesheets
- **JavaScript Files**: 25+ organized modules
- **Database Scripts**: 7 utility scripts
- **Configuration Files**: 8 setup files

## 🎯 Architecture Benefits

### 1. **Modular Structure**
- Clear separation of concerns
- Reusable components and utilities
- Easy maintenance and updates

### 2. **Scalable Design**
- Service layer for API calls
- Context-based state management
- Component-based architecture

### 3. **Professional Organization**
- Consistent naming conventions
- Logical file grouping
- Comprehensive documentation

### 4. **Development Efficiency**
- Hot reloading for development
- Automated scripts for common tasks
- Environment-based configuration

This structure ensures maintainability, scalability, and professional development practices for the PageTurn Educational Bookstore Platform.
