const params = new URLSearchParams(window.location.search);
const lang = params.get('lang') || 'python';
const gistUrl = params.get('gist');
const timeLimit = parseInt(params.get('time')) || 300;
const isTestMode = params.get('test') === 'true';

let editor, pyodideInstance, timerStarted = false, timeLeft = timeLimit,timerInterval;

window.addEventListener("beforeunload", function (e) {
    e.preventDefault();
    e.returnValue = "";
});

// --- MONACO SETUP ---
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.36.1/min/vs' }});
require(['vs/editor/editor.main'], function() {
    editor = monaco.editor.create(document.getElementById('monaco-editor'), {
        value: "",
        language: lang === 'python' ? 'python' : 'cpp',
        theme: 'vs-dark',
        fontSize: 18,
        automaticLayout: true,
        minimap: { enabled: false },
        
        // --- RAW NOTEPAD MODE SETTINGS ---
        autoClosingBrackets: "never",
        autoClosingQuotes: "never",
        autoIndent: "none",
        formatOnType: false,
        formatOnPaste: false,
        quickSuggestions: false, // Disables the popup autocomplete
        suggestOnTriggerCharacters: false,
        acceptSuggestionOnEnter: "off",
        tabSize: 4, 
        insertSpaces: true, // Standard for Python, but doesn't auto-indent
        // ---------------------------------

        cursorBlinking: "none",
        renderLineHighlight: "none"
    });

    // Focus editor automatically
    editor.focus();

    // Start timer on actual content change
    const changeListener = editor.onDidChangeModelContent(() => {
        if (!timerStarted && !isTestMode) startTimer();
    });

    if (isTestMode) {
        document.getElementById('blind-overlay').style.display = 'none';
        document.getElementById('run-btn').style.display = 'inline-block';
        document.getElementById('timer-display').innerText = "TESTING";
        editor.updateOptions({ cursorBlinking: "blink" });
    }
    
    if (lang === 'python') initPython();
});

// --- GIST FETCHING ---
if (gistUrl) {
    fetch(gistUrl)
        .then(res => res.text())
        .then(data => { document.getElementById('source-code').innerText = data; })
        .catch(() => { document.getElementById('source-code').innerText = "Gist Load Failed."; });
}

// --- COMPETITION LOGIC ---
function startTimer() {
    timerStarted = true;
    document.getElementById('overlay-text').innerText = "BLIND ACTIVE";
    
    // Assign the interval to our global variable
    timerInterval = setInterval(() => {
        timeLeft--;
        const m = Math.floor(timeLeft / 60);
        const s = timeLeft % 60;
        document.getElementById('timer-display').innerText = `${m}:${s.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 10) document.getElementById('timer-display').classList.add('warning');
        
        if (timeLeft <= 0) {
            endRound(); // The interval is cleared inside endRound
        }
    }, 1000);
}

function endRound() {
    // STOP THE TIMER IMMEDIATELY
    clearInterval(timerInterval);
    
    // Visual reveals
    document.getElementById('blind-overlay').style.opacity = '0';
    setTimeout(() => document.getElementById('blind-overlay').style.display = 'none', 500);
    
    document.getElementById('run-btn').style.display = 'inline-block';
    document.getElementById('finish-btn').style.display = 'none';
    
    // Lock the editor
    editor.updateOptions({ readOnly: true, cursorBlinking: "blink" });
    log("ROUND ENDED. Timer stopped. Evaluation mode active.", "var(--accent)");
}

function log(msg, color = "#adbac7") {
    const div = document.createElement('div');
    div.style.color = color;
    div.innerText = `> ${msg}`;
    document.getElementById('terminal').appendChild(div);
}

// --- ENGINES ---
async function initPython() {
    log("Loading Python Runtime...", "#565f89");
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js';
    script.onload = async () => {
        pyodideInstance = await loadPyodide();
        log("Python Engine Ready.", "var(--success)");
    };
    document.head.appendChild(script);
}

async function executeCode() {
    const code = editor.getValue();
    log("Executing...");
    if (lang === 'python') {
        try {
            await pyodideInstance.runPythonAsync(`import sys, io\nsys.stdout = io.StringIO()`);
            await pyodideInstance.runPythonAsync(code);
            log(pyodideInstance.runPython("sys.stdout.getvalue()") || "No Output.");
        } catch (err) { log(err, "var(--danger)"); }
    } else {
        const res = await fetch("https://emkc.org/api/v2/piston/execute", {
            method: "POST",
            body: JSON.stringify({ language: "c", version: "10.2.0", files: [{ content: code }] })
        });
        const out = await res.json();
        log(out.run.output || "No output.");
    }
}
