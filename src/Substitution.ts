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


const jsonpath = require("jsonpath-plus");

import forEach = require("lodash.foreach");
import forOwn = require("lodash.forown");
import isEqual = require("lodash.isequal");

import {RawObject} from "./RawObject"
import {SubstitutionRecursionLimitReachedError} from "./SubstitutionRecursionLimitReachedError";





/**
 * Substitutes references in JSON documents. Be aware that references are only
 * substituted in values, never in keys.
 */
export class Substitution {

    private document: object;
    private recursionLimit: number;

    public constructor(document: object, recursionLimit = 9) {
        this.document = document;
        this.recursionLimit = recursionLimit;
    }





    public substitute(): object {
        return this.recursiveSubstitute(this.document, 0);
    }



    private recursiveSubstitute(source: object, level: number): object {

        /* Arbitrary but helpful
         */
        if (level > this.recursionLimit) {
            throw new SubstitutionRecursionLimitReachedError("Substitution recursion limit reached, most likely you have defined an infinite recursion", source);
        }

        /* Execute substitution
         */
        let destination: object = this.substituteValue(source);

        /* No more substitutions occurred, therefore we have reached the final
         * object appearance
         */
        if (isEqual(source, destination)) {
            return destination;
        }

        /* We have to recurse at least once more
         */
        return this.recursiveSubstitute(destination, level + 1);
    }





    private substituteValue(value: any): any {
        if (Array.isArray(value)) {
            return this.substituteArray(value);
        }

        if (typeof(value) === "boolean") {
            return this.substituteBoolean(value);
        }

        if (typeof(value) === "number") {
            return this.substituteNumber(value);
        }

        if (typeof(value) === "string") {
            return this.substituteString(value);
        }

        if (typeof(value) === "object") {
            return this.substituteObject(value);
        }

        throw new Error("Unsupported value `" + value + "'");
    }



    private substituteArray(source: any[]): any[] {
        let destination: any[] = [];

        forEach(source, (value: any, index: number) => {
            destination[index] = this.substituteValue(value);
        });

        return destination;
    }



    private substituteBoolean(value: boolean): boolean {
        return value;
    }



    private substituteNumber(value: number): number {
        return value;
    }



    private substituteObject(source: RawObject): RawObject {
        let destination: RawObject = {};

        forOwn(source, (value: any, key: string) => {
            destination[key] = this.substituteValue(value);
        });

        return destination;
    }



    /**
     * This method does the real substitution work by looking for JSON path
     * specifications inside the string and replacing it with the referenced
     * value from `document'.
     *
     * @param {string} value Text in which references should be searched for
     *
     * @returns {any} The referenced value, iff the text contains exactly one
     *    reference and nothing else. Otherwise the text interpolated with
     *    referenced values converted to string
     */
    private substituteString(value: string): any {

        /* `value' contains one reference and nothing else
         *
         * Example: "${config.repository}"
         */
        let exactlyOneReference: RegExp = /^\$\{([^}]+)\}$/;
        let match: RegExpMatchArray | null = value.match(exactlyOneReference);

        /* Reference should be replaced by value itself
         */
        if (null !== match) {
            let reference: string = match[1];
            return this.getReferencedValue(reference);
        }


        /* value contains at least one reference but also other text
         *
         * Example: "${config.repository}/package.git"
         */
        let inlineReference: RegExp = /\$\{([^}]+)\}/g;

        value = value.replace(inlineReference, (match, reference: string) => {
            let referencedValue: any = this.getReferencedValue(reference);
            let inlineValue: string = this.toInlineValue(referencedValue);
            return inlineValue;
        });

        return value;
    }



    /**
     * @param {string} reference JSON Path like reference to a value inside
     *     `document'
     * @return {any} Referenced value
     *
     * @warning Does not return a copy but a reference!
     */
    private getReferencedValue(reference: string): any {
        let path: string = "$." + reference;

        let referencedValues: any[] = jsonpath({
            path: path,
            json: this.document,
            wrap: true
        });

        if (1 !== referencedValues.length) {
            throw new Error("JSON path `" + path + "' did not match exactly one element but " + referencedValues.length + "!");
        }
        let referencedValue: any = referencedValues[0];

        return referencedValue;
    }



    /**
     * Convertes a referenced value to text for inline substitution
     *
     * @param value Any referenced value
     * @returns {string} Textual representation of value
     *
     * @throws {Error} iff value is not a primitive type (boolean, number or
     *     string)
     */
    private toInlineValue(value: any): string {
        if (typeof(value) === "boolean") {
            return "" + value;
        }
        if (typeof(value) === "number") {
            return "" + value;
        }
        if (typeof(value) === "string") {
            return "" + value;
        }

        throw new Error("Unsupported type `" + typeof(value) + "' of value `" + value + "', cannot be used for inline reference");
    }
}
