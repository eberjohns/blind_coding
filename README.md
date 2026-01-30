# 🎯 Srishti 2.6 | Blind Coding Tool

A sleek, cinematic, frontend-only web application designed for **Blind Coding competitions**.

This tool simulates a **raw notepad** environment:
- ❌ No auto-completion  
- ❌ No auto-indentation  
- ❌ No bracket closing  

The contestant’s input is hidden behind a **blind overlay** until the timer expires.

---

## 🚀 Features

- **Zero Backend**  
  Pure **HTML / CSS / JavaScript**. Easily hostable on **GitHub Pages**.

- **Dual Language Support**
  - **Python**: Executed in-browser via **Pyodide (WebAssembly)**
  - **C**: Executed via the **Piston API**

- **Dynamic Configuration**  
  Control time, language, and source code using **URL parameters**.

- **"Raw" Editor**  
  Powered by **Monaco Editor**, with all smart coding features disabled.

- **Keystroke-Triggered Timer**  
  Countdown starts automatically on first keypress.

- **Mobile Responsive**  
  Adapts cleanly for tablets and smartphones.

---

## 🛠️ Usage & URL Parameters

The application is fully controlled via **URL Query Parameters**.

### Base URL
`https://eberjohns.github.io/blind_coding/?lang=python&time=300&gist=RAW_GIST_URL`


### Parameters

| Parameter | Type    | Description                                                  | Example |
|---------|---------|--------------------------------------------------------------|---------|
| `lang`  | String  | Sets the language (`python` or `c`)                          | `lang=c` |
| `time`  | Integer | Competition duration in seconds                              | `time=600` |
| `gist`  | String  | Raw GitHub Gist URL containing the source code               | `gist=https://gist.githubusercontent.com/.../raw/file.py` |
| `test`  | Boolean | If `true`, disables blind mode and timer (testing only)      | `test=true` |

---

## 🏁 Quick Start for Organizers

1. **Prepare the Code**  
   - Create a GitHub Gist with the code.
   - Click **Raw** and copy the raw URL.

2. **Generate the Link**
   - **Python (10 mins)**  
     ```
     ?lang=python&time=600&gist=YOUR_RAW_URL
     ```
   - **C (5 mins)**  
     ```
     ?lang=c&time=300&gist=YOUR_RAW_URL
     ```

---

## ⚖️ Competition Rules (Recommended)

- **Objective**  
  Retype the source code exactly as shown.

- **Blind Mode**  
  Code is hidden until the timer ends or **Finish Early** is clicked.

- **Scoring Priority**
  1. Program runs and produces correct output  
  2. Fewest syntax/logical errors  
  3. Fastest completion time  

---

## 🛠️ Tech Stack

- **Editor**: Monaco Editor  
- **Python Runtime**: Pyodide  
- **C Execution**: Piston API  
- **Styling**: Custom CSS (Tokyo Night–inspired cinematic theme)

---

## 📄 License

Distributed under the **MIT License**.  
See `LICENSE` for more information.
