import { AddendOf, Exponent, MultiplicandOf, PositiveExponent, ProductOf, SubtrahendOf } from "../src/exponent";
import { assertRelation } from "./utils";

assertRelation<AddendOf<"3">, "-5" | "-4" | "-3" | "-2" | "-1" | "0" | "1" | "2">().isSame();
assertRelation<AddendOf<"0">, Exponent>().isSame();

assertRelation<SubtrahendOf<"3">, "-2" | "-1" | "0" | "1" | "2" | "3" | "4" | "5">().isSame();
assertRelation<SubtrahendOf<"0">, Exponent>().isSame();

assertRelation<MultiplicandOf<"2">, "-2" | "-1" | "0" | "1" | "2">().isSame();
assertRelation<MultiplicandOf<"3">, "-1" | "0" | "1">().isSame();
assertRelation<MultiplicandOf<"0">, Exponent>().isSame();

assertRelation<ProductOf<"2">, "-4" | "-2" | "0" | "2" | "4">().isSame();

assertRelation<PositiveExponent, "1" | "2" | "3" | "4" | "5">().isSame();
