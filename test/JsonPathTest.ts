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


let jsonpath: any = require("jsonpath-plus");
import test = require("tape");

import {Test} from "tape";





test("json path", (t: Test) => {
    let json = {
        "config": {
            "boolean": true,
            "integer": 3,
            "decimal": 3.5,
            "array": [
                "one",
                "two"
            ],
            "object": {
                "one": 1,
                "two": 2
            },
            "Ɋ ʩ": "ʬ"
        }
    };


    t.equals(jsonpath({
        path: "$.config.boolean",
        json: json,
        wrap: false
    }), true, "$.config.boolean");

    t.equals(jsonpath({
        path: "$.config.integer",
        json: json,
        wrap: false
    }), 3, "$.config.integer");

    t.equals(jsonpath({
        path: "$.config.decimal",
        json: json,
        wrap: false
    }), 3.5, "$.config.decimal");


    t.deepEquals(jsonpath({
        path: "$.config.array",
        json: json,
        wrap: true
    }), [["one", "two"]], "$.config.array");

    t.deepEquals(jsonpath({
        path: "$.config.object",
        json: json,
        wrap: true
    }), [{"one": 1, "two": 2}], "$.config.object");


    t.equals(jsonpath({
        path: "$.config.'Ɋ ʩ'",
        json: json,
        wrap: false
    }), "ʬ", "$.config.'Ɋ ʩ'");


    t.end();
});
