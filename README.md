# parent-project

Generates [package.json](https://docs.npmjs.com/files/package.json) files from a
[YAML](http://yaml.org/) description. Currently does the same as all the other
YAML to JSON converters, but will be extended with additional functionality.



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



### Substitution

*parent-project* also supports variable substitution. Inside string values, you
can use [jsonpath](https://www.npmjs.com/package/jsonpath-plus) syntax to
reference other values in the same document.

```yaml
{
  "name": "my-project",
  "version": "0.1.0",

  "dependencies": {
    "my-sub-component": "${version}",
    "external-component": "${config.repository}/external-component.git#dev"
  },

  "config": {
    "repository": "git+https://repo.example.com"
  }
}
```

If the string referencing a value contains other text (like
`$.dependencies.'external-component'` in this example), then the value is
converted to string and placed inside.

On the other hand, if the string contains nothing but a reference, then the hole
value gets replaced. This allows you to reference hole objects like `author` or
`contributors`.

While recursive variable substitution is supported, it should be used with
caution.



## Usage

```
$> npm install -g parent-project
$> parent-project package.yaml > package.json && npm install
```

This will convert a `package.yaml` file into the corresponding `package.json` to
be read by `npm install`. Most likely you want to `.gitignore` but not
`.npmignore` the generated file.



## Changelog


### [0.2.0](https://github.com/ooxi/parent-project/releases/tag/v0.2.0)

 * Variable substitution


### [0.1.1](https://github.com/ooxi/parent-project/releases/tag/v0.1.1)

 * Became self hosted by the latest stable version hosted on npmjs to translate
   the [package.yaml](package.yaml) project definition

### [0.1.0](https://github.com/ooxi/parent-project/releases/tag/v0.1.0)

 * Initial development
 * Published to [npmjs](https://www.npmjs.com/package/parent-project)

