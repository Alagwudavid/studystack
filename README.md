# StudyStack

## 🌍 The Problem

Students today face fragmented experiences when trying to connect with peers, find academic opportunities, discover relevant communities, and organize study groups. Existing platforms either focus on professional networking, general social media, or isolated learning tools, missing the unique needs of students seeking meaningful academic connections and collaborative learning opportunities.

## ✨ Our Solution: StudyStack

**StudyStack** is a comprehensive social platform designed specifically for students to connect with each other, discover opportunities, join communities, and create study groups. We provide a dynamic space where students can share knowledge, collaborate on projects, find internships and jobs, participate in events, and build lasting academic relationships in a supportive, student-focused environment.

## 🚀 Core Features

### Social Connection & Networking

- **Student Profiles:** Create comprehensive profiles showcasing your academic interests, skills, and achievements
- **Social Feed:** Share posts, updates, achievements, and questions with your network
- **Advanced Reaction System:** Express engagement with content through multiple reaction types (like, love, celebrate, support, insightful, funny)
- **Follow System:** Connect with fellow students, educators, and industry professionals
- **Direct Messaging:** Private conversations and group chats for seamless communication
- **News Feed:** Stay updated with relevant academic news and trending topics

### Study Groups & Communities

- **Study Groups:** Create and join subject-specific study groups for collaborative learning
- **Communities:** Discover and participate in communities based on interests, majors, or topics
- **Classroom Integration:** Digital classroom spaces for course-specific discussions and resources
- **Channels:** Topic-based channels for focused discussions and resource sharing
- **Collaborative Projects:** Work together on academic projects and assignments
- **Event Organization:** Create and manage study sessions, meetups, and academic events

### Opportunities & Career

- **Job Board:** Discover internships, part-time jobs, and career opportunities
- **Company Profiles:** Explore companies and organizations hiring students
- **Business Verification:** Verified company accounts for authentic opportunities
- **Events Calendar:** Academic events, career fairs, workshops, and networking sessions
- **Leaderboard:** Recognition system for active contributors and high achievers

### Learning & Resources

- **Course Discovery:** Explore and share educational courses and resources
- **Learning Spaces:** Dedicated spaces for specific subjects and topics
- **Q&A System:** Ask and answer academic questions within the community
- **Resource Sharing:** Share notes, materials, and helpful content
- **Moments:** Share quick updates and achievements similar to stories

### Content & Engagement

- **Post Types:** Share achievements, tips, questions, projects, milestones, and collaborative opportunities
- **Rich Media Support:** Upload images, videos, and documents to enhance your posts
- **Engagement Analytics:** Track likes, comments, shares, saves, and awards on your content
- **Trending Content:** Discover popular posts and trending discussions
- **Hashtags & Search:** Find relevant content and connect with like-minded students

## 📁 Project Structure

```
studystack/
├── app/                          # Next.js app directory
│   ├── activities/              # User activity tracking and notifications
│   ├── api/                     # API routes and endpoints
│   ├── auth/                    # Authentication pages and flows
│   ├── channel/                 # Channel/group communication features
│   ├── communities/             # Community discovery and browsing
│   ├── community/               # Individual community pages
│   ├── companies/               # Company directory and profiles
│   ├── create/                  # Content creation flows
│   ├── create-post/             # Post creation interface
│   ├── discover/                # Content discovery and recommendations
│   ├── events/                  # Events calendar and management
│   ├── explore/                 # Explore page for browsing content
│   ├── home/                    # Main feed and dashboard
│   ├── leaderboard/             # User rankings and achievements
│   ├── moments/                 # Story-like quick updates
│   ├── news/                    # News feed and articles
│   ├── onboarding/              # New user onboarding flow
│   ├── opportunities/           # Job and internship listings
│   ├── posts/                   # Individual post pages
│   ├── questions/               # Q&A section
│   ├── search/                  # Global search functionality
│   ├── settings/                # User settings and preferences
│   ├── space/                   # Personal or group spaces
│   ├── users/                   # User profiles and pages
│   ├── verify-business/         # Business account verification
│   └── watch/                   # Video content platform
│
├── backend/                     # Laravel PHP backend
│   ├── api/                     # Backend API endpoints
│   ├── app/                     # Application logic
│   ├── config/                  # Configuration files
│   ├── database/                # Database migrations and seeders
│   ├── routes/                  # API routing
│   └── public/                  # Public assets
│
├── components/                  # Reusable React components
│   ├── aside-bar.tsx           # Sidebar navigation
│   ├── bottom-nav.tsx          # Mobile bottom navigation
│   ├── CreatePostModal.tsx     # Post creation modal
│   ├── FeedGenerator.tsx       # Dynamic feed generation
│   ├── FollowButton.tsx        # User follow functionality
│   ├── JobCard.tsx             # Job listing cards
│   ├── NotificationPanel.tsx   # Notification system
│   ├── PostCard.tsx            # Post display component
│   └── [100+ more components]  # Additional UI components
│
├── contexts/                    # React context providers
├── hooks/                       # Custom React hooks
├── lib/                         # Utility functions and helpers
├── stores/                      # State management
├── types/                       # TypeScript type definitions
├── public/                      # Static assets
└── styles/                      # Global styles and themes
```

## 🏗️ Technical Architecture

### Frontend Architecture

- **Framework:** Next.js 15 with App Router for server-side rendering and optimal performance
- **Language:** TypeScript for type-safe development
- **Styling:** Tailwind CSS for responsive, utility-first styling
- **UI Components:** Custom component library with Radix UI primitives
- **State Management:** React hooks, Context API, and Zustand stores
- **Real-time Features:** WebSocket integration for live notifications and updates
- **Animations:** Smooth transitions using CSS animations and Tailwind utilities

### Backend Architecture

- **Framework:** Laravel (PHP) for robust API development
- **Database:** PostgreSQL/MySQL with comprehensive schema
- **Authentication:** Token-based authentication with middleware
- **API Design:** RESTful API endpoints with proper error handling
- **File Storage:** Support for image and document uploads
- **Notifications:** Real-time notification system with WebSocket support

### Infrastructure

- **Package Manager:** pnpm for efficient dependency management
- **Deployment:** Vercel-ready configuration for frontend
- **Development:** Hot reload and fast refresh for optimal DX
- **Logging:** Custom logging system for debugging and monitoring
- **Testing:** Test suite setup for quality assurance

## 🛠️ Technology Stack

**Frontend:**

- Next.js 15
- React 18+
- TypeScript
- Tailwind CSS
- Radix UI
- Lucide React (Icons)
- Zustand (State Management)

**Backend:**

- Laravel (PHP)
- PostgreSQL/MySQL
- WebSocket Server (Node.js)

**Development Tools:**

- pnpm
- ESLint
- TypeScript Compiler
- PostCSS

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- PHP 8.1+ and Composer
- PostgreSQL or MySQL database

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/studystack.git
cd studystack
```

2. **Install frontend dependencies:**

```bash
pnpm install
```

3. **Install backend dependencies:**

```bash
cd backend
composer install
```

4. **Set up environment variables:**

```bash
# Copy and configure frontend .env
cp .env.example .env.local

# Copy and configure backend .env
cd backend
cp .env.example .env
```

5. **Run database migrations:**

```bash
cd backend
php artisan migrate
```

6. **Start development servers:**

```bash
# Frontend (from root directory)
pnpm dev

# Backend (from backend directory)
php artisan serve

# WebSocket server (optional, for real-time features)
node websocket-server.js
```

### Development Scripts

- `pnpm dev` - Start Next.js development server
- `pnpm build` - Build production bundle
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## 📱 Key Features by Section

### Home Feed

- Personalized content based on interests and connections
- Multiple post types (text, images, videos, polls)
- Real-time updates and notifications
- Trending topics and popular posts

### Communities

- Subject-specific communities
- Interest-based groups
- University/college communities
- Activity tracking and moderation tools

### Opportunities

- Internship listings
- Part-time jobs for students
- Volunteer opportunities
- Research positions
- Company profiles and direct applications

### Study Groups

- Create private or public study groups
- Schedule study sessions
- Share resources and materials
- Collaborative note-taking
- Progress tracking

### Events

- Academic events calendar
- Workshop and seminar listings
- Career fair notifications
- Study session scheduling
- Event RSVPs and reminders

## 🎯 Goals & Vision

Our mission is to create the ultimate platform for student collaboration and opportunity discovery. StudyStack aims to:

- **Connect Students:** Build meaningful academic relationships and professional networks
- **Facilitate Learning:** Enable collaborative study and knowledge sharing
- **Unlock Opportunities:** Help students discover and access internships, jobs, and events
- **Build Communities:** Foster supportive spaces for students with shared interests
- **Empower Growth:** Provide tools and resources for academic and career success

## 🔮 Roadmap & Future Features

- **Mobile Applications:** Native iOS and Android apps
- **AI-Powered Recommendations:** Personalized content and opportunity suggestions
- **Virtual Study Rooms:** Video chat integration for remote study sessions
- **Gamification:** Achievement badges, streaks, and reward systems
- **Advanced Analytics:** Detailed insights for users and communities
- **Integration APIs:** Connect with LMS platforms and academic tools
- **Live Streaming:** Host virtual classes and study sessions
- **Mentorship Program:** Connect students with mentors and advisors
- **Career Services:** Resume building, interview prep, and career counseling

## 📄 License & Contributing

This project is currently in active development. Contribution guidelines and licensing information will be updated soon.

## 📞 Support

For questions, feedback, or support, please reach out through the platform's contact page or create an issue in the repository.

---

**Built with ❤️ for students, by students.**
