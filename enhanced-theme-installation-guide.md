# Enhanced Quravel Theme - Installation Guide

## Overview
This guide will help you implement the enhanced dark streaming theme with slideshow and "Top Airing" section on your Blogger site. The theme features:

- **Dark Navy theme background** (#0A101C)
- **Grounded Inversion footer** (#4B525F - Grounded Inversion color)
- **Auto-playing hero slideshow** with manual controls
- **New "Top Airing" section** featuring trending content
- **Enhanced content cards** with quality badges and hover effects
- **Responsive design** for all devices

---

## Files Included

1. **`enhanced-quravel-theme.xml`** - Complete Blogger template XML
2. **`enhanced-theme-preview.html`** - Standalone preview file
3. **`enhanced-theme-installation-guide.md`** - This guide

---

## Step-by-Step Installation

### Step 1: Backup Your Current Theme

**CRITICAL: Always backup before making changes!**

1. Go to **Blogger Dashboard** → **Theme** → **Edit HTML**
2. Select **all content** in the HTML editor (Ctrl+A)
3. **Copy and paste** it into a text file on your computer
4. Save as `backup-[date].xml` for future reference

### Step 2: Prepare the New Theme

1. Open `enhanced-quravel-theme.xml` file
2. **Select all content** (Ctrl+A)
3. **Copy the entire content** (Ctrl+C)

### Step 3: Apply the New Theme

1. In Blogger Dashboard → **Theme** → **Edit HTML**
2. **Delete all existing content** in the HTML editor
3. **Paste the new theme code** (Ctrl+V)
4. Click **Save** button
5. Click **Apply to blog**

### Step 4: Customize Content

The new theme includes sample content that you'll need to replace with your actual posts:

#### A. Update Hero Slideshow Content

**Location:** Lines 285-330 in the template

**Find and replace these sample slides:**

```xml
<!-- Slide 1: Featured Movie -->
<div class='slide active' style='background-image: url("YOUR_IMAGE_URL");'>
    <div class='slide-overlay'></div>
    <div class='slide-content'>
        <h1 class='slide-title'>YOUR MOVIE/SHOW TITLE</h1>
        <div class='slide-meta'>
            <span>YEAR</span>
            <span>•</span>
            <span>DURATION</span>
            <span class='badge hd'>HD</span>
        </div>
        <a class='btn-primary' href='YOUR_LINK'>
            <svg class='play-icon' viewBox='0 0 24 24' fill='currentColor'>
                <path d='M8 5v14l11-7z'/>
            </svg>
            Watch Now
        </a>
    </div>
</div>
```

**Where to get content:**
- **Slideshow images:** Use high-quality movie posters or show stills (1280x720px minimum)
- **Content data:** Use The Movie Database (TMDB) API for accurate information
- **Links:** Link to your post detail pages

#### B. Update Content Sections

**Latest Movies (Lines 349-450):**
- Replace sample movie data with your actual movie posts
- Update poster images and metadata
- Maintain the card structure

**Top Airing (Lines 452-553):**
- This is your NEW section featuring trending content
- Update with your most popular/ongoing shows
- Use season/episode format for TV shows

**Latest TV Shows (Lines 555-656):**
- Replace with your actual TV show posts
- Include season/episode information

**Latest Anime (Lines 658-759):**
- Add your anime content
- Use appropriate season/episode format

**Recommended (Lines 761-862):**
- Add highly-rated or popular content
- Mix of movies and TV shows

### Step 5: Configure Blogger Widgets

#### A. Header Section
**Location:** Lines 220-235
- Update logo text "Quravel" with your site name
- Modify navigation links to match your categories

#### B. Footer Section
**Location:** Lines 1033-1100
- Update footer links and categories
- Change copyright information

---

## Customization Options

### Color Scheme
All colors are defined in CSS custom properties (variables) at the top of the stylesheet:

```css
:root {
    --bg-page: #0A101C;           /* Main background */
    --bg-surface: #101828;        /* Card backgrounds */
    --bg-footer: #4B525F;         /* Footer background */
    --primary-500: #A94451;       /* Primary accent color */
    --interactive-500: #22D3EE;   /* Interactive elements */
}
```

### Content Grid Adjustments
**Current:** 4 columns on desktop, 3 on tablet, 2 on mobile
**To change:** Modify `.content-grid` CSS:
```css
.content-grid {
    grid-template-columns: repeat(5, 1fr); /* For 5 columns */
}
```

### Slideshow Timing
**Current:** 8 seconds per slide
**To change:** Modify the interval in JavaScript:
```javascript
setInterval(() => {
    changeSlide(1);
}, 5000); // Change to 5000 for 5 seconds
```

---

## Troubleshooting

### Issue: Theme doesn't look right
**Solution:** 
- Clear browser cache (Ctrl+F5)
- Check for any missing closing tags in HTML
- Ensure all CSS is properly enclosed

### Issue: Slideshow not auto-playing
**Solution:**
- Check browser console for JavaScript errors
- Ensure images are loading properly
- Verify all slide elements have unique content

### Issue: Mobile layout broken
**Solution:**
- Check responsive CSS media queries
- Ensure viewport meta tag is present
- Test on different screen sizes

### Issue: Colors look different
**Solution:**
- Ensure CSS custom properties are supported
- Check for conflicting theme styles
- Clear browser cache and reload

---

## Advanced Customization

### Adding New Content Sections

1. **Copy existing section structure:**
```xml
<section class='content-section' id='your-section'>
    <div class='container'>
        <div class='section-header'>
            <h2 class='section-title'>Your Section Title</h2>
            <a class='view-more' href='#'>View More →</a>
        </div>
        <div class='content-grid'>
            <!-- Your content cards here -->
        </div>
    </div>
</section>
```

2. **Add to navigation menu:**
```xml
<li><a href='#your-section'>Your Section</a></li>
```

### Integrating with Blogger Posts

To automatically display your actual Blogger posts:

1. **Replace static content with Blogger loop:**
```xml
<b:section class='content-section' id='featured-posts' maxwidgets='1' showaddelement='yes'>
    <b:widget id='Blog1' locked='true' title='Blog Posts' type='Blog' version='2'/>
</b:section>
```

2. **Customize the Blog widget template** to match the card design

### Adding Search Functionality

Add a search section in the header:
```xml
<div class='search-container'>
    <input type='text' placeholder='Search movies, shows...'/>
    <button type='submit'>Search</button>
</div>
```

---

## Performance Optimization

### Image Optimization
- Use WebP format when possible
- Implement lazy loading for images
- Compress images to appropriate sizes

### CSS Optimization
- Minify CSS for production
- Remove unused styles
- Use CSS custom properties for better caching

### JavaScript Optimization
- Minify JavaScript files
- Implement efficient event handling
- Use requestAnimationFrame for smooth animations

---

## Browser Compatibility

**Supported Browsers:**
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

**Fallbacks Included:**
- CSS Grid with Flexbox fallbacks
- Custom properties with static values
- Progressive enhancement for animations

---

## Support & Maintenance

### Regular Updates
- **Content:** Update hero slideshow regularly
- **Images:** Refresh poster images monthly
- **Links:** Ensure all navigation links work

### Security
- Keep Blogger platform updated
- Regularly backup theme changes
- Monitor for broken external links

---

## File Structure Reference

```
enhanced-quravel-theme.xml
├── <head> section
│   ├── Meta tags and SEO
│   ├── Google Fonts
│   └── CSS styles
├── <body> section
│   ├── Header with navigation
│   ├── Hero slideshow
│   ├── Content sections
│   └── Footer
└── <script> section
    ├── Slider functionality
    ├── Animation effects
    └── Event handlers
```

---

## Final Checklist

- [ ] Backup current theme
- [ ] Install new template
- [ ] Update hero slideshow content
- [ ] Replace sample content with real posts
- [ ] Update navigation links
- [ ] Customize footer sections
- [ ] Test responsive design
- [ ] Check all links work
- [ ] Verify slideshow auto-plays
- [ ] Test on mobile devices

---

## Need Help?

If you encounter issues during installation:

1. **Check the console** for error messages
2. **Verify file structure** matches the template
3. **Test in different browsers**
4. **Ensure all images load properly**

The theme is fully responsive and should work seamlessly across all devices and browsers.

---

**Created by:** MiniMax Agent  
**Version:** 1.0  
**Last Updated:** November 29, 2025