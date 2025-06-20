# Babymoon Sleep Guide

A React application for tracking baby sleep patterns and providing sleep guidance for parents.

## Features

- 🔐 User authentication with Supabase
- 👶 Baby profile management
- 📊 Sleep tracking and analytics
- 📱 Responsive design with Tailwind CSS
- 🔒 Protected routes
- 📧 Password reset functionality

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Deployment**: Netlify

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

## Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd babymoon-sleep-guide
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Supabase Setup

1. **Create a Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Set up the database schema**
   Run this SQL in your Supabase SQL editor:
   ```sql
   -- Create babies table
   CREATE TABLE babies (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     name TEXT NOT NULL,
     birth_date DATE NOT NULL,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
   );

   -- Enable Row Level Security
   ALTER TABLE babies ENABLE ROW LEVEL SECURITY;

   -- Create policy to allow users to see only their babies
   CREATE POLICY "Users can view own babies" ON babies
     FOR SELECT USING (auth.uid() = user_id);

   -- Create policy to allow users to insert their own babies
   CREATE POLICY "Users can insert own babies" ON babies
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   -- Create policy to allow users to update their own babies
   CREATE POLICY "Users can update own babies" ON babies
     FOR UPDATE USING (auth.uid() = user_id);

   -- Create policy to allow users to delete their own babies
   CREATE POLICY "Users can delete own babies" ON babies
     FOR DELETE USING (auth.uid() = user_id);
   ```

3. **Configure Authentication**
   - Go to Authentication > Settings in your Supabase dashboard
   - Configure your site URL (for local development: `http://localhost:3000`)
   - Add redirect URLs for password reset and email confirmation

## Deployment to Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`

3. **Configure environment variables in Netlify**
   - Go to Site settings > Environment variables
   - Add the following variables:
     - `VITE_SUPABASE_URL`: Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

4. **Configure Supabase for production**
   - Go to your Supabase project settings
   - Add your Netlify domain to the allowed origins
   - Update redirect URLs to include your Netlify domain

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/     # Reusable components
├── contexts/       # React contexts (Auth)
├── lib/           # Utility libraries
├── pages/         # Page components
├── types/         # TypeScript type definitions
└── main.tsx       # Application entry point
```

## Troubleshooting

### Build Issues
- Ensure all dependencies are installed: `npm install`
- Check TypeScript errors: `npm run lint`
- Verify environment variables are set correctly

### Authentication Issues
- Verify Supabase URL and anon key are correct
- Check Supabase project settings for allowed origins
- Ensure redirect URLs are configured properly

### Deployment Issues
- Check Netlify build logs for errors
- Verify environment variables are set in Netlify
- Ensure Supabase CORS settings include your domain

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
