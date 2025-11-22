# Steam Game Compatibility Checker

A MERN stack application to check if your PC can run Steam games.

## Features
- **Game Browser**: Search and view details of Steam games.
- **System Detection**:
  - **Browser-based**: Estimates specs using browser APIs.
  - **Local Helper**: Python script for precise hardware detection.
- **Compatibility Check**: Compares your specs with game requirements.

## Setup

### Prerequisites
- Node.js
- MongoDB
- Python 3 (for local helper)

### Backend
1. Navigate to `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   Server runs on `http://localhost:5000`.

### Frontend
1. Navigate to `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   App runs on `http://localhost:5173`.

### Local Helper
1. Navigate to `local-helper` directory.
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the scanner:
   ```bash
   python scanner.py
   ```
   Or build the executable:
   ```bash
   build_exe.bat
   ```

## Environment Variables
Create a `.env` file in `server` directory:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/steam-checker
STEAM_API_KEY=YOUR_STEAM_API_KEY (Optional for some endpoints)
```
