# PathForge Solutions - React Frontend

A modern React application for PathForge Solutions, an IT consultancy platform for students and professionals.

## 🚀 Features

- **Modern React Architecture**: Built with React 18 and Vite for optimal performance
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Routing**: Client-side routing with React Router
- **Component-Based**: Modular, reusable components
- **Interactive Forms**: Login form with validation and state management
- **Smooth Animations**: Scroll reveal animations and transitions
- **Accessibility**: ARIA labels and keyboard navigation support

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx      # Header component (top bar + navbar)
│   ├── Navbar.jsx      # Navigation component
│   └── Footer.jsx      # Footer component
├── pages/              # Page components
│   ├── Home.jsx        # Landing page
│   ├── About.jsx       # About page
│   ├── Services.jsx    # Services page
│   ├── Login.jsx       # Login page
│   ├── Internship.jsx  # Internship page
│   ├── CareerGuidance.jsx # Career guidance page
│   ├── JobConsultancy.jsx # Job consultancy page
│   └── Contact.jsx     # Contact page
├── App.jsx             # Main app component with routing
├── App.css             # Global styles and utilities
└── main.jsx           # Application entry point
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Install React Router DOM**
   ```bash
   npm install react-router-dom
   ```

3. **Copy Assets**
   - Copy the `assets` folder from the original Frontend directory to `public/assets`
   - This includes images, icons, and other static files

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   ```

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework via CDN
- **Custom CSS**: Additional styles in `App.css`
- **Responsive Design**: Mobile-first approach
- **Custom Scrollbars**: Thin, modern scrollbar styling

## 🔧 Key Components

### Header
- **Top Bar**: Contact information (phone and email) with gradient background
- **Navigation**: Responsive navigation with mobile menu
- **Sticky Positioning**: Entire header stays at top when scrolling
- **Active Link Highlighting**: Current page highlighting
- **Scroll-based Shadow Effects**: Dynamic shadow on scroll

### Footer
- Newsletter subscription form
- Social media links
- Quick navigation links
- Dynamic year display

### Login Form
- Email and password validation
- Password visibility toggle
- Remember me functionality
- Loading states and error handling
- Social login options

### Home Page
- Hero section with call-to-action
- Services preview grid
- Scroll reveal animations
- Responsive layout

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify

### Traditional Hosting
1. Build the project: `npm run build`
2. Upload contents of `dist` folder to your web server

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔗 Dependencies

- **React**: 18.x
- **React Router DOM**: 6.x
- **Vite**: Build tool
- **Tailwind CSS**: Styling (via CDN)

## 🎯 Next Steps

1. **Complete Page Content**: Add full content to placeholder pages
2. **Form Integration**: Connect forms to backend APIs
3. **Authentication**: Implement proper auth system
4. **SEO Optimization**: Add meta tags and structured data
5. **Performance**: Implement lazy loading and code splitting
6. **Testing**: Add unit and integration tests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the PathForge Solutions platform.

---

**Note**: Make sure to copy all assets from the original Frontend directory to ensure proper functionality.
