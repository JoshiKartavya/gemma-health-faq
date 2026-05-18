# 🩺 Gemma Health FAQ: AI Medical Assistant

![Gemma Health Thumbnail](https://via.placeholder.com/1000x400.png?text=Gemma+Health+FAQ+-+Medical+RAG)

**Gemma Health FAQ** is a lightning-fast, cloud-deployed Retrieval-Augmented Generation (RAG) assistant designed to instantly provide reliable medical answers to remote health workers and patients. 

Built as a submission for the **Google – Build with Gemma Kaggle Hackathon**, this project demonstrates how to effectively combine highly-optimized semantic search with modern web architecture to solve real-world healthcare information bottlenecks.

---

## 🌟 Key Features

*   **Instant Answers:** Delivers sub-second medical query responses globally.
*   **Verified Knowledge:** Backed by the **MedQuAD** (Medical Question Answering Dataset), encompassing 8,000+ verified medical Q&A pairs covering symptoms, causes, and treatments.
*   **Intelligent Retrieval:** Utilizes `sentence-transformers` (`all-MiniLM-L6-v2`) and a localized **ChromaDB** vector store for highly accurate, intent-aware semantic matching.
*   **Mobile-First Design:** A beautiful, accessible UI built with Next.js, Tailwind CSS, and Shadcn UI that feels like a native messaging app.
*   **Stateless Backend:** Powered by FastAPI, ensuring robust and scalable performance.

---

## 🏗️ Architecture

The system is split into two highly-optimized monorepos:

1.  **Frontend (`/frontend`)**: A Next.js App Router application hosted on **Vercel**. It provides the chat interface and handles client-side state.
2.  **Backend (`/backend`)**: A FastAPI Python server hosted on **Railway**. It manages the ChromaDB instance, embedding models, and custom ranking algorithms.

### How the RAG Pipeline Works
1.  **Query Normalization**: The user's input is scanned for medical intents (e.g., "how to stop vomiting" -> "What are treatments for dehydration?").
2.  **Vector Search**: The normalized query is embedded using `sentence-transformers` and searched against ChromaDB.
3.  **Custom Ranking**: Results are mathematically boosted based on keyword overlap and semantic distance to guarantee the highest relevance.
4.  **Response**: The top verified answer is returned to the frontend in milliseconds.

---

## 🚀 Live Demo

*   **Frontend App:** [https://gemma-health-faq.vercel.app](https://gemma-health-faq.vercel.app)
*   **Backend API:** `https://gemma-health-faq-production.up.railway.app`

---

## 💻 Local Installation

### Prerequisites
*   Node.js 18+
*   Python 3.10+

### 1. Start the Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Or .venv\Scripts\activate on Windows
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```

### 2. Start the Frontend
```bash
cd frontend
npm install

# Start the Next.js development server
npm run dev
```
Open `http://localhost:3000` to view the application!

---

## 📄 License
This project is open-sourced under the MIT License. The dataset (`MedQuAD`) falls under its respective open-source public domain licensing.
