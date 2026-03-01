const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const code = `
let x = 5;
let y = 10;
console.log(x);
`;

const ast = parser.parse(code);

const declared = new Set();
const used = new Set();

traverse(ast, {
  VariableDeclarator(path) {
    declared.add(path.node.id.name);
  },
  Identifier(path) {
    if(path.parent.type !== "VariableDeclarator") {
      used.add(path.node.name);
    }
  },
  IfStatement(path) {
    if(path.node.test.type === "Literal" && path.node.test.value === false) {
        console.warn(`Warning: Unreachable code detected inside if block.`);
    }
    }
});

for(let name of declared) {
  if(!used.has(name)) {
    console.warn(`Warning: Variable "${name}" is declared but never used.`);
  }
}
