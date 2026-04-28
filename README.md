# ⚡ AI Workflow Builder — Natural Language to Automation

> Describe any workflow in plain English. AI builds and deploys it instantly.

![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3_70B-orange?style=flat-square)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-green?style=flat-square)
![React](https://img.shields.io/badge/Frontend-React.js-blue?style=flat-square)
![n8n](https://img.shields.io/badge/Automation-n8n-red?style=flat-square)

## 🎯 What It Does

Type something like:
> *"When a Google Form is submitted, save to Sheets and send a Slack message"*

The app will:
1. **Parse** your text using Groq LLaMA 3.3 70B via FastAPI
2. **Visualize** the workflow as color-coded blocks in React
3. **Auto-create** a real executable workflow inside n8n — ready to run

## 🎥 Demo
> [Watch Demo Video](https://github.com/user-attachments/assets/7166f94e-3366-407d-ae32-1b433292c752)
)

## 🛠️ Tech Stack
| Layer | Technology |
|-------|-----------|
| AI Model | Groq API — LLaMA 3.3 70B |
| Backend | Python, FastAPI |
| Frontend | React.js, Vite |
| Automation | n8n REST API |

## ⚙️ Setup

### 1. Clone
```bash
git clone https://github.com/SnehaChaursia/AI-Workflow-Builder-.git
cd AI-Workflow-Builder-
```

### 2. Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn groq python-dotenv requests
```

Create `backend/.env`:
```
GROQ_API_KEY=your_groq_key_here
N8N_API_KEY=your_n8n_key_here
N8N_URL=http://localhost:5678
```
```bash
uvicorn main:app --reload
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. n8n
```bash
npx n8n
```

Open → `http://localhost:5173`
