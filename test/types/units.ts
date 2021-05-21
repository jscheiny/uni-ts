import { Exponent } from "../../src/exponent";
import {
    MultiplyUnits,
    RadicandUnit,
    NthRootUnit,
    MultiplicandUnit,
    DivideUnits,
    ExponentiateUnit,
    AllowedExponents,
} from "../../src/measure/unitTypeArithmetic";
import { IsSame } from "./utils";
import { IsSingleStringLiteral } from "../../src/measure/typeUtils";
import { Measure, meters, milli, seconds } from "safe-units";

type Extends<A, B> = A extends B ? true : false;

// MultiplyUnits

type SelfMultiplication = MultiplyUnits<{ a: "2" }, { a: "2" }>; // $ExpectType { a: "4"; }
type MultiplySeveralDimensions = MultiplyUnits<{ a: "2"; b: "-1" }, { a: "-2"; b: "2"; c: "1" }>; // $ExpectType { b: "1"; c: "1"; }

// MultiplicandUnit

type MultiplicandAllowsOtherDimsWithAnyExponent = Extends<{ b: Exponent }, MultiplicandUnit<{ a: "2" }>>; // $ExpectType true
type MultiplicandRejectsSameDimWithBadExponent = Extends<{ a: "-4" }, MultiplicandUnit<{ a: "-2" }>>; // $ExpectType false
type MultiplicandAcceptsSameDimWithGoodExponent = Extends<{ a: "2" }, MultiplicandUnit<{ a: "3" }>>; // $ExpectType true
type MultiplicandAllowsMultiDims = Extends<{ a: "3"; c: "-4"; d: "5" }, MultiplicandUnit<{ a: "1"; c: "2" }>>; // $ExpectType true
type MultiplicandRejectsMultiDims = Extends<{ a: "1"; c: "0" }, MultiplicandUnit<{ a: "5"; b: "-5" }>>; // $ExpectType false

// DivideUnits

type Division = DivideUnits<{ a: "2"; b: "-1" }, { a: "2"; b: "-2"; c: "-1" }>; // $ExpectType { b: "1"; c: "1"; }

// ExponentiateUnit

type RaisingToTheZero = ExponentiateUnit<{ a: "2"; b: "-1" }, "0">; // $ExpectType {}
type RaisingToTheOne = ExponentiateUnit<{ a: "2"; b: "3" }, "1">; // $ExpectType { a: "2"; b: "3"; }
type Squaring = ExponentiateUnit<{ a: "2"; b: "-1" }, "2">; // $ExpectType { a: "4"; b: "-2"; }
type Cubing = ExponentiateUnit<{ a: "1" }, "3">; // $ExpectType { a: "3"; }

// AllowedExponents

type AllowedLargeExponents = AllowedExponents<{ a: "1"; b: "0" }>; // $ExpectType Exponent
type AllowedMediumExponents = IsSame<"-2" | "-1" | "0" | "1" | "2", AllowedExponents<{ a: "2"; b: "1" }>>; // $ExpectType true
type AllowedSmallExponents = IsSame<"-1" | "0" | "1", AllowedExponents<{ a: "3"; b: "1" }>>; // $ExpectType true

// NthRootUnit

type SquareRooting = NthRootUnit<{ a: "4"; b: "-2" }, "2">; // $ExpectType { a: "2"; b: "-1"; }
type CubeRooting = NthRootUnit<{ a: "3"; b: "-3" }, "3">; // $ExpectType { a: "1"; b: "-1"; }
type NthRootRejectsZero = NthRootUnit<{ a: "0" }, "0">; // $ExpectError
type NthRootRejectsNegative = NthRootUnit<{ a: "1" }, "-1">; // $ExpectError

// RadicandUnit

type RadicandAcceptsPerfectSquares = Extends<{ a: "2"; b: "-4"; c: "0" }, RadicandUnit<"2">>; // $ExpectType true
type RadicandRejectsNonPerfectSquares = Extends<{ a: "2"; b: "1" }, RadicandUnit<"2">>; // $ExpectType false
type RadicandAcceptsPerfectCubes = Extends<{ a: "3"; b: "-3" }, RadicandUnit<"3">>; // $ExpectType true
type RadicandRejectsNonPerfectCubes = Extends<{ a: "3"; b: "2" }, RadicandUnit<"3">>; // $ExpectType false
type RadicandRejectsZero = RadicandUnit<"0">; // $ExpectError

// IsSingleStringLiteral

type SingleLiteralWorks = IsSingleStringLiteral<"A">; // $ExpectType true
type UnionLiteralWorks = IsSingleStringLiteral<"A" | "B">; // $ExpectType false
type StringTypeWorks = IsSingleStringLiteral<string>; // $ExpectType false

// Conversion

Measure.of(3, meters).valueIn(seconds); // $ExpectError
Measure.of(3, meters).valueIn(milli(meters)); // $ExpectType number
