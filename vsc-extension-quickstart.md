# VS Code Extension Quickstart – TSDoc Gen

This guide is for contributors and maintainers of the `tsdoc-gen` extension.  
It covers how to run, build, test, and package the extension for development.

---

## 🛠️ Getting Started

1. Clone the repo:

   ```bash
   git clone https://github.com/your-username/tsdoc-gen.git
   cd tsdoc-gen
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Compile TypeScript:

   ```bash
   npm run compile
   ```

4. Open the folder in **VS Code**

5. Press `F5` to launch the Extension Development Host window

---

## 🔁 Making Changes

- Source code is under `src/`
- Templates and formatting logic live in `core/`
- Handlers follow the strategy pattern: see `core/generators/`
- Configuration options are declared in `package.json`

---

## 🧪 Testing (Coming Soon)

Tests will live under:

```
src/
└── tests/
    ├── tsdoc-builder.test.ts
    ├── function-handler.test.ts
    └── ...
```

To run tests:

```bash
npm test
```

---

## 📦 Packaging the Extension

To build a `.vsix` file for local installation or publishing:

```bash
npm install -g vsce
vsce package
```

---

## ⚙ Recommended Tools

- VS Code Extension Pack: `Extension Development`
- Node.js ≥ 16.x
- TypeScript ≥ 5.x
