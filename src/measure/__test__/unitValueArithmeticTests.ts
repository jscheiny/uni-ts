import { UnitSystem } from "../unitSystem";
import { divideUnits, exponentiateUnit, multiplyUnits, nthRootUnit } from "../unitValueArithmetic";

describe("Unit value arithmetic", () => {
    interface TestUnitSystem {
        x: unknown;
        y: unknown;
    }

    const TestUnitSystem = new UnitSystem<TestUnitSystem>({
        x: "x",
        y: "y",
    });

    const x = TestUnitSystem.createDimensionUnit("x");
    const y = TestUnitSystem.createDimensionUnit("y");

    describe("multiplication", () => {
        it("should multiply two different base units correctly", () => {
            expect(multiplyUnits(TestUnitSystem, x, y)).toEqual({ x: "1", y: "1" });
        });

        it("should multiply two of the same base unit correctly", () => {
            expect(multiplyUnits(TestUnitSystem, x, x)).toEqual({ x: "2", y: "0" });
        });

        it("should multiply complex units correctly", () => {
            const left = { x: "1", y: "-2" } as const;
            const right = { x: "0", y: "1" } as const;
            expect(multiplyUnits(TestUnitSystem, left, right)).toEqual({ x: "1", y: "-1" });
        });

        it("should not remove zero exponents from the result", () => {
            const left = { x: "1", y: "2" } as const;
            const right = { x: "-1", y: "-2" } as const;
            expect(multiplyUnits(TestUnitSystem, left, right)).toEqual({ x: "0", y: "0" });
        });

        it("should handle explicitly 0 exponents", () => {
            const left = { x: "2", y: "0" } as const;
            const right = { x: "0", y: "0" } as const;
            expect(multiplyUnits(TestUnitSystem, left, right)).toEqual({ x: "2", y: "0" });
        });
    });

    describe("division", () => {
        it("should correctly divide units", () => {
            const left = { x: "2", y: "2" } as const;
            const right = { x: "2", y: "-1" } as const;
            expect(divideUnits(TestUnitSystem, left, right)).toEqual({ x: "0", y: "3" });
        });
    });

    describe("exponentiation", () => {
        it("should square a simple unit", () => {
            expect(exponentiateUnit(TestUnitSystem, x, "2")).toEqual({ x: "2", y: "0" });
        });

        it("should cube a simple unit", () => {
            expect(exponentiateUnit(TestUnitSystem, x, "3")).toEqual({ x: "3", y: "0" });
        });

        it("should square a complex unit", () => {
            expect(exponentiateUnit(TestUnitSystem, { x: "1", y: "-2" }, "2")).toEqual({ x: "2", y: "-4" });
        });

        it("should invert a unit", () => {
            expect(exponentiateUnit(TestUnitSystem, { x: "-1", y: "2" }, "-1")).toEqual({
                x: "1",
                y: "-2",
            });
        });

        it("should return the same unit when raised to the one", () => {
            const input = { x: "-1", y: "2" } as const;
            expect(exponentiateUnit(TestUnitSystem, input, "1")).toEqual(input);
        });

        it("should return a dimensionless unit when raised to the zero", () => {
            expect(exponentiateUnit(TestUnitSystem, { x: "-1", y: "2" }, "0")).toEqual({ x: "0", y: "0" });
        });

        it("should handle explicitly 0 exponents", () => {
            expect(exponentiateUnit(TestUnitSystem, { x: "2", y: "0" }, "2")).toEqual({ x: "4", y: "0" });
        });
    });

    describe("roots", () => {
        it("should square root the unit", () => {
            expect(nthRootUnit(TestUnitSystem, { x: "4", y: "-2" }, "2")).toEqual({ x: "2", y: "-1" });
        });

        it("should cube root the unit", () => {
            expect(nthRootUnit(TestUnitSystem, { x: "3", y: "-3" }, "3")).toEqual({ x: "1", y: "-1" });
        });

        it("should handle explicitly 0 exponents", () => {
            expect(nthRootUnit(TestUnitSystem, { x: "2", y: "0" }, "2")).toEqual({ x: "1", y: "0" });
        });
    });
});
