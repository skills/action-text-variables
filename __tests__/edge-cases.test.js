/**
 * Unit tests for edge cases and error handling of the action's main functionality, src/main.js
 * Tests various error conditions and invalid inputs
 */
const core = require('@actions/core')
const main = require('../src/main')

// Mock the GitHub Actions core library
const getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
const setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

describe('Edge Cases and Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Error Responses - Missing inputs
  it('should fail when template is missing', async () => {
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

  it('should fail when template file does not exist', async () => {
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

  it('should fail when template-vars is missing', async () => {
    // Arrange - Mock responses for the inputs
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'template-text':
          return 'Hello {{ name }}'
        default:
          return undefined
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

  // Error Responses - Bad Inputs
  it('should fail when template-vars is a number', async () => {
    // Arrange - Mock responses for the inputs
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'template-text':
          return 'Hello {{ name }}'
        case 'template-vars':
          return 1234
        default:
          return undefined
      }
    })

    // Act - Run action to cause the error
    await main.run()
    expect(runMock).toHaveReturned()

    // Assert - Action was closed with correct error message
    expect(setFailedMock).toHaveBeenNthCalledWith(
      1,
      expect.stringMatching(/Invalid input/)
    )
  })

  it('should fail when template-vars is an empty string', async () => {
    // Arrange - Mock responses for the inputs
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'template-text':
          return 'Hello {{ name }}'
        case 'template-vars':
          return ''
        default:
          return undefined
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

  it('should fail when template-vars contains malformed JSON', async () => {
    // Arrange - Mock responses for the inputs
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'template-text':
          return 'Hello {{ name }}'
        case 'template-vars':
          return '{ "name": "John, "forgot": "closing quote" }'
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
      expect.stringMatching(/Invalid input/)
    )
  })

  it('should fail when template-vars contains malformed YAML', async () => {
    // Arrange - Mock responses for the inputs
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'template-text':
          return 'Hello {{ name }}'
        case 'template-vars':
          return `
name: "John1
  invalid: yaml: format
          `
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
      expect.stringMatching(/Invalid input/)
    )
  })

  it('should fail when template-vars contains invalid variable format', async () => {
    // Arrange - Mock responses for the inputs
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'template-text':
          return 'Hello {{ name }}'
        case 'template-vars':
          return `
            name!=John1
          `
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
      expect.stringMatching(/Invalid input/)
    )
  })
})
