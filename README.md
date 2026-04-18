# NeuroQuiz™

**An Adaptive Gamified Quiz Platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/your-repo/NeuroQuiz)
[![Status](https://img.shields.io/badge/status-production-green.svg)](https://neuroquiz.com)

> **Production Ready** - Version 1.0.0 | Released January 2026

**PRESENTATION SLIDE**: https://www.canva.com/design/DAG_IPtiutc/IsqJQKNHZJd0DG4vL8bz7w/edit?utm_content=DAG_IPtiutc&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

## 📋 Project Overview

NeuroQuiz™ is an innovative client-side web application that combines cutting-edge cognitive science research with engaging game mechanics to create an optimal learning experience. The platform adapts to each user's performance in real-time, adjusting question difficulty based on cognitive load theory and implementing spaced repetition principles to enhance long-term memory retention.

## ✨ Features

### Core Features
- **Adaptive Learning System**: RB-ADA algorithm adjusts difficulty based on 5 consecutive correct/wrong answers
- **Gamification**: Points, levels (Elementary/Secondary/University), streaks, and achievements
- **Real-time Feedback**: Immediate visual feedback (green for correct, red for wrong answers)
- **Performance Analytics**: Detailed charts, cognitive profiling, and category breakdowns
- **Cognitive Analyzer**: Advanced diagnostic assessment based on Rule Space Method
- **Accessibility**: WCAG AA compliant with high contrast themes, keyboard navigation, and screen reader support
- **Responsive Design**: Mobile-first design works seamlessly on all devices

### Technical Features
- **Client-Side Only**: No backend required - runs entirely in the browser
- **PWA Support**: Service worker enables offline functionality
- **Local Storage**: Progress, results, and preferences saved locally
- **Multi-language**: English and Bahasa Malaysia support
- **Theme Switching**: Light, dark, and system preference themes
- **Print & Export**: Print results or export to PDF with jsPDF
- **Question Review**: Detailed review of all questions with explanations
- **Version Management**: Automatic cache busting and version checking
- **1000+ Questions**: 5 categories (General Knowledge, Math, Logic, Literature, STEM)

## 🎯 Target Audience

- **Students**: Practice and test knowledge across various subjects with adaptive difficulty
- **Educators**: Use as an engaging assessment tool with detailed performance analytics
- **Lifelong Learners**: Self-paced learning with cognitive insights and progress tracking
- **Organizations**: Training and assessment platform with offline capability
- **Researchers**: Study adaptive learning algorithms and cognitive assessment methods

## 🔄 User Flow

1. **Landing Page** (`index.html`)
   - Welcome message and research introduction
   - Feature highlights
   - Call-to-action to start quiz

2. **Setup Page** (`setup.html`)
   - Quiz configuration (literacy level, question count)
   - Interactive tutorial explaining the system
   - Category selection
   - Start quiz button

3. **Quiz Page** (`quiz.html`)
   - Real-time progress tracking
   - Question display with multiple-choice options
   - Visual feedback (green/red highlighting)
   - Gamification indicators (level, difficulty, streak, points)
   - Adaptive difficulty adjustment (RB-ADA algorithm)
   - Motivational messages and milestones

4. **Results Page** (`result.html`)
   - Score visualization with circular progress
   - Performance charts (Chart.js) and category breakdowns
   - Cognitive profile analysis
   - Achievement badges and insights
   - Detailed question review with explanations
   - Print and PDF export options

5. **About Page** (`about.html`)
   - Team information and roles
   - Technology stack details
   - Research references and methodology
   - Project story and timeline

## 🔬 Research & References

NeuroQuiz™ is built on research from:

### Adaptive Learning
- **Cognitive Load Theory**: Optimizing information processing by managing intrinsic, extraneous, and germane cognitive load
- **Personalized Learning Algorithms**: Real-time difficulty adjustment based on performance metrics
- **Spaced Repetition**: Optimizing memory retention through strategic question intervals

### Gamification
- **Game Mechanics**: Points, badges, levels, and leaderboards to enhance motivation
- **Immediate Feedback**: Positive reinforcement and learning from mistakes
- **Progress Visualization**: Clear indicators of advancement and achievement

### Neuroscience
- **Memory Formation**: Leveraging research on how the brain encodes and retrieves information
- **Attention and Focus**: Design principles that maintain user engagement
- **Reward Systems**: Dopamine-driven motivation through achievement systems

For detailed research documentation and references, see the [`docs/`](docs/) folder. All documentation is available in both Markdown (`.md`) and PDF (`.pdf`) formats.

## 👥 Team Members

### Development Team
- **Lead Developer**: Core quiz logic, adaptive system, and game mechanics
- **UI/UX Designer 1**: Visual design and user experience
- **UI/UX Designer 2**: Interface design and interactions
- **Frontend Developer**: UI implementation and styling
- **Content Lead**: Question bank and educational content

*Team member details available on the [About page](about.html)*

## 🛠 Technology Stack

### Frontend
- **HTML5**: Semantic markup and accessibility
- **CSS3**: Modern styling with CSS custom properties (variables)
- **JavaScript (ES6+)**: Vanilla JavaScript, no frameworks required
- **Chart.js 4.4.0**: Performance charts and visualizations
- **jsPDF**: PDF export functionality

### Tools & Libraries
- **Service Worker API**: Offline support and caching
- **Local Storage API**: Client-side data persistence
- **CSS Custom Properties**: Theme switching and customization
- **Web Audio API**: Sound effects and feedback
- **Canvas API**: Background visual effects

### Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📁 Project Structure

```
NeuroQuiz/
├── index.html              # Landing page
├── quiz.html               # Quiz interface
├── result.html             # Results page
├── about.html              # About page
├── setup.html              # Quiz setup and tutorial
├── README.md               # This file
├── LICENSE                 # License file
├── package.json            # Build scripts and dependencies
├── update-version.js       # Version management script
├── service-worker.js       # PWA service worker
├── robots.txt              # SEO robots file
├── sitemap.xml             # SEO sitemap
├── .gitignore             # Git ignore rules
│
├── css/
│   ├── theme.css          # Color palettes, themes, accessibility
│   ├── layout.css         # Grid, flexbox, responsive layouts
│   ├── animations.css     # Transitions and animations
│   ├── index.css          # Landing page styles
│   ├── setup.css          # Setup page styles
│   ├── quiz.css           # Quiz page styles
│   ├── results.css        # Results page styles
│   └── about.css          # About page styles
│
├── js/
│   ├── engine.js          # ⚠️ Core quiz logic (RB-ADA algorithm)
│   ├── cognitive-analyzer.js # Cognitive diagnostic assessment
│   ├── quiz-ui.js          # Quiz page UI controller
│   ├── results-ui.js       # Results page UI controller
│   ├── translations.js     # i18n translations (EN/MS)
│   ├── language.js         # Language switching
│   ├── theme.js            # Theme switching
│   ├── background-effects.js # Visual effects
│   ├── card-tilt.js        # 3D card effects
│   ├── mobile-menu.js      # Mobile navigation
│   ├── about.js            # About page interactions
│   ├── index.js            # Landing page interactions
│   ├── cache-utils.js      # Cache management utilities
│   └── version-checker.js  # Version checking and cache busting
│
├── data/
│   ├── gk.json            # General knowledge questions
│   ├── math.json           # Mathematics questions
│   ├── logic.json          # Logic and reasoning questions
│   ├── literature.json     # Literature questions
│   └── stem.json           # STEM questions
│
├── assets/
│   ├── images/            # Logo, team photos, icons
│   ├── audio/             # Sound effects (correct, wrong, levelup, background)
│   └── fonts/             # Custom fonts (optional)
│
└── docs/
    ├── COGNITIVE_ANALYZER.md      # Cognitive analyzer documentation
    ├── COGNITIVE_ANALYZER.pdf     # PDF version
    ├── LOGIC_EXPLANATION.md       # RB-ADA algorithm explanation
    ├── LOGIC_EXPLANATION.pdf      # PDF version
    ├── SHNEIDERMAN_GOLDEN_RULES.md # UI/UX design principles
    ├── SHNEIDERMAN_GOLDEN_RULES.pdf # PDF version
    ├── REFERENCES.md              # Research references
    └── REFERENCES.pdf             # PDF version
```

## 🚀 Setup Instructions

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (required for service worker and full functionality)

### Installation

1. **Clone or download the repository**
   ```bash
   git clone <repository-url>
   cd NeuroQuiz
   ```

2. **Start a local web server** (required)
   
   **Option A: Using Python**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   
   **Option B: Using Node.js (http-server)**
   ```bash
   npx http-server -p 8000
   ```
   
   **Option C: Using PHP**
   ```bash
   php -S localhost:8000
   ```

3. **Open in browser**
   - Navigate to `http://localhost:8000`
   - Service worker will register automatically for offline support

### Production Deployment

1. **Update version numbers** (for cache busting)
   ```bash
   node update-version.js
   ```

2. **Deploy to web server**
   - Upload all files to your web server
   - Ensure HTTPS is enabled (required for service worker)
   - Verify `service-worker.js` is accessible

3. **Verify deployment**
   - Check service worker registration in browser DevTools
   - Test offline functionality
   - Verify all assets load correctly

### Development Workflow

#### For UI/Design Team
- **Modify**: `css/` files, HTML structure (with care), `js/quiz-ui.js`, `js/results-ui.js`
- **Do NOT modify**: `js/engine.js` (core logic), `js/data.js` (without approval)

#### For Lead Developer
- **Implement**: Core logic in `js/engine.js`
- **Manage**: Question bank in `js/data.js`
- **Coordinate**: With UI team for integration points

#### For Content Lead
- **Add Questions**: To `js/data.js` following the question structure
- **Review**: Question quality and educational value

## 📝 Development Guidelines

### Code Organization
- **Separation of Concerns**: UI logic separate from core logic
- **Comments**: Clear comments guide team members
- **Accessibility**: WCAG AA compliance minimum
- **Responsive Design**: Mobile-first approach

### File Modification Rules
- ✅ **UI Team**: CSS, HTML structure, UI JavaScript
- ⚠️ **Lead Developer Only**: `engine.js`, core algorithms
- ⚠️ **Content Lead + Lead Developer**: `data.js` question bank
- ✅ **All Team**: Documentation, assets

### Accessibility
- Semantic HTML5 elements
- ARIA labels and roles
- Keyboard navigation support
- High contrast color schemes
- Screen reader compatibility

## 🎨 Customization

### Themes
Themes are defined in `css/theme.css` using CSS custom properties. To add a new theme:
1. Add theme variables in `:root` or `[data-theme="your-theme"]`
2. Update `js/theme.js` to include the new theme
3. Test contrast ratios for accessibility

### Colors
Color palettes are color-blind safe and high contrast. Modify in `css/theme.css`:
- Primary colors: Actions and highlights
- Success/Error: Feedback colors
- Backgrounds: Page and card backgrounds
- Text: Text colors with sufficient contrast

### Animations
Animations are in `css/animations.css`. All animations respect `prefers-reduced-motion`.

## 📊 Question Bank Structure

Questions are stored in JSON files in the `data/` directory. Each file contains an array of question objects:

```javascript
{
    "id": 1,
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 2,  // 0-based index
    "category": "Category Name",
    "level": 1,  // 1-3 (Elementary, Secondary, University)
    "difficulty": 1,  // 1-3 (Beginner, Intermediate, Expert)
    "explanation": "Explanation of the answer",
    "tags": ["tag1", "tag2"]
}
```

### Question Categories
- **General Knowledge** (`gk.json`): History, geography, culture, current events
- **Mathematics** (`math.json`): Arithmetic, algebra, geometry, problem-solving
- **Logic** (`logic.json`): Reasoning, patterns, sequences, critical thinking
- **Literature** (`literature.json`): Books, authors, literary devices, analysis
- **STEM** (`stem.json`): Science, technology, engineering, mathematics

## 🐛 Troubleshooting

### Quiz not loading
- Check browser console for errors
- Verify all JavaScript files are loaded
- Ensure question bank JSON files are accessible
- Check that service worker is not blocking resources
- Verify you're using a web server (not file:// protocol)

### Results not displaying
- Check localStorage for 'quizResults'
- Verify Chart.js is loaded (for charts)
- Check browser console for errors
- Ensure jsPDF is loaded for PDF export

### Theme not switching
- Verify `theme.js` is loaded
- Check browser localStorage permissions
- Ensure CSS custom properties are supported
- Clear browser cache if theme changes aren't applying

### Service Worker issues
- Ensure HTTPS is enabled (or localhost for development)
- Check service worker registration in DevTools > Application
- Clear service worker cache if needed
- Verify `service-worker.js` is accessible

### Offline functionality not working
- Check service worker registration
- Verify all assets are cached
- Check browser console for service worker errors
- Ensure HTTPS is enabled (required for service workers)

## 🚢 Production Deployment

### Pre-Deployment Checklist
- [x] All features tested and working
- [x] Service worker configured
- [x] Version numbers updated
- [x] All assets optimized
- [x] SEO meta tags in place
- [x] Accessibility verified
- [x] Cross-browser testing completed
- [x] Mobile responsiveness verified

### Deployment Steps

1. **Update Version**
   ```bash
   node update-version.js
   ```

2. **Upload Files**
   - Upload all files to your web server
   - Maintain directory structure
   - Ensure all files are accessible

3. **Configure Server**
   - Enable HTTPS (required for service worker)
   - Set proper MIME types for JSON files
   - Configure caching headers if needed

4. **Verify**
   - Test service worker registration
   - Verify offline functionality
   - Check all pages load correctly
   - Test quiz functionality end-to-end

### Performance Optimization
- All assets are versioned for cache busting
- Service worker caches resources for offline use
- Images are optimized
- CSS and JS are minified-ready (use build tools if needed)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Follow the file modification rules above
2. Maintain code comments and documentation
3. Test across different browsers
4. Ensure accessibility standards are met
5. Coordinate with team members on shared files

## 📧 Contact & Support

For questions or issues:
- Review documentation in `docs/`
- Check code comments in relevant files
- Contact team lead for core logic questions

## 🗺 Roadmap

### Phase 1: Foundation ✅
- [x] Project structure
- [x] Basic HTML pages
- [x] CSS framework
- [x] JavaScript architecture

### Phase 2: Core Development ✅
- [x] Implement quiz engine (RB-ADA algorithm)
- [x] Build question bank (5 categories, 1000+ questions)
- [x] Complete UI integration
- [x] Cognitive analyzer system
- [x] Adaptive difficulty system
- [x] Gamification features

### Phase 3: Enhancement ✅
- [x] Multiple question categories
- [x] Advanced analytics and cognitive profiling
- [x] Offline support (PWA with service worker)
- [x] Multi-language support (English/Malay)
- [x] Theme switching (Light/Dark/System)
- [x] Print and PDF export
- [x] Responsive design for all devices

### Production Ready ✅
- [x] Performance optimization
- [x] Accessibility compliance (WCAG AA)
- [x] SEO optimization
- [x] Cache management
- [x] Version control system
- [x] Complete documentation

---

**NeuroQuiz™** - Learning, Gamified. 🧠🎮

