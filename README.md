# MunchMatch Frontend

A modern web interface for the MunchMatch recipe recommendation system.

## Features

- Drag and drop image upload
- Text description input with confirmation
- Adjustable number of recipe recommendations
- Real-time recipe search results
- Responsive design for all devices

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory with the following variables:
```
STREAMLIT_BACKEND_URL=http://your-streamlit-backend-url
```

3. Run the development server:
```bash
npm run dev
```

## Deployment to Vercel

1. Push your code to a GitHub repository
2. Go to [Vercel](https://vercel.com) and create a new project
3. Import your GitHub repository
4. Add the environment variable:
   - `STREAMLIT_BACKEND_URL`: Your Streamlit backend URL
5. Deploy!

## Environment Variables

- `STREAMLIT_BACKEND_URL`: The URL of your Streamlit backend server

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios
- React Dropzone
- Heroicons # munchmatch_frontend-trial
