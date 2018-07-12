# noise-file-gen
Node.js CLI tool to generate files with random data.

Generates one or several files with specified size.

### Installation:
```
npm i -g noise-file-gen
```

### Usage:
```
noise-file-gen --size 100 --fileName random.bin
```
Will create 100Mb file with name `random.bin` in the current directory

```
noise-file-gen --size 10 --fileName chunk --count 100
```
Will create 100 files with size 10Mb each with names from `chunk_0` to `chunk_99`

Enjoy!
