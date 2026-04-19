# 🛠️ HR Workflow Designer
### *Building a better experience for the people who manage people.*

## 🌐 Live Demo
Don't want to spin it up locally? No problem. I have hosted a live, fully functional version of the prototype so you can test the interactions immediately: 
👉 **[Experience the HR Workflow Designer Here](https://agent-workflow-designer-tredence-zdxn-fv2w67vxk.vercel.app/)**

---

## ✨ The Vision
HR administrators are often buried under complex, manual processes. Onboarding, leave approvals, and document verifications can quickly feel like a tangled web. **HR Workflow Designer** was built to turn that administrative complexity into a visual, intuitive story. 

I wanted to create a tool that feels less like a sterile database and more like a creative canvas. Whether it's a straightforward three-step approval or a multi-stage automated onboarding flow, this designer makes the process transparent, scalable, and—dare I say—enjoyable. 

---

## 🎨 Design Philosophy
Having spent time organizing UI/UX workshops and designing interfaces, I approached this prototype with a strict "Design First" mindset:
* **Zen-like Clarity:** I moved away from busy, distracting backgrounds in favor of a clean, subtle grid system that keeps the focus exactly where it belongs: on the workflow.
* **Adaptive Aesthetics:** Everyone works differently. Whether you prefer a crisp, professional **Light Mode** or a focused, sleek **Dark Mode**, the interface adapts to your style seamlessly.
* **Snappy Feedback:** I believe a tool should feel alive. When you drag a node, connect an edge, or trigger a simulation, the UI responds instantly with smooth transitions and real-time validation.

---

## 🚀 The Craftsmanship (Tech Stack)
To make this vision a reality within a tight timeframe, I picked a stack that prioritizes performance, type safety, and reliable architecture:
* **React & Vite:** For a development experience that's as blisteringly fast as the final application.
* **Zustand:** I chose Zustand for state management because it's incredibly lightweight. It keeps the entire workflow "brain" in sync without the heavy boilerplate of Redux, ensuring the graph state remains clean and manageable.
* **React Flow:** The backbone of the interactive canvas, heavily customized with specialized, strictly-typed node components for HR-specific needs.
* **MSW (Mock Service Worker):** I didn't want to just mock data; I wanted to mock the *network*. This lets the app behave exactly like it's talking to a real production API, fulfilling the simulation requirements flawlessly.
* **TypeScript:** Strict typing ensures that the complex graph logic behind the scenes is as solid as the UI on the front.

---

## 🧪 Bulletproof Reliability (Testing)
You can’t build a "zero-to-one" product without trusting the code. I’ve included a dedicated `tests` directory to ensure the core logic holds up under pressure:
* **Component & Logic Tests:** Included in the `tests` folder are test suites designed to validate the workflow’s structural integrity. 
* **Catching the Edge Cases:** These tests ensure the app automatically catches logic cycles, orphan nodes, and validates basic constraints (like ensuring the Start Node is always first) before a user even tries to run a simulation.

---

## 🌟 Key Features
* **Drag-and-Drop Palette:** Easily bring ideas to life by dragging Task, Approval, or Automated nodes directly onto the canvas.
* **Smart Configuration:** Every node type has its own tailored, dynamic configuration form. No generic inputs—just exactly what you need for that specific step.
* **One-Click Simulation:** Don't just build it—run it. The built-in sandbox simulator traces the workflow path, checks for bottlenecks, and provides a live, step-by-step execution log.
* **Time Travel (Undo/Redo):** Made a mistake? No problem. Use standard keyboard shortcuts (`Ctrl+Z` / `Ctrl+Y`) to step effortlessly back and forward in time.

---

## 🛠️ Getting Started

1.  **Get the pieces:** `npm install`
2.  **Start the engine:** `npm run dev`
3.  **Test the logic:** `npm run test`
4.  **Build for production:** `npm run build`

---

## 🔮 What's on the Horizon
Given the time-boxed nature of this sprint, I focused heavily on core functionality and architecture. If I had a few more weeks to push this further, I'd love to add:
* **Real-time Collaboration:** Multiple HR admins designing the same workflow together concurrently.
* **Conditional Logic Branching:** Advanced edge routing (e.g., "If salary > $100k, route to Director approval").
* **Auto-Layout Magic:** A single button click to perfectly organize and untangle even the messiest "spaghetti" graphs.

---

## 💡 Assumptions & Considerations
* **Desktop First:** This is a professional-grade administrative tool designed for the precision of a mouse and the real estate of a larger screen.
* **Dynamic Variable Injection:** While the current mock data is static, the underlying architecture is primed and ready to support dynamic data injection like `{{candidate_name}}` in the future.

**— C P KAPILNATH**