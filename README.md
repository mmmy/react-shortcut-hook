
<p align="center">
  <img src="https://i.imgur.com/6z2UKST.png" width="150" />
  <h5 align="center">Setup shortcuts for your react app easily.</h5>
</p>

# react-shortcut-hook
[![NPM](https://img.shields.io/npm/v/react-shortcut-hook.svg)](https://www.npmjs.com/package/react-shortcut-hook) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-shortcut-hook
```

## Usage

```tsx
import * as React from "react";

import useCommander from "button-commanderreact-shortcut-hook"

const Example = () => {
  useCommander(
    undefined,
    [
      {
        name: "Green Color",
        shortcut: { windows: ["ctrl", "z"], macOS: ["meta", "z"] },
        description: "Change background color to green",
        callback: () => (document.body.style.background = "#64C964"),
        stopBubblingUp: true,
      },
      {
        name: "Yellow Color",
        shortcut: { windows: ["ctrl", "x"], macOS: ["meta", "x"] },
        description: "Change background color to yellow",
        callback: () => (document.body.style.background = "#fdd231"),
      },
      {
        name: "Red Color",
        shortcut: { windows: ["ctrl", "c"], macOS: ["meta", "c"] },
        description: "Change background color to red",
        callback: () => (document.body.style.background = "#FF614D"),
      },
    ]
  );

  return <div>hello world!</button>;
};
```

## [Live Demo](https://mmmy.github.io/react-shortcut-hook/)

## Found this project useful? ❤️

If you found this project useful, then please consider giving it a ⭐️ on Github and sharing it with your friends via social media.

## Issues and feedback 💭

If you have any suggestion for including a feature or if something doesn't work, feel free to open a Github [issue](https://github.com/mmmy/react-shortcut-hook/issues) for us to have a discussion on it.

## License

MIT © [mmmy](https://github.com/mmmy)

---

This hook is created using [create-react-hook](https://github.com/hermanya/create-react-hook).
