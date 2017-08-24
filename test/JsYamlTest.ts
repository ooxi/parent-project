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


import jsyaml = require("js-yaml");
import test = require("tape");

import {Test} from "tape";





/* js-yaml should be able to parse a real YAML document
 */
test("yaml", function(t: Test) {
    let yaml: string = `
invoice: 34843
date   : 2001-01-23
bill-to: &id001
    given  : Chris
    family : Dumars
    address:
        lines: |
            458 Walkman Dr.
            Suite #292
        city    : Royal Oak
        state   : MI
        postal  : 48046
ship-to: *id001
product:
    - sku         : BL394D
      quantity    : 4
      description : Basketball
      price       : 450.00
    - sku         : BL4438H
      quantity    : 1
      description : Super Hoop
      price       : 2392.00
tax  : 251.42
total: 4443.52
comments: >
    Late afternoon is best.
    Backup contact is Nancy
    Billsmer @ 338-4338.
    `;


    let documents: any[] = [];

    jsyaml.safeLoadAll(yaml, (document) => {
        documents.push(document);
    });


    t.equals(documents.length, 1, "Number of documents");
    t.equals(documents[0]["ship-to"]["given"], "Chris", "ship-to reference");

    t.end();
});





/* js-yaml should also be able to parse a plain package.json
 */
test("package.json", function(t: Test) {
    let pkg: string = '{\n\t"name": "my-package"\n}';


    let documents: any[] = [];

    jsyaml.safeLoadAll(pkg, (document) => {
        documents.push(document);
    });


    t.equals(documents.length, 1, "Number of documents");
    t.equals(documents[0]["name"], "my-package", "Package name");

    t.end();
});





/* And finally, js-yaml should be able to parse an augmented package.yaml
 */
test("package.yaml", function(t: Test) {
    let yaml: string = `
    {
        name: "my-package",
        version: "0.1.0",
        
        # Comments, finally!
        dependencies: {
            urijs: "1.2.3",
            "js-yaml": "^5"
        }        
    }
    `;


    let documents: any[] = [];

    jsyaml.safeLoadAll(yaml, (document) => {
        documents.push(document);
    });


    t.equals(documents.length, 1, "Number of documents");
    t.equals(documents[0]["dependencies"]["urijs"], "1.2.3", "URI.js dependency version");

    t.end();
});
