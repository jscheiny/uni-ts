import { Exponent } from "../src/exponent";
import { UnitBasis } from "../src/measure/unitSystem";
import {
    AllowedExponents,
    DimensionlessUnit,
    DimensionUnit,
    DivideUnits,
    DivisorUnit,
    ExponentiateUnit,
    MultiplicandUnit,
    MultiplyUnits,
    NthRootUnit,
    RadicandUnit,
} from "../src/measure/unitTypeArithmetic";
import { assertRelation } from "./utils";

interface Basis extends UnitBasis<"a" | "b" | "c"> {}

// DimensionlessUnit

assertRelation<DimensionlessUnit<Basis>, { a: "0"; b: "0"; c: "0" }>().isSame();

// DimensionUnit

assertRelation<DimensionUnit<Basis, "a">, { a: "1"; b: "0"; c: "0" }>().isSame();
assertRelation<DimensionUnit<Basis, "b">, { a: "0"; b: "1"; c: "0" }>().isSame();

// MultiplyUnits

assertRelation<
    MultiplyUnits<Basis, { a: "2"; b: "0"; c: "0" }, { a: "2"; b: "0"; c: "0" }>,
    { a: "4"; b: "0"; c: "0" }
>().isSame();
assertRelation<
    MultiplyUnits<Basis, { a: "2"; b: "0"; c: "0" }, { a: "2"; b: "0"; c: "0" }>,
    { a: "4"; b: "0"; c: "0" }
>().isSame();
assertRelation<
    MultiplyUnits<Basis, { a: "2"; b: "-1"; c: "0" }, { a: "-2"; b: "2"; c: "1" }>,
    { a: "0"; b: "1"; c: "1" }
>().isSame();

// MultiplicandUnit

assertRelation<
    MultiplicandUnit<Basis, { a: "4"; b: "0"; c: "0" }>,
    {
        a: "-5" | "-4" | "-3" | "-2" | "-1" | "0" | "1";
        b: Exponent;
        c: Exponent;
    }
>().isSame();
assertRelation<
    MultiplicandUnit<Basis, { a: "5"; b: "3"; c: "-4" }>,
    {
        a: "-5" | "-4" | "-3" | "-2" | "-1" | "0";
        b: "-5" | "-4" | "-3" | "-2" | "-1" | "0" | "1" | "2";
        c: "-1" | "0" | "1" | "2" | "3" | "4" | "5";
    }
>().isSame();

// DivideUnits

assertRelation<
    DivideUnits<Basis, { a: "2"; b: "-1"; c: "0" }, { a: "2"; b: "-2"; c: "-1" }>,
    { a: "0"; b: "1"; c: "1" }
>().isSame();
assertRelation<
    DivideUnits<Basis, { a: "5"; b: "-5"; c: "0" }, { a: "3"; b: "-3"; c: "-1" }>,
    { a: "2"; b: "-2"; c: "1" }
>().isSame();

// DivisorUnit

assertRelation<
    DivisorUnit<Basis, { a: "4"; b: "0"; c: "0" }>,
    { a: "-1" | "0" | "1" | "2" | "3" | "4" | "5"; b: Exponent; c: Exponent }
>().isSame();
assertRelation<
    DivisorUnit<Basis, { a: "5"; b: "3"; c: "-4" }>,
    {
        a: "0" | "1" | "2" | "3" | "4" | "5";
        b: "-2" | "-1" | "0" | "1" | "2" | "3" | "4" | "5";
        c: "-5" | "-4" | "-3" | "-2" | "-1" | "0" | "1";
    }
>().isSame();

// ExponentiateUnit

assertRelation<ExponentiateUnit<Basis, { a: "2"; b: "-1"; c: "0" }, "0">, { a: "0"; b: "0"; c: "0" }>().isSame();
assertRelation<ExponentiateUnit<Basis, { a: "2"; b: "3"; c: "0" }, "1">, { a: "2"; b: "3"; c: "0" }>().isSame();
assertRelation<ExponentiateUnit<Basis, { a: "2"; b: "-1"; c: "0" }, "2">, { a: "4"; b: "-2"; c: "0" }>().isSame();
assertRelation<ExponentiateUnit<Basis, { a: "1"; b: "0"; c: "0" }, "3">, { a: "3"; b: "0"; c: "0" }>().isSame();

// AllowedExponents

assertRelation<AllowedExponents<Basis, { a: "1"; b: "0"; c: "0" }>, Exponent>().isSame();
assertRelation<AllowedExponents<Basis, { a: "2"; b: "1"; c: "0" }>, "-2" | "-1" | "0" | "1" | "2">().isSame();
assertRelation<AllowedExponents<Basis, { a: "3"; b: "1"; c: "0" }>, "-1" | "0" | "1">().isSame();

// NthRootUnit

assertRelation<NthRootUnit<Basis, { a: "4"; b: "-2"; c: "0" }, "1">, { a: "4"; b: "-2"; c: "0" }>().isSame();
assertRelation<NthRootUnit<Basis, { a: "4"; b: "-2"; c: "0" }, "2">, { a: "2"; b: "-1"; c: "0" }>().isSame();
assertRelation<NthRootUnit<Basis, { a: "3"; b: "-3"; c: "0" }, "3">, { a: "1"; b: "-1"; c: "0" }>().isSame();

// RadicandUnit

assertRelation<
    RadicandUnit<Basis, "2">,
    {
        a: "-4" | "-2" | "0" | "2" | "4";
        b: "-4" | "-2" | "0" | "2" | "4";
        c: "-4" | "-2" | "0" | "2" | "4";
    }
>().isSame();
assertRelation<
    RadicandUnit<Basis, "3">,
    {
        a: "-3" | "0" | "3";
        b: "-3" | "0" | "3";
        c: "-3" | "0" | "3";
    }
>().isSame();
