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


import test = require("tape");

import {RawObject} from "../src/RawObject";
import {Substitution} from "../src/Substitution";
import {Test} from "tape";





test("no substitution", (t: Test) => {

    /* Source object with all available types, even nested
     */
    let source: object = {
        "boolean": true,
        "number": 3.5,
        "string": "hello world",

        "array": [
            true,
            3.5,
            "hello world",
            ["one", "two"],
            {
                "one": 1,
                "two": 2
            }
        ],

        "object": {
            "boolean": true,
            "number": 3.5,
            "string": "hello world",
            "array": ["one", "two"]
        }
    };


    /* Execute substitution request
     */
    let substitution: Substitution = new Substitution(source);
    let destination: object = substitution.substitute();


    /* No modification of source object should have occurred
     */
    t.deepEquals(destination, source, "no modification");


    t.end();
});





test("simple substitution", (t: Test) => {

    /* Source defining substitutions for multiple types
     */
    let source: object = {
        "config": {
            "boolean": true,
            "number": 3.5,
            "string": "hello world",
            "array": ["one", "two"],
            "object": {
                "one": 1,
                "two": 2
            }
        },

        "boolean": "${config.boolean}",
        "number": "${config.number}",
        "string": "${config.string}",
        "array": "${config.array}",
        "object": "${config.object}"
    };


    /* Execute substitution request
     */
    let substitution: Substitution = new Substitution(source);
    let destination: RawObject = substitution.substitute();


    /* Modifications should have been performed
     */
    t.equals(destination["boolean"], true, "substitute boolean");
    t.equals(destination["number"], 3.5, "substitute number");
    t.equals(destination["string"], "hello world", "substitute string");

    t.deepEquals(destination["array"], ["one", "two"], "substitue array");
    t.deepEquals(destination["object"], {"one": 1, "two": 2}, "substitue object");


    t.end();
});





test("inline substitution", (t: Test) => {

    /* Source defining substitutions for multiple types
     */
    let source: object = {
        "config": {
            "boolean": true,
            "number": 3.5,
            "string": "hello world",
            "array": ["one", "two"],
            "object": {
                "one": 1,
                "two": 2
            }
        },

        "boolean": "A boolean: ${config.boolean}",
        "number": "A number: ${config.number}",
        "string": "A string: ${config.string}",

        "multiple": "${config.boolean}${config.number}${config.string}"
    };


    /* Execute substitution request
     */
    let substitution: Substitution = new Substitution(source);
    let destination: RawObject = substitution.substitute();


    /* Modifications should have been performed
     */
    t.equals(destination["boolean"], "A boolean: true", "substitute boolean");
    t.equals(destination["number"], "A number: 3.5", "substitute number");
    t.equals(destination["string"], "A string: hello world", "substitute string");
    t.equals(destination["multiple"], "true3.5hello world", "substitute multiple");


    t.end();
});





test("recursion", (t: Test) => {

    /* Recursive substitution should not be used excessively!
     */
    let source: object = {
        config: {
            a: "${",
            b: "config.d",
            c: "}",

            d: "world",
        },

        hello: "${config.a}${config.b}${config.c}"
    };


    let substitution: Substitution = new Substitution(source);
    let destination: RawObject = substitution.substitute();


    t.equals(destination["hello"], "world", "recursive substitution");


    t.end();
});





test("infinite recursion", (t: Test) => {
    let substitution: Substitution = new Substitution({
        "a": "${a}${a}"
    });

    try {
        substitution.substitute();
    } catch (e) {
        t.equals(
            e.message,
            "Substitution recursion limit reached, most likely you have defined an infinite recursion",
            "Substitution recursion limit reached error thrown"
        );
    }

    t.end();
});





test("readme example", (t: Test) => {

    /* Having an example in the readme which does not actually work is very
     * embarrassing
     */
    let source: object = JSON.parse(`
{
  "name": "my-project",
  "version": "0.1.0",

  "dependencies": {
    "my-sub-component": "\${version}",
    "external-component": "\${config.repository}/external-component.git#dev"
  },

  "config": {
    "repository": "git+https://repo.example.com"
  }
}
    `);


    let substitution: Substitution = new Substitution(source);
    let destination: object = substitution.substitute();


    t.deepEquals(destination, {
        name: "my-project",
        version: "0.1.0",

        dependencies: {
            "my-sub-component": "0.1.0",
            "external-component": "git+https://repo.example.com/external-component.git#dev"
        },

        config: {
            repository: "git+https://repo.example.com"
        }

    }, "Substitution of example in README.md");


    t.end();
});
