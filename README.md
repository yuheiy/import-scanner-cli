# @yuheiy/import-scanner-cli

Scan files for import declarations.

## Install

```sh
npm install @yuheiy/import-scanner-cli
```

## Usage

```
$ import-scanner --help

  Usage
    $ import-scanner [path...]

  Options
    --ignore          Ignore specific file paths
    --module          The module name targeted by the imports to be retrieved
    --module-regexp   The regular expression for the module name targeted by the imports to be retrieved
    --json            Output scanned imports as a JSON

  Examples
    $ import-scanner **/*.{js,ts,jsx,tsx}
    $ import-scanner **/*.{js,ts,jsx,tsx} --ignore="**/dist/**" --ignore="**/node_modules/**"
    $ import-scanner **/*.{js,ts,jsx,tsx} --module=my-module
    $ import-scanner **/*.{js,ts,jsx,tsx} --module-regexp="^my-module(/.+)?$"
    $ import-scanner **/*.{js,ts,jsx,tsx} --json
```

## Related

- [@yuheiy/import-scanner](https://github.com/yuheiy/import-scanner) - API for this package
