const core = require('@actions/core')
const fs = require('fs')
const path = require('path')
const mustache = require('mustache')
const dotenv = require('dotenv')

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
    if (!templateVars === 'string') {
      throw new Error("Invalid input: 'template-vars' must be a string")
    }
    if (templateVars.length == 0) {
      throw new Error("Invalid input: 'template-vars' must not be empty")
    }

    // If templateText is blank, try loading from the file
    if (templateText === '') {
      const filePath = path.resolve(templateFile)
      templateText = fs.readFileSync(filePath, 'utf8')
    }

    // Parse the template variables into json object
    templateVars = parseTemplateVars(templateVars)

    // Replace variables in template
    const output = mustache.render(templateText, templateVars)

    // Save to output for use in other actions
    core.setOutput('updated-text', output)
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error.message)
  }
}

function parseTemplateVars(vars) {
  let templateVars = {}

  // Try loading as ENV style. Dotenv fails silently.
  templateVars = dotenv.parse(vars)
  if (Object.keys(templateVars).length > 0) {
    return templateVars
  }

  // Try loading as JSON style
  try {
    templateVars = JSON.parse(vars)
    if (Object.keys(templateVars).length > 0) {
      return templateVars
    }
  } catch (error) {
    // Do nothing
  }

  // If we get here, the input is not valid
  throw new Error("Invalid input: 'template-vars' is not a supported format")
}

module.exports = {
  run,
  parseTemplateVars
}
