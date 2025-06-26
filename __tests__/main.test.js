/**
 * Unit tests for the action's main functionality, src/main.js
 */
const core = require('@actions/core')
const main = require('../src/main')

// Mock the GitHub Actions core library
const getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
const setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
const setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

// Other utilities

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Proper Usage - JSON
  it('Use template file - JSON', async () => {
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
    expect(outputValue).toMatch(/🔑 You have admin privileges!/)
    expect(outputValue).toMatch(/- repo1 \(JavaScript\)/)
    expect(outputValue).toMatch(/- repo2 \(Python\)/)
    expect(outputValue).toMatch(/Uppercase: JOHN1/)
    expect(outputValue).toMatch(/Title case: John1/)
    expect(outputValue).toMatch(/Default value: Not provided/)
    expect(outputValue).toMatch(/Line 1\s*Line 2/)
    expect(outputValue).not.toMatch(/unused/)
    expect(outputValue).not.toMatch(/extra value/)
  })

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

  it('Use template text - JSON', async () => {
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

  // Proper Usage - YAML format
  it('Use template text - YAML', async () => {
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

  // Error Responses - Missing inputs
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

  it('Missing template-vars. Set failed status.', async () => {
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
  it('Provided number for template-vars. Set failed status.', async () => {
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

  it('Provided empty string for template-vars. Set failed status.', async () => {
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

  it('Badly formed JSON for template-vars. Set failed status.', async () => {
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

  it('Badly formed YAML for template-vars. Set failed status.', async () => {
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

  it('Badly formed variable list for template-vars. Set failed status.', async () => {
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

  // Methods
  it('parseTemplateVars - JSON', () => {
    // Arrange
    const variables = JSON.stringify({
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
    // Act
    const result = main.parseTemplateVars(variables)

    // Assert
    expect(result.name).toEqual('John1')
    expect(result['person']['name']).toEqual('John2')
    expect(result['person']['unused_value']).toEqual('unused')
    expect(result.multiline_paragraph).toMatch(/Line 1\s*Line 2/)
  })

  it('parseTemplateVars - YAML', () => {
    // Arrange
    const variables = `
    name: John1
    person:
      name: John2
      unused_value: unused
    multiline_paragraph: |
      Line 1
      Line 2
    `
    // Act
    const result = main.parseTemplateVars(variables)

    // Assert
    expect(result.name).toEqual('John1')
    expect(result.person.name).toEqual('John2')
    expect(result.person.unused_value).toEqual('unused')
    expect(result.multiline_paragraph).toMatch(/Line 1\s*Line 2/)
  })

  it('parseTemplateVars - invalid YAML', () => {
    // Arrange
    const variables = `
    name: "John1
    invalid: yaml: format
    `
    // Act
    const parseAction = () => main.parseTemplateVars(variables)

    // Assert
    expect(parseAction).toThrow(/Invalid input/)
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
