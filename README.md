# VeriJS - Static Analyzer for JavaScript

> A lightweight static analysis tool that detects semantic issues in JavaScript source code by parsing it into an Abstract Syntax Tree (AST) and applying rule-based analysis without executing the code. Now available as a **React web app** with a live code editor and instant visual feedback.

---

## What is Static Analysis?

Static analysis is the process of examining source code **without running it**. Instead of executing the program, the analyzer parses the code into a structured tree (AST) and applies rules to detect potential bugs, bad practices, and logical errors at the structural level.

This is the same core technique used by professional tools like ESLint, TypeScript, and Facebook's Flow.

---

## How VeriJS Works

```
User writes JS in the editor (left panel)
     ↓
Clicks "Execute"
     ↓
@babel/parser → Abstract Syntax Tree (AST)
     ↓
@babel/traverse → Walk through AST nodes
     ↓
Rule Engine → Apply analysis rules
     ↓
Warning Collector → Gather all issues
     ↓
Issues displayed in the output panel (right panel)
```

The AST represents your code as a structured tree of nodes. For example:

```js
let x = 5;
```

Becomes a tree like:

```
Program
 └── VariableDeclaration
      └── VariableDeclarator
           ├── Identifier (name: "x")
           └── NumericLiteral (value: 5)
```

VeriJS walks this tree and checks each node against a set of rules.

---

## Features

| Rule | Description |
|------|-------------|
| Unused Variable Detection | Detects variables that are declared but never referenced |
| Unreachable Code Detection | Detects code inside `if(false)` blocks that will never execute |
| Infinite Loop Detection | Detects `while(true)` loops with no exit condition |
| Type Mismatch Detection | Warns when a variable is reassigned with a different type |
| Const Reassignment | Detects illegal reassignment of `const` variables |
| var Usage | Warns against using `var` — recommends `let` or `const` |
| Loose Equality | Warns when `==` is used instead of strict `===` |
| Loose Inequality | Warns when `!=` is used instead of strict `!==` |
| Division by Zero | Detects expressions like `x / 0` |
| Unreachable Code After Return | Detects dead code that appears after a `return` statement |
| Empty If Block | Detects `if` statements with empty bodies |

---

## UI Overview

The web app features a split-panel layout inspired by online compilers:

- **Left Panel** — Monaco-powered code editor where users write JavaScript
- **Right Panel** — Issues output showing analysis results with severity badges (`ERROR`, `WARN`, `INFO`), line numbers, and descriptions
- **Toolbar** — Contains **Execute** (run analysis), **Clear** (reset output), and **Reset** (restore sample code) buttons

Issues are color-coded by severity and sorted by line number for easy navigation.

---

## Installation

Make sure you have **Node.js** (v16+) installed, then:

```bash
git clone https://github.com/Saurabh-1785/VeriJS.git
cd VeriJS/verijs-app
npm install
```

---

## Usage

### Web App (React)

```bash
cd verijs-app
npm start
```

This starts the development server at `http://localhost:3000`. Write JavaScript in the editor and click **Execute** to see analysis results.

### CLI (Original)

The original command-line analyzer is still available in the project root:

```bash
node analyzer.js <yourfile.js>
```

Example:

```bash
node analyzer.js code.js
```

---

## Example Output

Given this input code in the editor:

```js
var name = "Saurabh";
const pi = 3.14;
pi = 5;
let x = 5;
let y = 10;
console.log(x);
if(false) {
  console.log("hi");
}
if(true) {
}
while(true) {
  console.log("looping");
}
let z = 6;
z = "hello";
if(x == y) {
  console.log("equal");
}
let result = x / 0;
function test() {
  return 42;
  console.log("never runs");
}
```

Clicking **Execute** produces issues such as:

| Severity | Line | Issue |
|----------|------|-------|
| WARN | 1 | Avoid using "var". Use "let" or "const" instead. |
| ERROR | 3 | Cannot reassign const variable "pi". |
| ERROR | 7 | Unreachable code detected inside if(false) block. |
| WARN | 10 | Empty if block detected. |
| ERROR | 12 | Potential infinite loop detected (while(true)). |
| WARN | 17 | Type mismatch for "z". Declared as NumericLiteral but reassigned as StringLiteral. |
| WARN | 19 | Use "===" instead of "==" for strict equality. |
| ERROR | 21 | Division by zero detected. |
| ERROR | 23 | Unreachable code detected after return statement. |
| INFO | 5 | Variable "y" is declared but never used. |

---

## Project Structure

```
VeriJS/
├── package.json               # Root project dependencies
├── README.md                  # Project documentation
└── verijs-app/                # React web application
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── analyzer/
    │   │   ├── analyzeCode.js # Core analysis engine (browser-compatible)
    │   │   └── index.js
    │   ├── components/
    │   │   ├── CodeEditor.jsx # Monaco editor component (left panel)
    │   │   ├── OutputPanel.jsx# Issues display component (right panel)
    │   │   ├── Toolbar.jsx    # Top bar with Execute/Clear/Reset
    │   │   └── index.js
    │   ├── constants/
    │   │   └── sampleCode.js  # Default sample code
    │   ├── App.js             # Main app with state management
    │   ├── App.css            # Full dark-theme styling
    │   └── index.js           # Entry point
    └── package.json           # React app dependencies
```

---

## Tech Stack

- **React** — UI framework for the web application
- **Monaco Editor** — VS Code's editor component for the code input panel
- **@babel/parser** — Parses JavaScript source code into AST
- **@babel/traverse** — Traverses AST nodes for rule application
- **Node.js** — Runtime environment (CLI version)

---

## Concepts Behind the Tool

**Abstract Syntax Tree (AST)** — A tree representation of the syntactic structure of source code. Each node in the tree represents a construct in the code.

**AST Traversal** — The process of visiting each node in the tree. VeriJS uses visitor pattern — each rule registers itself for specific node types.

**Data Flow Analysis** — Tracking how variables are declared and used across statements. Used in the unused variable and type mismatch detectors.

**Control Flow Analysis** — Reasoning about which parts of code are reachable. Used in unreachable code and post-return code detectors.

---

## Future Work

- Extend analyzer for formal semantic equivalence validation between transformed programs
- Add scope-aware analysis for variables inside functions
- Support for cross-file analysis
- JSON output flag (`--json`) for integration with other tools
- Control Flow Graph (CFG) visualization
- Inline editor annotations (underline issues directly in the editor)

---

## Author

Built as a research-oriented prototype demonstrating static analysis fundamentals using AST-based rule engines.