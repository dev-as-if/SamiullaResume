# AI Resume Builder - Production-Ready Full Stack Application

A stunning, production-ready web application for building professional, ATS-friendly resumes using AI. Built with React, Node.js/Express, TypeScript, Gemini API integration, and ready for instant deployment on Netlify + Render.

## 🌟 Features

- **AI-Powered Content Generation**: Leverages Google Gemini API for intelligent resume content suggestions
- **Conversational UI**: Guided, interactive resume building experience
- **Multiple Professional Templates**: Modern and Professional resume designs
- **Live Preview**: Real-time resume preview as you edit
- **ATS Optimization**: 100% ATS-compliant formatting
- **Export Options**: Download as PDF or Word (.docx) documents
- **Responsive Design**: Works seamlessly on all devices
- **Modern UI**: Beautiful, animated interface using Framer Motion and Tailwind CSS
- **Zero Friction**: Non-technical users can easily build professional resumes
- **Instant Deployment**: Ready for Netlify + Render in minutes

## 🏗️ Architecture

```
├── server/                 # Node.js/Express Backend
│   ├── src/
│   │   ├── config/        # Configuration & Gemini setup
│   │   ├── controllers/   # Request handlers
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic & Gemini integration
│   │   └── index.ts       # Express server entry
│   ├── .env.example       # Environment variables template
│   └── package.json
├── client/                # React/Vite Frontend
│   ├── src/
│   │   ├── components/    # React components (including Footer)
│   │   ├── pages/         # Landing & Builder pages
│   │   ├── store/         # Zustand state management
│   │   ├── templates/     # Resume templates
│   │   ├── utils/         # Utility functions & API client
│   │   └── styles/        # Global styles
│   ├── .env.example       # Environment variables template
│   └── package.json
├── DEPLOYMENT_GUIDE.md    # Step-by-step deployment instructions
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Docker & Docker Compose
- Google Gemini API Key
- AWS Account (for deployment)

### Local Development

1. **Setup Environment Variables**

```bash
# Backend
cp server/.env.example server/.env
# Add your Gemini API key
echo "GEMINI_API_KEY=your_key_here" >> server/.env

# Frontend
cp client/.env.example client/.env
```

2. **Install Dependencies**

```bash
# Backend
cd server && npm install

# Frontend
cd client && npm install
```

3. **Run Development Servers**

```bash
# Terminal 1: Backend (Port 8000)
cd server && npm run dev

# Terminal 2: Frontend (Port 3000)
cd client && npm run dev
```

4. **Open in Browser**

Navigate to `http://localhost:3000`

### Docker Development

```bash
# Build and run with Docker Compose
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

## 📦 Building for Production

### Build Frontend
```bash
cd client && npm run build
# Output: client/dist/
```

### Build Backend
```bash
cd server && npm run build
# Output: server/dist/
```

## 🚀 Deployment: Netlify + Render

### **Quick Deploy in 5 Minutes**

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete step-by-step instructions.

**TL;DR:**
1. Push to GitHub
2. Connect GitHub to Netlify (frontend) → Paste Render backend URL as `VITE_API_URL`
3. Connect GitHub to Render (backend) → Add `GEMINI_API_KEY` and `CORS_ORIGIN` env vars
4. Both auto-deploy on `git push` ✨

### Deployment Architecture
```
Frontend (Netlify)        Backend (Render)
  netlify.app    ←→    onrender.com
                         ↓
                   Gemini API (Google)
```

### Environment Variables Checklist

**Backend (Render):**
- `NODE_ENV` = `production`
- `GEMINI_API_KEY` = *(from Google AI Studio)*
- `CORS_ORIGIN` = *(your Netlify URL)*
- `CLIENT_URL` = *(your Netlify URL)*

**Frontend (Netlify):**
- `VITE_API_URL` = *(your Render backend URL)*



## 📡 API Endpoints

### Gemini AI Endpoints

```
POST /api/ai/generate/career-objective
- Generate career objective variations
- Body: { jobTitle, yearsExperience, industry, skills }

POST /api/ai/generate/role-responsibilities
- Generate role and responsibilities
- Body: { profession, jobTitle, context }

POST /api/ai/generate/skills
- Generate skills list
- Body: { jobTitle, yearsExperience, industry }

POST /api/ai/generate/improvements
- Get content improvement suggestions
- Body: { section, content, profession }

POST /api/ai/generate/clarification-questions
- Generate clarification questions
- Body: { section, userInput, profession }

POST /api/ai/generate/resume-section
- Generate comprehensive resume section
- Body: { profession, section, userInput, context }

POST /api/ai/validate/ats-compliance
- Validate ATS compliance
- Body: { content, section }

GET /api/ai/health
- Health check endpoint
```

## 🎨 Resume Templates

### Supported Templates
1. **Modern** - Contemporary design with colored headers
2. **Professional** - Clean, traditional business format
3. **Creative** - Eye-catching design for creative roles

Templates are fully ATS-optimized and use semantic HTML with proper formatting.

## 🔐 Security Features

- **Helmet.js**: HTTP security headers
- **CORS**: Configurable cross-origin resource sharing
- **Input Validation**: Server-side validation for all requests
- **Environment Variables**: Secure API key management
- **Non-root Docker User**: Container runs as non-root
- **Health Checks**: Automated health monitoring

## 📊 State Management

Uses **Zustand** for simple, efficient state management:
- Resume data persistence
- Step tracking
- Loading and error states
- Theme customization

## 🧪 Testing & Quality

```bash
# Frontend linting
cd client && npm run lint

# Backend linting
cd server && npm run lint

# Type checking
cd client && npm run type-check
```

## 📈 Performance Optimizations

- **Code Splitting**: Vite's automatic code splitting
- **Tree Shaking**: Unused code removal
- **Image Optimization**: Lazy loading and compression
- **Caching**: Browser caching for static assets
- **Gzip Compression**: Nginx gzip compression
- **CDN Ready**: CloudFront compatible

## 🛠️ Environment Configuration

### Backend (.env)
```
NODE_ENV=production
PORT=5000
GEMINI_API_KEY=your_key
CLIENT_URL=https://yourdomain.com
CORS_ORIGIN=https://yourdomain.com
LOG_LEVEL=info
```

### Frontend (.env)
```
VITE_API_URL=https://api.yourdomain.com
```

## 📚 Technology Stack

### Frontend
- React 18 with TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Framer Motion (animations)
- Zustand (state management)
- Axios (HTTP client)
- jsPDF & DOCX (document generation)
- React Icons (icon library)
- React Hot Toast (notifications)

### Backend
- Node.js 20
- Express.js
- TypeScript
- Gemini API (@google/generative-ai)
- Helmet (security)
- Morgan (logging)
- CORS

### Infrastructure
- Docker & Docker Compose
- AWS ECS (container orchestration)
- AWS ECR (container registry)
- AWS CloudFormation (IaC)
- Nginx (web server)
- AWS Secrets Manager

## 📝 API Documentation

### Health Check
```bash
curl http://localhost:5000/api/ai/health
```

### Generate Career Objective
```bash
curl -X POST http://localhost:5000/api/ai/generate/career-objective \
  -H "Content-Type: application/json" \
  -d '{
    "jobTitle": "Software Engineer",
    "yearsExperience": 5,
    "industry": "Technology",
    "skills": ["React", "Node.js", "TypeScript"]
  }'
```

### Generate Skills
```bash
curl -X POST http://localhost:5000/api/ai/generate/skills \
  -H "Content-Type: application/json" \
  -d '{
    "jobTitle": "Software Engineer",
    "yearsExperience": 5,
    "industry": "Technology"
  }'
```

## 🚨 Error Handling

- Comprehensive error messages
- Request ID tracking
- Graceful fallbacks
- User-friendly toast notifications
- Detailed server logging

## 📦 Deployment Checklist

- [ ] Update environment variables
- [ ] Setup Gemini API key in Secrets Manager
- [ ] Configure domain and SSL
- [ ] Setup CloudFront CDN
- [ ] Enable CloudWatch monitoring
- [ ] Configure auto-scaling policies
- [ ] Setup health checks
- [ ] Enable HTTPS redirection
- [ ] Configure backup strategy
- [ ] Setup CI/CD pipeline

## 🐛 Troubleshooting

### Backend not connecting
1. Check Gemini API key is set: `echo $GEMINI_API_KEY`
2. Verify backend is running: `curl http://localhost:5000/api/ai/health`
3. Check port 5000 is available: `lsof -i :5000`

### Frontend not connecting to API
1. Verify VITE_API_URL is set correctly
2. Check CORS settings in backend
3. Verify backend health: `curl -I http://localhost:5000/api/ai/health`

### Docker issues
1. Clear Docker cache: `docker system prune -a`
2. Rebuild images: `docker-compose build --no-cache`
3. Check logs: `docker-compose logs -f`

## 📄 License

MIT License - feel free to use this project

## 🤝 Contributing

Contributions are welcome! Please follow standard Git workflow and submit pull requests.

## 📞 Support

For issues and questions:
1. Check documentation
2. Review API logs
3. Check CloudWatch logs (AWS)
4. Verify environment configuration

## 🚀 Future Enhancements

- [ ] Multi-language support
- [ ] Team collaboration features
- [ ] More resume templates
- [ ] LinkedIn import integration
- [ ] Job application tracking
- [ ] Resume analytics
- [ ] Mobile app
- [ ] Offline mode
- [ ] Advanced formatting options
- [ ] ATS scoring system

---

**Built with ❤️ for professionals building their future**
