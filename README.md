# @yuheiy/import-analyzer-cli

Scan files for import declarations based on specified module patterns.

## Install

```sh
npm install @yuheiy/import-scanner-cli
```

## Usage

```
$ import-scanner --help

  Usage
    $ import-scanner [module-pattern...]

  Options
    --regexp   Use RegExp for module-patten
    --path     Specify target file paths (default: **/*.{js,ts,jsx,tsx})
    --ignore   Ignore specific file paths from target (default: **/node_modules)
    --json     Output analyzed results as a JSON

  Examples
    Basic usage:
    $ import-scanner my-module
    $ import-scanner my-module another-my-module

    Use regular expressions, including subpaths:
    $ import-scanner "^my-module(/.+)?$" --regexp

    Specify the target file paths:
    $ import-scanner my-module --path="subdir/**/*.{js,ts,jsx,tsx}"

    Ignore specific file paths:
    $ import-scanner my-module --ignore="dist/**" --ignore="node_modules/**"

    Output as a JSON:
    $ import-scanner my-module --json
```

## Related

- [@yuheiy/import-scanner](https://github.com/yuheiy/import-scanner) - API for this package
