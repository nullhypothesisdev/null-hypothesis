# The Null Hypothesis (NØH)

**Reject the default.**
*The Null Hypothesis* is a rigorous data science platform designed for those who demand precision over platitudes. It combines interactive research ("Studies"), computational tools ("The Lab"), and structured learning ("Academy") into a unified architecture of insight.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)
![Supabase](https://img.shields.io/badge/Supabase-Database-green)

---

## 🏛 Architecture

The platform is built on a modern, high-performance stack designed for interactivity and content rigour.

### Core Stack
*   **Framework:** [Next.js 16 (App Router)](https://nextjs.org/) - Utilizing the latest React Server Components and Server Actions.
*   **Language:** [TypeScript](https://typescriptlang.org/) - Strict type safety across the entire codebase.
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) - With a custom "Paper & Ink" design system (`bg-paper`, `text-ink`) inspired by academic journals.
*   **Database:** [Supabase](https://supabase.com/) - PostgreSQL for data persistence, auth, and real-time features.
*   **Motion:** [Framer Motion](https://www.framer.com/motion/) - Fluid, physics-based animations.

### Key Features

#### 1. 🔬 The Lab (Interactive Computing)
A browser-based computational environment for statistical analysis.
*   **Python Playground:** Execute Python code directly in the browser (via Pyodide) with data visualization support.
*   **Estimation Tools:** Fermi problem solvers and probabilistic calculators.
*   **AI Analysis:** Integrated OpenAI/Gemini support for code explanation and data interpretation.

#### 2. 📑 Case Files (Studies)
Interactive data journalism and deep-dive research articles.
*   **Rich Text:** Built with [Tiptap](https://tiptap.dev/) for a notion-like editing experience.
*   **Math Support:** Full $\LaTeX$ rendering via KaTeX.
*   **Dynamic Graphs:** Interactive charts using [Recharts](https://recharts.org/).

#### 3. 🎓 The Academy
Structured courses and curriculum for data science education.
*   Progress tracking.
*   Interactive quizzes and code challenges.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js 18+
*   npm

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/nullhypothesisdev/null-hypothesis.git
    cd null-hypothesis
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file with your Supabase and AI credentials:
    ```bash
    NEXT_PUBLIC_SUPABASE_URL=your_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
    OPENAI_API_KEY=your_key
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the platform.

---

## 🎨 Design System

The visual identity is based on the concept of **"Calculated Uncertainty"**.
*   **Typography:** `EB Garamond` (Body) mixed with `JetBrains Mono` (Data) and `Cormorant Garamond` (Display).
*   **Palette:**
    *   `--paper-val`: `#f5f2ed` (Creamy off-white)
    *   `--ink-val`: `#1a1614` (Deep charcoal)
    *   `--accent-val`: `#d4774e` (Burnt Orange/Clay)

---

## 🤝 Contributing

We welcome rigorously justified pull requests. Please ensure all mathematical assertions are cited and all code is strictly typed.

## 📄 License

MIT © [Ezz Eldin Ahmed](https://ezzio.me)
