// numericalMethods.ts

import { create, all } from "mathjs";

const math = create(all);

export const computeFunction = (func: string, x: number): number => {
  try {
    const compiledFunc = math.compile(func);
    const scope = { x };
    return compiledFunc.evaluate(scope);
  } catch (err) {
    throw new Error("Error evaluating function");
  }
};

// Ini adalah kodingan rumus biseksi
export const calculateBisection = (
  func: string,
  a: number,
  b: number,
  iterations: number,
  error: number
): number | null => {
  let fa = computeFunction(func, a);
  let fb = computeFunction(func, b);

  if (fa * fb >= 0) {
    throw new Error(
      "Metode Bisection tidak berlaku di sini karena f(a) * f(b) >= 0"
    );
  }

  let c = a;
  for (let i = 0; i < iterations; i++) {
    c = (a + b) / 2;
    let fc = computeFunction(func, c);
    if (Math.abs(fc) < error) {
      break;
    }
    if (fa * fc < 0) {
      b = c;
    } else {
      a = c;
    }
  }
  return c;
};

// Ini adalah kodingan rumus regula falsi
export const calculateRegulaFalsi = (
  func: string,
  a: number,
  b: number,
  iterations: number,
  error: number
): number | null => {
  let fa = computeFunction(func, a);
  let fb = computeFunction(func, b);

  if (fa * fb >= 0) {
    throw new Error(
      "Metode Regula Falsi tidak berlaku di sini karena f(a) * f(b) >= 0"
    );
  }

  let c = a;
  for (let i = 0; i < iterations; i++) {
    c = (a * fb - b * fa) / (fb - fa);
    let fc = computeFunction(func, c);
    if (Math.abs(fc) < error) {
      break;
    }
    if (fa * fc < 0) {
      b = c;
    } else {
      a = c;
    }
  }
  return c;
};
