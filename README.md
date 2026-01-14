# NeuroQuiz™

**An Adaptive Gamified Quiz Platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 Project Overview

NeuroQuiz™ is an innovative client-side web application that combines cutting-edge cognitive science research with engaging game mechanics to create an optimal learning experience. The platform adapts to each user's performance in real-time, adjusting question difficulty based on cognitive load theory and implementing spaced repetition principles to enhance long-term memory retention.

## ✨ Features

### Core Features
- **Adaptive Learning System**: Questions adjust dynamically based on user performance
- **Gamification**: Points, levels, streaks, and achievements to enhance motivation
- **Real-time Feedback**: Immediate feedback on answers with explanations
- **Performance Analytics**: Detailed charts and breakdowns of quiz performance
- **Accessibility**: High contrast themes, keyboard navigation, and screen reader support
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Technical Features
- **Client-Side Only**: No backend required - runs entirely in the browser
- **Local Storage**: Progress and results saved locally
- **Theme Switching**: Light, dark, and high-contrast themes
- **Print & Export**: Print results or export to PDF
- **Question Review**: Detailed review of all questions after completion

## 🎯 Target Audience

- **Students**: Practice and test knowledge across various subjects
- **Educators**: Create engaging quiz experiences for learners
- **Lifelong Learners**: Self-paced learning and knowledge assessment
- **Organizations**: Training and assessment tools

## 🔄 User Flow

1. **Landing Page** (`index.html`)
   - Welcome message and research introduction
   - Feature highlights
   - Call-to-action to start quiz

2. **Quiz Page** (`quiz.html`)
   - Progress tracking
   - Question display with multiple-choice options
   - Real-time score and gamification indicators
   - Adaptive difficulty adjustment

3. **Results Page** (`result.html`)
   - Score visualization with circular progress
   - Performance charts and category breakdowns
   - Achievement badges
   - Detailed question review
   - Print and export options

4. **About Page** (`about.html`)
   - Team information
   - Technology stack
   - Research references

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

For detailed research documentation, see [`docs/research.pdf`](docs/research.pdf).

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
- **Chart.js**: Data visualization for results

### Tools & Libraries
- **Chart.js 4.4.0**: Performance charts and visualizations
- **Local Storage API**: Client-side data persistence
- **CSS Custom Properties**: Theme switching and customization

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
├── README.md               # This file
├── LICENSE                 # License file
├── .gitignore             # Git ignore rules
│
├── css/
│   ├── theme.css          # Color palettes, themes, accessibility
│   ├── layout.css         # Grid, flexbox, responsive layouts
│   └── animations.css     # Transitions and animations
│
├── js/
│   ├── engine.js          # ⚠️ Core quiz logic (Lead Developer only)
│   ├── data.js            # ⚠️ Question bank (Lead Developer + Content Lead)
│   ├── quiz-ui.js         # Quiz page UI controller
│   ├── results-ui.js      # Results page UI controller
│   └── theme.js           # Theme switching
│
├── assets/
│   ├── images/
│   │   ├── logo.png       # Application logo
│   │   ├── favicon.ico    # Browser favicon
│   │   └── team-placeholder.png
│   ├── audio/
│   │   ├── correct.mp3    # Success sound
│   │   ├── wrong.mp3     # Error sound
│   │   └── levelup.mp3   # Achievement sound
│   └── fonts/             # Custom fonts (optional)
│
└── docs/
    ├── research.pdf       # Research documentation
    └── user-flow.png      # User flow diagram
```

## 🚀 Setup Instructions

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional, but recommended)

### Installation

1. **Clone or download the repository**
   ```bash
   git clone <repository-url>
   cd NeuroQuiz
   ```

2. **Start a local web server** (recommended)
   
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
   - Or simply open `index.html` directly (some features may be limited)

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

Questions in `js/data.js` follow this structure:

```javascript
{
    id: 1,
    question: "Question text here?",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: 2,  // 0-based index
    category: "Category Name",
    difficulty: 1,  // 1-5 scale
    explanation: "Explanation of the answer",
    tags: ["tag1", "tag2"]
}
```

## 🐛 Troubleshooting

### Quiz not loading
- Check browser console for errors
- Verify all JavaScript files are loaded
- Ensure question bank has at least one question

### Results not displaying
- Check localStorage for 'quizResults'
- Verify Chart.js is loaded (for charts)
- Check browser console for errors

### Theme not switching
- Verify `theme.js` is loaded
- Check browser localStorage permissions
- Ensure CSS custom properties are supported

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

### Phase 2: Core Development (In Progress)
- [ ] Implement quiz engine
- [ ] Build question bank
- [ ] Complete UI integration

### Phase 3: Enhancement
- [ ] Additional question categories
- [ ] Advanced analytics
- [ ] Social sharing features
- [ ] Offline support (PWA)

---

**NeuroQuiz™** - Learning, Gamified. 🧠🎮

Tryy 
