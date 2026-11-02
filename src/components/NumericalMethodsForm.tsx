// @ts-nocheck
"use client";
import React, { useMemo, useState } from "react";
import { calculateRegulaFalsi, computeFunction } from "../app/utils/numericalMethods";

const CONTOH = [
  { label: "x³ - x - 2", func: "x^3 - x - 2", a: "1", b: "2" },
  { label: "cos(x) - x", func: "cos(x) - x", a: "0", b: "1" },
  { label: "x² - 2", func: "x^2 - 2", a: "0", b: "2" },
];

const W = 640, H = 380, PAD = 34;

const Grafik = ({ func, langkah, pilih }) => {
  const aktif = langkah[pilih] || langkah[0];
  const { path, sx, sy, sumbuX } = useMemo(() => {
    const a0 = langkah[0].a, b0 = langkah[0].b;
    const lebar = Math.abs(b0 - a0) || 1;
    const x0 = Math.min(a0, b0) - lebar * 0.25, x1 = Math.max(a0, b0) + lebar * 0.25;
    const titik = [];
    for (let i = 0; i <= 240; i++) {
      const x = x0 + ((x1 - x0) * i) / 240;
      let y = NaN;
      try { y = computeFunction(func, x); } catch (e) {}
      if (typeof y === "number" && isFinite(y)) titik.push([x, y]);
    }
    const ys = titik.map((p) => p[1]);
    const y0 = Math.min(0, ...ys), y1 = Math.max(0, ...ys);
    const sx = (x) => PAD + ((x - x0) / (x1 - x0)) * (W - 2 * PAD);
    const sy = (y) => H - PAD - ((y - y0) / (y1 - y0 || 1)) * (H - 2 * PAD);
    const path = titik.map((p, i) => `${i ? "L" : "M"}${sx(p[0]).toFixed(1)} ${sy(p[1]).toFixed(1)}`).join("");
    return { path, sx, sy, sumbuX: sy(0) };
  }, [func, langkah]);

  return (
    <svg className="nm-plot" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Grafik f(x) = ${func} pada iterasi ${pilih + 1}`}>
      <line className="nm-axis" x1={PAD} x2={W - PAD} y1={sumbuX} y2={sumbuX} />
      <rect className="nm-band" x={Math.min(sx(aktif.a), sx(aktif.b))} y={PAD / 2} width={Math.abs(sx(aktif.b) - sx(aktif.a))} height={H - PAD} />
      <path className="nm-curve" d={path} pathLength="1" key={func} />
      <line className="nm-bound" x1={sx(aktif.a)} x2={sx(aktif.a)} y1={PAD / 2} y2={H - PAD / 2} />
      <line className="nm-bound" x1={sx(aktif.b)} x2={sx(aktif.b)} y1={PAD / 2} y2={H - PAD / 2} />
      <text className="nm-tag" x={sx(aktif.a)} y={H - 6} textAnchor="middle">a</text>
      <text className="nm-tag" x={sx(aktif.b)} y={H - 6} textAnchor="middle">b</text>
      <circle className="nm-root" cx={sx(aktif.c)} cy={sumbuX} r="6" />
      <text className="nm-tag nm-tag--c" x={sx(aktif.c)} y={sumbuX - 14} textAnchor="middle">c</text>
    </svg>
  );
};

const NumericalMethodsForm: React.FC = () => {
  const [funcInput, setFuncInput] = useState("x^3 - x - 2");
  const [aInput, setAInput] = useState("1");
  const [bInput, setBInput] = useState("2");
  const [iterationsInput, setIterationsInput] = useState("8");
  const [errorInput, setErrorInput] = useState("0.0001");

  const [bisectionResults, setBisectionResults] = useState<Array<any>>([]);
  const [regulaFalsiResult, setRegulaFalsiResult] = useState<number | null>(null);
  const [fungsiTerhitung, setFungsiTerhitung] = useState("");
  const [pilih, setPilih] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);
    setBisectionResults([]);
    setRegulaFalsiResult(null);

    const a = parseFloat(aInput);
    const b = parseFloat(bInput);
    const iterations = parseInt(iterationsInput);
    const tolerance = parseFloat(errorInput);

    if (!funcInput.trim() || [a, b, iterations, tolerance].some(Number.isNaN)) {
      setError("Lengkapi semua isian dengan angka yang valid.");
      return;
    }
    if (iterations < 1 || iterations > 200) {
      setError("Jumlah iterasi harus antara 1 sampai 200.");
      return;
    }

    try {
      if (computeFunction(funcInput, a) * computeFunction(funcInput, b) >= 0) {
        setError("f(a) dan f(b) harus berlawanan tanda. Coba batas lain yang mengapit akar.");
        return;
      }

      // Ini adalah bagian untuk menghitung dengan metode Bisection
      const hasil = [];
      let currentA = a;
      let currentB = b;
      for (let i = 0; i < iterations; i++) {
        const c = (currentA + currentB) / 2;
        const fA = computeFunction(funcInput, currentA);
        const fB = computeFunction(funcInput, currentB);
        const fC = computeFunction(funcInput, c);
        hasil.push({ iteration: i + 1, a: currentA, b: currentB, c, fA, fB, fC, product: fB * fC });
        if (Math.abs(fC) < tolerance) break;
        if (fB * fC >= 0) {
          currentB = c;
        } else {
          currentA = c;
        }
      }

      // Ini adalah bagian untuk menghitung dengan metode Regula Falsi
      setRegulaFalsiResult(calculateRegulaFalsi(funcInput, a, b, iterations, tolerance));
      setBisectionResults(hasil);
      setFungsiTerhitung(funcInput);
      setPilih(hasil.length - 1);
    } catch (err) {
      setError("Terjadi kesalahan saat menghitung. Periksa penulisan fungsi, misalnya x^2 - 2.");
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

  const pakaiContoh = (c) => {
    setFuncInput(c.func);
    setAInput(c.a);
    setBInput(c.b);
  };

  const akhir = bisectionResults[bisectionResults.length - 1];

  return (
    <main className="nm-page">
      <div className="nm-intro" aria-hidden="true"><i /><i /><b>f(x) = 0</b></div>

      <header className="nm-head">
        <p className="nm-kick">Metode numerik, pencarian akar</p>
        <h1>Bisection <em>&amp;</em> Regula Falsi</h1>
      </header>

      <section className="nm-board">
        <form className="nm-form" onSubmit={(e) => { e.preventDefault(); handleCalculate(); }}>
          <label className="nm-wide">Fungsi f(x)
            <input type="text" value={funcInput} onChange={(e) => setFuncInput(e.target.value)} spellCheck={false} placeholder="x^3 - x - 2" />
          </label>
          <div className="nm-chips nm-wide">
            {CONTOH.map((c) => (
              <button type="button" key={c.func} onClick={() => pakaiContoh(c)}>{c.label}</button>
            ))}
          </div>
          <label>Batas awal (a)
            <input type="text" inputMode="decimal" value={aInput} onChange={(e) => setAInput(e.target.value)} />
          </label>
          <label>Batas akhir (b)
            <input type="text" inputMode="decimal" value={bInput} onChange={(e) => setBInput(e.target.value)} />
          </label>
          <label>Jumlah iterasi
            <input type="text" inputMode="numeric" value={iterationsInput} onChange={(e) => setIterationsInput(e.target.value)} />
          </label>
          <label>Nilai error
            <input type="text" inputMode="decimal" value={errorInput} onChange={(e) => setErrorInput(e.target.value)} />
          </label>
          <div className="nm-actions nm-wide">
            <button type="submit" className="nm-go">Hitung</button>
            <button type="button" className="nm-reset" onClick={handleReset}>Reset</button>
          </div>
          {error && <p className="nm-error nm-wide" role="alert">{error}</p>}
        </form>

        <div className="nm-view">
          {bisectionResults.length > 0 ? (
            <>
              <Grafik func={fungsiTerhitung} langkah={bisectionResults} pilih={pilih} />
              <label className="nm-slider">Iterasi {pilih + 1} dari {bisectionResults.length}
                <input type="range" min="0" max={bisectionResults.length - 1} value={pilih} onChange={(e) => setPilih(+e.target.value)} />
              </label>
            </>
          ) : (
            <div className="nm-empty"><b>f(x)</b><span>Isi fungsi dan batasnya, lalu tekan Hitung. Grafik akan menunjukkan interval yang menyempit di tiap iterasi.</span></div>
          )}
        </div>
      </section>

      {akhir && (
        <section className="nm-answers">
          <div><span>Akar, Bisection</span><b>{akhir.c.toFixed(6)}</b><small>{bisectionResults.length} iterasi</small></div>
          {regulaFalsiResult !== null && (
            <div><span>Akar, Regula Falsi</span><b>{regulaFalsiResult.toFixed(6)}</b><small>Toleransi {errorInput}</small></div>
          )}
        </section>
      )}

      {bisectionResults.length > 0 && (
        <section className="nm-table">
          <h2>Tabel iterasi Bisection</h2>
          <div className="nm-scroll">
            <table>
              <thead><tr><th>i</th><th>a</th><th>b</th><th>c = (a+b)/2</th><th>F(b)</th><th>F(c)</th><th>F(b)F(c)</th><th>Berikutnya</th></tr></thead>
              <tbody>
                {bisectionResults.map((r, i) => (
                  <tr key={r.iteration} className={i === pilih ? "is-on" : ""} onClick={() => setPilih(i)}>
                    <td>{r.iteration}</td>
                    <td>{r.a.toFixed(6)}</td>
                    <td>{r.b.toFixed(6)}</td>
                    <td>{r.c.toFixed(6)}</td>
                    <td>{r.fB.toFixed(6)}</td>
                    <td>{r.fC.toFixed(6)}</td>
                    <td>{r.product.toFixed(6)}</td>
                    <td>{r.product >= 0 ? "b = c" : "a = c"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
};

export default NumericalMethodsForm;
