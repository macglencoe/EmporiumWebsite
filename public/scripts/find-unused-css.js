const fs = require('fs');
const path = require('path');
const { parse } = require('@babel/parser');

// Function to extract CSS selectors from a <style jsx> tag
function extractCssSelectors(styleTagContent) {
  const cssSelectorRegex = /([^{]+)\s*\{/g;
  const selectors = [];
  let match;
  

  while ((match = cssSelectorRegex.exec(styleTagContent)) !== null) {
    selectors.push(match[1].trim());
    
  }

  return selectors;
}

// Function to extract used CSS selectors from JSX content
function extractUsedCssSelectors(jsxContent) {
  const usedSelectors = [];
  const classRegex = /\bclassName="([^"]+)"\b/g;
  const idRegex = /\bid="([^"]+)"\b/g;
  let match;
  

  while ((match = classRegex.exec(jsxContent)) !== null) {
    usedSelectors.push(...match[1].split(' '));
  }

  while ((match = idRegex.exec(jsxContent)) !== null) {
    usedSelectors.push(`#${match[1]}`);
  }

  return usedSelectors;
}

// Function to extract components from JSX file
function extractComponents(fileContent) {
  const ast = parse(fileContent, {
    sourceType: 'module',
    plugins: ['jsx'],
  });
  

  const components = [];

  ast.program.body.forEach((node) => {

    if (node.type === 'ExportNamedDeclaration' || node.type === 'ExportDefaultDeclaration') {
      const component = node;
      console.log(component);
      if (component.type === 'FunctionDeclaration' || component.type === 'ClassDeclaration' ){
        components.push(component);
      }
    }
  });

  return components;
}

// Function to identify unused CSS selectors for each component
function identifyUnusedCssSelectors(components, fileContent) {
  const unusedSelectors = {};

  components.forEach((component) => {
    const componentName = component.name;
    const componentContent = fileContent.slice(component.start, component.end);

    const styleTagRegex = /<style jsx>([\s\S]+?)<\/style>/g;
    const matches = componentContent.matchAll(styleTagRegex);

    const usedSelectors = extractUsedCssSelectors(componentContent);
    const componentUnusedSelectors = [];

    for (const match of matches) {
      const styleTagContent = match[1];
      const cssSelectors = extractCssSelectors(styleTagContent);

      cssSelectors.forEach((selector) => {
        if (!usedSelectors.includes(selector)) {
          componentUnusedSelectors.push(selector);
        }
      });
    }

    unusedSelectors[componentName] = componentUnusedSelectors;
  });

  return unusedSelectors;
}

// Example usage
const filePath = '../../components/contact.js';
const fileContent = fs.readFileSync(filePath, 'utf8');
const components = extractComponents(fileContent);
const unusedSelectors = identifyUnusedCssSelectors(components, fileContent);

console.log('Unused CSS selectors:');
Object.keys(unusedSelectors).forEach((componentName) => {
  console.log(`Component: ${componentName}`);
  console.log(unusedSelectors[componentName]);
  console.log();
});