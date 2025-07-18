# 📚 StudyCraftAI

**StudyCraftAI** is a mobile application that automatically generates educational content from user-uploaded PDF files. It’s designed to assist students, teachers, and lifelong learners in quickly creating study materials like summaries, flashcards, tests, glossaries, and presentations.

---

## 🚀 Features

- 🔐 User authentication with Firebase
- 📤 Upload and preview PDF documents
- 🤖 AI-powered generation of:
  - Summaries
  - Key terms/glossary
  - Quiz questions
  - Flashcards
  - Tests
  - Slide presentations
- 💾 Save and view generated results
- 📱 Mobile-friendly React Native UI

---

## ⚙️ Tech Stack

- **Frontend**: React Native, Expo
- **Backend**: Node.js, Express
- **AI**: OpenAI API (GPT)
- **Database & Auth**: Firebase (Firestore + Authentication + Storage)

---

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/studycraftai.git
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file inside the `server/` folder:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Run the backend server

```bash
cd server
npm start
```

### 5. Run the mobile app

```bash
cd studycraftai
npm start
```

You can run the app on Android, iOS using Expo.
