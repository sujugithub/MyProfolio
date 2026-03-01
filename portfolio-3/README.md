# Sujay Shrestha — Portfolio Website

## 📁 Folder Structure

```
portfolio/
│
├── index.html                  ← Main page (HTML structure only)
│
├── assets/
│   ├── css/
│   │   └── style.css           ← ALL styles (colors, fonts, layout)
│   └── js/
│       └── main.js             ← ALL functionality (animations, game, projects)
│
└── projects/                   ← Each project opens full-page in a new tab
    ├── digit-ai-pro/
    │   └── index.html
    ├── store-busy-predictor/
    │   └── index.html
    ├── calculator/
    │   └── index.html
    ├── password-generator/
    │   └── index.html
    ├── file-manager/
    │   └── index.html
    ├── sanjay-textile-website/
    │   └── index.html
    ├── power-platform-automation/
    │   └── index.html
    ├── mini-games-suite/
    │   └── index.html
    ├── budget-tracker/
    │   └── index.html
    ├── quiz-app/
    │   └── index.html
    └── weather-dashboard/
        └── index.html
```

---

## ✏️ How To Edit

### Change colors
Open `assets/css/style.css` → find `:root { }` at the top:
```css
--accent: #0071e3;   /* ← change this for main blue color */
--text:   #1d1d1f;   /* ← main text color */
--bg:     #f5f5f7;   /* ← page background */
```

### Change your name / tagline
Open `index.html` → find the `<!-- HERO -->` section

### Add a new project
1. Create a folder: `projects/my-new-project/`
2. Put your `index.html` inside it
3. In `index.html`, copy any `proj-card` block and update:
   ```html
   onclick="openProject('my-new-project')"
   ```

### Change contact links
Open `index.html` → find `<!-- CONTACT -->` → update `href` values

### Edit project demos
Each project is a standalone HTML file inside `projects/folder-name/index.html`
Open and edit that file directly.

---

## 🚀 How To Run

Just open `index.html` in any browser — no server needed.

For projects to load, keep all files in the same folder structure.
