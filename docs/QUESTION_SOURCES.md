# NeuroQuiz Question Sources Documentation

This document provides information about the sources of all questions used in the NeuroQuiz application.

## Overview

NeuroQuiz uses a comprehensive question bank organized into 5 categories, with 300 questions per category (1,500 total questions). Each category is distributed across 3 education levels (Elementary, Secondary, University) with varying difficulty levels (easy, medium, hard).

## Question Datasets

### Total Questions: 1,500

| Category | File | Questions | Levels | Difficulties |
|----------|------|-----------|--------|--------------|
| Logic | `data/logic.json` | 300 | 1-3 | easy, medium, hard |
| Math | `data/math.json` | 300 | 1-3 | easy, medium, hard |
| STEM | `data/stem.json` | 300 | 1-3 | easy, medium, hard |
| Literature | `data/literature.json` | 300 | 1-3 | easy, medium, hard |
| General Knowledge | `data/gk.json` | 300 | 1-3 | easy, medium, hard |

## Question Distribution

Each category contains:
- **Level 1 (Elementary)**: 100 questions
  - 33 easy difficulty
  - 33 medium difficulty
  - 34 hard difficulty
- **Level 2 (Secondary)**: 100 questions
  - 33 easy difficulty
  - 33 medium difficulty
  - 34 hard difficulty
- **Level 3 (University/Adult)**: 100 questions
  - 33 easy difficulty
  - 33 medium difficulty
  - 34 hard difficulty

## Question Structure

Each question follows this JSON structure:
```json
{
  "id": Number,
  "level": 1 | 2 | 3,
  "difficulty": "easy" | "medium" | "hard",
  "category": String,
  "question": String,
  "options": [String, String, String, String],
  "answer": Number (0-based index),
  "explanation": String
}
```

## Source Information

### Logic Questions (`data/logic.json`)
- **Total**: 300 questions
- **ID Range**: 2001-2300
- **Topics Covered**:
  - Logical reasoning
  - Pattern recognition
  - Deductive reasoning
  - Sequence problems
  - Conditional logic
- **Source**: [To be documented]
- **Last Updated**: [Date]
- **License**: [License information]

### Math Questions (`data/math.json`)
- **Total**: 300 questions
- **ID Range**: 1-300
- **Topics Covered**:
  - Arithmetic operations
  - Algebra
  - Geometry
  - Word problems
  - Advanced mathematics (Level 3)
- **Source**: [To be documented]
- **Last Updated**: [Date]
- **License**: [License information]

### STEM Questions (`data/stem.json`)
- **Total**: 300 questions
- **ID Range**: 3001-3300
- **Topics Covered**:
  - Science fundamentals
  - Technology concepts
  - Engineering principles
  - Scientific method
  - Advanced STEM topics (Level 3)
- **Source**: [To be documented]
- **Last Updated**: [Date]
- **License**: [License information]

### Literature Questions (`data/literature.json`)
- **Total**: 300 questions
- **ID Range**: 4001-4300
- **Topics Covered**:
  - Literary analysis
  - Author identification
  - Literary devices
  - Reading comprehension
  - Classic and modern literature (Level 3)
- **Source**: [To be documented]
- **Last Updated**: [Date]
- **License**: [License information]

### General Knowledge Questions (`data/gk.json`)
- **Total**: 300 questions
- **ID Range**: 5001-5300
- **Topics Covered**:
  - History
  - Geography
  - Current events
  - Culture
  - Trivia
- **Source**: [To be documented]
- **Last Updated**: [Date]
- **License**: [License information]

## Question Generation

Questions are stored in JSON format and loaded dynamically by the quiz engine. The engine filters questions based on:
- User-selected category
- Current education level (1-3)
- Current difficulty level (1-3, mapped from literacy level)
- Adaptive algorithm adjustments

## Usage in Application

Questions are loaded via:
1. **Initial Load**: `quiz-ui.js` fetches all category JSON files
2. **Caching**: Questions are cached in `window.NEUROQUIZ_QUESTION_BANK`
3. **Filtering**: Engine filters by category, level, and difficulty
4. **Selection**: RB-ADA algorithm selects appropriate questions

## Maintenance

### Adding New Questions
1. Follow the JSON structure defined above
2. Ensure unique IDs within category
3. Maintain level and difficulty distribution
4. Update this document with source information

### Updating Questions
1. Maintain backward compatibility with existing IDs
2. Update explanation if answer changes
3. Document changes in version history

### Quality Assurance
- All questions reviewed for accuracy
- Explanations verified
- Difficulty levels validated
- Level appropriateness confirmed

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | [Date] | Initial question bank | [Author] |

## Attribution

### Credits
- **Question Bank**: NeuroQuiz Team
- **Algorithm**: RB-ADA by Saiful Iqbal, Team ChendAwan
- **Platform**: NeuroQuiz™

### Acknowledgments
[Add acknowledgments for question sources, contributors, etc.]

## References

For detailed academic references and citations, see **[REFERENCES.md](./REFERENCES.md)**.

### Quick Reference Summary

- **Logic Questions**: See REFERENCES.md for logic and reasoning sources
- **Mathematics Questions**: See REFERENCES.md for mathematics textbooks and resources
- **STEM Questions**: See REFERENCES.md for science, technology, and engineering sources
- **Literature Questions**: See REFERENCES.md for literary texts and criticism
- **General Knowledge Questions**: See REFERENCES.md for history, geography, and current events sources

### Citation Style

All references follow **APA 7th Edition** format. The full reference list with detailed citations is available in [REFERENCES.md](./REFERENCES.md).

## License

[Specify license for question content]

## Contact

For questions about question sources or to report issues:
- **Project**: NeuroQuiz
- **Repository**: [Repository URL]
- **Issues**: [Issues URL]

---

**Note**: This document should be updated whenever new questions are added or sources change. Maintain accurate source attribution for all educational content. All references should be properly cited according to academic standards.
