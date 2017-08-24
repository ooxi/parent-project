/**
 * Copyright (c) 2017 ooxi <violetland@mail.ru>
 *     https://github.com/ooxi/parent-project
 *
 * This software is provided 'as-is', without any express or implied warranty.
 * In no event will the authors be held liable for any damages arising from the
 * use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 *  1. The origin of this software must not be misrepresented; you must not
 *     claim that you wrote the original software. If you use this software in a
 *     product, an acknowledgment in the product documentation would be
 *     appreciated but is not required.
 *
 *  2. Altered source versions must be plainly marked as such, and must not be
 *     misrepresented as being the original software.
 *
 *  3. This notice may not be removed or altered from any source distribution.
 */
"use strict";


import fs = require("fs");
import assign = require("lodash.assign");
import jsyaml = require("js-yaml");





/* ['/usr/bin/node', 'cli.js', 'package.yaml']
 */
let argv: string[] = process.argv;

if (3 !== argv.length) {
    console.error("Usage: parent-project package.yaml");
    process.exit(1);
}


/* Read package.yaml from filesystem
 */
let pathToPackageYaml: string = argv[2];
let packageYamlContent: string = fs.readFileSync(pathToPackageYaml, {
    encoding: "utf8"
});


/* Parse YAML
 */
let documents: any[] = [];

jsyaml.safeLoadAll(packageYamlContent, (document) => {
    documents.push(document);
});

if (1 !== documents.length) {
    console.error("Expected exactly one document but read " + documents.length + " while reading `" + pathToPackageYaml + "'");
    process.exit(1);
}


/* Add warning to object
 */
let document: any = documents[0];

document = assign({
    WARNING: "AUTO GENERATED - DO NOT MODIFY!"
}, document);


/* Pretty print package.json to stdout
 */
let prettyPrinted: string = JSON.stringify(document, null, 2);
console.log(prettyPrinted);
