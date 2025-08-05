# Expense Tracker Frontend

A modern React-based expense tracking application with magic link authentication and comprehensive expense management features.

## Features

- **Magic Link Authentication**: Passwordless login via email
- **Expense Dashboard**: Visual card-based expense display with statistics
- **Expense Management**: Add, edit, and delete expenses with modals
- **Advanced Filtering**: Filter by category, date range, and search terms
- **User Profile**: Manage profile information and view statistics
- **Responsive Design**: Mobile-friendly layout with modern UI
- **Dark/Light Theme**: Toggle between themes
- **Real-time Updates**: Automatic refresh after operations

## Technology Stack

- **Frontend**: React 18 with functional components and hooks
- **Routing**: React Router DOM for client-side navigation
- **HTTP Client**: Axios for API communication
- **Styling**: Custom CSS with CSS variables for theming
- **Authentication**: JWT token-based with localStorage persistence

## Color Theme

- **Primary**: #4361ee (Blue)
- **Secondary**: #48cae4 (Light Blue)
- **Accent**: #f9c74f (Yellow)
- **Light Theme**: Clean white backgrounds
- **Dark Theme**: Dark backgrounds with proper contrast

## Prerequisites

- Node.js 16+ and npm
- Backend API running on port 3001 (expense_tracker_backend)

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   - Copy `.env.example` to `.env`
   - Update environment variables if needed:
     ```
     REACT_APP_API_URL=http://localhost:3001
     REACT_APP_SITE_URL=http://localhost:3000
     ```

## Development

1. **Start the development server**:
   ```bash
   npm start
   ```
   The app will run on `http://localhost:3000` (or next available port)

2. **Build for production**:
   ```bash
   npm run build
   ```

3. **Run tests**:
   ```bash
   npm test
   ```

## Application Structure

```
src/
├── components/
│   ├── Dashboard.js          # Main dashboard with expense grid
│   ├── ExpenseCard.js        # Individual expense display card
│   ├── ExpenseModal.js       # Add/edit expense modal
│   ├── FilterSidebar.js      # Filtering and sorting sidebar
│   ├── Login.js              # Magic link login form
│   ├── MagicLinkCallback.js  # Handle magic link verification
│   ├── Navbar.js             # Navigation bar with user menu
│   └── Profile.js            # User profile management
├── App.js                    # Main app with routing and auth context
├── App.css                   # Comprehensive styling
├── index.js                  # React app entry point
└── index.css                 # Global base styles
```

## Key Components

### Authentication Flow
1. **Login**: Enter email → Magic link sent → Click link → Authenticated
2. **Token Management**: JWT stored in localStorage with automatic header setting
3. **Route Protection**: Protected routes redirect to login if not authenticated

### Dashboard Features
- **Statistics Cards**: Total expenses, categories, monthly totals
- **Expense Grid**: Card-based layout with hover effects
- **Filtering**: Category, date range, search, and sorting options
- **Pagination**: Handle large datasets efficiently

### Expense Management
- **Add Expense**: Modal form with validation
- **Edit Expense**: Pre-filled form with existing data
- **Delete Expense**: Confirmation dialog before deletion
- **Categories**: Predefined categories with custom option

### User Experience
- **Responsive Design**: Adapts to mobile, tablet, and desktop
- **Loading States**: Spinners and skeleton loading
- **Error Handling**: User-friendly error messages
- **Success Feedback**: Confirmation messages for actions

## API Integration

The frontend integrates with the backend API endpoints:

- **Authentication**: `/api/auth/*` - Login, verification, logout
- **Expenses**: `/api/expenses/*` - CRUD operations, filtering, stats
- **User**: `/api/user/*` - Profile management, statistics

## Styling Approach

- **CSS Variables**: Theme-based color system
- **Component-Scoped**: Each component has dedicated styles
- **Responsive**: Mobile-first approach with breakpoints
- **Animations**: Smooth transitions and hover effects
- **Accessibility**: Proper contrast ratios and focus states

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development Notes

1. **State Management**: Uses React hooks and context for auth state
2. **Form Handling**: Controlled components with validation
3. **Error Boundaries**: Graceful error handling throughout
4. **Performance**: Optimized re-renders and efficient updates
5. **SEO Ready**: Proper meta tags and semantic HTML

## Deployment

The build output in `build/` folder can be deployed to any static hosting service:

- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages

## Troubleshooting

### Common Issues

1. **API Connection**: Ensure backend is running on port 3001
2. **CORS**: Backend should allow frontend origin
3. **Environment Variables**: Check `.env` file configuration
4. **Port Conflicts**: Frontend will auto-select available port

### Development Tips

1. **Hot Reload**: Changes automatically refresh the browser
2. **Network Tab**: Monitor API calls in browser dev tools
3. **React DevTools**: Install browser extension for debugging
4. **Console Errors**: Check browser console for detailed errors

## Contributing

1. Follow existing code style and patterns
2. Add comments for complex logic
3. Test on mobile and desktop
4. Ensure accessibility compliance
5. Update documentation as needed

## License

This project is part of the expense tracker application suite.
