import { useEffect, useState } from "react";
import api from "../utils/api";

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const today = () => new Date().toISOString().split("T")[0];

export default function Income() {
  const [incomes, setIncomes] = useState([]);
  const [form, setForm] = useState({ amount: "", source: "", date: today() });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const load = () => api.get("/income").then((r) => setIncomes(r.data));
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      await api.post("/income", { ...form, amount: parseFloat(form.amount) });
      setForm({ amount: "", source: "", date: today() });
      load();
    } catch (e) {
      setErr(e.response?.data?.detail || "Failed to add income");
    } finally { setLoading(false); }
  };

  const del = async (id) => {
    await api.delete(`/income/${id}`);
    load();
  };

  const total = incomes.reduce((s, i) => s + i.amount, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Income</h1>
        <p className="text-slate-400 mt-1">Track your earnings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="card lg:col-span-1">
          <h2 className="text-base font-semibold mb-5">Add Income</h2>
          {err && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-3 py-2 mb-4">
              {err}
            </div>
          )}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="label">Amount (₹)</label>
              <input className="input" type="number" min="1" step="any"
                placeholder="20000" value={form.amount} onChange={set("amount")} required />
            </div>
            <div>
              <label className="label">Source</label>
              <input className="input" placeholder="Salary, Freelancing…"
                value={form.source} onChange={set("source")} required />
            </div>
            <div>
              <label className="label">Date</label>
              <input className="input" type="date" value={form.date} onChange={set("date")} required />
            </div>
            <button className="btn-primary w-full" type="submit" disabled={loading}>
              {loading ? "Adding…" : "Add Income"}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          {/* Total */}
          <div className="card mb-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center text-lg">📈</div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Total Income</p>
              <p className="text-2xl font-bold font-mono text-brand-400">{fmt(total)}</p>
            </div>
          </div>

          {incomes.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-3xl mb-3">💵</p>
              <p className="text-slate-400">No income added yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {incomes.map((item) => (
                <div key={item.id} className="card flex items-center justify-between py-4 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-500/15 flex items-center justify-center text-sm">💵</div>
                    <div>
                      <p className="font-medium text-white">{item.source}</p>
                      <p className="text-xs text-slate-500">{item.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono font-semibold text-brand-400">{fmt(item.amount)}</span>
                    <button onClick={() => del(item.id)}
                      className="text-slate-600 hover:text-red-400 transition-colors text-lg leading-none">×</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
