import { NumericOperations } from "../genericMeasure";
import { createMeasureType } from "../genericMeasureFactory";
import { wrapBinaryFn, wrapReducerFn, wrapSpreadFn, wrapUnaryFn } from "../genericMeasureUtils";
import { Measure } from "../numberMeasure";
import { UnitBasis, UnitSystem } from "../unitSystem";

describe("Generic measures", () => {
    interface TestUnitSystem extends UnitBasis<"length" | "mass"> {}

    const TestUnitSystem = new UnitSystem<TestUnitSystem>({
        length: "m",
        mass: "kg",
    });

    describe("function wrappers", () => {
        const meters = Measure.dimension(TestUnitSystem, "mass");
        const add = (left: number, right: number) => left + right;

        it("unary wrapper", () => {
            const increment = wrapUnaryFn((x: number) => x + 1);
            const result = increment(Measure.of(10, meters));
            expect(result).toEqual(Measure.of(11, meters));
        });

        it("binary wrapper", () => {
            const measureAdd = wrapBinaryFn(add);
            const result = measureAdd(Measure.of(5, meters), Measure.of(10, meters));
            expect(result).toEqual(Measure.of(15, meters));
        });

        it("spread wrapper", () => {
            const sum = wrapSpreadFn((...values: number[]) => values.reduce(add, 0));
            const result = sum(Measure.of(5, meters), Measure.of(10, meters), Measure.of(15, meters));
            expect(result).toEqual(Measure.of(30, meters));
        });

        it("reducer wrapper", () => {
            const sum = wrapReducerFn(add);
            const result = sum(Measure.of(5, meters), Measure.of(10, meters), Measure.of(15, meters));
            expect(result).toEqual(Measure.of(30, meters));
        });
    });

    describe("static methods", () => {
        const numericOps: NumericOperations<number> = {
            one: () => 1,
            neg: x => -x,
            add: (x, y) => x + y,
            sub: (x, y) => x - y,
            mult: (x, y) => x * y,
            div: (x, y) => x / y,
            pow: (x, y) => x ** y,
            compare: (x, y) => x - y,
            format: x => `${x}`,
        };

        it("should attach static methods when given", () => {
            const LocalMeasure = createMeasureType(numericOps, {
                staticMethod: () => "method",
            });
            expect("staticMethod" in LocalMeasure).toBe(true);
        });

        it("should not attach static methods when omitted", () => {
            const LocalMeasure = createMeasureType(numericOps);
            expect("staticMethod" in LocalMeasure).toBe(false);
        });
    });
});
