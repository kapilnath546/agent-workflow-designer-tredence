# 🛠️ HR Workflow Designer
### *Building a better experience for the people who manage people.*

## ✨ The Vision
HR administrators are often buried under complex, manual processes—onboarding, leave approvals, and document verifications can feel like a tangled web. **HR Workflow Designer** was built to turn that complexity into a visual story. 

I wanted to create a tool that feels less like a database and more like a creative canvas. Whether it's a simple three-step approval or a multi-stage automated onboarding flow, this designer makes the process intuitive, transparent, and—dare I say—enjoyable.

---

## 🎨 Design Philosophy
Every pixel in this prototype was chosen with a "Design First" mindset:
- **Zen-like Clarity:** I moved away from busy, distracting backgrounds to a clean, subtle grid system that keeps the focus where it belongs: on the workflow.
- **Adaptive Aesthetics:** Everyone works differently. Whether you prefer a crisp, professional **Light Mode** or a focused, sleek **Dark Mode**, the interface adapts to your style with a single click.
- **Snappy Feedback:** I believe a tool should feel alive. When you drag a node, connect an edge, or trigger a simulation, the UI responds instantly with smooth transitions and real-time validation.

---

## 🚀 The Craftsmanship (Tech Stack)
To make this vision a reality, I picked a stack that prioritizes performance and reliability:
- **React & Vite:** For a development experience that's as fast as the final app.
- **Zustand:** I chose Zustand for state management because it's incredibly lightweight and keeps the entire workflow "brain" in sync without the boilerplate of Redux.
- **React Flow:** The backbone of the interactive canvas, customized with specialized node types for HR specific needs.
- **MSW (Mock Service Worker):** I didn't want to just mock data; I wanted to mock the *network*. This lets the app behave exactly like it's talking to a real production backend.
- **TypeScript:** Strict typing ensures that the logic behind the scenes is as solid as the UI on the front.

---

## 🌟 Features I've Poured Into This
- **Drag-and-Drop Palette:** Easily bring your ideas to life by dragging Task, Approval, or Automated nodes onto the canvas.
- **Smart Configuration:** Every node has its own tailored form. No generic fields—just what you need for that specific step.
- **One-Click Simulation:** Don't just build it—run it. The built-in simulator traces the path, checks for bottlenecks, and provides a live execution log.
- **Time Travel (Undo/Redo):** Made a mistake? No problem. Use `Ctrl+Z` to step back in time or `Ctrl+Y` to move forward.
- **Structural Integrity:** The app automatically catches logic cycles or "orphan" nodes, acting as a guardrail for your workflow design.

---

## 🛠️ How to work with It

1. **Get the pieces:** `npm install`
2. **Start the engine:** `npm run dev`
3. **Test the logic:** `npm run test`
4. **Build for real:** `npm run build`

---

## 🔮 What's on the Horizon
If I had a few more weeks, I'd love to add:
- **Real-time Collaboration:** Multiple HR admins designing the same workflow together using CRDTs.
- **Conditional Logic:** Advanced branching (e.g., "If salary > $100k, require Director approval").
- **Auto-Layout Magic:** One button to perfectly organize even the messiest "spaghetti" graphs.

---

## 💡 Assumptions & Considerations
- **Desktop First:** This is a professional tool designed for the precision of a mouse and large screen.
- **Dynamic Variable Injection:** While the current mock is static, the architecture is ready to support dynamic data like `{{candidate_name}}`.


