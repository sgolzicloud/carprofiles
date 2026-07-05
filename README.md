# 🏎️ Car Profiles

A responsive web application for displaying car profile details accessible via QR codes. Perfect for showcasing tuned vehicles and their modifications on mobile devices.

## Features

- 📱 **Fully Responsive Design** - Works seamlessly on smartphones, tablets, and desktops
- 🔗 **QR Code Ready** - Each car has its own URL for QR code linking
- 🎨 **Modern UI** - Clean, professional design with smooth interactions
- 📊 **Detailed Specs** - Display performance metrics and specifications
- 🖼️ **Image Gallery** - Showcase multiple car photos
- 🔧 **Easy Maintenance** - JSON-based car data for simple updates
- 🚀 **Performance Optimized** - Lazy loading images, minimal dependencies

## Project Structure

```
carprofiles/
├── index.html                 # Home page / landing page
├── profile.html               # Car profile template
├── css/
│   └── styles.css            # Responsive stylesheet
├── js/
│   ├── app.js                # Main app utilities
│   └── profile-loader.js     # Profile loading and rendering
├── data/
│   └── cars/
│       ├── car-template.json # Template for new car profiles
│       ├── car-001.json      # Individual car profile
│       └── ...               # More car profiles
├── img/                       # Car images and assets
├── README.md                  # This file
└── .gitignore                # Git ignore rules
```

## How to Use

### Adding a New Car Profile

1. **Create a new JSON file** in `data/cars/` with the format: `car-{id}.json`
   - Example: `data/cars/car-001.json`

2. **Use the template** from `data/cars/car-template.json` as a reference

3. **Fill in the car details:**
   - Basic info (name, year, description)
   - Performance specs
   - Modifications and parts
   - Owner information
   - Gallery images

4. **Example JSON structure:**
   ```json
   {
     "id": "car-001",
     "name": "My Tuned Car",
     "year": "2020",
     "description": "Detailed description...",
     "heroImage": "/img/car-001-hero.jpg",
     "specs": {
       "horsepower": "450 hp",
       "torque": "550 Nm",
       "acceleration": "3.8 sec (0-100 km/h)"
     },
     "owner": {
       "name": "Owner Name",
       "contact": "email@example.com"
     },
     "parts": [
       {
         "category": "Engine",
         "name": "Part Name",
         "description": "Part description"
       }
     ],
     "gallery": [
       "/img/car-001-photo-1.jpg",
       "/img/car-001-photo-2.jpg"
     ],
     "lastUpdated": "2026-07-05"
   }
   ```

### Creating QR Codes

Generate QR codes pointing to:
```
https://yourdomain.com/profile.html?id=car-001
```

Or locally:
```
profile.html?id=car-001
```

### Updating Existing Cars

Simply update the corresponding JSON file in `data/cars/`. Changes will reflect immediately on the web page without any code modifications.

## Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## Browser Support

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment

This is a static website and can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

## Customization

### Colors

Edit the CSS variables in `css/styles.css`:
```css
:root {
    --primary-color: #e74c3c;      /* Red/primary accent */
    --secondary-color: #2c3e50;    /* Dark blue/header */
    --accent-color: #3498db;       /* Light blue accents */
    --text-dark: #2c3e50;
    --text-light: #7f8c8d;
    --bg-light: #ecf0f1;
}
```

### Typography

Modify font sizes and styles in `css/styles.css`. The design uses CSS `clamp()` for responsive typography.

## File Updates

When updating a car profile, the `lastUpdated` field helps track changes. Update the date in YYYY-MM-DD format whenever you modify the profile.

## License

© 2026 Car Profiles. All rights reserved.

## Support

For issues or questions, please refer to the GitHub repository.
