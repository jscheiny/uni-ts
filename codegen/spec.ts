import { CodeGenSpec } from "./common";

const maxExponent = 5;

export const codeGenSpec: CodeGenSpec = {
    minExponent: -maxExponent,
    maxExponent,
    operators: [
        {
            fileNamePrefix: "addition",
            uncurriedTypeNamePrefix: "Add",
            curriedTypeNamePrefix: "Add",
            specialCases: {
                0: "R",
            },
            compute: (left, right) => left + right,
        },
        {
            fileNamePrefix: "multiplication",
            uncurriedTypeNamePrefix: "Multiply",
            curriedTypeNamePrefix: "MultiplyBy",
            specialCases: {
                0: "0",
                1: "R",
            },
            compute: (left, right) => left * right,
        },
        {
            fileNamePrefix: "division",
            uncurriedTypeNamePrefix: "Divide",
            curriedTypeNamePrefix: "DividedBy",
            specialCases: {
                0: "(R extends 0 ? never : 0)",
            },
            compute: (left, right) => left / right,
        },
    ],
};
