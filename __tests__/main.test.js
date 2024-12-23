/**
 * Unit tests for the action's main functionality, src/main.js
 */
const core = require('@actions/core')
const main = require('../src/main')

// Mock the GitHub Actions core library
const debugMock = jest.spyOn(core, 'debug').mockImplementation()
const getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
const setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
const setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

// Other utilities
const timeRegex = /^\d{2}:\d{2}:\d{2}/

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Proper Usage
  it('Use template file', async () => {
    // Arrange - Mock responses for the inputs
    getInputMock.mockImplementation(inputName => {
      switch (inputName) {
        case 'template-file':
          return '__tests__/sample-template.md'
        case 'template-vars':
          return JSON.stringify({
            name: 'John1',
            person: {
              name: 'John2',
              unused_value: 'unused'
            },
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
    expect(outputValue).toMatch(/Simple Variable: John1/)
    expect(outputValue).toMatch(/SubObject Variable: John2/)
    expect(outputValue).toMatch(/Line 1\s*Line 2/)
    expect(outputValue).not.toMatch(/unused/)
    expect(outputValue).not.toMatch(/extra value/)
  })

  it('Use template text', async () => {
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

  // Error Responses
  it('Missing template. Set failed status.', async () => {
    // Arrange - Mock responses for the inputs
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'template-vars':
          return '{}'
        default:
          return ''
      }
    })

    // Act - Run action to cause the error
    await main.run()
    expect(runMock).toHaveReturned()

    // Assert - Action was closed with correct error message
    expect(setFailedMock).toHaveBeenNthCalledWith(
      1,
      expect.stringMatching(/Missing required input/)
    )
  })

  it('Missing template file. Set failed status.', async () => {
    // Arrange - Mock responses for the inputs
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'template-file':
          return 'bad/path/to/template.md'
        case 'template-vars':
          return '{}'
        default:
          return ''
      }
    })

    // Act - Run action to cause the error
    await main.run()
    expect(runMock).toHaveReturned()

    // Assert - Action was closed with correct error message
    expect(setFailedMock).toHaveBeenNthCalledWith(
      1,
      expect.stringMatching(/no such file/)
    )
  })

  it('Badly formed JSON. Set failed status.', async () => {
    // Arrange - Mock responses for the inputs
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'template-text':
          return 'Hello {{ name }}'
        case 'template-vars':
          return '{ forgot quotations on values }'
        default:
          return ''
      }
    })

    // Act - Run action to cause the error
    await main.run()
    expect(runMock).toHaveReturned()

    // Assert - Action was closed with correct error message
    expect(setFailedMock).toHaveBeenNthCalledWith(
      1,
      expect.stringMatching(/Invalid JSON input/)
    )
  })
})
