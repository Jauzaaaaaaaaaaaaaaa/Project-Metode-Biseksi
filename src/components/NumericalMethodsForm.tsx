// @ts-nocheck
"use client";
import React, { useState } from "react";
import {
  calculateBisection,
  calculateRegulaFalsi,
  computeFunction,
} from "../app/utils/numericalMethods";

const NumericalMethodsForm: React.FC = () => {
  const [funcInput, setFuncInput] = useState("");
  const [aInput, setAInput] = useState("");
  const [bInput, setBInput] = useState("");
  const [iterationsInput, setIterationsInput] = useState("");
  const [errorInput, setErrorInput] = useState("");

  const [bisectionResults, setBisectionResults] = useState<Array<any>>([]);
  const [regulaFalsiResult, setRegulaFalsiResult] = useState<number | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);

    try {
      const a = parseFloat(aInput);
      const b = parseFloat(bInput);
      const iterations = parseInt(iterationsInput);
      const error = parseFloat(errorInput);

      // Ini adalah bagian untuk menghitung dengan metode Bisection
      const bisectionResults = [];
      let currentA = a;
      let currentB = b;
      for (let i = 0; i < iterations; i++) {
        const c = (currentA + currentB) / 2;
        const fA = computeFunction(funcInput, currentA);
        const fB = computeFunction(funcInput, currentB);
        const fC = computeFunction(funcInput, c);
        bisectionResults.push({
          iteration: i + 1,
          a: currentA,
          b: currentB,
          c: c,
          fA: fA,
          fB: fB,
          fC: fC,
          product: fB * fC,
        });
        if (fB * fC >= 0) {
          currentB = c;
        } else {
          currentA = c;
        }
      }

      // Ini adalah bagian untuk menghitung dengan metode Regula Falsi
      const regulaFalsiResult = calculateRegulaFalsi(
        funcInput,
        a,
        b,
        iterations,
        error
      );

      setBisectionResults(bisectionResults);
      setRegulaFalsiResult(regulaFalsiResult);
    } catch (err) {
      setError("Terjadi kesalahan saat menghitung. Pastikan input valid.");
      console.error(err);
    }
  };

  const handleReset = () => {
    setFuncInput("");
    setAInput("");
    setBInput("");
    setIterationsInput("");
    setErrorInput("");
    setBisectionResults([]);
    setRegulaFalsiResult(null);
    setError(null);
  };

  const getSign = (value: number): string => (value >= 0 ? "positif" : "negatif");

  return (
    <div className="max-w-md mx-auto mt-10 p-5 border rounded shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-5 text-center">
        Metode Bisection dan Regula Falsi
      </h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Masukkan fungsi f(x):
          <input
            type="text"
            value={funcInput}
            onChange={(e) => setFuncInput(e.target.value)}
            className="mt-1 p-2 block w-full border rounded"
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Batas awal (a):
          <input
            type="text"
            value={aInput}
            onChange={(e) => setAInput(e.target.value)}
            className="mt-1 p-2 block w-full border rounded"
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Batas akhir (b):
          <input
            type="text"
            value={bInput}
            onChange={(e) => setBInput(e.target.value)}
            className="mt-1 p-2 block w-full border rounded"
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Jumlah iterasi:
          <input
            type="text"
            value={iterationsInput}
            onChange={(e) => setIterationsInput(e.target.value)}
            className="mt-1 p-2 block w-full border rounded"
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Nilai error:
          <input
            type="text"
            value={errorInput}
            onChange={(e) => setErrorInput(e.target.value)}
            className="mt-1 p-2 block w-full border rounded"
          />
        </label>
      </div>
      <div className="flex justify-between">
        <button
          onClick={handleCalculate}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
        >
          Hitung
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition duration-300"
        >
          Reset
        </button>
      </div>

      {error && <div className="text-red-500 mt-4">{error}</div>}

      {bisectionResults.length > 0 && (
        <div className="mt-5 p-3 border rounded bg-gray-100">
          <h3 className="text-xl font-semibold">Hasil Metode Bisection:</h3>
          {bisectionResults.map((result) => (
            <div key={result.iteration}>
              <h4 className="font-semibold">Iterasi {result.iteration}:</h4>
              <p>F(b) = {result.fB.toFixed(6)}</p>
              <p>c = (a+b)/2 = {result.c.toFixed(6)}</p>
              <p>F(c) = {result.fC.toFixed(6)}</p>
              <p>F(b)F(c) = {result.product.toFixed(6)}</p>
              {result.product >= 0 ? (
                <p>b = {result.c.toFixed(6)}</p>
              ) : (
                <p>a = {result.c.toFixed(6)}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {regulaFalsiResult !== null && (
        <div className="mt-5 p-3 border rounded bg-gray-100">
          <h3 className="text-xl font-semibold">Hasil Metode Regula Falsi:</h3>
          <p>Akar: {regulaFalsiResult.toFixed(6)}</p>
        </div>
      )}
    </div>
  );
};

export default NumericalMethodsForm;
