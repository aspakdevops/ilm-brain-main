# User Progress API Documentation

## 📊 Overview

The User Progress API provides complete functionality for tracking and managing user learning progress through the Physics Energy chapter. It reads from `sample_data/current_status.json` and transforms the data into rich frontend responses with progress percentages, subtopic statuses, and current session information. No user authentication or database required.

## 🏗️ Architecture

### Modular Structure
```
routes/user-progress.js      → HTTP routing and endpoint definitions
controllers/userProgressController.js → Request/response handling
services/userProgressService.js → Business logic and calculations
models/UserProgress.js       → Data structure and validation
sample_data/user_*_progress.json → Sample user progress data
```

## 🔗 API Endpoints

Base URL: `/api/user-progress`

### 1. **Health Check**
```
GET /api/user-progress/health
```
**Response:**
```json
{
  "status": "success",
  "message": "User Progress API is healthy",
  "data": {
    "service": "User Progress API",
    "timestamp": "2024-01-25T10:30:00.000Z",
    "metadata_loaded": true
  }
}
```

### 2. **Get User Progress**
```
GET /api/user-progress
```
**Example:** `GET /api/user-progress`

**Response:**
```json
{
  "status": "success",
  "message": "User progress retrieved successfully",
  "data": {
    "user_id": "user_001",
    "overall_progress": {
      "chapter_title": "Energy",
      "completed_goals": 3,
      "total_goals": 12,
      "progress_percentage": 25
    },
    "subject_progress": {
      "physics": {
        "chapter_progress": {
          "1": {
            "chapter_title": "Energy",
            "completed_goals": 3,
            "total_goals": 12,
            "progress_percentage": 25,
            "subtopic_progress": [
              {
                "subtopic_id": 1,
                "subtopic_name": "Types of Energy",
                "status": "completed",
                "completed_goals": 3,
                "total_goals": 3,
                "progress_percentage": 100
              },
              {
                "subtopic_id": 2,
                "subtopic_name": "Energy Conservation",
                "status": "current",
                "completed_goals": 0,
                "total_goals": 3,
                "progress_percentage": 0
              }
              // ... other subtopics
            ]
          }
        }
      }
    },
    "current_session": {
      "subject": "physics",
      "chapter_id": 1,
      "subtopic_id": 2,
      "goal_id": 4,
      "next_goal_id": 5
    }
  }
}
```

### 3. **Reset Progress**
```
POST /api/user-progress/reset
```
**Example:** `POST /api/user-progress/reset`

Resets progress to the beginning (goal 1) for testing purposes.

### 4. **Update User Progress**
```
PUT /api/user-progress/goal/:goalId
```
**Example:** `PUT /api/user-progress/goal/5`

Marks goal 5 as completed and returns updated progress.

### 5. **Get Current Learning Position**
```
GET /api/user-progress/current
```
**Example:** `GET /api/user-progress/current`

**Response:**
```json
{
  "status": "success",
  "message": "Current learning position retrieved successfully",
  "data": {
    "current_session": {
      "subject": "physics",
      "chapter_id": 1,
      "subtopic_id": 2,
      "goal_id": 4,
      "next_goal_id": 5
    },
    "current_subtopic": {
      "subtopic_id": 2,
      "subtopic_name": "Energy Conservation",
      "status": "current",
      "completed_goals": 0,
      "total_goals": 3,
      "progress_percentage": 0
    }
  }
}
```

## 📊 Progress Calculation Logic

### Subtopic Status
- **`completed`**: All goals in the subtopic are completed
- **`current`**: Contains the current goal OR has some (but not all) goals completed
- **`pending`**: No goals completed yet

### Progress Percentage
- Calculated as: `(completed_goals / total_goals) * 100`
- Rounded to nearest integer

## 🧪 Sample Data

Progress is stored in `sample_data/current_status.json`:

- **Current user**: John Doe (user_001)
- **Default state**: No goals completed, currently on goal 1
- **Modifiable**: Progress updates are saved to this file

## 🚀 Testing Examples

### Using curl:
```bash
# Health check
curl http://localhost:3000/api/user-progress/health

# Get user progress
curl http://localhost:3000/api/user-progress

# Update progress (complete goal 5)
curl -X PUT http://localhost:3000/api/user-progress/goal/5

# Get current position
curl http://localhost:3000/api/user-progress/current

# Reset progress to beginning
curl -X POST http://localhost:3000/api/user-progress/reset
```

### Using JavaScript fetch:
```javascript
// Get user progress
const response = await fetch('/api/user-progress');
const data = await response.json();
console.log('User progress:', data.data);

// Update progress
const updateResponse = await fetch('/api/user-progress/goal/5', {
  method: 'PUT'
});
const updateData = await updateResponse.json();
console.log('Progress updated:', updateData.data);

// Reset progress
const resetResponse = await fetch('/api/user-progress/reset', {
  method: 'POST'
});
const resetData = await resetResponse.json();
console.log('Progress reset:', resetData.data);
```

## 🔧 Frontend Integration

### Progress Bar Updates
```javascript
async function updateProgressBar() {
  const response = await fetch('/api/user-progress');
  const data = await response.json();
  
  const progress = data.data.overall_progress.progress_percentage;
  document.querySelector('.progress-bar').style.width = `${progress}%`;
  document.querySelector('.progress-text').textContent = 
    `${data.data.overall_progress.completed_goals}/${data.data.overall_progress.total_goals} Goals Complete`;
}
```

### Subtopic Unlock Logic
```javascript
async function getSubtopicStatuses() {
  const response = await fetch('/api/user-progress');
  const data = await response.json();
  
  return data.data.subject_progress.physics.chapter_progress['1'].subtopic_progress;
}
```

## 🛠️ Error Handling

### Common Error Responses
- **404**: User not found
- **500**: Server error (metadata loading, file system issues)

### Error Response Format
```json
{
  "status": "error",
  "message": "User not found",
  "data": null
}
```

## 📝 Data Structure

### User Progress File Format
```json
{
  "user_id": "user_001",
  "created_at": "2024-01-15T08:30:00.000Z",
  "last_active": "2024-01-20T14:45:30.000Z",
  "courses": {
    "physics": {
      "chapters": {
        "1": {
          "completed_goals": [1, 2, 3],
          "current_goal": 4
        }
      }
    }
  }
}
```

## 🔄 Future Enhancements

- Multi-chapter support
- Multi-subject support  
- Progress analytics and insights
- Achievement system integration
- Learning streak tracking
- Database integration (currently uses JSON files)

## 🎉 **Final API Structure**

```
/api/
├── health                          # Health check
├── next-content                    # Learning content flow
├── submit-answer                   # Answer submission
├── chat                           # Chatbot interaction
├── chat/history                   # Chat history
└── user-progress/
    ├── /                          # Get current progress
    ├── /goal/:goalId              # Update progress
    ├── /current                   # Current position
    ├── /reset                     # Reset progress
    └── /health                    # Progress API health
```

**Total Active Endpoints:** 10 endpoints, all tested and working ✅  
**Data Source:** `sample_data/current_status.json` (no database required)  
**No Authentication:** Simple file-based progress tracking 