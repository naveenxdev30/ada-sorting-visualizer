/**
 * ==============================================================================
 * ADA SORTING ALGORITHM VISUALIZER & PERFORMANCE ANALYZER
 * Client-Side JavaScript Engine (Pure Vanilla ES6+)
 * ==============================================================================
 */

// ==============================================================================
// 1. COMPLEXITY & METADATA CONFIGURATION
// ==============================================================================
const ALGO_METADATA = {
  bubble: {
    title: "Bubble Sort Properties",
    bestTime: "Ω(n)",
    avgTime: "Θ(n²)",
    worstTime: "O(n²)",
    space: "O(1)",
    stable: "Yes",
    inplace: "Yes",
    desc: "Iterates through the list, comparing adjacent items and swapping them if out of order. With the swapped-flag optimization, it terminates in a single linear pass on already sorted arrays."
  },
  selection: {
    title: "Selection Sort Properties",
    bestTime: "Ω(n²)",
    avgTime: "Θ(n²)",
    worstTime: "O(n²)",
    space: "O(1)",
    stable: "No",
    inplace: "Yes",
    desc: "Divides the array into sorted and unsorted regions. Repeatedly searches the unsorted region for the minimum element and swaps it with the first unsorted position. Guarantees at most O(n) memory writes."
  },
  insertion: {
    title: "Insertion Sort Properties",
    bestTime: "Ω(n)",
    avgTime: "Θ(n²)",
    worstTime: "O(n²)",
    space: "O(1)",
    stable: "Yes",
    inplace: "Yes",
    desc: "Maintains a sorted subarray. Sequentially picks the next element (the key) and shifts larger elements to the right to insert the key in its correct position. Highly adaptive for nearly-sorted data."
  },
  merge: {
    title: "Merge Sort Properties",
    bestTime: "Ω(n log n)",
    avgTime: "Θ(n log n)",
    worstTime: "O(n log n)",
    space: "O(n)",
    stable: "Yes",
    inplace: "No",
    desc: "Recursively divides the array into two halves until single elements remain, then merges the sorted halves using auxiliary memory. Guarantees consistent O(n log n) runtime across all inputs."
  },
  quick: {
    title: "Quick Sort Properties",
    bestTime: "Ω(n log n)",
    avgTime: "Θ(n log n)",
    worstTime: "O(n²)",
    space: "O(log n)",
    stable: "No",
    inplace: "Yes",
    desc: "Picks a pivot element and partitions the array into elements smaller than or equal to the pivot on the left and larger on the right, then recurses. Implementation includes middle-pivot safety against sorted data."
  }
};

const COLOR_DEFAULT = "#38bdf8";     // Sky blue
const COLOR_COMPARING = "#facc15";   // Vivid yellow
const COLOR_SWAPPING = "#ef4444";    // Crimson red
const COLOR_SPECIAL = "#c084fc";     // Purple
const COLOR_MIN = "#2dd4bf";         // Cyan
const COLOR_SORTED = "#22c55e";      // Emerald green
const COLOR_AXIS = "#475569";        // Axis gray

// ==============================================================================
// 2. APPLICATION STATE
// ==============================================================================
let arrayData = [];
let initialDataCopy = [];
let isSorting = false;
let isPaused = false;
let stepRequested = false;
let abortSorting = false;
let currentDelay = 40; // ms

let timerInterval = null;
let startTime = 0;
let elapsedTime = 0;
let comparisonsCount = 0;
let swapsCount = 0;

// DOM Elements
const canvas = document.getElementById("sortCanvas");
const ctx = canvas.getContext("2d");

const algoSelect = document.getElementById("algoSelect");
const sizeSlider = document.getElementById("sizeSlider");
const sizeVal = document.getElementById("sizeVal");
const distSelect = document.getElementById("distSelect");
const speedSlider = document.getElementById("speedSlider");
const speedVal = document.getElementById("speedVal");
const customInput = document.getElementById("customInput");

const btnGenerate = document.getElementById("btnGenerate");
const btnStart = document.getElementById("btnStart");
const btnPause = document.getElementById("btnPause");
const btnStep = document.getElementById("btnStep");
const btnReset = document.getElementById("btnReset");
const btnLoadCustom = document.getElementById("btnLoadCustom");

const statusText = document.getElementById("statusText");
const metricTime = document.getElementById("metricTime");
const metricComp = document.getElementById("metricComp");
const metricSwaps = document.getElementById("metricSwaps");
const metricSize = document.getElementById("metricSize");

// Complexity elements
const complexityAlgoTitle = document.getElementById("complexityAlgoTitle");
const compBest = document.getElementById("compBest");
const compAvg = document.getElementById("compAvg");
const compWorst = document.getElementById("compWorst");
const compSpace = document.getElementById("compSpace");
const compStable = document.getElementById("compStable");
const compInplace = document.getElementById("compInplace");
const compDesc = document.getElementById("compDesc");

// Benchmark elements
const btnRunBenchmark = document.getElementById("btnRunBenchmark");
const benchSizeSelect = document.getElementById("benchSizeSelect");
const benchDistSelect = document.getElementById("benchDistSelect");
const benchProgress = document.getElementById("benchProgress");
const benchmarkTbody = document.getElementById("benchmarkTbody");
const findingsText = document.getElementById("findingsText");

// ==============================================================================
// 3. CANVAS RENDERING WITH ZERO-BASELINE FOR NEGATIVE NUMBERS
// ==============================================================================
function resizeCanvas() {
  const container = canvas.parentElement;
  const rect = container.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  if (ctx.setTransform) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  } else {
    ctx.scale(dpr, dpr);
  }

  drawBars();
}

window.addEventListener("resize", resizeCanvas);

function drawBars(colorMap = {}) {
  const container = canvas.parentElement;
  const rect = container.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  if (!arrayData || arrayData.length === 0) return;

  const n = arrayData.length;
  const padX = 20;
  const padTop = 30;
  const padBottom = 30;
  const usableW = width - (padX * 2);
  const usableH = height - (padTop + padBottom);

  const barWidth = usableW / n;
  const gap = barWidth > 8 ? 2 : (barWidth > 4 ? 1 : 0);

  let minVal = arrayData[0];
  let maxVal = arrayData[0];
  for (let i = 1; i < n; i++) {
    if (arrayData[i] < minVal) minVal = arrayData[i];
    if (arrayData[i] > maxVal) maxVal = arrayData[i];
  }

  // Calculate Zero Baseline
  let zeroY;
  let totalRange;

  if (minVal >= 0) {
    zeroY = height - padBottom;
    totalRange = maxVal > 0 ? maxVal : 1;
  } else if (maxVal <= 0) {
    zeroY = padTop;
    totalRange = Math.abs(minVal) > 0 ? Math.abs(minVal) : 1;
  } else {
    totalRange = maxVal - minVal;
    const zeroRatio = (0 - minVal) / totalRange;
    zeroY = (height - padBottom) - (zeroRatio * usableH);
  }

  // Draw Zero Axis Line
  ctx.beginPath();
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = COLOR_AXIS;
  ctx.lineWidth = 1;
  ctx.moveTo(padX - 8, zeroY);
  ctx.lineTo(width - padX + 8, zeroY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Axis "0" text
  ctx.font = "10px ui-monospace, Consolas, monospace";
  ctx.fillStyle = "#64748b";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillText("0", padX - 10, zeroY);

  // Draw Bars
  for (let i = 0; i < n; i++) {
    const val = arrayData[i];
    const x0 = padX + (i * barWidth) + (gap / 2);
    const w = barWidth - gap;
    const color = colorMap[i] || COLOR_DEFAULT;

    ctx.fillStyle = color;

    let y0, h;
    if (totalRange === 0) {
      h = usableH / 2;
      y0 = zeroY - h;
    } else {
      if (val >= 0) {
        h = (val / totalRange) * usableH;
        y0 = zeroY - h;
      } else {
        h = (Math.abs(val) / totalRange) * usableH;
        y0 = zeroY;
      }
    }

    ctx.fillRect(x0, y0, Math.max(1, w), Math.max(1, h));

    // Render value labels if bar count is small
    if (n <= 32) {
      ctx.fillStyle = "#f8f8f2";
      ctx.font = "bold 10px ui-monospace, Consolas, monospace";
      ctx.textAlign = "center";
      if (val >= 0) {
        ctx.textBaseline = "bottom";
        ctx.fillText(String(val), x0 + w / 2, y0 - 3);
      } else {
        ctx.textBaseline = "top";
        ctx.fillText(String(val), x0 + w / 2, y0 + h + 3);
      }
    }
  }
}

// ==============================================================================
// 4. ANIMATION FLOW & ASYNC CONTROLLER (PAUSE, RESUME, STEP, CANCEL)
// ==============================================================================
async function waitStep() {
  if (abortSorting) throw new Error("ABORTED");

  if (isPaused) {
    while (isPaused && !stepRequested && !abortSorting) {
      await new Promise(r => setTimeout(r, 40));
    }
    if (abortSorting) throw new Error("ABORTED");
    if (stepRequested) {
      stepRequested = false;
      return;
    }
  }

  await new Promise(r => setTimeout(r, currentDelay));
}

function updateLiveMetrics(msg, colorMap) {
  statusText.textContent = msg;
  metricComp.textContent = comparisonsCount.toLocaleString();
  metricSwaps.textContent = swapsCount.toLocaleString();
  drawBars(colorMap);
}

function startTimer() {
  startTime = performance.now() - elapsedTime;
  timerInterval = setInterval(() => {
    elapsedTime = performance.now() - startTime;
    metricTime.textContent = (elapsedTime / 1000).toFixed(3) + " s";
  }, 30);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function resetMetrics() {
  stopTimer();
  elapsedTime = 0;
  comparisonsCount = 0;
  swapsCount = 0;
  metricTime.textContent = "0.000 s";
  metricComp.textContent = "0";
  metricSwaps.textContent = "0";
  metricSize.textContent = arrayData.length;
}

// ==============================================================================
// 5. ANIMATED SORTING ALGORITHMS
// ==============================================================================

// 1. Bubble Sort (with swapped flag optimization)
async function animatedBubbleSort() {
  const n = arrayData.length;
  for (let i = 0; i < n; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      comparisonsCount++;
      updateLiveMetrics(
        `Comparing arr[${j}] (${arrayData[j]}) and arr[${j + 1}] (${arrayData[j + 1]})`,
        { [j]: COLOR_COMPARING, [j + 1]: COLOR_COMPARING }
      );
      await waitStep();

      if (arrayData[j] > arrayData[j + 1]) {
        const tmp = arrayData[j];
        arrayData[j] = arrayData[j + 1];
        arrayData[j + 1] = tmp;
        swapsCount++;
        swapped = true;

        updateLiveMetrics(
          `Swapping arr[${j}] and arr[${j + 1}]`,
          { [j]: COLOR_SWAPPING, [j + 1]: COLOR_SWAPPING }
        );
        await waitStep();
      }
    }
    if (!swapped) break;
  }
}

// 2. Selection Sort
async function animatedSelectionSort() {
  const n = arrayData.length;
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    updateLiveMetrics(
      `Pass ${i + 1}: Assuming index ${minIdx} (${arrayData[minIdx]}) as minimum`,
      { [minIdx]: COLOR_MIN }
    );
    await waitStep();

    for (let j = i + 1; j < n; j++) {
      comparisonsCount++;
      updateLiveMetrics(
        `Comparing arr[${j}] (${arrayData[j]}) with min arr[${minIdx}] (${arrayData[minIdx]})`,
        { [minIdx]: COLOR_MIN, [j]: COLOR_COMPARING }
      );
      await waitStep();

      if (arrayData[j] < arrayData[minIdx]) {
        minIdx = j;
        updateLiveMetrics(
          `New minimum found at index ${minIdx} (${arrayData[minIdx]})`,
          { [minIdx]: COLOR_MIN }
        );
        await waitStep();
      }
    }

    if (minIdx !== i) {
      const tmp = arrayData[i];
      arrayData[i] = arrayData[minIdx];
      arrayData[minIdx] = tmp;
      swapsCount++;
      updateLiveMetrics(
        `Swapping minimum (${arrayData[i]}) into position ${i}`,
        { [i]: COLOR_SWAPPING, [minIdx]: COLOR_SWAPPING }
      );
      await waitStep();
    }
  }
}

// 3. Insertion Sort
async function animatedInsertionSort() {
  const n = arrayData.length;
  for (let i = 1; i < n; i++) {
    const key = arrayData[i];
    let j = i - 1;

    updateLiveMetrics(
      `Picked key arr[${i}] = ${key} to insert into sorted prefix`,
      { [i]: COLOR_SPECIAL }
    );
    await waitStep();

    while (j >= 0) {
      comparisonsCount++;
      updateLiveMetrics(
        `Comparing key ${key} with arr[${j}] (${arrayData[j]})`,
        { [j]: COLOR_COMPARING, [j + 1]: COLOR_SPECIAL }
      );
      await waitStep();

      if (arrayData[j] > key) {
        arrayData[j + 1] = arrayData[j];
        swapsCount++;
        updateLiveMetrics(
          `Shifted arr[${j}] (${arrayData[j]}) right to position ${j + 1}`,
          { [j + 1]: COLOR_SWAPPING }
        );
        await waitStep();
        j--;
      } else {
        break;
      }
    }

    arrayData[j + 1] = key;
    swapsCount++;
    updateLiveMetrics(
      `Inserted key ${key} at position ${j + 1}`,
      { [j + 1]: COLOR_SORTED }
    );
    await waitStep();
  }
}

// 4. Merge Sort
async function animatedMergeSort() {
  async function mergeSortHelper(low, high) {
    if (low < high) {
      const mid = Math.floor((low + high) / 2);
      await mergeSortHelper(low, mid);
      await mergeSortHelper(mid + 1, high);
      await mergeHelper(low, mid, high);
    }
  }

  async function mergeHelper(low, mid, high) {
    const leftSub = arrayData.slice(low, mid + 1);
    const rightSub = arrayData.slice(mid + 1, high + 1);
    let i = 0, j = 0, k = low;

    while (i < leftSub.length && j < rightSub.length) {
      comparisonsCount++;
      updateLiveMetrics(
        `Comparing left ${leftSub[i]} and right ${rightSub[j]}`,
        { [low + i]: COLOR_COMPARING, [mid + 1 + j]: COLOR_COMPARING }
      );
      await waitStep();

      if (leftSub[i] <= rightSub[j]) {
        arrayData[k] = leftSub[i];
        swapsCount++;
        i++;
      } else {
        arrayData[k] = rightSub[j];
        swapsCount++;
        j++;
      }

      updateLiveMetrics(
        `Merged element ${arrayData[k]} into index ${k}`,
        { [k]: COLOR_SWAPPING }
      );
      await waitStep();
      k++;
    }

    while (i < leftSub.length) {
      arrayData[k] = leftSub[i];
      swapsCount++;
      i++;
      updateLiveMetrics(`Copied remaining left ${arrayData[k]} to index ${k}`, { [k]: COLOR_SWAPPING });
      await waitStep();
      k++;
    }

    while (j < rightSub.length) {
      arrayData[k] = rightSub[j];
      swapsCount++;
      j++;
      updateLiveMetrics(`Copied remaining right ${arrayData[k]} to index ${k}`, { [k]: COLOR_SWAPPING });
      await waitStep();
      k++;
    }
  }

  await mergeSortHelper(0, arrayData.length - 1);
}

// 5. Quick Sort (with median-of-three pivot safety)
async function animatedQuickSort() {
  async function quickSortHelper(low, high) {
    if (low < high) {
      const pIdx = await partitionHelper(low, high);
      await quickSortHelper(low, pIdx - 1);
      await quickSortHelper(pIdx + 1, high);
    }
  }

  async function partitionHelper(low, high) {
    // Median-of-three pivot to avoid worst-case on sorted data
    const mid = Math.floor((low + high) / 2);
    const tmpMid = arrayData[mid];
    arrayData[mid] = arrayData[high];
    arrayData[high] = tmpMid;
    swapsCount++;

    const pivot = arrayData[high];
    let i = low - 1;

    updateLiveMetrics(
      `Selected pivot ${pivot} at index ${high}`,
      { [high]: COLOR_SPECIAL }
    );
    await waitStep();

    for (let j = low; j < high; j++) {
      comparisonsCount++;
      updateLiveMetrics(
        `Comparing arr[${j}] (${arrayData[j]}) with pivot ${pivot}`,
        { [j]: COLOR_COMPARING, [high]: COLOR_SPECIAL }
      );
      await waitStep();

      if (arrayData[j] <= pivot) {
        i++;
        const tmp = arrayData[i];
        arrayData[i] = arrayData[j];
        arrayData[j] = tmp;
        swapsCount++;

        updateLiveMetrics(
          `Swapped arr[${i}] and arr[${j}] (value <= pivot)`,
          { [i]: COLOR_SWAPPING, [j]: COLOR_SWAPPING, [high]: COLOR_SPECIAL }
        );
        await waitStep();
      }
    }

    const tmpFinal = arrayData[i + 1];
    arrayData[i + 1] = arrayData[high];
    arrayData[high] = tmpFinal;
    swapsCount++;

    const pivotFinal = i + 1;
    updateLiveMetrics(
      `Placed pivot ${pivot} in its sorted position ${pivotFinal}`,
      { [pivotFinal]: COLOR_SORTED }
    );
    await waitStep();

    return pivotFinal;
  }

  await quickSortHelper(0, arrayData.length - 1);
}

// ==============================================================================
// 6. EXECUTION DISPATCHER
// ==============================================================================
async function startSortingProcess() {
  if (isSorting && isPaused) {
    // Resume
    isPaused = false;
    btnPause.textContent = "⏸ Pause";
    startTimer();
    statusText.textContent = `Resumed ${algoSelect.options[algoSelect.selectedIndex].text}...`;
    return;
  }

  if (isSorting) return;

  isSorting = true;
  isPaused = false;
  abortSorting = false;
  stepRequested = false;

  resetMetrics();
  setControlsSortingState(true);
  startTimer();

  const algo = algoSelect.value;
  const algoName = algoSelect.options[algoSelect.selectedIndex].text;
  statusText.textContent = `Sorting with ${algoName}...`;

  try {
    if (algo === "bubble") await animatedBubbleSort();
    else if (algo === "selection") await animatedSelectionSort();
    else if (algo === "insertion") await animatedInsertionSort();
    else if (algo === "merge") await animatedMergeSort();
    else if (algo === "quick") await animatedQuickSort();

    // Victory sweep: green highlight
    const victoryColors = {};
    for (let i = 0; i < arrayData.length; i++) victoryColors[i] = COLOR_SORTED;
    stopTimer();
    statusText.textContent = `✓ ${algoName} Completed! Time: ${(elapsedTime / 1000).toFixed(3)}s | Comparisons: ${comparisonsCount} | Swaps: ${swapsCount}`;
    drawBars(victoryColors);
  } catch (err) {
    if (err.message !== "ABORTED") {
      console.error(err);
      statusText.textContent = "Error occurred during sorting.";
    }
  } finally {
    isSorting = false;
    isPaused = false;
    stopTimer();
    setControlsSortingState(false);
  }
}

function pauseSortingProcess() {
  if (!isSorting) return;

  if (isPaused) {
    isPaused = false;
    btnPause.textContent = "⏸ Pause";
    startTimer();
    statusText.textContent = `Resumed ${algoSelect.options[algoSelect.selectedIndex].text}...`;
  } else {
    isPaused = true;
    btnPause.textContent = "▶ Resume";
    stopTimer();
    statusText.textContent = `${algoSelect.options[algoSelect.selectedIndex].text} is paused. Click 'Resume' or 'Step'.`;
  }
}

function stepSortingProcess() {
  if (!isSorting) {
    // Start in paused state
    startSortingProcess();
    isPaused = true;
    btnPause.textContent = "▶ Resume";
    stopTimer();
    stepRequested = true;
  } else {
    if (!isPaused) {
      pauseSortingProcess();
    }
    stepRequested = true;
  }
}

function resetArrayData() {
  abortSorting = true;
  isSorting = false;
  isPaused = false;
  stopTimer();

  if (initialDataCopy.length > 0) {
    arrayData = [...initialDataCopy];
  }
  resetMetrics();
  setControlsSortingState(false);
  drawBars();
  statusText.textContent = "Array reset to original unsorted state.";
}

function setControlsSortingState(sorting) {
  btnStart.disabled = sorting;
  btnPause.disabled = !sorting;
  btnGenerate.disabled = sorting;
  btnLoadCustom.disabled = sorting;
  algoSelect.disabled = sorting;
  sizeSlider.disabled = sorting;
  distSelect.disabled = sorting;
}

// ==============================================================================
// 7. DATASET GENERATION & INPUT PARSING
// ==============================================================================
function generateArray() {
  if (isSorting) {
    abortSorting = true;
    isSorting = false;
  }

  const n = parseInt(sizeSlider.value, 10);
  const pattern = distSelect.value;
  arrayData = [];

  if (pattern === "random-mixed") {
    for (let i = 0; i < n; i++) arrayData.push(Math.floor(Math.random() * 120) - 45);
  } else if (pattern === "random-pos") {
    for (let i = 0; i < n; i++) arrayData.push(Math.floor(Math.random() * 95) + 5);
  } else if (pattern === "nearly-sorted") {
    for (let i = 0; i < n; i++) arrayData.push(Math.floor(Math.random() * 100) - 20);
    arrayData.sort((a, b) => a - b);
    const swapCount = Math.max(1, Math.floor(n / 10));
    for (let i = 0; i < swapCount; i++) {
      const idx1 = Math.floor(Math.random() * n);
      const idx2 = Math.floor(Math.random() * n);
      const t = arrayData[idx1];
      arrayData[idx1] = arrayData[idx2];
      arrayData[idx2] = t;
    }
  } else if (pattern === "reverse-sorted") {
    for (let i = 0; i < n; i++) arrayData.push(Math.floor(Math.random() * 120) - 30);
    arrayData.sort((a, b) => b - a);
  } else if (pattern === "already-sorted") {
    for (let i = 0; i < n; i++) arrayData.push(Math.floor(Math.random() * 120) - 30);
    arrayData.sort((a, b) => a - b);
  } else if (pattern === "many-duplicates") {
    const pool = [];
    const poolSize = Math.max(3, Math.floor(n / 4));
    for (let i = 0; i < poolSize; i++) pool.push(Math.floor(Math.random() * 60) - 15);
    for (let i = 0; i < n; i++) arrayData.push(pool[Math.floor(Math.random() * pool.length)]);
  }

  initialDataCopy = [...arrayData];
  resetMetrics();
  drawBars();
  statusText.textContent = `Generated new array with n=${n} elements (${distSelect.options[distSelect.selectedIndex].text}).`;
}

function loadCustomArray() {
  const raw = customInput.value.trim();
  if (!raw) {
    alert("Please enter numbers separated by commas (e.g. 15, -8, 42, 0, -20, 33).");
    return;
  }

  const clean = raw.replace(/[;\n]/g, ",");
  const tokens = clean.split(",").map(t => t.trim()).filter(t => t.length > 0);

  if (tokens.length < 2) {
    alert("Please provide at least 2 numbers to visualize sorting.");
    return;
  }

  const parsed = [];
  for (const token of tokens) {
    const val = Number(token);
    if (isNaN(val)) {
      alert(`Invalid token: "${token}" is not a valid number.\nPlease enter only numbers separated by commas.`);
      return;
    }
    parsed.push(val);
  }

  if (parsed.length > 80) {
    alert(`You entered ${parsed.length} numbers. The visualizer will render them, but the display may be compact on smaller screens.`);
  }

  if (isSorting) {
    abortSorting = true;
    isSorting = false;
  }

  arrayData = parsed;
  initialDataCopy = [...arrayData];
  sizeSlider.value = Math.min(80, Math.max(5, arrayData.length));
  sizeVal.textContent = arrayData.length;
  resetMetrics();
  drawBars();
  statusText.textContent = `Loaded custom array with ${arrayData.length} elements.`;
}

// ==============================================================================
// 8. COMPLEXITY PANEL UPDATE
// ==============================================================================
function updateComplexityCard() {
  const algoKey = algoSelect.value;
  const meta = ALGO_METADATA[algoKey];
  if (!meta) return;

  complexityAlgoTitle.textContent = meta.title;
  compBest.textContent = meta.bestTime;
  compAvg.textContent = meta.avgTime;
  compWorst.textContent = meta.worstTime;
  compSpace.textContent = meta.space;
  compStable.textContent = meta.stable;
  compInplace.textContent = meta.inplace;
  compDesc.textContent = meta.desc;
}

// ==============================================================================
// 9. PURE SORTING ALGORITHMS (FOR EMPIRICAL BENCHMARKING)
// ==============================================================================
function pureBubbleSort(arr) {
  const a = [...arr];
  const n = a.length;
  let comp = 0, swaps = 0;
  for (let i = 0; i < n; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      comp++;
      if (a[j] > a[j + 1]) {
        const t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
        swaps++;
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return { comp, swaps };
}

function pureSelectionSort(arr) {
  const a = [...arr];
  const n = a.length;
  let comp = 0, swaps = 0;
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      comp++;
      if (a[j] < a[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      const t = a[i]; a[i] = a[minIdx]; a[minIdx] = t;
      swaps++;
    }
  }
  return { comp, swaps };
}

function pureInsertionSort(arr) {
  const a = [...arr];
  const n = a.length;
  let comp = 0, swaps = 0;
  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0) {
      comp++;
      if (a[j] > key) {
        a[j + 1] = a[j];
        swaps++;
        j--;
      } else {
        break;
      }
    }
    a[j + 1] = key;
    swaps++;
  }
  return { comp, swaps };
}

function pureMergeSort(arr) {
  const a = [...arr];
  let comp = 0, swaps = 0;

  function ms(low, high) {
    if (low < high) {
      const mid = Math.floor((low + high) / 2);
      ms(low, mid);
      ms(mid + 1, high);
      merge(low, mid, high);
    }
  }

  function merge(low, mid, high) {
    const left = a.slice(low, mid + 1);
    const right = a.slice(mid + 1, high + 1);
    let i = 0, j = 0, k = low;
    while (i < left.length && j < right.length) {
      comp++;
      if (left[i] <= right[j]) {
        a[k++] = left[i++];
      } else {
        a[k++] = right[j++];
      }
      swaps++;
    }
    while (i < left.length) { a[k++] = left[i++]; swaps++; }
    while (j < right.length) { a[k++] = right[j++]; swaps++; }
  }

  if (a.length > 1) ms(0, a.length - 1);
  return { comp, swaps };
}

function pureQuickSort(arr) {
  const a = [...arr];
  let comp = 0, swaps = 0;

  function qs(low, high) {
    if (low < high) {
      const mid = Math.floor((low + high) / 2);
      const tMid = a[mid]; a[mid] = a[high]; a[high] = tMid;
      swaps++;

      const pivot = a[high];
      let i = low - 1;
      for (let j = low; j < high; j++) {
        comp++;
        if (a[j] <= pivot) {
          i++;
          const t = a[i]; a[i] = a[j]; a[j] = t;
          swaps++;
        }
      }
      const tFin = a[i + 1]; a[i + 1] = a[high]; a[high] = tFin;
      swaps++;
      const p = i + 1;

      qs(low, p - 1);
      qs(p + 1, high);
    }
  }

  if (a.length > 1) qs(0, a.length - 1);
  return { comp, swaps };
}

async function runBenchmarkSuite() {
  btnRunBenchmark.disabled = true;
  benchProgress.style.display = "flex";
  benchmarkTbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted" style="padding: 2rem;">Computing benchmark test suite...</td></tr>`;

  // Allow browser UI to render spinner
  await new Promise(r => setTimeout(r, 60));

  const n = parseInt(benchSizeSelect.value, 10);
  const pattern = benchDistSelect.value;

  // Generate benchmark dataset
  const baseData = [];
  if (pattern === "random-mixed") {
    for (let i = 0; i < n; i++) baseData.push(Math.floor(Math.random() * 2000) - 1000);
  } else if (pattern === "nearly-sorted") {
    for (let i = 0; i < n; i++) baseData.push(Math.floor(Math.random() * 2000) - 1000);
    baseData.sort((a, b) => a - b);
    for (let i = 0; i < Math.max(1, Math.floor(n / 20)); i++) {
      const i1 = Math.floor(Math.random() * n);
      const i2 = Math.floor(Math.random() * n);
      const t = baseData[i1]; baseData[i1] = baseData[i2]; baseData[i2] = t;
    }
  } else if (pattern === "reverse-sorted") {
    for (let i = 0; i < n; i++) baseData.push(Math.floor(Math.random() * 2000) - 1000);
    baseData.sort((a, b) => b - a);
  } else if (pattern === "already-sorted") {
    for (let i = 0; i < n; i++) baseData.push(Math.floor(Math.random() * 2000) - 1000);
    baseData.sort((a, b) => a - b);
  } else if (pattern === "many-duplicates") {
    const pool = [];
    for (let i = 0; i < Math.max(5, Math.floor(n / 10)); i++) pool.push(Math.floor(Math.random() * 100) - 50);
    for (let i = 0; i < n; i++) baseData.push(pool[Math.floor(Math.random() * pool.length)]);
  }

  const algorithms = [
    { name: "Bubble Sort", fn: pureBubbleSort, theory: "O(n²) Quadratic Scaling" },
    { name: "Selection Sort", fn: pureSelectionSort, theory: "O(n²) Comparisons Always" },
    { name: "Insertion Sort", fn: pureInsertionSort, theory: "O(n) Best / O(n²) Worst" },
    { name: "Merge Sort", fn: pureMergeSort, theory: "O(n log n) Guaranteed" },
    { name: "Quick Sort", fn: pureQuickSort, theory: "O(n log n) Fast Partitioning" }
  ];

  const results = [];

  for (const algo of algorithms) {
    const t0 = performance.now();
    const stats = algo.fn(baseData);
    const t1 = performance.now();
    results.push({
      name: algo.name,
      size: n,
      comp: stats.comp,
      swaps: stats.swaps,
      timeMs: (t1 - t0),
      theory: algo.theory
    });
  }

  // Sort by execution time ascending
  results.sort((a, b) => a.timeMs - b.timeMs);

  // Render Table
  let html = "";
  results.forEach((res, idx) => {
    let rankBadge = `#${idx + 1}`;
    if (idx === 0) rankBadge = "🥇 1st";
    else if (idx === 1) rankBadge = "🥈 2nd";
    else if (idx === 2) rankBadge = "🥉 3rd";

    html += `
      <tr>
        <td><strong>${rankBadge}</strong></td>
        <td><strong>${res.name}</strong></td>
        <td>${res.size.toLocaleString()}</td>
        <td>${res.comp.toLocaleString()}</td>
        <td>${res.swaps.toLocaleString()}</td>
        <td><strong class="text-green">${res.timeMs.toFixed(2)} ms</strong></td>
        <td><span class="badge badge-cyan">${res.theory}</span></td>
      </tr>
    `;
  });

  benchmarkTbody.innerHTML = html;
  benchProgress.style.display = "none";
  btnRunBenchmark.disabled = false;

  const fastest = results[0];
  const slowest = results[results.length - 1];
  const speedup = (slowest.timeMs / (fastest.timeMs || 0.01)).toFixed(1);

  findingsText.innerHTML = `
    <strong>Observation for n = ${n.toLocaleString()} (${benchDistSelect.options[benchDistSelect.selectedIndex].text}):</strong>
    <em>${fastest.name}</em> finished first at <strong>${fastest.timeMs.toFixed(2)} ms</strong>, outperforming <em>${slowest.name}</em> by <strong>${speedup}x</strong>!
    Notice how Divide & Conquer algorithms ($O(n \\log n)$) perform exponentially fewer comparisons than quadratic algorithms ($O(n^2)$) as input size scales, empirically validating theoretical asymptotic analysis.
  `;
}

// ==============================================================================
// 10. EVENT LISTENERS & INITIALIZATION
// ==============================================================================
function setupEventListeners() {
  // Tab Navigation
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      const targetTab = btn.getAttribute("data-tab");
      const targetPanel = document.getElementById(`tab-${targetTab}`);
      if (targetPanel) {
        targetPanel.classList.add("active");
        if (targetTab === "visualizer") {
          setTimeout(resizeCanvas, 50);
        }
      }
    });
  });

  // Slider controls
  sizeSlider.addEventListener("input", (e) => {
    sizeVal.textContent = e.target.value;
    generateArray();
  });

  speedSlider.addEventListener("input", (e) => {
    currentDelay = parseInt(e.target.value, 10);
    speedVal.textContent = currentDelay + "ms";
  });

  algoSelect.addEventListener("change", () => {
    updateComplexityCard();
    statusText.textContent = `Selected ${algoSelect.options[algoSelect.selectedIndex].text}.`;
  });

  distSelect.addEventListener("change", generateArray);

  // Buttons
  btnGenerate.addEventListener("click", generateArray);
  btnStart.addEventListener("click", startSortingProcess);
  btnPause.addEventListener("click", pauseSortingProcess);
  btnStep.addEventListener("click", stepSortingProcess);
  btnReset.addEventListener("click", resetArrayData);
  btnLoadCustom.addEventListener("click", loadCustomArray);
  btnRunBenchmark.addEventListener("click", runBenchmarkSuite);
}

// Initialize on page load
window.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  updateComplexityCard();
  generateArray();
  setTimeout(resizeCanvas, 100);
});
