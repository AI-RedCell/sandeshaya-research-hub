# Sandeshaya - National Student Research on Media Ethics

A national academic survey platform by **Sandeshaya**, the youth media initiative of Ananda College Broadcasting Unit, exploring Sri Lankan school students' views on media ethics and regulation.

## About

This research initiative aims to understand how Sri Lankan school students perceive media ethics, trust, and the need for improved media regulation.

## Technologies

- **React** + **TypeScript** - Frontend framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Firebase** - Authentication & Database
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd sandeshaya-research-hub

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Firebase configuration

# Start development server
npm run dev
```

## Project Structure

```
src/
├── assets/          # Images and static files
├── components/      # Reusable UI components
│   ├── landing/     # Landing page sections
│   └── ui/          # shadcn/ui components
├── contexts/        # React contexts (Auth, Language)
├── lib/             # Utilities and Firebase config
├── pages/           # Page components
└── translations/    # Multilingual content
```

## Features

- 🌐 Multilingual support (English, Sinhala, Tamil)
- 🔐 Email link authentication
- 📊 30-question survey across 7 sections
- 📱 Mobile responsive design
- 🎨 School colors theme (Maroon, Gold, White)

## Deployment

Build the production bundle:

```bash
npm run build
```

The output will be in the `dist` directory.

## Credits

**Sandeshaya** - Ananda College Broadcasting Unit

---

© 2024 Sandeshaya - Ananda College Broadcasting Unit. All rights reserved.
