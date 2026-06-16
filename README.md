# Lake City Caring Partners - Hospital Website & Portal

A comprehensive hospital website and admin portal built with React, Vite, Express, and MongoDB.

## Features

*   **Public Website:** Home page, doctors directory, departments, blog, contact, virtual tour, and media gallery.
*   **Admin Portal (CMS):** Manage departments, doctors, leads, blog content, user reviews, media gallery, and virtual tours.
*   **Secure Admin Access:** JWT-based authentication with 2FA (Two-Factor Authentication) capabilities for the admin portal.
*   **Virtual Tour:** 360-degree virtual tour of hospital facilities.
*   **Media Management:** Upload and manage gallery images and virtual tour shots using Cloudinary.
*   **AI Integration:** Embedded Gemini AI for intelligent content generation, like blog posts and draft reviews.
*   **Responsive UI:** Fully responsive design built with Tailwind CSS and Framer Motion.

## Prerequisites

Before running the application locally, ensure you have the following installed:

*   **Node.js**: v18 or newer
*   **npm**: package manager
*   **MongoDB**: A local instance running OR a MongoDB Atlas connection string.
*   **Cloudinary Account**: For media uploads (media gallery and virtual tours).
*   **Google Gemini API Key**: For AI content generation features.

## Setup Instructions

1.  **Clone the repository and install dependencies:**

    ```bash
    npm install
    ```

2.  **Environment Variables:**

    Copy `.env.example` to a new file named `.env`:

    ```bash
    cp .env.example .env
    ```

    Fill in the required values in `.env`:

    ```env
    # Database Configuration
    MONGODB_URI=mongodb://localhost:27017/lakecity_hospital

    # Cloudinary (Needed for uploading images)
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret

    # Server Configuration
    PORT=3000
    NODE_ENV=development

    # Gemini API Configuration (Needed for AI features)
    GEMINI_API_KEY=your_gemini_api_key

    # Admin Configuration
    JWT_SECRET=somereallylongsecretkey
    ```

3.  **Start the Local Development Server:**

    ```bash
    npm run dev
    ```

    This command starts both the Express server (Backend API) on `http://localhost:3001` and the Vite development server (React Frontend) concurrently on `http://localhost:3000`.

## Accessing the Application

*   **Public Site:** `http://localhost:3000`
*   **Admin Login:** `http://localhost:3000/admin`
*   **API Server:** API endpoints are served under `/api` by the Express server.
    *   *If this is a fresh setup with no admin user, you can create the first admin via the frontend UI by navigating to `/admin`.*

## Building for Production

To build the project for production deployment:

```bash
npm run build
```

The production output will be generated in the `dist` folder. It can be served by running:

```bash
npm run start
```
