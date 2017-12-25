# generator-react-app-redux 
![Build Status][travis] [![Coverage Status][coveralls-badge]][coveralls-status]
[![Maintainability][codeclimate-badge]][codeclimate-status] [![Dependencies Status][davis-badge]][davis]

React &amp; Redux generator, no server side.

The main app generator is working, the others need work. Any [contributions][contribute] are welcome.

## What you'll get

- Working empty [React][react] & [Redux][redux] application
- [Webpack][webpack] & [Webpack Dev Server][webpack-dev-server]
- ES7+ powered by [Babel][babel], [ESLint][eslint] and [prettier][prettier]
- [Jest][jest] setup
- [PostCSS][postcss], [Autoprefixer][autoprefixer], [SASS][sass], CSS and JS minification

Optionally

- [Bootstrap 3][react-bootstrap] ported to React
- [Thunks][redux-thunk]
- Data normalization with [normalizr][normalizr]
- [Redux form][redux-form]
- [HOC to set React components to be loading][react-hoc-loading]
- [Webpack Dashboard][webpack-dashboard]

## Install

```bash
git clone https://github.com/MarcoScabbiolo/generator-react-app-redux.git
cd generator-react-app-redux
npm install
npm link
```

## Run

Install [Yeoman][yeoman] if you don't have it yet.

Run the generator:
```bash
yo react-app-redux
```

If there's something you don't like about the generated proyect [please share your thoughts!][discussion-new]

[discussion-new]: https://github.com/MarcoScabbiolo/generator-react-app-redux/issues/new?labels=discussion
[yeoman]: http://yeoman.io/
[contribute]: Contributing.md
[travis]: https://travis-ci.org/MarcoScabbiolo/generator-react-app-redux.svg?branch=master "Travis CI build status"
[coveralls-status]: https://coveralls.io/github/MarcoScabbiolo/generator-react-app-redux?branch=master
[coveralls-badge]: https://coveralls.io/repos/github/MarcoScabbiolo/generator-react-app-redux/badge.svg?branch=master "Coveralls coverage status"
[codeclimate-status]: https://codeclimate.com/github/MarcoScabbiolo/generator-react-app-redux/maintainability
[codeclimate-badge]: https://api.codeclimate.com/v1/badges/52b628e0764aad1dff9d/maintainability "Code Climate Maintainability"
[davis]: https://david-dm.org/MarcoScabbiolo/generator-react-app-redux
[davis-badge]: https://david-dm.org/MarcoScabbiolo/generator-react-app-redux.svg
[react]: https://reactjs.org/
[redux]: https://redux.js.org/
[webpack]: https://webpack.js.org/
[webpack-dev-server]: https://webpack.js.org/guides/development/#using-webpack-dev-server
[babel]: https://babeljs.io/
[eslint]: https://eslint.org/
[prettier]: https://prettier.io/
[jest]: https://facebook.github.io/jest/
[postcss]: http://postcss.org/
[autoprefixer]: https://css-tricks.com/autoprefixer/
[sass]: http://sass-lang.com/
[react-bootstrap]: https://react-bootstrap.github.io/
[redux-thunk]: https://redux.js.org/docs/advanced/AsyncActions.html#async-action-creators
[redux-form]: https://redux-form.com/7.1.2/
[normalizr]: https://github.com/paularmstrong/normalizr#normalizr----
[react-hoc-loading]: https://github.com/MarcoScabbiolo/react-hoc-loading
[webpack-dashboard]: https://github.com/FormidableLabs/webpack-dashboard#webpack-dashboard
