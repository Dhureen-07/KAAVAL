# KAAVAL – AI-Powered Public Safety & Emergency Assistance

KAAVAL is an AI-powered intelligence and public safety platform focused on enabling law enforcement officers and emergency personnel to scan documents, translate language contexts, query verified crime record databases, and generate structured First Information Reports (FIRs) in real-time.

---

## 🚀 Key Features

*   **Document OCR Scanner:** Extracts printed text from scanned incident logs and police complaint reports using the **Hugging Face TrOCR** (`microsoft/trocr-base-printed`) model.
*   **Language Translation Hub:** Translates parsed text contexts between **Kannada (ಕನ್ನಡ)** and **English** using the **Hugging Face NLLB-200** (`facebook/nllb-200-distilled-600M`) model.
*   **Central AI Assistant:** RAG-powered intelligence assistant backed by **NVIDIA Nemotron** to retrieve criminal records, cross-reference vehicles/suspects, and perform intelligence sweeps.
*   **Legal FIR Drafting Engine:** Automatically drafts highly formal legal First Information Reports (FIRs) based on officer notes or text inputs.
*   **Interactive Spatial UI:** Designed with Apple/Linear-inspired aesthetics, glassmorphic panels, and a central navigation OmniDock.

---

## 🛠️ Architecture & AI Pipeline

```
  [Scanned Documents] / [ID Cards]
             │
             ▼
      (1) OCR Scanner ───► [microsoft/trocr-base-printed]
             │
             ▼
     (2) Translation ───► [facebook/nllb-200-distilled-600M] (English ↔ Kannada)
             │
             ▼
    (3) AI Assistant ───► [NVIDIA Nemotron via OpenRouter] + [Local Crime Records RAG]
```

### Resilient Processing Fail-safe:
To ensure the application runs smoothly in offline or dev environments, both the backend and frontend include a **graceful simulation fallback mode**. If Hugging Face or OpenRouter API keys are not provided, the platform automatically switches to a local simulation mode that displays high-fidelity mock reports and database sweeps for testing.

---

## 📁 Repository Structure

*   `backend/` - Python HTTP server handling OCR, Translation, RAG queries, and FIR drafting.
    *   `backend/main.py` - Core server script routing API calls.
    *   `backend/data/` - Holds verified Karnataka State Police crime record datasets.
*   `src/app/` - Next.js routing and UI layout files.
    *   `src/app/(dashboard)/ocr-translation/page.tsx` - Document scan & translation interface.
    *   `src/app/(dashboard)/assistant/page.tsx` - Central Intelligence AI chatbot.
*   `src/components/layout/OmniDock.tsx` - Floating navigation dock component.
*   `public/images/` - Uploaded templates and assets.

---

## ⚙️ Environment Configuration

Create a `.env` file in the project root to enable live API processing:

```env
# Hugging Face API key for OCR (TrOCR) and Translation (NLLB-200)
HF_TOKEN=your_hugging_face_token

# OpenRouter API key for Central Intelligence (NVIDIA Nemotron)
OPENROUTER_API_KEY=your_openrouter_token
REASONING_MODEL=nvidia/nemotron-4-340b-instruct
```

---

## 🏁 Step-by-Step Local Setup

### Prerequisites
*   [Node.js (LTS)](https://nodejs.org) installed on your system.
*   [Python 3.10+](https://www.python.org/downloads/) installed (Make sure to select **"Add Python.exe to PATH"** during setup).

---

### Step 1: Start the Python Backend
1.  Open your terminal and navigate to the backend folder:
    ```powershell
    cd C:\Users\ASUS\Desktop\KAAVAL\backend
    ```
2.  Start the backend server:
    ```powershell
    python main.py
    ```
    *(The backend will start listening on port `8000`).*

---

### Step 2: Start the Next.js Frontend
1.  Open a **new, separate terminal window** and navigate to the project root:
    ```powershell
    cd C:\Users\ASUS\Desktop\KAAVAL
    ```
2.  Install the package dependencies:
    ```powershell
    npm.cmd install
    ```
3.  Start the Next.js development server:
    ```powershell
    npm.cmd run dev
    ```
4.  Open your browser and navigate to: **`http://localhost:3000`**

---

## 🧪 Testing the Pipeline
1.  Go to `http://localhost:3000/ocr-translation`.
2.  Click **"Load Sample Incident Report (English)"** to upload a document template.
3.  Click **"Run OCR Text Extraction"** to extract text.
4.  Click **"Translate Text Context"** to see the full document translated to Kannada.
5.  Click **"Import OCR to Assistant"** to automatically copy the text and carry it over to the Central AI Assistant search engine.
