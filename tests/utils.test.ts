import assert from "node:assert/strict";
import { formatPrice, truncate } from "../src/lib/utils";

export function runUtilsTests() {
  assert.equal(truncate("hello", 10), "hello");
  assert.equal(truncate("hello world", 5), "hello...");
  const formatted = formatPrice(1234);
  assert.match(formatted, /1,234/);
}
