# How to Develop

1. Open this project using the dev container config.
1. Make your changes. Build into the `dist` folder using `npm run bundle`.
1. Verify all tests run, either in the VS Code test runner or by running
   `npm test` in the terminal.
1. Try running using the workflows in the `examples` folder.
1. Verify the workflows run in `.github/workflows` using the `act` tool.
   - Check formatting:  
     `act pull_request -W .github/workflows/linter.yml`
   - Check the build matches with source:  
     `act pull_request -W .github/workflows/check-dist.yml`
   - Check that all tests pass:  
     `act pull_request -W .github/workflows/ci.yml`
   - Use CodeQL to check for security vulnerabilities:  
     `act pull_request -W .github/workflows/codeql-analysis.yml`
1. Update version in `package.json`.
1. Merge to `main`. Create a release with same tag as `package.json` version.
1. Update the major version tag.

## Setup Nektos/Act

```bash
# .actrc
--var-file .act.vars
--secret-file=.act.secrets
--action-offline-mode
--container-architecture=linux/amd64
```
