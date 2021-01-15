# esbuild-sass-plugin

![Node.js CI](https://github.com/koluch/esbuild-sass-plugin/workflows/Node.js%20CI/badge.svg)

Plugin for [esbuild](https://esbuild.github.io/) to support SASS styles

## Install

```bash
npm i esbuild esbuild-sass-plugin
```

## Usage example

Create file `src/test.scss`:

```scss
body {
  &.red {
    background: red;
  }
}
```

Create file `src/index.js`:

```
import './test.scss'
```


Create file `build.js`:

```js
const esbuild = require('esbuild');
const sassPlugin = require('esbuild-sass-plugin')

esbuild.build({
    entryPoints: ['src/index.js'],
    bundle: true,
    outfile: 'bundle.js',
    plugins: [sassPlugin],
}).catch((e) => console.error(e.message))
```

Run:

```bash
node build.js
```

File named `bundle.css` with following content will be created:

```css
body.isRed {
  background: red;
}
```