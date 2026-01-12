# NeuroQuiz Question Datasets

This directory contains question datasets for the NeuroAdapt™ Engine.

## Structure

Each category file contains **300 questions** organized as:
- **Level 1 (Elementary)**: 100 questions
  - 33 easy
  - 33 medium  
  - 34 hard
- **Level 2 (Secondary)**: 100 questions
  - 33 easy
  - 33 medium
  - 34 hard
- **Level 3 (University/Adult)**: 100 questions
  - 33 easy
  - 33 medium
  - 34 hard

## Files

- `math.json` - Mathematics questions
- `logic.json` - Logic and puzzle questions
- `stem.json` - Science, Technology, Engineering questions
- `literature.json` - Literature and language questions
- `gk.json` - General knowledge questions

## Question Format

```json
{
  "id": Number,
  "level": 1 | 2 | 3,
  "difficulty": "easy" | "medium" | "hard",
  "category": String,
  "question": String,
  "options": [String, String, String, String],
  "answer": Number,
  "explanation": String
}
```

## Usage

Import questions in JavaScript:
```javascript
const mathQuestions = require('./data/math.json');
// or
import mathQuestions from './data/math.json';
```
