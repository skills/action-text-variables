# Sample Nunjucks Template

## Basic Variables (same as before)
Hello {{ name }}!

Your email is: {{ user.email }}

## Enhanced Nunjucks Features (now available)

### Conditional Content
{% if user.role == 'admin' %}
🔑 You have admin privileges!
{% else %}
👤 Regular user access
{% endif %}

### Loops
Your repositories:
{% for repo in repositories %}
- {{ repo.name }} ({{ repo.language }})
{% endfor %}

### Filters
- Uppercase: {{ name | upper }}
- Title case: {{ name | title }}
- Default value: {{ missing_var | default("Not provided") }}

### Built-in Functions
- Current date: {{ moment().format('YYYY-MM-DD') if moment else 'Date not available' }}

---
*Note: While these enhanced features are now available with Nunjucks, 
the basic {{ variable }} syntax remains fully compatible with existing templates.*