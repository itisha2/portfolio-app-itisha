# Itisha Yadav Portfolio - React Application

This is a React.js portfolio application created from the provided .tsx file. The application showcases Itisha Yadav's professional profile, research interests, experience, education, skills, projects, and publications.

## Features

- **Responsive Design**: Works on both desktop and mobile devices
- **Interactive Navigation**: Tab-based navigation system
- **Professional Sections**:
  - About: Professional profile and current affiliations
  - Research: Research interests with detailed descriptions
  - Experience: Professional timeline with highlights
  - Education: Academic background
  - Skills: Technical skills with proficiency levels
  - Projects: Current ventures and funding status
  - Publications: Academic publications with links

## Technology Stack

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **shadcn/ui**: High-quality UI components

## Setup Instructions

1. **Extract the archive**:

   ```bash
   tar -xzf portfolio-app.tar.gz
   cd portfolio-app
   ```
2. **Install dependencies**:

   ```bash
   npm install
   # or
   pnpm install
   ```
3. **Start the development server**:

   ```bash
   npm run dev
   # or
   pnpm run dev
   ```
4. **Build for production**:

   ```bash
   npm run build
   # or
   pnpm run build
   ```
5. **Preview production build**:

   ```bash
   npm run preview
   # or
   pnpm run preview
   ```

## Project Structure

```
portfolio-app/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images and other assets
│   ├── components/
│   │   └── ui/           # UI components from shadcn/ui
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── App.jsx           # Main portfolio component
│   ├── App.css           # Styles with Tailwind CSS
│   ├── index.css         # Global styles
│   └── main.jsx          # Entry point
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
└── README.md            # This file
```

## Key Components

- **Portfolio Component**: Main component containing all sections
- **Tab Navigation**: Interactive navigation between different sections
- **Responsive Layout**: Mobile-friendly design with proper breakpoints
- **Interactive Elements**: Hover effects, animations, and transitions

## Customization

The application is built with modern React patterns and can be easily customized:

- **Content**: Update the data objects in `App.jsx` to modify content
- **Styling**: Modify Tailwind classes or add custom CSS in `App.css`
- **Components**: Add new sections or modify existing ones
- **Icons**: Replace Lucide icons with your preferred icon library

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Notes

- The application uses modern JavaScript (ES6+)
- All components are functional components with hooks
- Responsive design implemented with Tailwind CSS
- Icons provided by Lucide React
- Fast development experience with Vite HMR

## Deployment

The built application can be deployed to any static hosting service:

- Vercel
- Netlify
- GitHub Pages
- AWS S3
- Any web server

Run `npm run build` to create the production build in the `dist/` folder.
