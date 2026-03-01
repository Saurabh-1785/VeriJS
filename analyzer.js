const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const fs = require("fs");

const file = process.argv[2];
if (!file) {
  console.log("Usage: node analyzer.js <filename.js>");
  process.exit(1);
}

const code = fs.readFileSync(file, "utf-8");
const ast = parser.parse(code);

const declared = new Map();
const used = new Set();
const warnings = [];

traverse(ast, {
  VariableDeclarator(path) {
    declared.set(path.node.id.name, {
      line: path.node.loc.start.line,
      type: path.node.init ? path.node.init.type : "undefined",
      kind: path.parent.kind
    });
  },

  Identifier(path) {
    if (path.parent.type !== "VariableDeclarator") {
      used.add(path.node.name);
    }
  },

  IfStatement(path) {
    if (path.node.test.type === "BooleanLiteral" && path.node.test.value === false) {
      warnings.push(`[Line ${path.node.loc.start.line}]  Unreachable code detected inside if block.`);
    }
    if (path.node.consequent.type === "BlockStatement" && path.node.consequent.body.length === 0) {
      warnings.push(`[Line ${path.node.loc.start.line}]  Empty if block detected.`);
    }
  },

  WhileStatement(path) {
    if (path.node.test.type === "BooleanLiteral" && path.node.test.value === true) {
      warnings.push(`[Line ${path.node.loc.start.line}]  Infinite loop detected.`);
    }
  },

  AssignmentExpression(path) {
    const name = path.node.left.name;
    const newType = path.node.right.type;

    if (declared.has(name)) {
      const info = declared.get(name);
      if (info.type !== newType) {
        warnings.push(`[Line ${path.node.loc.start.line}]  Type mismatch for "${name}". Declared as ${info.type} but reassigned as ${newType}.`);
      }
      if (info.kind === "const") {
        warnings.push(`[Line ${path.node.loc.start.line}]  Cannot reassign const variable "${name}".`);
      }
    }
  },

  VariableDeclaration(path) {
    if (path.node.kind === "var") {
      warnings.push(`[Line ${path.node.loc.start.line}]  Avoid using "var". Use "let" or "const" instead.`);
    }
  },

  BinaryExpression(path) {
    if (path.node.operator === "==") {
      warnings.push(`[Line ${path.node.loc.start.line}]  Use "===" instead of "==" for strict equality.`);
    }
    if (path.node.right.type === "NumericLiteral" && path.node.right.value === 0 && path.node.operator === "/") {
      warnings.push(`[Line ${path.node.loc.start.line}]  Division by zero detected.`);
    }
  },

  ReturnStatement(path) {
    const body = path.parent.body;
    const index = body.indexOf(path.node);
    if (index !== -1 && index < body.length - 1) {
      warnings.push(`[Line ${path.node.loc.start.line}]  Unreachable code detected after return statement.`);
    }
  }
});

for (let [name, info] of declared) {
  if (!used.has(name)) {
    warnings.push(`[Line ${info.line}]  Variable "${name}" is declared but never used.`);
  }
}

console.log("\n=============================");
console.log("     VeriJS Analysis Report");
console.log("=============================");

if (warnings.length === 0) {
  console.log("  No issues found. Clean code!");
} else {
  warnings.forEach(warning => console.log(" " + warning));
}

console.log("=============================");
console.log(`  Total issues found: ${warnings.length}`);
console.log("=============================\n");
