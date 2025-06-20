# ILM Brain - Learning Platform

A robust backend system for an AI-powered learning platform that provides personalized learning experiences, progress tracking, and interactive content delivery with a modular frontend architecture.

## Project Structure

```
ILM_brain_prototype/
├── 🏠 Core Application
│   ├── app.js           # Express application setup with middleware and routing (99 lines) ✅
│   ├── server.js        # Server startup with error handling (31 lines) ✅
│   └── package.json     # Dependencies and scripts configuration (44 lines) ✅
│
├── 🔄 Backend API Layer
│   ├── routes/          # API route definitions
│   │   ├── index.js     # Main router mounting all routes (23 lines) ✅
│   │   ├── learning.js  # Chat endpoint (9 lines) ✅
│   │   ├── user-progress.js  # Progress tracking endpoints (32 lines) ✅
│   │   └── content-fetch.js  # Content fetching endpoints (25 lines) ✅
│   │
│   ├── controllers/     # Request handlers and business logic
│   │   ├── learningController.js     # Chat message handling (73 lines) ✅
│   │   ├── userProgressController.js # Progress tracking logic (120 lines) ✅
│   │   └── contentFetchController.js # Content request handling (178 lines) ✅
│   │
│   ├── services/        # Business logic and external integrations
│   │   ├── learningService.js        # External chatbot API integration (69 lines) ✅
│   │   ├── contentService.js         # Content management service (348 lines) ✅
│   │   └── userProgressService.js    # Progress calculations and logic (221 lines) ✅
│   │
│   └── models/          # Data models and structures
│       ├── UserProgress.js  # Complete progress data model with validation (126 lines) ✅
│       ├── Chapter.js       # Schema placeholder (29 lines) ⚠️
│       ├── Subtopic.js      # Schema placeholder (34 lines) ⚠️
│       ├── Goal.js          # Schema placeholder (empty) ⚠️
│       ├── Question.js      # Schema placeholder (empty) ⚠️
│       ├── LearningSession.js # Schema placeholder (empty) ⚠️
│       └── Answer.js        # Schema placeholder (empty) ⚠️
│
├── ⚙️ Configuration & Infrastructure
│   ├── config/          # Configuration files
│   │   ├── environment.js   # Environment variables (6 lines) ✅
│   │   └── database.js      # Database connection placeholder (empty) ⚠️
│   │
│   ├── middleware/      # Express middleware (all placeholders)
│   │   ├── validation.js    # Request validation (1 line) ⚠️
│   │   ├── errorHandler.js  # Error handling (1 line) ⚠️
│   │   ├── rateLimiter.js  # Rate limiting (1 line) ⚠️
│   │   ├── cors.js         # CORS configuration (1 line) ⚠️
│   │   └── logger.js       # Request logging (1 line) ⚠️
│   │
│   ├── validators/      # Input validation schemas (placeholders)
│   │   ├── learningValidator.js  # Learning validation (1 line) ⚠️
│   │   └── questionValidator.js  # Question validation (1 line) ⚠️
│   │
│   ├── utils/          # Utility functions (placeholders)
│   │   ├── helpers.js      # Helper functions (1 line) ⚠️
│   │   ├── constants.js    # Application constants (1 line) ⚠️
│   │   ├── responseFormatter.js # Response formatting (1 line) ⚠️
│   │   └── httpClient.js   # HTTP client utilities (1 line) ⚠️
│   │
│   └── database/       # Database related files
│       ├── connection.js   # Database connection (1 line) ⚠️
│       ├── migrations/     # Database migrations (placeholder)
│       └── seeders/        # Database seeders (placeholder)
│
├── views/             # Modular Frontend Architecture ✅
│   ├── layouts/      # Layout templates
│   │   └── main.hbs  # Main layout (not used - static HTML)
│   │
│   ├── pages/        # Main page templates
│   │   ├── index.html    # Landing page ✅
│   │   ├── topics.html   # Topics selection page ✅
│   │   ├── subtopics.html # Subtopics page ✅
│   │   └── learning.html # Learning interface ✅
│   │
│   ├── partials/     # Reusable HTML partials
│   │   ├── header.html   # Common header
│   │   ├── footer.html   # Common footer
│   │   ├── sidebar.html  # Learning sidebar
│   │   └── chatbot.html  # Chatbot interface
│   │
│   ├── components/   # Reusable UI components
│   │   ├── goal-item.html     # Goal progress item
│   │   └── question-card.html # Question card component
│   │
│   ├── css/         # Modular stylesheets ✅
│   │   ├── main.css        # Base styles and common elements
│   │   ├── components.css  # Reusable component styles
│   │   ├── learning.css    # Learning interface styles
│   │   └── responsive.css  # Responsive design styles
│   │
│   ├── js/          # Modular JavaScript files ✅
│   │   ├── main.js         # Common functionality and theme toggle (450 lines)
│   │   ├── learning.js     # Learning interface functionality (388 lines)
│   │   ├── chatbot.js      # Chatbot functionality (105 lines)
│   │   ├── api-client.js   # API request handling (73 lines)
│   │   ├── data-service.js # Data management (153 lines)
│   │   ├── topics.js       # Topics page functionality (263 lines)
│   │   ├── subtopics.js    # Subtopics page functionality (559 lines)
│   │   ├── utils.js        # Utility functions (117 lines)
│   │   └── progress-loader.js # Progress loading utilities
│   │
│   ├── images/      # Static images
│   │   ├── icons/   # Icon files
│   │   ├── logos/   # Logo files
│   │   └── favicon.ico
│   │
│   └── fonts/       # Font files
│
├── docs/              # Documentation ✅
│   ├── USER_PROGRESS_API.md # Complete user progress API documentation (297 lines)
│   └── ROUTES_CLEANUP_SUMMARY.md # API cleanup documentation (130 lines)
│
├── sample_data/       # Sample data files ✅
│   ├── topics.json          # Complete topic/subtopic/goal structure with content (378 lines)
│   ├── current_status.json  # User progress tracking data (24 lines)
│   ├── meta_data.json       # Legacy chapter metadata (113 lines)
│   ├── questions.json       # Question database with exam sources (1408 lines)
│   ├── api_responses/       # Sample API response files
│   ├── project_overview.txt # Project overview documentation
│   ├── project_workflow.jpeg # Visual workflow diagram
│   └── chapters.json        # Legacy chapter data
│
├── without_node/     # Backup/alternative implementation (full duplicate structure)
│
├── .gitignore       # Git ignore file ✅
├── package.json     # Complete package configuration with dependencies and scripts (44 lines) ✅
├── app.js          # Main Express application setup with middleware, routes, and server configuration (86 lines) ✅
├── server.js       # Server startup script with port configuration and error handling (31 lines) ✅
├── flatten.js      # Comprehensive zip creation utility for flattening design files (183 lines) ✅
└── flattened_design_mapping.txt  # File mapping for flattened zip structure ✅
```

## Key Features

- **Topic-Based Learning Architecture**: Organized around Physics topics with subtopics and learning goals
- **Real-Time Progress Tracking**: Goal-based progress system with completion percentages
- **Interactive Learning Interface**: Dynamic content delivery with goal navigation
- **Modular Frontend Architecture**: Clean separation of concerns with organized CSS, JavaScript, and HTML files
- **Comprehensive API System**: RESTful APIs for content, progress, and learning management
- **Responsive Design**: Mobile-first design that works on all devices
- **Developer Tools**: Developer mode for testing and QA workflows
- **Scalable Architecture**: Modular and maintainable codebase

## Data Architecture

The application uses a **topic-based learning structure** powered by JSON data files:

### Primary Data Source: `topics.json`
- **Structure**: Subjects → Topics → Subtopics → Goals
- **Content**: Physics Energy topic with 12 subtopics and 46 learning goals
- **Goal Content**: Each goal includes description and detailed learning content
- **Hierarchical**: Supports multiple subjects and topics (expandable)

### Progress Tracking: `current_status.json`
- **User State**: Current position (topic, subtopic, goal)
- **Completion Data**: Array of completed goal IDs
- **Real-time Updates**: Progress saved after each goal completion

### Question Database: `questions.json`
- **Exam Questions**: 63 GCSE Physics questions with official sources
- **Structured Answers**: Both raw text and HTML formatted answers
- **Keyword Tagging**: Searchable keywords for each question
- **Subtopic Mapping**: Questions organized by subtopic ID

## Frontend Architecture

The frontend is built with a modular approach:

### CSS Architecture
- **main.css**: Base styles, reset, utility classes, and common elements
- **components.css**: Reusable component styles (buttons, cards, etc.)
- **learning.css**: Learning interface specific styles
- **responsive.css**: Mobile-responsive design styles

### JavaScript Architecture
- **main.js**: Theme toggle, common utilities, and base functionality
- **learning.js**: Learning interface with goal navigation and progress tracking
- **topics.js**: Topic selection and navigation
- **subtopics.js**: Subtopic display with progress indicators and developer mode
- **api-client.js**: Centralized API request handling
- **chatbot.js**: Interactive chat functionality
- **utils.js**: Helper functions and utilities

### HTML Structure
- **Static HTML Pages**: No template engine dependency - pure HTML/CSS/JS
- **Modular Components**: Reusable HTML components for consistency
- **Responsive Layout**: Grid-based layout that adapts to different screen sizes

## API Documentation

### **Complete API Reference (9 Active Endpoints)**

Base URL: `http://localhost:3000/api`

**Quick Chat API Overview:**
- **POST /api/chat** - Send message to AI chatbot (requires: question, content, sub_topic)

---

## 🏥 Health Check APIs

### 1. General Health Check
**Endpoint:** `GET /api/health`  
**Description:** Verifies API server status  
**Authentication:** None required

#### Request
```bash
curl -X GET http://localhost:3000/api/health
```

#### Response
```json
{
  "status": "success",
  "message": "API is healthy",
  "timestamp": "2024-01-25T10:30:00.000Z",
  "uptime": "2h 15m 30s"
}
```

### 2. User Progress API Health Check
**Endpoint:** `GET /api/user-progress/health`  
**Description:** Verifies user progress service status  
**Authentication:** None required

#### Request
```bash
curl -X GET http://localhost:3000/api/user-progress/health
```

#### Response
```json
{
  "status": "success",
  "message": "User Progress API is healthy",
  "data": {
    "service": "User Progress API",
    "timestamp": "2024-01-25T10:30:00.000Z",
    "metadata_loaded": true,
    "data_source": "sample_data/topics.json"
  }
}
```

---

## 🤖 Chat API

### 3. Chat with AI Assistant
**Endpoint:** `POST /api/chat`  
**Description:** Send message to AI chatbot with learning context  
**External Dependency:** Requires CHATBOT_API_URL environment variable

#### Request
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is kinetic energy?",
    "content": "Energy stores and systems learning content...",
    "sub_topic": "Energy Stores and Systems"
  }'
```

#### Request Body
```json
{
  "question": "What is kinetic energy?",
  "content": "Energy stores and systems learning content...",
  "sub_topic": "Energy Stores and Systems"
}
```

#### Response
```json
{
  "status": "success",
  "message": "Answer generated successfully",
  "data": {
    "answer": "<p>Kinetic energy is the energy an object has due to its motion...</p>"
  }
}
```

#### Error Response
```json
{
  "status": "error",
  "message": "question is required"
}
```

---

## 📚 Content APIs

### 4. Get All Topics
**Endpoint:** `GET /api/content/topics`  
**Description:** Retrieves all available topics with metadata  
**Query Parameters:** 
- `subject` (optional): Filter by subject (default: "physics")

#### Request
```bash
curl -X GET "http://localhost:3000/api/content/topics?subject=physics"
```

#### Response
```json
{
  "success": true,
  "subject": "Physics",
  "topics": [
    {
      "id": 1,
      "title": "Energy",
      "description": "Complete coverage of energy concepts for GCSE Physics",
      "subtopic_count": 12,
      "total_goals": 46,
      "difficulty": "Foundation",
      "estimated_duration": "8-12 hours"
    }
  ],
  "metadata": {
    "total_topics": 1,
    "total_subtopics": 12,
    "total_goals": 46
  }
}
```

### 4. Get Subtopics for Topic
**Endpoint:** `GET /api/content/topics/:topicId/subtopics`  
**Description:** Gets all subtopics for a specific topic  
**Path Parameters:**
- `topicId`: ID of the topic (e.g., 1)
**Query Parameters:**
- `subject` (optional): Subject name (default: "physics")

#### Request
```bash
curl -X GET "http://localhost:3000/api/content/topics/1/subtopics?subject=physics"
```

#### Response
```json
{
  "success": true,
  "subject": "Physics",
  "topic": {
    "id": 1,
    "title": "Energy",
    "description": "Complete coverage of energy concepts for GCSE Physics"
  },
  "subtopics": [
    {
      "id": 1,
      "name": "Energy Stores and Systems",
      "order": 1,
      "goals": [
        {
          "id": 1,
          "order": 1,
          "description": "State the Law of Conservation of Energy.",
          "content": "The Law of Conservation of Energy states that energy cannot be created or destroyed, only transferred, stored, or dissipated. The total energy in a closed system remains constant."
        },
        {
          "id": 2,
          "order": 2,
          "description": "Identify and define the 8 main types of energy stores.",
          "content": "The 8 energy stores and their definitions:\n1. Thermal energy – energy stored due to the temperature of an object..."
        }
      ]
    }
  ]
}
```

### 5. Get Goals for Subtopic
**Endpoint:** `GET /api/content/topics/:topicId/subtopics/:subtopicId/goals`  
**Description:** Gets detailed goals for a specific subtopic  
**Path Parameters:**
- `topicId`: ID of the topic
- `subtopicId`: ID of the subtopic
**Query Parameters:**
- `subject` (optional): Subject name (default: "physics")

#### Request
```bash
curl -X GET "http://localhost:3000/api/content/topics/1/subtopics/1/goals?subject=physics"
```

#### Response
```json
{
  "success": true,
  "subject": {
    "name": "Physics",
    "topic": {
      "id": 1,
      "title": "Energy",
      "subtopic": {
        "id": 1,
        "title": "Energy Stores and Systems",
        "goals": [
          {
            "id": 1,
            "order": 1,
            "description": "State the Law of Conservation of Energy."
          },
          {
            "id": 2,
            "order": 2,
            "description": "Identify and define the 8 main types of energy stores."
          },
          {
            "id": 3,
            "order": 3,
            "description": "Describe the 4 ways energy can be transferred."
          },
          {
            "id": 4,
            "order": 4,
            "description": "Show how energy transfers in real-life systems."
          }
        ]
      }
    }
  }
}
```

### 6. Get Content Statistics
**Endpoint:** `GET /api/content/stats`  
**Description:** Gets overall content statistics for a subject  
**Query Parameters:**
- `subject` (optional): Subject name (default: "physics")

#### Request
```bash
curl -X GET "http://localhost:3000/api/content/stats?subject=physics"
```

#### Response
```json
{
  "success": true,
  "subject": "Physics",
  "stats": {
    "topics": 1,
    "subtopics": 12,
    "goals": 46,
    "questions": 73
  }
}
```

### 7. Get Questions for Subtopic
**Endpoint:** `GET /api/content/subtopics/:subtopicId/questions`  
**Description:** Gets all questions for a specific subtopic  
**Path Parameters:**
- `subtopicId`: ID of the subtopic

#### Request
```bash
curl -X GET "http://localhost:3000/api/content/subtopics/1/questions"
```

#### Response
```json
{
  "success": true,
  "subtopic_id": 1,
  "questions": [
    {
      "id": 1,
      "text": "What is kinetic energy?",
      "type": "short_answer",
      "difficulty": "easy",
      "order": 1
    },
    {
      "id": 2,
      "text": "List the 8 main energy stores",
      "type": "list",
      "difficulty": "medium",
      "order": 2
    }
  ]
}
```

### 8. Get Goal by ID ✅ **FULLY IMPLEMENTED**
**Endpoint:** `GET /api/content/goals/:goalId`  
**Description:** Gets a specific goal with full context information  
**Path Parameters:**
- `goalId`: ID of the goal (must be numeric)
**Query Parameters:**
- `subject` (optional): Subject name (default: "physics")

#### Request
```bash
curl -X GET "http://localhost:3000/api/content/goals/44?subject=physics"
```

#### Response Format
```json
{
  "success": true,
  "data": {
    "subject": {
      "name": "Physics"
    },
    "topic": {
      "id": 1,
      "title": "Energy"
    },
    "subtopic": {
      "id": 12,
      "name": "Trends in Energy Resource Use"
    },
    "goal": {
      "id": 44,
      "order": 2,
      "description": "Explain why renewable energy use is growing.",
      "content": "Rise in Renewables:1.Fossil fuels are polluting and non-renewable, so there's growing interest in cleaner, sustainable energy sources. 2. Governments set environmental targets, pushing energy companies to invest in renewables. 3. Electric and hybrid cars are becoming more popular, reducing reliance on fossil fuels."
    }
  }
}
```

#### Error Responses

**Invalid Goal ID (400):**
```json
{
  "success": false,
  "message": "Invalid goal ID: abc. Goal ID must be a number."
}
```

**Goal Not Found (404):**
```json
{
  "success": false,
  "message": "Goal with ID 999 not found in subject physics"
}
```

**Subject Not Found (404):**
```json
{
  "success": false,
  "message": "Subject chemistry not found"
}
```

---

## 📊 User Progress APIs

### 6. Get User Progress
**Endpoint:** `GET /api/user-progress`  
**Description:** Retrieves current user progress with detailed breakdown  
**Authentication:** None required (uses default user)

#### Request
```bash
curl -X GET http://localhost:3000/api/user-progress
```

#### Response
```json
{
  "status": "success",
  "message": "User progress retrieved successfully",
  "data": {
    "user_id": "user_001",
    "user_name": "John Doe",
    "overall_progress": {
      "topic_title": "Energy",
      "completed_goals": 1,
      "total_goals": 46,
      "progress_percentage": 2
    },
    "subtopic_progress": [
      {
        "subtopic_id": 1,
        "subtopic_name": "Energy Stores and Systems",
        "status": "current",
        "completed_goals": 1,
        "total_goals": 4,
        "progress_percentage": 25
      },
      {
        "subtopic_id": 2,
        "subtopic_name": "Kinetic and Potential Energy Stores",
        "status": "pending",
        "completed_goals": 0,
        "total_goals": 4,
        "progress_percentage": 0
      }
    ],
    "current_session": {
      "subject": "physics",
      "topic_id": 1,
      "subtopic_id": 1,
      "goal_id": 2
    }
  }
}
```

### 7. Complete Goal (Update Progress)
**Endpoint:** `PUT /api/user-progress/goal/:goalId`  
**Description:** Marks a specific goal as completed and updates user progress  
**Path Parameters:**
- `goalId`: ID of the goal to complete (e.g., 2)

#### Request
```bash
curl -X PUT http://localhost:3000/api/user-progress/goal/2
```

#### Response
```json
{
  "status": "success",
  "message": "Goal 2 completed successfully! Progress updated.",
  "data": {
    "completed_goal": {
      "goal_id": 2,
      "description": "Identify and define the 8 main types of energy stores.",
      "completed_at": "2025-01-25T10:30:00.000Z"
    },
    "updated_progress": {
      "overall_progress": {
        "completed_goals": 2,
        "total_goals": 46,
        "progress_percentage": 4
      },
      "current_subtopic": {
        "subtopic_id": 1,
        "subtopic_name": "Energy Stores and Systems",
        "completed_goals": 2,
        "total_goals": 4,
        "progress_percentage": 50,
        "status": "current"
      },
      "next_goal": {
        "goal_id": 3,
        "description": "Describe the 4 ways energy can be transferred."
      }
    }
  }
}
```

### 8. Reset Progress
**Endpoint:** `POST /api/user-progress/reset`  
**Description:** Resets all user progress to beginning (for testing)  
**Authentication:** None required

#### Request
```bash
curl -X POST http://localhost:3000/api/user-progress/reset
```

#### Response
```json
{
  "status": "success",
  "message": "Progress reset successfully. User is now at the beginning.",
  "data": {
    "user_id": "user_001",
    "reset_timestamp": "2025-01-25T10:30:00.000Z",
    "current_session": {
      "subject": "physics",
      "topic_id": 1,
      "subtopic_id": 1,
      "goal_id": 1
    },
    "progress": {
      "completed_goals": [],
      "total_goals": 46,
      "progress_percentage": 0
    }
  }
}
```

---

## 🤖 Learning APIs (Legacy)

### 9. Chat with AI Assistant
**Endpoint:** `POST /api/chat`  
**Description:** Send message to AI chatbot (basic placeholder implementation - returns simple responses)  
**Content-Type:** `application/json`

#### Request
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is energy conservation?"
  }'
```

#### Request Body
```json
{
  "message": "What is energy conservation?"
}
```

#### Response
```json
{
  "message": "Thank you for your message: \"What is energy conservation?\". This is a placeholder response.",
  "timestamp": "2025-01-25T10:30:00.000Z"
}
```

### 10. Submit Answer for Evaluation
**Endpoint:** `POST /api/submit-answer`  
**Description:** Submit and evaluate user answers (simple keyword matching implementation)  
**Content-Type:** `application/json`

#### Request
```bash
curl -X POST http://localhost:3000/api/submit-answer \
  -H "Content-Type: application/json" \
  -d '{
    "question_id": 1,
    "answer": "Energy cannot be created or destroyed, only transferred or transformed from one form to another."
  }'
```

#### Request Body
```json
{
  "question_id": 1,
  "answer": "Energy cannot be created or destroyed, only transferred or transformed from one form to another."
}
```

#### Response
```json
{
  "correct": true,
  "feedback": "Great! Machine learning is indeed a subset of artificial intelligence."
}
```

---

## 🛠️ API Integration Examples

### JavaScript (Frontend)
```javascript
// Get user progress
const getUserProgress = async () => {
  try {
    const response = await fetch('/api/user-progress');
    const data = await response.json();
    console.log('User Progress:', data.data);
    return data;
  } catch (error) {
    console.error('Error fetching progress:', error);
  }
};

// Complete a goal
const completeGoal = async (goalId) => {
  try {
    const response = await fetch(`/api/user-progress/goal/${goalId}`, {
      method: 'PUT'
    });
    const data = await response.json();
    console.log('Goal completed:', data.data);
    return data;
  } catch (error) {
    console.error('Error completing goal:', error);
  }
};

// Get topics
const getTopics = async () => {
  try {
    const response = await fetch('/api/content/topics');
    const data = await response.json();
    console.log('Topics:', data.topics);
    return data;
  } catch (error) {
    console.error('Error fetching topics:', error);
  }
};
```

### Python
```python
import requests
import json

base_url = "http://localhost:3000/api"

# Get user progress
def get_user_progress():
    response = requests.get(f"{base_url}/user-progress")
    return response.json()

# Complete a goal
def complete_goal(goal_id):
    response = requests.put(f"{base_url}/user-progress/goal/{goal_id}")
    return response.json()

# Chat with AI
def chat_with_ai(message):
    payload = {"message": message}
    response = requests.post(f"{base_url}/chat", json=payload)
    return response.json()

# Example usage
progress = get_user_progress()
print(f"User progress: {progress['data']['overall_progress']['progress_percentage']}%")

result = complete_goal(2)
print(f"Goal completed: {result['data']['completed_goal']['description']}")
```

---

## 📋 Response Status Codes

| Status Code | Description | Example |
|-------------|-------------|---------|
| `200` | Success | Data retrieved/updated successfully |
| `201` | Created | Progress updated/goal completed |
| `400` | Bad Request | Invalid goal ID or missing parameters |
| `404` | Not Found | Topic/subtopic not found |
| `500` | Server Error | Internal server error |

---

## 🔧 Error Handling

### Standard Error Response Format
```json
{
  "status": "error",
  "message": "Descriptive error message",
  "error_code": "INVALID_GOAL_ID",
  "details": {
    "provided_id": "999",
    "valid_range": "1-46"
  },
  "timestamp": "2025-01-25T10:30:00.000Z"
}
```

### Common Error Scenarios

#### Invalid Goal ID
```json
{
  "status": "error",
  "message": "Goal ID 999 not found",
  "error_code": "GOAL_NOT_FOUND",
  "details": {
    "goal_id": 999,
    "valid_range": "1-46"
  }
}
```

#### Missing Request Body
```json
{
  "status": "error",
  "message": "Message is required",
  "error_code": "MISSING_MESSAGE",
  "details": {
    "required_fields": ["message"]
  }
}
```

---

## 📊 Data Sources & Architecture

### **Primary Data Files**
- **Learning Content**: `sample_data/topics.json` (378 lines)
- **User Progress**: `sample_data/current_status.json` (24 lines)  
- **Questions**: `sample_data/questions.json` (1408 lines)
- **Legacy Metadata**: `sample_data/meta_data.json` (113 lines)

### **API Characteristics**
- **File-based**: No database dependency for development
- **Topic-Centric**: Built around the topics.json hierarchical structure
- **Real-time Progress**: Progress calculated and saved on-the-fly
- **RESTful Design**: Consistent HTTP methods and response formats
- **Hierarchical Content**: Supports nested subject/topic/subtopic/goal structure
- **Cross-Origin Ready**: CORS enabled for frontend integration

## Application Flow

### **Learning Journey**
```
Homepage → Topics (Physics) → Subtopics (Energy) → Learning Interface (Goals)
```

### **Navigation Pattern**
1. **Topics Page**: Select "Energy" topic from Physics
2. **Subtopics Page**: View 12 energy subtopics with progress indicators
3. **Learning Interface**: Study goals within selected subtopic
4. **Progress Tracking**: Complete goals and advance through content

### **URL Structure**
- Topics: `/topics`
- Subtopics: `/subtopics?topic=1&subject=physics`
- Learning: `/learning?topic=1&subtopic=1&subject=physics`

## Environment Variables

Create a `.env` file in the root directory:

```bash
# Chat API Configuration
CHATBOT_API_URL=http://127.0.0.1:5000/ilm-chatbot

# Optional configurations
PORT=3000
NODE_ENV=development
CORS_ORIGIN=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Required for Chat API:**
- `CHATBOT_API_URL`: URL to external Python chatbot service

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ILM_brain_prototype
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or for development with auto-restart
   npm run dev
   ```

4. **Access the application**
   - Main Page: `http://localhost:3000/`
   - Topics Page: `http://localhost:3000/topics`
   - API Health Check: `http://localhost:3000/api/health`

## Developer Features

### **Developer Mode** ✅ 
**FULLY FUNCTIONAL** - For testing and QA workflows, access the subtopics page with developer mode:

```
http://localhost:3000/subtopics?topic=1&subject=physics&dev
```

**Developer Mode Features** (All Working):
- **✅ Unlock All Content**: Access any subtopic regardless of progress
- **✅ Visual Indicator**: Orange border and "🔧 DEV MODE" title prefix  
- **✅ Testing Workflow**: Test specific content without completing prerequisites
- **✅ Quality Assurance**: Validate all subtopic content and functionality

## Current Implementation Status

### **Files with Functional Code (Ready for Use)**

#### **Core Application** (4 files)
- **`app.js`** - Express application setup with routing (86 lines)
- **`server.js`** - Server startup and configuration (31 lines)
- **`package.json`** - Dependencies and scripts (44 lines)
- **`flatten.js`** - File management utility (183 lines)

#### **API Layer** (8 files)
- **`routes/index.js`** - Route mounting (21 lines)
- **`routes/user-progress.js`** - Progress API routes (32 lines)
- **`routes/content-fetch.js`** - Content API routes (12 lines)
- **`routes/learning.js`** - Learning API routes (73 lines)
- **`controllers/userProgressController.js`** - Progress handling (149 lines)
- **`controllers/contentFetchController.js`** - Content handling (180 lines)
- **`services/learningService.js`** - Learning management and orchestration (placeholder)
- **`services/contentService.js`** - Content management service (348 lines)
- **`services/userProgressService.js`** - Progress business logic (221 lines)
- **`models/UserProgress.js`** - Progress data model (126 lines)

#### **Frontend** (Complete Implementation)
- **All files in `views/` directory** are fully functional
- **8 JavaScript modules** with complete functionality
- **4 CSS files** with comprehensive styling
- **4 HTML pages** with complete user interface

#### **Data Files** (4 primary files)
- **`sample_data/topics.json`** - Main content structure (378 lines)
- **`sample_data/current_status.json`** - User progress (24 lines)
- **`sample_data/questions.json`** - Question database (1408 lines)
- **`sample_data/meta_data.json`** - Legacy metadata (113 lines)

### **Placeholder Files** (Future Development)
- **Services**: Only essential services remain: `learningService.js` (placeholder), `contentService.js`, `userProgressService.js`
- **Models**: `Chapter.js`, `Subtopic.js`, `Goal.js`, `Question.js`, `LearningSession.js`, `Answer.js`
- **Middleware**: `validation.js`, `errorHandler.js`, `rateLimiter.js`, `logger.js` (Note: `cors.js` has basic comment)
- **Utils**: `httpClient.js`, `responseFormatter.js`, `constants.js`, `helpers.js`
- **Config**: `environment.js`, `llm.js`, `index.js` (Note: `database.js` is empty)

### **Summary**
- **✅ 20+ backend files** with functional code
- **✅ Complete frontend** implementation (100% working)
- **✅ 9 active APIs** with full functionality (including Chat API)
- **✅ Topic-based learning system** with goal tracking
- **✅ Real-time progress tracking** with file-based persistence
- **✅ Chat API integration** with external Python chatbot
- **✅ Developer mode** fully functional for testing
- **🚀 Production-ready** core functionality  
- **📝 25+ placeholder files** for future enhancement

## Testing

### **API Testing**
```bash
# Test user progress
curl http://localhost:3000/api/user-progress

# Test content APIs
curl http://localhost:3000/api/content/topics
curl http://localhost:3000/api/content/topics/1/subtopics
curl http://localhost:3000/api/content/topics/1/subtopics/1/goals
curl http://localhost:3000/api/content/stats
curl http://localhost:3000/api/content/subtopics/1/questions
curl http://localhost:3000/api/content/goals/1

# Update progress
curl -X PUT http://localhost:3000/api/user-progress/goal/1
```

### **Frontend Testing**
- Navigate through Topics → Subtopics → Learning workflow
- Test progress tracking and goal completion
- Verify responsive design on different screen sizes
- Test developer mode functionality

## Contributing

1. Follow the modular architecture when adding new features
2. Keep CSS, JavaScript, and HTML files organized in their respective directories
3. Test on multiple screen sizes for responsive design
4. Ensure API endpoints are properly documented
5. Use the topic-based data structure for new content

## Future Enhancements

- **Database Integration**: Replace file-based storage with MongoDB/PostgreSQL
- **User Authentication**: Add user accounts and personalized progress
- **Advanced LLM Integration**: Upgrade from placeholder to sophisticated AI tutoring features
- **Enhanced Chat System**: Implement full conversational AI (currently basic placeholder)
- **Advanced Answer Evaluation**: Upgrade from simple keyword matching to AI-powered assessment
- **Real-time Collaboration**: Add multi-user learning features
- **Content Management**: Add admin interface for content management

## License

ISC License

## Contact

Created by Raiyan Ashraf 