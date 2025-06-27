/**
 * Unit tests for basic functionality of the action's main functionality, src/main.js
 * Tests basic template replacement for both template-file and template-text with JSON and YAML
 */
const core = require('@actions/core')
const main = require('../src/main')

// Mock the GitHub Actions core library
const getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
const setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

describe('Basic Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Basic Variables - JSON - Template File
  it('Basic Variables - JSON - Template File', async () => {
    // Arrange - Mock responses for the inputs
    getInputMock.mockImplementation(inputName => {
      switch (inputName) {
        case 'template-file':
          return '__tests__/test-template.md'
        case 'template-vars':
          return JSON.stringify({
            name: 'John1',
            user: {
              email: 'john1@example.com',
              role: 'admin'
            },
            repositories: [
              { name: 'repo1', language: 'JavaScript' },
              { name: 'repo2', language: 'Python' }
            ],
            unused_value: 'unused',
            multiline_paragraph: `
            Line 1
            Line 2
            `,
            extra_var: 'extra value'
          })
        default:
          return ''
      }
    })

    // Act - Load the template and replace the variables
    await main.run()
    expect(runMock).toHaveReturned()

    // Assert - Check output name
    const call = setOutputMock.mock.calls[0]
    const outputName = call[0]
    expect(outputName).toBe('updated-text')

    // Assert - Check inserted values
    const outputValue = call[1]
    expect(outputValue).toMatch(/Hello John1!/)
    expect(outputValue).toMatch(/Your email is: john1@example.com/)
    expect(outputValue).toMatch(/Line 1\s*Line 2/)
    expect(outputValue).not.toMatch(/unused/)
    expect(outputValue).not.toMatch(/extra value/)
  })

  // Basic Variables - JSON - Template Text
  it('Basic Variables - JSON - Template Text', async () => {
    // Arrange - Mock responses for the inputs
    getInputMock.mockImplementation(inputName => {
      switch (inputName) {
        case 'template-text':
          return 'Hello {{ name }}'
        case 'template-vars':
          return JSON.stringify({
            name: 'John1',
            extra_var: 'extra value'
          })
        default:
          return ''
      }
    })

    // Act - Load the template and replace the variables
    await main.run()
    expect(runMock).toHaveReturned()

    // Assert - Check output name
    const call = setOutputMock.mock.calls[0]
    const outputName = call[0]
    expect(outputName).toBe('updated-text')

    // Assert - Check inserted values
    const outputValue = call[1]
    expect(outputValue).toBe('Hello John1')
    expect(outputValue).not.toMatch(/extra value/)
  })

  // Basic Variables - YAML - Template Text
  it('Basic Variables - YAML - Template Text', async () => {
    // Arrange - Mock responses for the inputs
    getInputMock.mockImplementation(inputName => {
      switch (inputName) {
        case 'template-text':
          return 'Hello {{ name }}'
        case 'template-vars':
          return `
name: John1
extra_var: extra value
          `
        default:
          return ''
      }
    })

    // Act - Load the template and replace the variables
    await main.run()
    expect(runMock).toHaveReturned()

    // Assert - Check output name
    const call = setOutputMock.mock.calls[0]
    const outputName = call[0]
    expect(outputName).toBe('updated-text')

    // Assert - Check inserted values
    const outputValue = call[1]
    expect(outputValue).toBe('Hello John1')
    expect(outputValue).not.toMatch(/extra value/)
  })

  // Basic Variables - YAML - Template File
  it('Basic Variables - YAML - Template File', async () => {
    // Arrange - Mock responses for the inputs
    getInputMock.mockImplementation(inputName => {
      switch (inputName) {
        case 'template-file':
          return '__tests__/test-template.md'
        case 'template-vars':
          return `
name: John1
user:
  email: john1@example.com
  role: admin
repositories:
  - name: repo1
    language: JavaScript
  - name: repo2
    language: Python
unused_value: unused
multiline_paragraph: |
  Line 1
  Line 2
extra_var: extra value
          `
        default:
          return ''
      }
    })

    // Act - Load the template and replace the variables
    await main.run()
    expect(runMock).toHaveReturned()

    // Assert - Check output name
    const call = setOutputMock.mock.calls[0]
    const outputName = call[0]
    expect(outputName).toBe('updated-text')

    // Assert - Check inserted values
    const outputValue = call[1]
    expect(outputValue).toMatch(/Hello John1!/)
    expect(outputValue).toMatch(/Your email is: john1@example.com/)
    expect(outputValue).toMatch(/Line 1\s*Line 2/)
    expect(outputValue).not.toMatch(/unused/)
    expect(outputValue).not.toMatch(/extra value/)
  })
})
