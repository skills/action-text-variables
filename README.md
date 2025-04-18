# Text Variables Action 📝

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub release](https://img.shields.io/github/release/skills/action-text-variables.svg)](https://github.com/skills/action-text-variables/releases)
[![Continuous Integration](https://github.com/skills/action-text-variables/actions/workflows/ci.yml/badge.svg)](https://github.com/skills/action-text-variables/actions/workflows/ci.yml)

Replace mustache style variables (`{{ variable }}`) in text templates. Returns
modified text as an output for use in other actions.

## Use Cases 💡

- **Dynamic Content Creation**: Build customized Issue or PR descriptions beyond
  GitHub's built-in templating
- **Consistent Formatting**: Maintain a uniform style for comments on issues and
  pull requests
- **Variable Replacement**: Easily inject variables into any text content
  (files, issues, PRs, comments, wiki pages)

## Basic Usage 🚀

### Direct Text with JSON Variables

```yaml
steps:
  - name: Build comment using template
    id: build-comment
    uses: skills/action-text-variables@v1
    with:
      template-text: 'Hello {{ login }}, nice to meet you!'
      template-vars: >
        {
          "login": "${{ github.actor }}"
        }

  - name: Do something with result
    run: echo "${{ steps.build-comment.outputs.updated-text }}"
```

### Direct Text with YAML Variables

```yaml
steps:
  - name: Build comment using template
    id: build-comment
    uses: skills/action-text-variables@v1
    with:
      template-text: 'Hello {{ login }}, nice to meet you!'
      template-vars: |
        login: ${{ github.actor }}

  - name: Do something with result
    run: echo "${{ steps.build-comment.outputs.updated-text }}"
```

## Inputs ⚙️

Provide the template as a file or directly as text. If both are provided, the
file will be ignored.

| Input Name      | Description                                      | Required |
| --------------- | ------------------------------------------------ | -------- |
| `template-file` | The path to a text file to load as the template. | No\*     |
| `template-text` | The template text with variable placeholders.    | No\*     |
| `template-vars` | A YAML dictionary or JSON object.                | Yes      |

\*One of either `template-file` or `template-text` must be provided.

## Outputs 📤

| Output Name    | Description                               |
| -------------- | ----------------------------------------- |
| `updated-text` | The text content with variables replaced. |

## Examples 🔥

### Use Template From Same Repository

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v4

  - name: Build comment using template
    id: build-comment
    uses: skills/action-text-variables@v1
    with:
      template-file: my-files/my-template.md
      template-vars: >
        {
          "login": "${{ github.actor }}"
        }

  - name: Do something with result
    run: echo "${{ steps.build-comment.outputs.updated-text }}"
```

### Use Template From Another Repository

<!-- prettier-ignore-start -->
```yaml
steps:
  - name: Get templates from another repository
    uses: actions/checkout@v4
    with:
      repository: skills/exercise-toolkit
      path: exercise-toolkit

  - name: Show available templates
    run: ls -R exercise-toolkit/markdown-templates

  - name: Build comment using template
    id: build-comment
    uses: skills/action-text-variables@v1
    with:
      template-file: exercise-toolkit/markdown-templates/step-feedback/lesson-finished.md
      template-vars: >
        {
          "login": "${{ github.actor }}",
          "repo_full_name": "${{ github.repository }}"
        }

  - name: Do something with result
    run: echo "${{ steps.build-comment.outputs.updated-text }}"
```
<!-- prettier-ignore-end -->
