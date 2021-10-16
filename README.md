# lifecraft-md [![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io) [![Version](https://img.shields.io/npm/v/lifecraft-md.svg)](https://npmjs.org/package/lifecraft-md) [![Downloads/week](https://img.shields.io/npm/dw/lifecraft-md.svg)](https://npmjs.org/package/lifecraft-md) [![License](https://img.shields.io/npm/l/lifecraft-md.svg)](https://github.com/KennethWussmann/lifecraft-md/blob/master/package.json)

Convert Lifecraft exports to markdown files

# Usage

```sh
npm install -g lifecraft-md
```

Convert a `.lifecraftex` export to markdown:

```sh
lifecraft-md my-export.lifecraftex
```

# Advanced usage

```
Convert Lifecraft exports to markdown files

USAGE
  $ lifecraft-md [EXPORT]

ARGUMENTS
  EXPORT  Lifecraft export file in .lifecraftex format

OPTIONS
  -e, --[no-]embed     Embed attachments as images in markdown
  -f, --flatten        Flatten the metadata
  -h, --help           Show usage
  -m, --metadata       Prepend entry metadata as YAML before markdown
  -o, --outdir=outdir  [default: out/] Output directory of conversion result
  -v, --version        show CLI version
```
