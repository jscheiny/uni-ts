export const EXPONENTS = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];

export interface CommonOperatorCodeGenOptions {
    minExponent: number;
    maxExponent: number;
}

export interface OperatorCodeGenOptions extends CommonOperatorCodeGenOptions {
    fileNamePrefix: string;
    uncurriedTypeNamePrefix: string;
    curriedTypeNamePrefix: string;
    testTypeNamePrefix: string;
    specialCases: { [left: number]: string };
    compute: (left: number, right: number) => number;
}

export function getExponents({ minExponent, maxExponent }: CommonOperatorCodeGenOptions): number[] {
    const exponents: number[] = [];
    for (let exponent = minExponent; exponent !== maxExponent; exponent++) {
        exponents.push(exponent);
    }
    return exponents;
}

export function genFileHeader(disableTslint: boolean = true): string[] {
    const header = ["// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.", ""];
    if (disableTslint) {
        header.push("// tslint:disable", "");
    }
    return header;
}

export function genImport(symbols: string[], source: string): string {
    symbols.sort((first, second) => {
        if (first < second) {
            return -1;
        }
        if (first > second) {
            return 1;
        }
        return 0;
    });

    return `import { ${symbols.join(", ")} } from "${source}";`;
}

export function genUncurriedTypeName(options: OperatorCodeGenOptions, left?: string | number, right?: string | number) {
    const args = left !== undefined && right !== undefined ? `<${left}, ${right}>` : "";
    return `${options.uncurriedTypeNamePrefix}Exponents${args}`;
}

export function genValueName(value: number): string {
    if (value === 0) {
        return "0";
    }
    const sign = value < 0 ? "Negative" : "Positive";
    return `${sign}${Math.abs(value)}`;
}

export function indent(line: string) {
    return "    " + line;
}
