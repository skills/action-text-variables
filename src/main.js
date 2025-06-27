const core = require('@actions/core')
const fs = require('fs')
const path = require('path')
const nunjucks = require('nunjucks')
const yaml = require('js-yaml')

async function run() {
  try {
    // Get inputs
    let templateText = core.getInput('template-text', {
      required: false,
      trimWhitespace: true
    })
    const templateFile = core.getInput('template-file', {
      required: false,
      trimWhitespace: true
    })
    let templateVars = core.getInput('template-vars', {
      required: true,
      trimWhitespace: true
    })

    // Check inputs
    if (!templateText && !templateFile) {
      throw new Error(
        "Missing required input: 'template-text' or 'template-file'"
      )
    }
    if (!templateVars) {
      throw new Error("Missing required input: 'template-vars'")
    }
    if (!(typeof templateVars === 'string')) {
      throw new Error("Invalid input: 'template-vars' must be a string")
    }

    // If templateText is blank, try loading from the file
    if (templateText === '') {
      const filePath = path.resolve(templateFile)
      templateText = fs.readFileSync(filePath, 'utf8')
    }

    // Parse the template variables into json object
    templateVars = parseTemplateVars(templateVars)

    // Replace variables in template
    // Configure nunjucks for secure rendering (autoescape enabled by default)
    const output = nunjucks.renderString(templateText, templateVars)

    // Save to output for use in other actions
    core.setOutput('updated-text', output)
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error.message)
  }
}

function parseTemplateVars(vars) {
  let templateVars = {}

  // Try loading as JSON style first
  try {
    templateVars = JSON.parse(vars)
    if (Object.keys(templateVars).length > 0) {
      return templateVars
    }
  } catch (error) {
    // Do nothing, try next format
  }

  // Try loading as YAML style
  try {
    templateVars = yaml.load(vars)
    if (
      templateVars &&
      typeof templateVars === 'object' &&
      !Array.isArray(templateVars) &&
      Object.keys(templateVars).length > 0
    ) {
      return templateVars
    }
  } catch (error) {
    // Do nothing
  }

  // If we get here, the input is not a valid format
  throw new Error(
    "Invalid input: 'template-vars' must be valid JSON or YAML format"
  )
}

module.exports = {
  run,
  parseTemplateVars
}
