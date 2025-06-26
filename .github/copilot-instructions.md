# GitHub Action: Text Variables

This is a JavaScript-based GitHub Action that replaces nunjucks-style variables
(`{{ variable }}`) in text templates. The action is designed to enable dynamic
content creation for GitHub workflows, particularly for customizing Issue/PR
descriptions, comments, and other text content.

## Code Standards

### Required Before Each Commit

- Run `npm run format:write` to format code with Prettier
- Run `npm run lint` to check code with ESLint
- Run `npm run test` to execute all tests
- Run `npm run all` to run the complete validation pipeline (format, lint, test,
  coverage, package)

## Repository Structure

- `src/`: Core JavaScript source code
  - `index.js`: Entry point for the action
  - `main.js`: Main logic for template processing and variable replacement
- `__tests__/`: Jest test files and sample templates
- `action.yml`: GitHub Action metadata and input/output definitions
- `dist/`: Compiled/bundled output (generated, do not edit directly)

## Code Quality

1. Follow JavaScript best practices and Node.js conventions
1. Use async/await for asynchronous operations
1. Write comprehensive Jest tests for unit testing.
1. Write integration tests for end-to-end validation of the GitHub Action using
   workflows in `.github/workflows/ci.yml`
1. Use descriptive variable names and add comments for complex logic
