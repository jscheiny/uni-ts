import * as Units from "..";
import { Measure } from "../../measure/numberMeasure";

describe("Predefined units", () => {
    const UnitNames = Object.keys(Units);
    const lowercaseFirstRegex = /^[a-z]/;

    function forEachUnit(fn: (unit: Measure<any, any>, name: string) => void): void {
        const wrappedCallback = (value: any, name: string) => {
            // Quantities start with a capital letter, exclude them
            if (Measure.isMeasure(value) && lowercaseFirstRegex.test(name)) {
                fn(value, name);
            }
        };

        UnitNames.forEach(name => {
            const value = (Units as any)[name];
            if (Measure.isMeasure(value)) {
                wrappedCallback(value, name);
            } else {
                for (const subName in value) {
                    if (value.hasOwnProperty(subName)) {
                        const unit = value[subName];
                        wrappedCallback(unit, subName);
                    }
                }
            }
        });
    }

    it("all units should have a symbol", () => {
        forEachUnit((unit, name) => {
            try {
                expect(unit.symbol).not.toBeUndefined();
            } catch (e) {
                console.log(`Unit ${name} has no symbol defined.`);
                throw e;
            }
        });
    });
});
