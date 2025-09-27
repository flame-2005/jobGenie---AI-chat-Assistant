# JobGenie AI - Career Assistant Platform

JobGenie AI is a comprehensive career assistant platform that combines a modern web application with a Chrome extension to help users with job searching, resume building, and career guidance using AI technology.

## 🚀 Features

- **Smart Resume Builder** - Create professional Job Assistant with AI assistance
- **Job Form Filler** - Your own Professional job Application helper
- **Chrome Extension** - Access JobGenie features directly from your browser
- **User Authentication** - Secure login/signup with Supabase
- **Real-time Data** - Powered by Convex for real-time updates
- **Modern UI** - Beautiful, responsive design with Tailwind CSS

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager
- A Supabase account and project
- Pinecone for embeding
- gemini for ai assistance
- A Convex account and project
- Chrome browser (for extension development)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd jobgenie-ai
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory and add:

```env
# 🔐 Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 🔗 Convex
NEXT_PUBLIC_CONVEX_URL=your_convex_url
CONVEX_DEPLOY_KEY=your_convex_deploy_key

# 🧠 AI (Gemini or OpenAI)
GOOGLE_GENAI_API_KEY=your_google_genai_api_key
# OR
OPENAI_API_KEY=your_openai_api_key

# 📂 Pinecone
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=jobgenie-index
PINECONE_ENVIRONMENT=us-east1-gcp

```

### 4. Database Setup

Set up your Supabase database tables and Convex schema according to your project requirements.

## 🌐 Running the Web Application

### Development Mode

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the web application.

### Production Build

```bash
npm run build
npm start
```

## 🔧 Chrome Extension Setup

### 1. Build the Extension

```bash
npm run build:extension
# or build the project normally and the extension files will be generated
```

### 2. Load the Extension in Chrome

1. **Open Chrome Extensions Page**
   - Navigate to `chrome://extensions/`
   - Or go to Settings → Extensions

2. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top right corner

3. **Load the Extension**
   - Click "Load unpacked"
   - Select the `dist/extension` or `out/extension` folder from your project
   - The extension should now appear in your extensions list

4. **Pin the Extension** (Optional)
   - Click the puzzle piece icon in Chrome's toolbar
   - Find "JobGenie AI" and click the pin icon

### 3. Extension Development

For development, the extension files are typically located in:

```
src/extension/
├── popup.tsx          # Extension popup interface
├── background.js      # Background service worker
├── content.js         # Content script for web pages
├── manifest.json      # Extension configuration
└── globals.css        # Styling
```

### 4. Hot Reload for Extension

When developing the extension:

1. Make changes to extension files
2. Run `npm run build` to rebuild
3. Go to `chrome://extensions/`
4. Click the refresh icon on your extension
5. The extension will reload with your changes

## 📁 Project Structure

```
jobgenie-ai/
├── src/
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   ├── context/            # React context providers
│   ├── extension/          # Chrome extension files
│   ├── lib/                # Utility libraries
│   └── constants/          # App constants
├── convex/                 # Convex backend functions
├── public/                 # Static assets
├── .env.local             # Environment variables
└── README.md
```

## 🔗 Key Technologies

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Convex (real-time database)
- **Authentication**: Supabase Auth
- **AI Integration**: OpenAI API
- **Extension**: Chrome Extension APIs
- **Deployment**: Vercel (web app)

## 📝 Usage

### Web Application

1. Visit the deployed web app or run locally
2. Sign up or log in to your account
3. Complete the onboarding process
4. Use the resume builder and career tools

### Chrome Extension

1. Click the JobGenie AI icon in Chrome toolbar
2. Sign in with the same credentials as the web app
3. Access career tools directly from any webpage
4. Get contextual job recommendations and assistance

## 🚀 Deployment

### Web Application (Vercel)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Extension Distribution

1. Build the production extension: `npm run build:extension`
2. Create a zip file of the extension folder
3. Submit to Chrome Web Store (requires developer account)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/your-username/jobgenie-ai/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔄 Updates

Keep your extension and web app updated:

- **Web App**: Automatically updates on Vercel deployments
- **Extension**: Update through Chrome Web Store or reload unpacked extension during development

---

**Happy Job Hunting with JobGenie AI! 🎯**
