# parent-project

Generates [package.json](https://docs.npmjs.com/files/package.json) files from a
[YAML](http://yaml.org/) description. Currently does the same as all the other
YAML to JSON converters, but will be extended with additional functionality.


## Usage

```
$> npm install -g parent-project
$> parent-project package.yaml > package.json && npm install
```

This will convert a `package.yaml` file into the corresponding `package.json` to
be read by `npm install`. Most likely you want to `.gitignore` but not
`.npmignore` the generated file.


## Example

At a certain level of complexity, one wishes to use comments in npm project
definitions. Simply rename `package.json` to `package.yaml`, add comments!
Before executing any `npm` related command, simply transform the YAML document
to JSON.

```yaml
{
  "name": "my-project",
  "version": "0.1.0",

  # Finally, comments!
  "dependencies": {
    "lodash": "*"
  }
}
```

