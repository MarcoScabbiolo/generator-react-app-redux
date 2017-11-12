# Contributing

Always use vanilla JavaScript, we're conditioned by node >=6 and transpiling is not really necessary. Code styling is enforced by prettier.

If you add features for a specific framework or library make sure the user always gets to choose.

Please do not use different template files to create the same output file, instead use ASTs programatically in the generator itself.

## Where to contribute

Make pull requests to `master` only to make changes to the documentation. Every other pull request is done on the `develop` branch.

If you don't add tests or test coverage falls bellow 90% and/or maintainability falls below `B` please pull to a new branch and we'll help you writing the tests and refactoring as needed.

## Test coverage and maintainability

Ideally, coverage for `master` should be greater than 95% and have no function, statement or line of code misses. Maintainability should be `A`. Tests are excluded for the moment, but let's not neglect the maintainability of tests.

## Discussion

Any architectural or design pattern that the generator might enforce is always open to discussion.