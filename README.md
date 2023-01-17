<h1 align="center">
  Lnpm
</h1>

<p align="center">
  A simple node cli to manage local node packages
</p>

## Overview

Lnpm is not a full-fledged package manager on its own. It is simply a node cli to make working with local packages much more convenient. Lnpm maintains a global store on your system where the local packages will be stored. This global store can be configured to any location. Later these packages from the global store can be installed into any project by the package name:

```bash
lnpm add -D <pkg-name>@<version>
```

instead of:

```bash
npm install -D path/to/package
```

The actual package installation will be done using your preferred package manager (`npm`, `yarn` or `pnpm`) which can be configured.

## Features

- Store local node packages at a particular location on your system.
- Install local packages by package name rather than file path.
- Save multiple package versions in the global store and install by specific version number.

## Installation

Install lnpm globally:

```bash
npm install -g lnpm
```

## CLI Commands

- [lnpm config](https://github.com/arpansaha13/lnpm/tree/main/docs/config.md)
- [lnpm store](https://github.com/arpansaha13/lnpm/tree/main/docs/store.md)
- [lnpm install](https://github.com/arpansaha13/lnpm/tree/main/docs/install.md)