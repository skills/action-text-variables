# Action: Text Variables

Replace mustache style variables in text templates. Returns modified text as an
output for use in other actions.

Typical uses:

- Dynamically build an Issue or Pull Request description, beyond GitHub's
  built-in templating.
- Using a consistent format for commenting on issues and pull requeests.
- Replace variables in committed files, issues, prs, comments, wiki pages.

## Workflow Inputs

Provide the template as a file or direclty as text. If both are provided, the
file will be ignored.

| Input Name      | Description                                      | Required | Default |
| --------------- | ------------------------------------------------ | -------- | ------- |
| `template-file` | The path to a text file to load as the template. | No       | -       |
| `template-text` | The template text with variable placeholders.    | No       | -       |
| `template-vars` | An ENV style list or stringified JSON object.    | Yes      | -       |

## Workflow Outputs

After replacing variables in the template, the modified text is returned as an
Action output. As such it can easily be referenced in subsequent steps.

| Output Name    | Description                               |
| -------------- | ----------------------------------------- |
| `updated-text` | The text content with variables replaced. |

## Scenarios

### Direct Text (JSON variables)

```yaml
steps:
  - name: Build comment using template
    id: build-comment
    uses: chriswblake/action-text-variables@v1
    with:
      template-text: 'Hello {{ login }}, nice to meet you!'
      template-vars: '{"login": "${{ github.actor }}" }'

  - name: Do something with result
    run: echo "${{ steps.build-comment.outputs.updated-text }}"
```

### Direct Text (ENV variables)

```yaml
steps:
  - name: Build comment using template
    id: build-comment
    uses: chriswblake/action-text-variables@v1
    with:
      template-text: 'Hello {{ login }}, nice to meet you!'
      template-vars: |
        login=${{ github.actor }}

  - name: Do something with result
    run: echo "${{ steps.build-comment.outputs.updated-text }}"
```

### Use template from same repository

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v4

  - name: Build comment using template
    id: build-comment
    uses: chriswblake/action-text-variables@v1
    with:
      template-file: my-files/my-template.md
      template-vars: '{ "login": "${{ github.actor }}" }'

  - name: Do something with result
    run: echo "${{ steps.build-comment.outputs.updated-text }}"
```

### Use template from other repository

<!-- prettier-ignore-start -->
```yaml
steps:
  - name: Get templates from another repository
    uses: actions/checkout@v4
    with:
      repository: chriswblake/feedback-templates
      path: feedback-templates

  - name: Show available templates
    run: ls -R feedback-templates

  - name: Build comment using template
    id: build-comment
    uses: chriswblake/action-text-variables@v1
    with:
      template-file: feedback-templates/skill-step-feedback/lesson-finished.md
      template-vars: '{
          "login": "${{ github.actor }}",
          "repo_full_name": "${{ github.repository }}"
        }'

  - name: Do something with result
    run: echo "${{ steps.build-comment.outputs.updated-text }}"
```
<!-- prettier-ignore-end -->
