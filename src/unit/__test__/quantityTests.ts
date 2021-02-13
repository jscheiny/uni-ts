import { Measure } from "../../measure/numberMeasure";
import * as Quantity from "../quantities";

describe("Quantities", () => {
    const QuantityNames = Object.keys(Quantity);

    function forEachQuantity(fn: (quantity: Measure<any, any>, name: string) => void): void {
        QuantityNames.forEach(name => {
            fn((Quantity as any)[name], name);
        });
    }

    it("no two quantities should have the same dimensions", () => {
        forEachQuantity((a, aName) => {
            forEachQuantity((b, bName) => {
                if (aName === bName) {
                    return;
                }
                try {
                    expect(a.unit).not.toEqual(b.unit);
                } catch (e) {
                    console.log(`Quantities '${aName}' and '${bName}' are the same.`);
                    throw e;
                }
            });
        });
    });

    it("all quantities should be normalized", () => {
        forEachQuantity(quantity => {
            expect(quantity.value).toBe(1);
        });
    });
});
