const core = require('@actions/core')
const fs = require('fs')
const path = require('path')
const mustache = require('mustache')

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

    // Try to convert templateVars to JSON
    if (typeof templateVars === 'string' && templateVars.length > 0) {
      try {
        templateVars = JSON.parse(templateVars)
      } catch (error) {
        throw new Error("Invalid JSON input: 'template-vars'")
      }
    } else {
      throw new Error("Invalid JSON input: 'template-vars'")
    }

    // If templateText is blank, try loading from the file
    if (templateText === '') {
      const filePath = path.resolve(templateFile)
      templateText = fs.readFileSync(filePath, 'utf8')
    }

    // Replace variables in template
    const output = mustache.render(templateText, templateVars)

    // Save to output for use in other actions
    core.setOutput('updated-text', output)
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error.message)
  }
}

module.exports = {
  run
}
