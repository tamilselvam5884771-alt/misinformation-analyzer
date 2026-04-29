# Deployment Instructions for Misinformation Analyzer

## Local Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/tamilselvam5884771-alt/misinformation-analyzer.git
   ```
2. **Navigate into the project directory**:
   ```bash
   cd misinformation-analyzer
   ```
3. **Install the dependencies**:
   - For the frontend:
     ```bash
     cd frontend
     npm install
     ```
   - For the backend:
     ```bash
     cd backend
     npm install
     ```
4. **Set up environment variables**:
   - Create a `.env` file in the root of both the `frontend` and `backend` folders.
   - Fill in the required environment variables as described in the example `.env.example` files provided in each folder.
5. **Start the local servers**:
   - For the frontend:
     ```bash
     npm start
     ```
   - For the backend:
     ```bash
     npm run start
     ```

## Docker Deployment
1. **Build the Docker images**:
   ```bash
   docker-compose build
   ```
2. **Run the Docker containers**:
   ```bash
   docker-compose up
   ```
3. Access the application at `http://localhost:3000` for the frontend and `http://localhost:5000` for the backend.

## Deployment to Vercel (Frontend)
1. **Sign in to Vercel**:
   Go to [Vercel](https://vercel.com) and sign in or create a new account.
2. **Import Project**:
   - Click on the ‘New Project’ button.
   - Import the repository from GitHub.
3. **Configure Environment Variables**:
   - Vercel allows you to set environment variables directly in the project settings. Add the required variables from your `.env` file.
4. **Deploy**:
   - Vercel automatically deploys your project upon importing. You can handle further deployments via the Vercel dashboard.

## Deployment to Railway (Backend)
1. **Sign in to Railway**:
   Go to [Railway](https://railway.app) and sign in or create a new account.
2. **Create a New Project**:
   - Click on ‘New Project’ and select the option to connect your repository.
3. **Configure Environment Variables**:
   - In the Railway dashboard, navigate to the settings of your project and add the required environment variables from your `.env` file.
4. **Deploy**:
   - Railway will automatically build and deploy your application. You can monitor the logs during the deployment process.

## Environment Variable Configuration
   - For both frontend and backend, ensure that all sensitive configuration values (API keys, database URLs, etc.) are stored in the `.env` files.
   - The structure of the `.env` files should match the configuration requirements of the respective services being used.

# Note: Ensure that you securely manage your environment variables and do not expose them in client-side code.  

---

This document provides an overview of the necessary steps to set up the project and deploy it using various platforms.