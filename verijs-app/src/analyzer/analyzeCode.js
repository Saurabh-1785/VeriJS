import * as parser from "@babel/parser";
import traverse from "@babel/traverse";

/**
 * Analyzes JavaScript source code for common issues using AST-based static analysis.
 * Ported from the original VeriJS CLI analyzer — all original rules preserved and enhanced.
 *
 * @param {string} code - The JavaScript source code to analyze
 * @returns {{ warnings: Array<{line: number, message: string, severity: string}>, error: string|null }}
 */
export default function analyzeCode(code) {
  if (!code || !code.trim()) {
    return { warnings: [], error: null };
  }

  let ast;
  try {
    ast = parser.parse(code, {
      sourceType: "module",
      plugins: ["jsx"],
      errorRecovery: true,
    });
  } catch (err) {
    return {
      warnings: [],
      error: `Syntax Error: ${err.message}`,
    };
  }

  const declared = new Map();
  const used = new Set();
  const warnings = [];

  const addWarning = (line, message, severity = "warning") => {
    warnings.push({ line, message, severity });
  };

  try {
    traverse(ast, {
      // Track variable declarations
      VariableDeclarator(path) {
        if (path.node.id && path.node.id.name) {
          declared.set(path.node.id.name, {
            line: path.node.loc.start.line,
            type: path.node.init ? path.node.init.type : "undefined",
            kind: path.parent.kind,
          });
        }
      },

      // Track variable usage
      Identifier(path) {
        if (path.parent.type !== "VariableDeclarator" || path.parent.init === path.node) {
          used.add(path.node.name);
        }
      },

      // Detect unreachable code inside if(false) and empty if blocks
      IfStatement(path) {
        if (
          path.node.test.type === "BooleanLiteral" &&
          path.node.test.value === false
        ) {
          addWarning(
            path.node.loc.start.line,
            "Unreachable code detected inside if(false) block.",
            "error"
          );
        }
        if (
          path.node.consequent.type === "BlockStatement" &&
          path.node.consequent.body.length === 0
        ) {
          addWarning(
            path.node.loc.start.line,
            "Empty if block detected.",
            "warning"
          );
        }
      },

      // Detect infinite loops: while(true)
      WhileStatement(path) {
        if (
          path.node.test.type === "BooleanLiteral" &&
          path.node.test.value === true
        ) {
          addWarning(
            path.node.loc.start.line,
            "Potential infinite loop detected (while(true)).",
            "error"
          );
        }
      },

      // Detect type mismatch and const reassignment
      AssignmentExpression(path) {
        const left = path.node.left;
        if (!left || !left.name) return;

        const name = left.name;
        const newType = path.node.right.type;

        if (declared.has(name)) {
          const info = declared.get(name);
          if (info.type !== "undefined" && info.type !== newType) {
            addWarning(
              path.node.loc.start.line,
              `Type mismatch for "${name}". Declared as ${info.type} but reassigned as ${newType}.`,
              "warning"
            );
          }
          if (info.kind === "const") {
            addWarning(
              path.node.loc.start.line,
              `Cannot reassign const variable "${name}".`,
              "error"
            );
          }
        }
      },

      // Detect var usage
      VariableDeclaration(path) {
        if (path.node.kind === "var") {
          addWarning(
            path.node.loc.start.line,
            'Avoid using "var". Use "let" or "const" instead.',
            "warning"
          );
        }
      },

      // Detect loose equality and division by zero
      BinaryExpression(path) {
        if (path.node.operator === "==") {
          addWarning(
            path.node.loc.start.line,
            'Use "===" instead of "==" for strict equality.',
            "warning"
          );
        }
        if (path.node.operator === "!=") {
          addWarning(
            path.node.loc.start.line,
            'Use "!==" instead of "!=" for strict inequality.',
            "warning"
          );
        }
        if (
          path.node.right.type === "NumericLiteral" &&
          path.node.right.value === 0 &&
          path.node.operator === "/"
        ) {
          addWarning(
            path.node.loc.start.line,
            "Division by zero detected.",
            "error"
          );
        }
      },

      // Detect unreachable code after return
      ReturnStatement(path) {
        const body = path.parent.body;
        if (!body) return;
        const index = body.indexOf(path.node);
        if (index !== -1 && index < body.length - 1) {
          addWarning(
            path.node.loc.start.line,
            "Unreachable code detected after return statement.",
            "error"
          );
        }
      },
    });
  } catch (err) {
    return {
      warnings,
      error: `Analysis Error: ${err.message}`,
    };
  }

  // Check for unused variables
  for (let [name, info] of declared) {
    if (!used.has(name)) {
      addWarning(
        info.line,
        `Variable "${name}" is declared but never used.`,
        "info"
      );
    }
  }

  // Sort warnings by line number
  warnings.sort((a, b) => a.line - b.line);

  return { warnings, error: null };
}
