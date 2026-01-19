# WikiSnap

<p align="center">
  <strong>Instantly summarize any Wikipedia article with AI-powered intelligence</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#demo">Demo</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#license">License</a>
</p>

---

## ✨ Features

- 🚀 **Instant Summarization** - Get concise summaries of any Wikipedia article in seconds
- 📏 **Adjustable Length** - Choose between Short, Medium, or Long summaries
- 📋 **Easy Export** - Copy to clipboard, download as PDF or DOCX
- 📚 **Source References** - View and copy original source citations
- 🎨 **Clean UI** - Modern, minimal interface with responsive design
- ⚡ **Fast & Lightweight** - Built with Vite for optimal performance

## 🖥️ Demo

1. Paste any Wikipedia URL (e.g., `https://en.wikipedia.org/wiki/Artificial_intelligence`)
2. Select your preferred summary length
3. Click **Summarize** and get your AI-generated summary
4. Export as PDF, DOCX, or copy to clipboard

## 🛠️ Installation

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ or [Bun](https://bun.sh/)
- [Groq API Key](https://console.groq.com/) for AI summarization

### Setup

1. **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/wikipedia-extractor.git
    cd wikipedia-extractor
    ```

2. **Install dependencies**

    ```bash
    bun install
    # or
    npm install
    ```

3. **Configure environment variables**

    Create a `.env` file in the root directory:

    ```env
    VITE_GROQ_API_KEY=your_groq_api_key_here
    ```

4. **Start the development server**

    ```bash
    bun run dev
    # or
    npm run dev
    ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## 📦 Build for Production

```bash
bun run build
# or
npm run build
```

The production-ready files will be in the `dist/` directory.

## 🔧 Tech Stack

| Category          | Technology           |
| ----------------- | -------------------- |
| **Framework**     | React 19             |
| **Language**      | TypeScript           |
| **Build Tool**    | Vite                 |
| **Styling**       | Tailwind CSS 4       |
| **Animations**    | Framer Motion        |
| **Icons**         | Lucide React         |
| **UI Components** | Radix UI (shadcn/ui) |
| **AI Backend**    | Groq (Llama-3 70b)   |
| **PDF Export**    | jsPDF                |
| **DOCX Export**   | docx.js              |

## 📁 Project Structure

```
src/
├── components/
│   ├── Layout.tsx              # Main layout wrapper
│   ├── ui/                     # Reusable UI components
│   └── wiki-extractor/
│       ├── InputSection.tsx    # URL input and controls
│       ├── SummaryDisplay.tsx  # Summary card with actions
│       └── ReferenceList.tsx   # Source references list
├── services/
│   ├── wikipedia.ts            # Wikipedia content extraction
│   └── groq.ts                 # Groq AI summarization
├── App.tsx                     # Main application
├── main.tsx                    # Entry point
└── index.css                   # Global styles
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ using React & Groq AI
</p>
