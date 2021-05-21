import { mkdir, writeFile } from "fs";
import { OperatorSpec } from "./common";
import { genExponentType } from "./genExponent";
import { genOperatorTests } from "./genTests";
import { genOperatorTypes } from "./genTypes";
import { codeGenSpec } from "./spec";

const DIR = "generated";
const SRC_PREFIX = `src/exponent/${DIR}`;
const TEST_PREFIX = `test/types/${DIR}`;

export interface EmitPlan {
    path: string;
    source: string;
}

export function emit(callback?: () => void): void {
    const emits: EmitPlan[] = [
        { path: `${SRC_PREFIX}/exponent.ts`, source: genExponentType(codeGenSpec) },
        ...getOperatorEmitPlans(SRC_PREFIX, genOperatorTypes),
        ...getOperatorEmitPlans(TEST_PREFIX, genOperatorTests),
    ];
    prepForEmit(() => {
        let index = -1;
        const nextEmit = () => {
            index++;
            const isLastEmit = index === emits.length - 1;
            emitFile(emits[index], isLastEmit ? callback : nextEmit);
        };
        nextEmit();
    });
}

function getOperatorEmitPlans(prefix: string, genSource: (spec: OperatorSpec) => string): EmitPlan[] {
    const { operators, ...common } = codeGenSpec;
    return operators.map(operator => {
        const operatorSpec: OperatorSpec = { ...operator, ...common };
        const { fileNamePrefix } = operator;
        return {
            path: `${prefix}/${fileNamePrefix}.ts`,
            source: genSource(operatorSpec),
        };
    });
}

function prepForEmit(callback: () => void): void {
    makeDirectory(SRC_PREFIX, () => makeDirectory(TEST_PREFIX, callback));
}

function makeDirectory(path: string, callback: () => void): void {
    mkdir(path, err => {
        if (!err || err.code === "EEXIST") callback();
        else console.error(`There was an error creating directory ${path}`);
    });
}

function emitFile({ path, source }: EmitPlan, callback?: () => void): void {
    writeFile(path, source, error => {
        if (error) {
            console.error(`There was an error writing to ${path}`);
        } else {
            console.log(`Generated ${path}`);
            if (callback) {
                callback();
            }
        }
    });
}

emit();
