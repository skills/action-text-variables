# Sample Nunjucks Template

## Basic Variables

Hello {{ name }}!

Your email is: {{ user.email }}

## Enhanced Nunjucks Features

### Conditional Content

{% if user.role == 'admin' %} 🔑 You have admin privileges! {% else %} 👤
Regular user access {% endif %}

### Loops

Your repositories: {% for repo in repositories %}

- {{ repo.name }} ({{ repo.language }}) {% endfor %}

### Filters

- Uppercase: {{ name | upper }}
- Title case: {{ name | title }}
- Default value: {{ missing_var | default("Not provided") }}

### Multiline Content

{{ multiline_paragraph }}

### URL Testing

Visit the repository at: https://github.com/{{full_repo_name}}
