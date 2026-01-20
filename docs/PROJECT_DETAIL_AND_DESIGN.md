# NeuroQuiz™ - Project Detail and Design Document

**Version:** 1.0.0  
**Release Date:** January 19, 2026  
**Last Updated:** January 20, 2026  
**Institution:** Universiti Teknologi Mara Cawangan Melaka Kampus Jasin  
**Document Type:** Project Review Documentation

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Overview](#project-overview)
3. [Design Philosophy](#design-philosophy)
4. [Technical Architecture](#technical-architecture)
5. [Core Features & Functionality](#core-features--functionality)
6. [User Interface & User Experience Design](#user-interface--user-experience-design)
7. [Algorithms & Research Foundation](#algorithms--research-foundation)
8. [Implementation Details](#implementation-details)
9. [File Structure & Organization](#file-structure--organization)
10. [Technology Stack](#technology-stack)
11. [Performance Optimization](#performance-optimization)
12. [Accessibility & Standards Compliance](#accessibility--standards-compliance)
13. [Testing & Quality Assurance](#testing--quality-assurance)
14. [Deployment & Distribution](#deployment--distribution)
15. [Future Roadmap](#future-roadmap)
16. [References & Citations](#references--citations)

---

## Executive Summary

**NeuroQuiz™** is an innovative, client-side web application that combines cutting-edge cognitive science research with engaging game mechanics to create an optimal adaptive learning experience. The platform implements a sophisticated Rule-Based Adaptive Dynamic Algorithm (RB-ADA) that adjusts question difficulty in real-time based on user performance, while providing comprehensive cognitive diagnostic assessment (CDA) through the Rule Space Method.

### Key Highlights

- **Adaptive Learning System**: Real-time difficulty adjustment based on cognitive load theory
- **Cognitive Diagnostic Assessment**: Deep insights into learning patterns beyond simple scoring
- **Gamification**: Points, levels, streaks, and achievements to enhance motivation
- **Client-Side Architecture**: No backend required - runs entirely in the browser
- **Research-Based**: Built on established educational psychology and cognitive science research
- **Professional Export**: Corporate-grade PDF reports with detailed analytics

### Target Applications

- Educational institutions for student assessment
- Research in adaptive learning and cognitive assessment
- Self-paced learning platforms
- Training and professional development programs

---

## Project Overview

### Problem Statement

Traditional quiz platforms provide limited feedback beyond correct/incorrect answers. They fail to:
- Adapt to individual learning capabilities in real-time
- Provide insights into cognitive learning patterns
- Identify specific knowledge gaps and strengths
- Offer actionable feedback for improvement

### Solution

NeuroQuiz™ addresses these limitations through:
1. **Adaptive Difficulty System**: Questions adjust dynamically to maintain optimal challenge level
2. **Cognitive Diagnostic Assessment**: Analyzes learning patterns using Rule Space Method
3. **Executive Function Evaluation**: Assesses cognitive skills beyond knowledge testing
4. **Comprehensive Analytics**: Detailed performance breakdowns and visualizations
5. **Professional Reporting**: Exportable PDF reports for documentation and review

### Project Goals

1. Create an engaging, gamified learning experience
2. Implement research-based adaptive learning algorithms
3. Provide detailed cognitive assessment capabilities
4. Ensure accessibility and cross-platform compatibility
5. Maintain high performance with client-side processing

---

## Design Philosophy

### Core Design Principles

#### 1. **User-Centered Design**
- Intuitive navigation and clear visual feedback
- Immediate response to user actions
- Progressive disclosure of information
- Minimal cognitive load in interface design

#### 2. **Accessibility First**
- WCAG AA compliance minimum
- Keyboard navigation support
- Screen reader compatibility
- High contrast color schemes
- Responsive design for all devices

#### 3. **Performance Optimization**
- Client-side processing for instant feedback
- Efficient DOM manipulation using document fragments
- CSS containment for animation performance
- Lazy loading and code splitting where applicable

#### 4. **Visual Design Language**

**Color System:**
- **Primary**: Electric Blue (#2563eb) - Actions and highlights
- **Success**: Green (#10b981) - Correct answers, achievements
- **Error**: Red (#ef4444) - Incorrect answers, warnings
- **Warning**: Amber (#f59e0b) - Hints and cautions
- **Neutral**: Gray scale for text and backgrounds

**Typography:**
- System fonts for optimal performance
- Responsive font sizing using clamp()
- Clear hierarchy with semantic HTML

**Spacing & Layout:**
- Consistent spacing scale (0.25rem to 3rem)
- Grid and flexbox for responsive layouts
- Mobile-first approach

#### 5. **Gamification Design**
- Visual feedback for achievements (confetti, emoji rain)
- Progress indicators (circular progress, progress bars)
- Streak tracking with visual effects
- Level progression with clear visual cues
- Points system with immediate feedback

---

## Technical Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface Layer                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Landing  │  │  Quiz   │  │ Results │  │  About   │  │
│  │  Page    │  │  Page   │  │  Page   │  │  Page    │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────┐
│                   Application Logic Layer                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ Quiz Engine  │  │     UI       │  │  Cognitive   │   │
│  │  (RB-ADA)    │  │ Controllers │  │  Analyzer    │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────┐
│                      Data Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  Question    │  │   Local     │  │   Theme     │   │
│  │    Bank      │  │  Storage    │  │   System    │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Component Architecture

#### 1. **Quiz Engine (RB-ADA)**
- **File**: `js/engine.js`
- **Responsibility**: Core adaptive algorithm, question selection, difficulty adjustment
- **Key Functions**:
  - `submitAnswer()` - Processes answers and adjusts difficulty
  - `getCurrentQuestion()` - Retrieves appropriate question based on level/difficulty
  - `getState()` - Returns current quiz state
  - `getProgress()` - Calculates progress metrics

#### 2. **UI Controllers**
- **Files**: `js/quiz-ui.js`, `js/results-ui.js`, `js/index.js`, `js/about.js`
- **Responsibility**: User interface management, event handling, visual updates
- **Key Features**:
  - Event delegation for performance
  - Batch DOM updates using requestAnimationFrame
  - Modal management
  - Visual effects (confetti, emoji rain, bloom effects)

#### 3. **Cognitive Analyzer**
- **File**: `js/cognitive-analyzer.js`
- **Responsibility**: Cognitive diagnostic assessment, executive function evaluation
- **Key Metrics**:
  - Adaptability, Consistency, Recovery Rate, Error Persistence
  - Processing Speed, Impulsivity Control, Analytical Thinking
  - Cognitive Endurance, Self-Regulation

#### 4. **Data Management**
- **File**: `js/data.js`
- **Responsibility**: Question bank loading and management
- **Format**: JSON files per category (math.json, logic.json, stem.json, literature.json, gk.json)

### Data Flow

1. **Initialization**:
   - User setup (name, level, categories) → Local Storage
   - Question bank loading → Quiz Engine initialization

2. **Quiz Session**:
   - User selects answer → Quiz Engine processes → UI updates
   - Difficulty adjustment → New question selection
   - Performance tracking → Cognitive Analyzer updates

3. **Completion**:
   - Results calculation → Cognitive profile generation
   - Data export → PDF generation
   - Results storage → Local Storage

---

## Core Features & Functionality

### 1. Adaptive Learning System

#### RB-ADA Algorithm
- **Level System**: 3 levels (Elementary, Secondary, University)
- **Difficulty Tiers**: 3 tiers per level (Beginner, Intermediate, Expert)
- **Dual Streak System**:
  - **Displayed Streak**: Tracks consecutive correct answers across all difficulties, never resets except on wrong answer, used for returning to Expert mode
  - **Expert Streak**: Tracks consecutive correct answers only while in Expert difficulty, resets when entering or leaving Expert, used exclusively for level upgrade offers
- **Adaptation Rules**:
  - Correct answer → Increase difficulty
  - Incorrect answer → Decrease difficulty
  - **Expert Mode Drop Rule**: If in Expert difficulty and first question is wrong → Immediately downgrade to Intermediate (2)
  - **Returning to Expert**: Requires 7 consecutive correct answers (using displayed streak, not expert streak)
  - Streak-based promotions
  - Performance-based level adjustments

#### Real-Time Adaptation
- Immediate difficulty adjustment after each answer
- Expert streak resets when entering or leaving Expert difficulty
- Displayed streak continues across difficulty changes
- Level promotion/demotion based on performance
- Optimal challenge zone maintenance

### 2. Cognitive Diagnostic Assessment

#### CDA Metrics
1. **Adaptability**: Adjustment to difficulty changes (0.0-1.0)
2. **Consistency**: Performance stability across questions (0.0-1.0)
3. **Recovery Rate**: Bounce-back after errors (0.0-1.0+)
4. **Error Persistence**: Tendency to repeat mistakes (0.0-1.0)

#### Knowledge Mastery
- Category-specific mastery scores
- Weighted calculation: 60% overall + 40% recent performance
- Visual representation in radar charts

### 3. Executive Function Assessment

#### Cognitive Skills Evaluated
1. **Processing Speed**: Cognitive efficiency measurement
2. **Impulsivity Control**: Response deliberation assessment
3. **Analytical Thinking**: Depth of question analysis
4. **Cognitive Endurance**: Sustained performance over time
5. **Self-Regulation**: Learning process management

### 4. Gamification System

#### Game Mechanics
- **Points System**: Difficulty-based scoring (10 points per difficulty level)
- **Level Progression**: Visual level indicators with effects
- **Dual Streak System**:
  - **Displayed Streak**: 
    - Never resets (except on wrong answer)
    - Continues across difficulty changes
    - Shown to user in UI
    - Used for returning to Expert difficulty (7 consecutive correct)
  - **Expert Streak**: 
    - Only counts while user is in Expert difficulty (3)
    - Resets immediately when entering Expert (new session starts at 0)
    - Resets immediately when leaving Expert
    - Used exclusively for level upgrade offers (10 consecutive correct in Expert)
    - Completely separate from displayed streak
- **Streak Tracking**: Visual feedback for consecutive correct answers
- **Level Upgrade Offers**: 
  - Triggered ONLY when ALL conditions are met:
    - User is currently in Expert difficulty (3)
    - User achieves exactly 10 consecutive correct answers WHILE in Expert
    - Count ONLY expert streak (not displayed streak)
  - Does NOT trigger based on:
    - Total streak
    - Displayed streak
    - Streaks earned before entering Expert
- **Achievements**: Milestone-based rewards
- **Visual Effects**: Confetti, emoji rain, bloom effects

#### Motivational Elements
- Real-time progress indicators
- Motivational messages based on milestones
- Achievement celebrations
- Performance visualization

### 5. Results & Analytics

#### Performance Metrics
- Overall accuracy percentage
- Category-specific performance
- Response time analysis
- Questions per minute
- Best streak achievement

#### Visualizations
- **Radar Chart**: Cognitive profile visualization (Chart.js)
- **Progress Bars**: Individual metric display
- **Category Breakdown**: Subject-specific mastery
- **Timeline Analysis**: Performance over time

#### Export Capabilities
- **PDF Export**: Professional corporate-format reports
- **Print Support**: Browser print functionality
- **Data Persistence**: Local storage for review

### 6. User Interface Features

#### Theme System
- **Light Theme**: Default, high-contrast design
- **Dark Theme**: Reduced eye strain for low-light environments
- **Theme Switching**: Persistent user preference
- **Accessibility**: WCAG AA compliant color schemes

#### Responsive Design
- **Mobile-First**: Optimized for touch interactions
- **Tablet Support**: Adaptive layouts for medium screens
- **Desktop Experience**: Full-featured interface
- **Breakpoints**: 480px, 768px, 1024px, 1440px

#### Interactive Elements
- **Button States**: Hover, active, disabled, focus
- **Modal System**: Custom modal overlays
- **Loading States**: Progress indicators
- **Error Handling**: User-friendly error messages

### 7. Audio Feedback

#### Sound System
- **Correct Answer**: Success sound (correct.mp3)
- **Wrong Answer**: Error sound (wrong.mp3)
- **Level Up**: Achievement sound (levelup.mp3)
- **Volume Control**: Configurable audio levels
- **Error Handling**: Graceful fallback for autoplay restrictions

---

## User Interface & User Experience Design

### Page Structure

#### 1. Landing Page (`index.html`)
- **Hero Section**: Welcome message with call-to-action
- **Feature Highlights**: Key platform capabilities
- **Research Introduction**: Academic foundation overview
- **Navigation**: Access to all sections

#### 2. Setup Page (`setup.html`)
- **User Information**: Name input
- **Level Selection**: Elementary, Secondary, University
- **Category Selection**: Multi-select question categories
- **Literacy Level**: Reading proficiency selection

#### 3. Quiz Page (`quiz.html`)
- **Header**: Progress indicator, score display, level/streak/points
- **Question Card**: Question text, options, badge
- **Action Buttons**: Submit, Next, Stop
- **Feedback Area**: Immediate answer feedback
- **Motivation Message**: Milestone-based encouragement

#### 4. Results Page (`result.html`)
- **Hero Section**: Personalized congratulations
- **Score Overview**: Circular progress, key metrics
- **Cognitive Performance**: Radar chart visualization
- **Category Breakdown**: Subject-specific performance
- **Export Options**: PDF and print functionality

#### 5. About Page (`about.html`)
- **Team Information**: Developer profiles
- **Technology Stack**: Technical details
- **Research References**: Academic citations
- **Project Information**: Version and release details

### Visual Design Elements

#### Color Palette
```
Primary Colors:
- Electric Blue: #2563eb (Primary actions)
- Primary Light: #3b82f6 (Active states)
- Primary Dark: #1e40af (Hover states)

Semantic Colors:
- Success: #10b981 (Correct answers)
- Error: #ef4444 (Wrong answers)
- Warning: #f59e0b (Hints)

Neutral Colors:
- Text Primary: #111827
- Text Secondary: #4b5563
- Text Tertiary: #6b7280
- Surface Base: #fafbfc
- Surface Subtle: #f3f4f6
- Border: #e5e7eb
```

#### Typography
- **Font Family**: System fonts (-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto)
- **Font Sizes**: Responsive using clamp() for scalability
- **Font Weights**: 400 (normal), 600 (semibold), 700 (bold)
- **Line Heights**: 1.5 for body, 1.2 for headings

#### Spacing System
- **Scale**: 0.25rem (xs) to 3rem (2xl)
- **Responsive Spacing**: clamp() values for fluid scaling
- **Consistent Margins**: 1rem base unit

#### Component Design

**Buttons:**
- Primary: Blue background, white text
- Secondary: Transparent with blue border
- Outline: Transparent with gray border
- States: Hover, active, disabled, focus

**Cards:**
- Elevated surfaces with subtle shadows
- Border radius: 0.75rem
- Padding: 1.5rem
- Background: White (light) / Dark gray (dark theme)

**Modals:**
- Overlay: Semi-transparent backdrop
- Card: Centered, max-width 90vw
- Animation: Fade in/out transitions
- Accessibility: ARIA labels, focus management

### Animation & Transitions

#### Performance Optimizations
- CSS transforms for animations (GPU-accelerated)
- `will-change` for animated properties
- `contain` property for layout isolation
- Reduced motion support (`prefers-reduced-motion`)

#### Animation Types
- **Fade**: Opacity transitions
- **Slide**: Transform-based movements
- **Scale**: Size transformations
- **Bloom**: Screen-wide color overlays
- **Confetti**: Particle effects
- **Emoji Rain**: Falling emoji animations

---

## Algorithms & Research Foundation

### Rule-Based Adaptive Dynamic Algorithm (RB-ADA)

#### Algorithm Overview
RB-ADA is a real-time adaptive testing algorithm that adjusts question difficulty based on user performance, implementing principles from cognitive load theory and adaptive testing research.

#### Core Components

**1. Level System**
```
Level 1 (Elementary): Beginner-level questions
Level 2 (Secondary): Intermediate-level questions
Level 3 (University): Advanced-level questions
```

**2. Difficulty Adjustment**
```
Within each level:
- Beginner (1): Easier questions
- Intermediate (2): Moderate questions
- Expert (3): Challenging questions
```

**3. Adaptation Rules**
- **Correct Answer**: Increase difficulty by 1
- **Incorrect Answer**: Decrease difficulty by 1
- **Expert Mode Drop Rule**: If user is in Expert difficulty (3) and answers the first question wrong, immediately downgrade to Intermediate (2)
- **Returning to Expert**: User must achieve 7 consecutive correct answers (using displayed streak, not expert streak) to regain Expert difficulty
- **Level Upgrade Offer**: Triggered ONLY when:
  - User is currently in Expert difficulty (3)
  - User achieves 10 consecutive correct answers WHILE in Expert
  - Count ONLY expert streak (ignores displayed streak and streaks earned outside Expert)
- **Level Promotion**: After consistent correct answers at Expert difficulty
- **Level Demotion**: After consistent incorrect answers at Beginner difficulty

**4. Scoring System**
```
Points = Difficulty Level × 10
- Beginner: 10 points
- Intermediate: 20 points
- Expert: 30 points
```

#### Research Foundation
- **Cognitive Load Theory** (Sweller, 1988): Managing intrinsic, extraneous, and germane cognitive load
- **Adaptive Testing Principles** (Weiss & Kingsbury, 1984): Real-time difficulty adjustment
- **Zone of Proximal Development** (Vygotsky): Optimal challenge level maintenance

### Cognitive Diagnostic Assessment (CDA)

#### Rule Space Method
Based on Tatsuoka (2009), the Rule Space Method analyzes answer patterns to identify knowledge mastery and learning patterns beyond aggregate scores.

#### CDA Metrics Calculation

**1. Adaptability Score**
```
Formula: Successful adaptations / Total difficulty changes
Range: 0.0 to 1.0
Interpretation: Higher = better adaptation to difficulty changes
```

**2. Consistency Index**
```
Formula: 1 - (variance / max_variance)
Range: 0.0 to 1.0
Interpretation: Higher = more stable performance
```

**3. Recovery Rate**
```
Formula: Level promotions / Level drops (when drops > 0)
Range: 0.0 to 1.0+
Interpretation: Higher = better recovery from errors
```

**4. Error Persistence Rate**
```
Formula: Consecutive error sequences / Total errors
Range: 0.0 to 1.0
Interpretation: Lower = better (fewer repeated mistakes)
```

#### Knowledge Mastery Calculation
```
For each category:
- Overall accuracy = correct / total
- Recent performance = last 5 questions accuracy
- Weighted score = (0.6 × overall) + (0.4 × recent)
Range: 0.0 to 1.0 per category
```

### Executive Function Assessment

#### Processing Speed
```
Calculation: Average response time normalized against difficulty
Inverse relationship: Faster = higher score (up to optimal threshold)
Range: 0.0 to 1.0
```

#### Impulsivity Control
```
Calculation: Response time vs. accuracy correlation
Quick responses with low accuracy = high impulsivity
Range: 0.0 to 1.0 (higher = better control)
```

#### Analytical Thinking
```
Calculation: Response time relative to question complexity
Accuracy on complex questions
Pattern of answer changes before submission
Range: 0.0 to 1.0
```

#### Cognitive Endurance
```
Calculation: Performance trend across quiz duration
Early vs. late performance comparison
Fatigue indicators (increasing errors over time)
Range: 0.0 to 1.0
```

#### Self-Regulation
```
Calculation: Adaptation to feedback patterns
Strategy changes after incorrect answers
Improvement trends over time
Range: 0.0 to 1.0
```

### Research References

**Primary Sources:**
1. Tatsuoka, K. K. (2009). *Cognitive assessment: An introduction to the Rule Space Method.* Routledge.

**Supporting Theory:**
- Sweller, J. (1988). Cognitive load during problem solving: Effects on learning. *Cognitive Science*, 12(2), 257-285.
- Weiss, D. J., & Kingsbury, G. G. (1984). Application of computerized adaptive testing to educational problems. *Journal of Educational Measurement*, 21(4), 361-375.
- Diamond, A. (2013). Executive functions. *Annual Review of Psychology*, 64, 135-168.

For complete references, see `docs/REFERENCES.md`.

---

## Implementation Details

### Code Organization

#### Separation of Concerns
- **Presentation**: HTML structure, CSS styling
- **Logic**: JavaScript algorithms and business rules
- **Data**: Question bank, user preferences, results

#### Modular Architecture
- **Engine Module**: Core quiz logic (RB-ADA)
- **UI Modules**: Page-specific controllers
- **Analyzer Module**: Cognitive assessment
- **Utility Modules**: Theme, version, data management

### Performance Optimizations

#### DOM Manipulation
- **Document Fragments**: Batch DOM creation
- **requestAnimationFrame**: Smooth visual updates
- **Event Delegation**: Efficient event handling
- **CSS Containment**: Isolate layout calculations

#### Memory Management
- **Event Listener Cleanup**: Remove listeners when not needed
- **Chart Instance Management**: Destroy before creating new
- **Animation Cleanup**: Remove DOM elements after animations

#### CSS Performance
- **GPU Acceleration**: Transform-based animations
- **Will-Change**: Hint browser for animated properties
- **Contain Property**: Layout isolation for animations
- **Reduced Motion**: Respect user preferences

### Error Handling

#### User-Facing Errors
- Friendly error messages
- Graceful degradation
- Fallback content
- Loading state indicators

#### Developer Errors
- Console logging for debugging
- Error boundaries
- Validation checks
- Null/undefined guards

### Browser Compatibility

#### Supported Browsers
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

#### Feature Detection
- Local Storage API
- CSS Custom Properties
- ES6+ JavaScript features
- Chart.js library

---

## File Structure & Organization

```
NeuroQuiz/
│
├── index.html              # Landing page
├── setup.html              # User setup page
├── quiz.html               # Quiz interface
├── result.html             # Results page
├── about.html              # About page
├── README.md               # Project overview
├── LICENSE                 # MIT License
├── package.json            # Project metadata
├── robots.txt              # SEO configuration
├── sitemap.xml             # Site structure
├── service-worker.js        # PWA service worker
├── update-version.js        # Version management
│
├── css/                    # Stylesheets
│   ├── theme.css           # Color system, themes, variables
│   ├── layout.css          # Grid, flexbox, responsive layouts
│   ├── index.css           # Landing page styles
│   ├── setup.css           # Setup page styles
│   ├── quiz.css            # Quiz page styles
│   ├── results.css         # Results page styles
│   ├── about.css           # About page styles
│   └── animations.css       # Transitions and animations
│
├── js/                     # JavaScript modules
│   ├── engine.js           # RB-ADA algorithm (core logic)
│   ├── cognitive-analyzer.js  # CDA and executive functions
│   ├── data.js             # Question bank management
│   ├── quiz-ui.js          # Quiz page controller
│   ├── results-ui.js       # Results page controller
│   ├── index.js            # Landing page controller
│   ├── about.js            # About page controller
│   ├── theme.js            # Theme switching
│   ├── version-utils.js    # Version management
│   ├── background-effects.js  # Background animations
│   ├── card-tilt.js        # 3D card effects
│   └── mobile-menu.js      # Mobile navigation
│
├── assets/                 # Static assets
│   ├── images/             # Images and icons
│   │   ├── logo.png        # Application logo
│   │   ├── logo.svg        # Vector logo
│   │   ├── favicon.ico     # Browser favicon
│   │   └── [team photos]   # Team member images
│   ├── audio/              # Sound effects
│   │   ├── correct.mp3     # Success sound
│   │   ├── wrong.mp3      # Error sound
│   │   └── levelup.mp3     # Achievement sound
│   └── fonts/              # Custom fonts (if any)
│
├── data/                   # Question bank data
│   ├── math.json           # Mathematics questions
│   ├── logic.json          # Logic & reasoning questions
│   ├── stem.json           # STEM questions
│   ├── literature.json     # Literature questions
│   └── gk.json             # General knowledge questions
│
└── docs/                   # Documentation
    ├── PROJECT_DETAIL_AND_DESIGN.md  # This document
    ├── COGNITIVE_ANALYZER.md         # CDA technical guide
    ├── LOGIC_EXPLANATION.md           # Algorithm explanation
    └── REFERENCES.md                  # Research citations
```

### File Responsibilities

#### Core Logic Files (Lead Developer Only)
- `js/engine.js`: RB-ADA algorithm implementation
- `js/cognitive-analyzer.js`: Cognitive assessment calculations
- `js/data.js`: Question bank structure and loading

#### UI Files (UI Team)
- `js/quiz-ui.js`: Quiz interface management
- `js/results-ui.js`: Results display and export
- `css/*.css`: All styling files
- HTML files: Page structure

#### Shared Files
- `js/theme.js`: Theme management (all team)
- Documentation files: All team members

---

## Technology Stack

### Frontend Technologies

#### Core
- **HTML5**: Semantic markup, accessibility features
- **CSS3**: Modern styling with custom properties, Grid, Flexbox
- **JavaScript (ES6+)**: Vanilla JavaScript, no frameworks

#### Libraries
- **Chart.js 4.4.0**: Data visualization (radar charts, line charts)
- **jsPDF**: PDF generation for report export

#### APIs
- **Local Storage API**: Client-side data persistence
- **Web Audio API**: Sound playback
- **Canvas API**: Chart rendering
- **Service Worker API**: PWA capabilities

### Development Tools

#### Build Tools (Optional)
- **Node.js**: Development environment
- **npm**: Package management
- **Terser**: JavaScript minification
- **clean-css**: CSS minification
- **html-minifier**: HTML optimization

#### Version Control
- **Git**: Source code management
- **GitHub Pages**: Hosting and deployment

### Browser APIs Used

- **LocalStorage**: User preferences, quiz results
- **SessionStorage**: Temporary session data
- **requestAnimationFrame**: Smooth animations
- **IntersectionObserver**: Performance optimization (if used)
- **MediaQueryList**: Theme detection

---

## Performance Optimization

### Loading Performance

#### Asset Optimization
- **Image Optimization**: Compressed images, appropriate formats
- **Font Loading**: System fonts for instant rendering
- **Code Splitting**: Page-specific JavaScript loading
- **Lazy Loading**: Deferred non-critical resources

#### Caching Strategy
- **Service Worker**: Offline support, asset caching
- **Local Storage**: Persistent user data
- **Version Control**: Cache busting for updates

### Runtime Performance

#### JavaScript Optimization
- **Event Delegation**: Reduced event listeners
- **Debouncing/Throttling**: Optimized event handlers
- **Batch DOM Updates**: Document fragments, requestAnimationFrame
- **Memory Management**: Proper cleanup, chart instance management

#### CSS Optimization
- **GPU Acceleration**: Transform-based animations
- **CSS Containment**: Layout isolation
- **Will-Change**: Animation hints
- **Reduced Motion**: Respect user preferences

### Network Performance

#### Asset Delivery
- **CDN**: External libraries (Chart.js) from CDN
- **Compression**: Gzip/Brotli compression (server-side)
- **Minification**: Production builds (optional)

---

## Accessibility & Standards Compliance

### WCAG Compliance

#### Level AA Compliance
- **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Screen Reader Support**: ARIA labels, roles, live regions
- **Focus Management**: Visible focus indicators, logical tab order

#### Implementation
- **Semantic HTML**: Proper use of HTML5 elements
- **ARIA Attributes**: Labels, roles, states, properties
- **Alt Text**: Descriptive text for images
- **Form Labels**: Associated labels for form inputs

### Keyboard Navigation

#### Supported Interactions
- **Tab**: Navigate between interactive elements
- **Enter/Space**: Activate buttons, select options
- **Arrow Keys**: Navigate option lists
- **Escape**: Close modals, cancel actions

### Screen Reader Support

#### ARIA Implementation
- **aria-label**: Descriptive labels for buttons
- **aria-checked**: Radio button states
- **aria-live**: Dynamic content announcements
- **aria-hidden**: Hide decorative elements
- **role**: Semantic roles for custom components

### Responsive Design

#### Breakpoints
- **Mobile**: < 480px
- **Tablet**: 480px - 1024px
- **Desktop**: > 1024px

#### Touch Targets
- **Minimum Size**: 44×44px for touch targets
- **Spacing**: Adequate spacing between interactive elements
- **Tap Highlight**: Transparent tap highlight for better UX

---

## Testing & Quality Assurance

### Testing Approach

#### Manual Testing
- **Cross-Browser Testing**: Chrome, Firefox, Safari, Edge
- **Device Testing**: Desktop, tablet, mobile devices
- **Accessibility Testing**: Screen reader testing, keyboard navigation
- **User Acceptance Testing**: Real user feedback

#### Functional Testing
- **Quiz Flow**: Complete quiz session testing
- **Adaptive Algorithm**: Difficulty adjustment verification
- **Cognitive Analyzer**: Metric calculation accuracy
- **Export Functionality**: PDF generation and formatting

#### Performance Testing
- **Load Time**: Initial page load performance
- **Runtime Performance**: Smooth animations, responsive interactions
- **Memory Usage**: No memory leaks, proper cleanup

### Quality Metrics

#### Code Quality
- **Comments**: Clear documentation of complex logic
- **Consistency**: Consistent coding style
- **Modularity**: Separation of concerns
- **Error Handling**: Graceful error management

#### User Experience
- **Usability**: Intuitive interface, clear feedback
- **Performance**: Smooth interactions, fast responses
- **Accessibility**: WCAG AA compliance
- **Responsiveness**: Works on all device sizes

---

## Deployment & Distribution

### Hosting

#### Current Deployment
- **Platform**: GitHub Pages
- **URL**: [GitHub Pages URL]
- **HTTPS**: Secure connection
- **CDN**: Fast global delivery

#### Deployment Process
1. Code committed to repository
2. GitHub Pages automatically builds and deploys
3. Version management via meta tags
4. Cache busting for asset updates

### Version Management

#### Version Control
- **Git Tags**: Release versioning
- **Meta Tags**: App version in HTML
- **Cache Busting**: Query parameters for assets
- **Service Worker**: Cache version management

### Distribution

#### Access Methods
- **Web Browser**: Direct URL access
- **Bookmark**: Save for quick access
- **PWA**: Progressive Web App capabilities (service worker)

---

## Future Roadmap

### Phase 1: Foundation ✅
- [x] Project structure and architecture
- [x] Core RB-ADA algorithm
- [x] Basic UI implementation
- [x] Cognitive analyzer system
- [x] Results and analytics

### Phase 2: Enhancement (In Progress)
- [x] Professional PDF export
- [x] Audio feedback system
- [x] Advanced visualizations
- [ ] Additional question categories
- [ ] Social sharing features

### Phase 3: Advanced Features (Planned)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Collaborative features
- [ ] Mobile app version
- [ ] Backend integration (optional)

### Phase 4: Research & Development
- [ ] Algorithm refinement based on user data
- [ ] Additional cognitive metrics
- [ ] Machine learning integration
- [ ] Predictive analytics
- [ ] Research publication

---

## References & Citations

### Primary Research

1. **Tatsuoka, K. K. (2009).** *Cognitive assessment: An introduction to the Rule Space Method.* Routledge.
   - Foundation for Cognitive Diagnostic Assessment implementation

### Supporting Research

2. **Sweller, J. (1988).** Cognitive load during problem solving: Effects on learning. *Cognitive Science*, 12(2), 257-285.
   - Cognitive Load Theory for adaptive difficulty

3. **Weiss, D. J., & Kingsbury, G. G. (1984).** Application of computerized adaptive testing to educational problems. *Journal of Educational Measurement*, 21(4), 361-375.
   - Adaptive testing principles

4. **Diamond, A. (2013).** Executive functions. *Annual Review of Psychology*, 64, 135-168.
   - Executive function assessment framework

### Additional References

For complete academic references and citations, see `docs/REFERENCES.md`.

---

## Appendices

### Appendix A: Algorithm Pseudocode

#### RB-ADA Difficulty Adjustment
```
// Dual Streak System
displayedStreak = 0  // Never resets, continues across difficulty changes
expertStreak = 0     // Only counts in Expert, resets when entering/leaving Expert

IF answer is correct:
    displayedStreak += 1
    IF currentDifficulty == EXPERT:
        expertStreak += 1
    difficulty = min(difficulty + 1, MAX_DIFFICULTY)
    
    // Returning to Expert: Need 7 consecutive correct (using displayed streak)
    IF displayedStreak >= 7 AND difficulty < MAX_DIFFICULTY:
        difficulty = MAX_DIFFICULTY
        expertStreak = 0  // Reset when entering Expert (new session)
    
    // Level Upgrade Offer: 10 consecutive correct in Expert (expert streak only)
    IF difficulty == EXPERT AND expertStreak == 10:
        triggerLevelUpgradeOffer()
ELSE:
    displayedStreak = 0
    IF currentDifficulty == EXPERT:
        expertStreak = 0
    
    // Expert Mode Drop Rule
    IF currentDifficulty == EXPERT AND totalAnswered == 1 AND answer is wrong:
        difficulty = INTERMEDIATE  // Immediately downgrade
        expertStreak = 0
        RETURN  // Early return
    ELSE:
        difficulty = max(difficulty - 1, MIN_DIFFICULTY)
        IF difficulty < MIN_DIFFICULTY:
            level = max(level - 1, MIN_LEVEL)
            difficulty = MAX_DIFFICULTY
            expertStreak = 0  // Reset when leaving Expert

// Reset expert streak when entering Expert (new session starts at 0)
IF previousDifficulty != EXPERT AND currentDifficulty == EXPERT:
    expertStreak = 0
```

#### CDA Adaptability Calculation
```
adaptability = successful_adaptations / total_difficulty_changes
WHERE successful_adaptation = (difficulty_increased AND next_answer_correct) 
   OR (difficulty_decreased AND next_answer_incorrect)
```

### Appendix B: Color System Reference

See `css/theme.css` for complete color system implementation.

### Appendix C: File Modification Guidelines

#### Lead Developer Only
- `js/engine.js`
- `js/cognitive-analyzer.js`
- `js/data.js` (with Content Lead approval)

#### UI Team
- All CSS files
- `js/quiz-ui.js`
- `js/results-ui.js`
- HTML structure (with care)

#### All Team Members
- Documentation files
- `js/theme.js`
- Asset files

---

## Document Information

**Document Version**: 1.0  
**Last Updated**: January 19, 2026  
**Author**: NeuroQuiz Development Team  
**Institution**: Universiti Teknologi Mara Cawangan Melaka Kampus Jasin  
**Contact**: [Contact Information]

---

**© 2026 NeuroQuiz™. All rights reserved.**

*This document is intended for academic and professional review purposes.*
