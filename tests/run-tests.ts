import { runCartUtilsTests } from "./cart-utils.test";
import { runUtilsTests } from "./utils.test";
import { runRouteSmokeTests } from "./routes-smoke.test";

function runTest(name: string, fn: () => void) {
  try {
    fn();
    console.log(`[PASS] ${name}`);
  } catch (error: unknown) {
    console.error(`[FAIL] ${name}`);
    throw error;
  }
}

runTest("cart-utils", runCartUtilsTests);
runTest("utils", runUtilsTests);
runTest("routes-smoke", runRouteSmokeTests);

console.log("All baseline tests passed.");
