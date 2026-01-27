# QR Friend Scanner

## Description

A Next.js web application built for the SMEC Hackathon. This project facilitates user authentication and friend management through QR code technology. Users can securely register and log in, generate unique personal QR codes, and scan other users' codes to connect and add them as friends.

## Features

- **User Authentication**: Secure login and registration system.
- **Dashboard**: Personal user area to view account details.
- **QR Code Generation**: Automatically generates a unique QR code for each registered user.
- **QR Code Scanning**: integrated scanner to read other users' QR codes.
- **Friend System**: Add friends by scanning their unique QR codes.
- **Responsive Design**: Modern user interface built with Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB (via Mongoose)
- **Utilities**:
  - react-qr-code (Generation)
  - @yudiel/react-qr-scanner (Scanning)

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- MongoDB (Local instance or Atlas connection)

### Installation

1. Clone the repository to your local machine.

2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Set up the environment variables:
   Create a `.env.local` file in the root directory and add your MongoDB connection string:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

## Project Structure

- `src/app`: Contains the application pages and API routes.
- `src/components`: Reusable UI components.
- `src/lib`: Utility functions and database connection logic.
- `src/models`: Mongoose database models.

## License

Private.
