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

| Input Name      | Description                                                | Required | Default |
| --------------- | ---------------------------------------------------------- | -------- | ------- |
| `template-file` | The path to a text file to load as the template.           | No       | -       |
| `template-text` | The template text with variable placeholders.              | No       | -       |
| `template-vars` | A JSON object containing variables to replace in the text. | Yes      | -       |

## Workflow Outputs

After replacing variables in the template, the modified text is returned as an
Action output. As such it can easily be referenced in subsequent steps.

| Output Name    | Description                               |
| -------------- | ----------------------------------------- |
| `updated-text` | The text content with variables replaced. |

