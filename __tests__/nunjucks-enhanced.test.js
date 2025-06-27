/**
 * Unit tests for enhanced Nunjucks functionality of the action's main functionality, src/main.js
 * Tests advanced Nunjucks features like conditionals, loops, filters, etc.
 */
const core = require('@actions/core')
const main = require('../src/main')

// Mock the GitHub Actions core library
const getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
const setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
const setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

describe('Enhanced Nunjucks Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Note: This test is currently commented out in the original file
  // Uncomment and modify as needed when enhanced Nunjucks features are implemented
  it('Use template file - JSON with Nunjucks features', async () => {
    // Arrange - Mock responses for the inputs with enhanced Nunjucks features
    getInputMock.mockImplementation(inputName => {
      switch (inputName) {
        case 'template-file':
          return '__tests__/test-template.md'
        case 'template-vars':
          return JSON.stringify({
            name: 'testuser',
            user: {
              email: 'test@example.com',
              role: 'user' // non-admin to test else branch
            },
            repositories: [
              { name: 'awesome-project', language: 'TypeScript' },
              { name: 'cool-tool', language: 'Go' },
              { name: 'web-app', language: 'JavaScript' }
            ]
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

    // Assert - Check Nunjucks enhanced features
    const outputValue = call[1]
    expect(outputValue).toMatch(/Hello testuser!/)
    expect(outputValue).toMatch(/Your email is: test@example.com/)
    expect(outputValue).toMatch(/👤\s*Regular user access/) // non-admin user
    expect(outputValue).toMatch(/- awesome-project \(TypeScript\)/)
    expect(outputValue).toMatch(/- cool-tool \(Go\)/)
    expect(outputValue).toMatch(/- web-app \(JavaScript\)/)
    expect(outputValue).toMatch(/Uppercase: TESTUSER/)
    expect(outputValue).toMatch(/Title case: Testuser/)
    expect(outputValue).toMatch(/Default value: Not provided/)
  })

  // URL scenario test - Common in GitHub Skills exercises
  it('Handle URLs with template variables correctly', async () => {
    // Arrange - Mock responses for URL template scenario
    getInputMock.mockImplementation(inputName => {
      switch (inputName) {
        case 'template-text':
          return 'Visit: https://codespaces.new/{{full_repo_name}}?quickstart=1\n\nOr clone: git clone https://github.com/{{full_repo_name}}.git'
        case 'template-vars':
          return JSON.stringify({
            full_repo_name: 'skills-test/example-repository'
          })
        default:
          return ''
      }
    })

    // Act
    await main.run()

    // Assert
    expect(setOutputMock).toHaveBeenNthCalledWith(
      1,
      'updated-text',
      'Visit: https://codespaces.new/skills-test/example-repository?quickstart=1\n\nOr clone: git clone https://github.com/skills-test/example-repository.git'
    )
    expect(setFailedMock).not.toHaveBeenCalled()
  })
})
