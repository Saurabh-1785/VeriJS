# VeriJS - Static Analyzer for JavaScript

> A lightweight static analysis tool that detects semantic issues in JavaScript source code by parsing it into an Abstract Syntax Tree (AST) and applying rule-based analysis without executing the code.

---

## What is Static Analysis?

Static analysis is the process of examining source code **without running it**. Instead of executing the program, the analyzer parses the code into a structured tree (AST) and applies rules to detect potential bugs, bad practices, and logical errors at the structural level.

This is the same core technique used by professional tools like ESLint, TypeScript, and Facebook's Flow.

---

## How VeriJS Works

```
Input JS File
     ↓
@babel/parser → Abstract Syntax Tree (AST)
     ↓
@babel/traverse → Walk through AST nodes
     ↓
Rule Engine → Apply analysis rules
     ↓
Warning Collector → Gather all issues
     ↓
Final Report Output
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
| Division by Zero | Detects expressions like `x / 0` |
| Unreachable Code After Return | Detects dead code that appears after a `return` statement |
| Empty If Block | Detects `if` statements with empty bodies |

---


## Installation

Make sure you have Node.js installed, then:

```bash
git clone https://github.com/yourusername/VeriJS.git
cd VeriJS
npm install
```

---

## Usage

```bash
node analyzer.js <yourfile.js>
```

Example:

```bash
node analyzer.js code.js
```

---

## Example Output

Given this input file:

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
while(true) {
  console.log("looping");
}
let z = 6;
z = "hello";
```

VeriJS produces:

```
=============================
     VeriJS Analysis Report
=============================
 [Line 1]  Avoid using "var". Use "let" or "const" instead.
 [Line 3]  Cannot reassign const variable "pi".
 [Line 7]  Unreachable code detected inside if block.
 [Line 10] Infinite loop detected.
 [Line 13] Type mismatch for "z". Declared as NumericLiteral but reassigned as StringLiteral.
 [Line 5]  Variable "y" is declared but never used.
=============================
  Total issues found: 6
=============================
```

---

## Project Structure

```
VeriJS/
├── analyzer.js       # Core analysis engine
├── code.js           # Sample test file
├── package.json      # Project dependencies
└── README.md         # Project documentation
```

---

## Tech Stack

- **Node.js** — Runtime environment
- **@babel/parser** — Parses JavaScript source code into AST
- **@babel/traverse** — Traverses AST nodes for rule application

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

---

## Author

Built as a research-oriented prototype demonstrating static analysis fundamentals using AST-based rule engines.