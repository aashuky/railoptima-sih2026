import React, { useState } from "react";
import logo from "../assets/logo.png";
import { RAILWAY_ASSETS } from "../assets/railwayImages";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound, TrainFront, ShieldCheck } from "lucide-react";
import { loginUser, registerUser } from "../services/api";

const inputClass = "auth-field-input w-full rounded-xl border border-slate-200 bg-slate-50/80 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none placeholder:text-slate-400";

export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("engineer");
  const [department, setDepartment] = useState("TMS");
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setNotice("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setNotice("");
    setLoading(true);

    try {
      const response = mode === "login"
        ? await loginUser(email.trim(), password)
        : await registerUser({ name: name.trim(), email: email.trim(), password, role, department });
      localStorage.setItem("railoptima_token", response.token);
      onLogin(response.user);
    } catch (error) {
      setNotice(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page min-h-screen overflow-hidden bg-[#061936] text-slate-800">
      <header className="relative z-10 flex items-center justify-between border-b border-white/15 px-5 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <img src={logo} alt="RailOptima" className="h-10 w-10 rounded-xl bg-white p-1 object-contain shadow-lg" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-sky-200">Ministry of Railways</p>
            <p className="text-sm font-semibold text-white">RailOptima Control Centre</p>
          </div>
        </div>
        <div className="hidden items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/70 sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" /> Secure operations network
        </div>
      </header>

      <main
        className="auth-backdrop relative flex min-h-[calc(100vh-73px)] items-center justify-center overflow-x-hidden bg-cover bg-center px-4 py-6 sm:px-8 sm:py-8"
        style={{ backgroundImage: `url(${RAILWAY_ASSETS.corridorHero})` }}
      >
        <div className="absolute inset-0 bg-[#071F4D]/55" />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(7,31,77,0.86),rgba(11,61,145,0.28)_52%,rgba(7,31,77,0.7))]" />

        <section className="relative z-10 grid w-full max-w-4xl overflow-hidden rounded-2xl border border-white/30 bg-white/10 shadow-2xl shadow-[#071F4D]/30 backdrop-blur-sm lg:grid-cols-[1fr_0.88fr] motion-enter">
          <div className="auth-story relative hidden min-h-[500px] flex-col justify-between overflow-hidden p-7 text-white sm:p-9 lg:flex">
            <div className="absolute inset-0 bg-[#082957]/25" />
            <div className="relative z-10">
              <div className="mb-7 flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-sky-100 backdrop-blur-md">
                <TrainFront size={14} /> Intelligent possession planning
              </div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-sky-200">One command view for every corridor</p>
              <h1 className="max-w-xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl">Keep the line moving.</h1>
              <p className="mt-5 max-w-lg text-sm leading-6 text-blue-50/85">Coordinate track, signalling, and traction work into safer, explainable maintenance blocks with a single operational view.</p>
            </div>
            <div className="relative z-10 grid max-w-lg grid-cols-3 gap-2 border-t border-white/20 pt-6 text-[10px] uppercase tracking-[0.14em] text-blue-100/80 sm:gap-5">
              <div><strong className="mb-1 block text-lg text-white">3</strong>Departments</div>
              <div><strong className="mb-1 block text-lg text-white">1</strong>Shared window</div>
              <div><strong className="mb-1 block text-lg text-white">AI</strong>Verified rationale</div>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-8 lg:p-9">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#1976D2]">RailOptima access</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-[#071F4D]">{mode === "login" ? "Welcome back." : "Join the network."}</h2>
                <p className="mt-2 text-sm text-slate-500">{mode === "login" ? "Continue to your operations workspace." : "Create your secure planner profile."}</p>
              </div>
              <div className="rounded-xl bg-blue-50 p-2.5 text-[#1976D2]"><ShieldCheck size={22} /></div>
            </div>

            <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1.5">
              {["login", "register"].map((item) => (
                <button key={item} type="button" onClick={() => switchMode(item)} className={`auth-tab rounded-lg py-2.5 text-xs font-bold uppercase tracking-[0.12em] ${mode === item ? "active bg-white text-[#0B3D91] shadow-sm" : "text-slate-400 hover:text-slate-700"}`}>
                  {item === "login" ? "Sign in" : "Register"}
                </button>
              ))}
            </div>

            {notice && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-700 motion-enter">{notice}</div>}

            <form key={mode} onSubmit={handleSubmit} className="auth-form space-y-4">
              {mode === "register" && (
                <label className="auth-field block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Full name
                  <span className="relative mt-2 block"><UserRound size={17} className="auth-field-icon absolute left-4 top-3.5 text-slate-400" /><input required value={name} onChange={(event) => setName(event.target.value)} className={inputClass} placeholder="Aarav Sharma" /></span>
                </label>
              )}
              <label className="auth-field block text-xs font-bold uppercase tracking-wide text-slate-500">
                Email address
                <span className="relative mt-2 block"><Mail size={17} className="auth-field-icon absolute left-4 top-3.5 text-slate-400" /><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} placeholder="name@railways.gov.in" /></span>
              </label>
              <label className="auth-field block text-xs font-bold uppercase tracking-wide text-slate-500">
                Password
                <span className="relative mt-2 block"><LockKeyhole size={17} className="auth-field-icon absolute left-4 top-3.5 text-slate-400" /><input required minLength={6} type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} className={`${inputClass} pr-11`} placeholder="At least 6 characters" /><button type="button" onClick={() => setShowPassword((visible) => !visible)} className="auth-icon-button absolute right-3 top-2.5 rounded-lg p-1.5 text-slate-400" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span>
              </label>
              {mode === "register" && (
                <div className="grid grid-cols-2 gap-3">
                  <label className="auth-field text-xs font-bold uppercase tracking-wide text-slate-500">Role<select value={role} onChange={(event) => setRole(event.target.value)} className="auth-field-input mt-2 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-3 text-sm font-medium normal-case tracking-normal text-slate-700 outline-none"><option value="engineer">Engineer</option><option value="controller">Controller</option><option value="admin">Admin</option></select></label>
                  <label className="auth-field text-xs font-bold uppercase tracking-wide text-slate-500">Department<select value={department} onChange={(event) => setDepartment(event.target.value)} disabled={role !== "engineer"} className="auth-field-input mt-2 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-3 text-sm font-medium normal-case tracking-normal text-slate-700 outline-none disabled:opacity-50"><option value="TMS">TMS</option><option value="SMMS">SMMS</option><option value="TDMS">TDMS</option></select></label>
                </div>
              )}
              <button disabled={loading} className="auth-submit mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B3D91] py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition hover:bg-[#1976D2] disabled:cursor-wait disabled:opacity-60 motion-focus">
                {loading ? <><span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /> Connecting securely...</> : <>{mode === "login" ? "Enter workspace" : "Create secure account"}<ArrowRight size={17} /></>}
              </button>
            </form>
            <p className="mt-5 text-center text-[11px] leading-5 text-slate-400">Protected access for authorized railway planning staff.<br />Your credentials are encrypted before storage.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
