# ADA Sorting Algorithm Visualizer & Performance Analyzer (Web Version)

A mobile-friendly, responsive, interactive web application built with **HTML5**, **CSS3**, and **Modern JavaScript (ES6+)**.

This application is an educational companion for undergraduate students studying **Analysis and Design of Algorithms (ADA)**. It provides dynamic step-by-step sorting animations, a theoretical complexity guide, and an empirical performance benchmarking suite that runs in any web browser without any installation or external dependencies.

---

## 🌟 Key Features

1. **5 Canonical Sorting Algorithms (Pure Implementations)**:
   - **Bubble Sort** (with swapped-flag early-termination optimization)
   - **Selection Sort**
   - **Insertion Sort**
   - **Merge Sort** (recursive divide-and-conquer)
   - **Quick Sort** (in-place partitioning with median-of-three pivot safety)
   - *Note: No built-in methods like `Array.prototype.sort()` are used in the algorithm implementations.*

2. **Animated Visualizer with Zero-Baseline Axis**:
   - Rendered using an HTML5 Canvas scaled with `devicePixelRatio` for razor-sharp clarity on retina displays and mobile phones.
   - **Negative Number Support**: Automatically calculates a dynamic zero-baseline horizontal axis where positive numbers extend upward and negative numbers extend downward.
   - **Duplicate Value Support**: Accurately tracks and sorts identical numbers without glitches.
   - Value labels rendered on/above/below bars when array size is $\le 32$.

3. **Color-Coded Algorithmic States**:
   - 🔵 **Sky Blue (`#38bdf8`)**: Unsorted / Default bar
   - 🟡 **Yellow (`#facc15`)**: Currently comparing two elements
   - 🔴 **Red (`#ef4444`)**: Swapping elements or overwriting during merge/shift
   - 🟣 **Purple (`#c084fc`)**: Pivot element (Quick Sort) or Key element (Insertion Sort)
   - 🟢 **Teal / Cyan (`#2dd4bf`)**: Current minimum candidate (Selection Sort)
   - 🟢 **Green (`#22c55e`)**: Element placed in its final sorted position

4. **Interactive Controls & Responsiveness**:
   - **Start Sorting**: Initiates smooth, non-blocking asynchronous animation.
   - **Pause / Resume**: Freeze execution at any instant to inspect values or explain steps.
   - **Step Forward (⏭)**: Advances the sorting algorithm by exactly one step (ideal for viva demonstrations and classroom presentations).
   - **Reset**: Instantly restores the array to its original unsorted state.
   - **Speed Slider**: Real-time animation speed control (from 5 ms fast execution to 300 ms slow-motion demonstration).

5. **Flexible Data Generation**:
   - Array size slider (5 to 80 elements).
   - Pre-configured distributions:
     - *Random (Mixed Positive & Negative)*
     - *Random (Positive Only)*
     - *Nearly Sorted* (demonstrates Insertion Sort's $\Omega(n)$ best case)
     - *Reverse Sorted* (demonstrates worst-case $O(n^2)$ behavior)
     - *Already Sorted*
     - *Many Duplicates* (tests stability and duplicate handling)
   - **Custom Array Input**: Type or paste any comma-separated sequence (e.g., `15, -8, 42, 0, -20, 33, 15, -4, 9`). Includes robust input validation that catches non-numeric tokens, single numbers, and empty inputs with helpful popups.

6. **Real-Time Performance Metrics**:
   - **Execution Time**: Millisecond-accurate stopwatch timer (pauses when you pause).
   - **Comparisons Counter**: Tracks every comparison operation performed.
   - **Swaps / Shifts Counter**: Tracks every array write or element exchange.
   - **Dynamic Step Inspector**: Live status bar displaying exact operations (e.g., `Comparing arr[3] (-8) with arr[4] (15)`).

7. **Theoretical Complexity Panel**:
   - Instant reference for the selected algorithm:
     - Algorithmic Paradigm (Divide & Conquer, Brute Force, Incremental, etc.)
     - Best-Case Time Complexity ($\Omega$)
     - Average-Case Time Complexity ($\Theta$)
     - Worst-Case Time Complexity ($O$)
     - Auxiliary Space Complexity
     - Stability (Stable vs. Unstable)
     - In-Place Status (Yes vs. No)

8. **Performance Analyzer & Empirical Benchmarking Suite (Tab 2)**:
   - **Theoretical Comparison Table**: Side-by-side comparison of all 5 algorithms.
   - **Head-to-Head Empirical Benchmarking Tool**:
     - Choose dataset sizes: $100$, $500$, $1000$, $2000$, $5000$ elements.
     - Tests all 5 algorithms on the **exact same dataset** simultaneously using pure non-animated functions.
     - Outputs a ranked leaderboard table with CPU time in milliseconds, comparison counts, swap counts, and algorithmic takeaway insights.

---

## 🚀 How to Run the Web App Locally

You have multiple convenient ways to launch and view the web application:

### Option 1: Direct File Launch (No server required!)
1. Open Windows File Explorer and navigate to:
   ```text
   C:\Users\ADMIN\.gemini\antigravity\scratch\ada_sorting_web
   ```
2. Double-click **`index.html`**.
3. It will open immediately in your default browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Brave).

---

### Option 2: Run via Python Local Web Server
If you prefer running via a local HTTP server:
1. Open PowerShell or Command Prompt.
2. Navigate to the project directory:
   ```powershell
   cd C:\Users\ADMIN\.gemini\antigravity\scratch\ada_sorting_web
   ```
3. Start Python's built-in HTTP server:
   ```powershell
   python -m http.server 8000
   ```
4. Open your web browser and go to:
   ```text
   http://localhost:8000
   ```

---

### Option 3: Access from your Mobile Phone on the Same Wi-Fi
To test the mobile-friendly interface on your actual smartphone:
1. Ensure your computer and smartphone are connected to the same Wi-Fi network.
2. In PowerShell, find your computer's local IP address:
   ```powershell
   ipconfig
   ```
   *(Look for `IPv4 Address`, e.g., `192.168.1.15`)*.
3. Start the local server:
   ```powershell
   python -m http.server 8000
   ```
4. On your mobile phone browser (Safari, Chrome, etc.), open:
   ```text
   http://<YOUR_COMPUTER_IP>:8000
   ```
   *(Example: `http://192.168.1.15:8000`)*.
5. The application will load with a fully optimized touch interface!

---

### Option 4: Run via VS Code Live Server
If you use Visual Studio Code:
1. Open the `ada_sorting_web` folder in VS Code.
2. Install the **Live Server** extension (by Ritwick Dey) if you haven't already.
3. Right-click `index.html` and click **"Open with Live Server"**.

---

## 📁 File Structure

```text
ada_sorting_web/
│
├── index.html       # HTML5 Semantic layout, controls, canvas, and tables
├── style.css        # Responsive mobile-first CSS3 styles (Dark theme)
├── script.js        # Pure Vanilla JavaScript sorting engine & visualizer
├── README.md        # Documentation and local setup instructions
└── ada_sorting_web.zip  # Downloadable archive for sharing or online deployment
```

---

## 🌐 Deploying to Free Web Hosting (Optional)

Because this web app consists of standard static files (`index.html`, `style.css`, `script.js`), you can host it for free online in 1 minute using:
- **GitHub Pages**: Push this folder to a GitHub repository and enable Pages under Settings.
- **Netlify**: Drag-and-drop the `ada_sorting_web` folder onto [app.netlify.com/drop](https://app.netlify.com/drop).
- **Vercel**: Deploy with `npx vercel`.

---

## 🎓 College ADA Curriculum Notes
- **Course**: B.Tech / B.E. / BCA / B.Sc (IT / Computer Science)
- **Subject**: Analysis and Design of Algorithms (ADA)
- **Topics Demonstrated**:
  - Comparison-based sorting lower bound ($\Omega(n \log n)$).
  - Exchange vs Selection vs Incremental vs Divide-and-Conquer paradigms.
  - Asymptotic time and space complexity ($O, \Omega, \Theta$).
  - In-place vs Out-of-place and Stable vs Unstable properties.
  - Empirical verification of theoretical runtimes at scale.
