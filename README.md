# Quravel Streaming Platform

A modern, responsive streaming platform built with HTML, CSS, and JavaScript. Features a dark theme, hero carousel, content management system, and admin panel.

## 🚀 Features

### Core Features
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Hero Carousel**: Auto-playing slideshow with manual controls
- **Content Management**: Dynamic content loading from JSON data
- **Search Functionality**: Global search with filtering options
- **Admin Panel**: Complete content management system
- **Dark Theme**: Modern dark UI with wine and navy colors

### Pages & Functionality
- **Homepage**: Hero carousel, trending content, latest movies/shows
- **Streaming Pages**: Video player with episode navigation
- **Details Pages**: Comprehensive content information
- **Admin Dashboard**: Content management and configuration

### Admin Features
- **Content Management**: Add, edit, delete posts and streaming pages
- **Header Management**: Customize navigation and branding
- **Slideshow Management**: Configure hero carousel content
- **Streaming Pages**: Manage video sources and episodes
- **Data Export/Import**: Backup and restore configurations

## 📁 Project Structure

```
├── index.html              # Main homepage
├── streaming.html          # Video streaming page template
├── post-details.html       # Content details page template
├── admin.html              # Admin dashboard
├── admin-*.html           # Admin management pages
├── styles/
│   ├── main.css           # Main stylesheet
│   ├── admin.css          # Admin panel styles
│   ├── streaming-page.css # Streaming page styles
│   └── details-page.css   # Details page styles
├── scripts/
│   ├── main.js            # Core application logic
│   ├── admin.js           # Admin panel functionality
│   ├── global-search.js   # Search component
│   ├── streaming-page.js  # Video player logic
│   └── details-page.js    # Details page functionality
├── data/
│   └── posts.json         # Content database
└── images/
    └── favicon.svg        # Site favicon
```

## 🛠️ Getting Started

### Quick Setup
1. Clone or download the project files
2. Open `index.html` in a web browser
3. Access admin panel at `admin.html`
4. No server setup required - runs entirely in the browser

### Content Management
1. Navigate to `admin.html` to access the dashboard
2. Add content through "Add Post" form
3. Configure slideshow content in "Slideshow Management"
4. Manage streaming pages and video sources
5. Customize header and navigation

### Data Structure
The application uses `data/posts.json` for content storage. Each post includes:
- Basic information (title, year, rating, type)
- Media assets (poster, backdrop images)
- Content metadata (genres, cast, director)
- Flags for featured content placement
- Streaming URLs and episode data

## 🎨 Customization

### Color Scheme
The platform uses CSS custom properties for theming:
- `--bg-page`: Main background color
- `--primary-500`: Primary accent color
- `--bg-surface`: Card and component backgrounds

### Adding Content
1. Use the admin panel at `admin.html`
2. Or directly edit `data/posts.json`
3. Follow the existing data structure for consistency

### Branding
- Replace `images/favicon.svg` with your logo
- Update site title in HTML files
- Customize colors in CSS variables

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Development

### Local Development
1. Use a local web server for best experience
2. Python: `python -m http.server 8000`
3. Node.js: `npx serve .`
4. Or use VS Code Live Server extension

### File Organization
- All styles in `styles/` directory
- JavaScript files in `scripts/` directory
- Content data in `data/` directory
- Images and assets in `images/` directory

## 🚀 Deployment

### GitHub Pages
1. Create a GitHub repository
2. Upload all files to the repository
3. Enable GitHub Pages in repository settings
4. Select source branch (usually `main`)
5. Your site will be available at `https://username.github.io/repository-name`

### Other Hosting
- Netlify: Drag and drop deployment
- Vercel: Connect GitHub repository
- Firebase Hosting: `firebase deploy`
- Any static web hosting provider

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🐛 Troubleshooting

### Common Issues
- **Blank page**: Check browser console for JavaScript errors
- **Images not loading**: Verify image paths and file existence
- **Search not working**: Ensure `data/posts.json` is accessible
- **Admin panel issues**: Check localStorage permissions

### Performance Tips
- Optimize images before uploading
- Use appropriate image formats (WebP when possible)
- Keep content data reasonably sized
- Test on mobile devices

---

**Built by MiniMax Agent** | Version 2.0 | December 2025