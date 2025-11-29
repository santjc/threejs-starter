# Three.js Starter

A modern, production-ready starter template for Three.js projects. 

## Features

- Modular architecture with clean separation of concerns
- Built-in utilities for debugging, time management, and resource loading
- Responsive camera and renderer setup
- Configurable grid floor component with grid shader
- Vite for fast development and optimized builds
- TypeScript-ready structure (can be easily migrated)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

### Production Build

```bash
# Build for production
npm run build
```

The production build will be output to the `dist/` directory.

## Project Structure

```
src/
├── core/           # Core experience and utilities
│   ├── render/     # Camera and renderer setup
│   └── utilities/  # Debug, Time, Sizes, Resources
└── scene/          # Scene-specific components
```

## License

MIT

## Acknowledgments

This starter is inspired by the excellent teaching and architecture patterns from [Bruno Simon's Three.js Journey course](https://threejs-journey.com/).
