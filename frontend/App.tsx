
import { useState } from "react";

import {
  Activity,
  Bell,
  Factory,
  LayoutDashboard,
  BarChart3,
  Settings,
  Users,
  Zap,
  FileText,
  Search,
  Menu,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  Gauge,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import FactoryAnalytics from "./pages/FactoryAnalytics";

// Sidebar navigation
const navigation: { label: string; icon: LucideIcon }[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Factory Analytics", icon: BarChart3 },
  { label: "Machine Intelligence", icon: Factory },
  { label: "Production Analytics", icon: Activity },
  { label: "Workforce Overview", icon: Users },
  { label: "Energy Monitoring", icon: Zap },
  { label: "Notifications", icon: Bell },
  { label: "Reports", icon: FileText },
];

// Sample production data
const productionData = [
  { day: "Mon", production: 120, target: 140 },
  { day: "Tue", production: 150, target: 140 },
  { day: "Wed", production: 135, target: 140 },
  { day: "Thu", production: 180, target: 160 },
  { day: "Fri", production: 165, target: 160 },
  { day: "Sat", production: 210, target: 180 },
  { day: "Sun", production: 190, target: 180 },
];

// Reusable KPI card
function KPICard({
  title,
  value,
  change,
  icon: Icon,
  positive,
}: {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  positive: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{title}</p>
        <div className="rounded-xl bg-cyan-400/10 p-2.5">
          <Icon size={20} className="text-cyan-400" />
        </div>
      </div>

      <h2 className="mt-4 text-3xl font-bold text-white">{value}</h2>

      <div className="mt-3 flex items-center gap-1 text-sm">
        {positive ? (
          <ArrowUpRight size={16} className="text-emerald-400" />
        ) : (
          <ArrowDownRight size={16} className="text-rose-400" />
        )}

        <span className={positive ? "text-emerald-400" : "text-rose-400"}>
          {change}
        </span>

        <span className="text-slate-500">vs last week</span>
      </div>
    </motion.div>
  );
}

function App() {
  const [activePage, setActivePage] = useState("Overview");

  return (
    <div className="min-h-screen bg-slate-950 text-white md:flex">

      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-900 md:flex">

        <div className="flex h-20 items-center gap-3 border-b border-slate-800 px-6">
          <div className="rounded-xl bg-cyan-400 p-2">
            <Factory size={25} className="text-slate-950" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-widest">AURA</h1>
            <p className="text-[10px] tracking-[0.25em] text-slate-400">
              SMART FACTORY
            </p>
          </div>
        </div>

        <div className="px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Main Menu
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.label;

              return (
                <button
                  key={item.label}
                  onClick={() => setActivePage(item.label)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                    isActive
                      ? "bg-cyan-400/10 text-cyan-400"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon size={19} />
                  <span>{item.label}</span>

                  {isActive && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-cyan-400" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-slate-800 p-4">
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 hover:bg-slate-800 hover:text-white">
            <Settings size={19} />
            Settings
          </button>

          <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-800 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400 font-bold text-slate-950">
              A
            </div>

            <div>
              <p className="text-sm font-semibold">Admin User</p>
              <p className="text-xs text-slate-400">Factory Manager</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-w-0 flex-1">

        {/* Mobile header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-5 py-4 md:hidden">
          <div className="flex items-center gap-2">
            <Factory className="text-cyan-400" />
            <span className="font-bold tracking-widest">AURA</span>
          </div>

          <button aria-label="Menu">
            <Menu />
          </button>
        </div>

        {/* Top header */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 px-5 py-5 md:px-8">
          <div>
            <p className="text-sm text-slate-400">
              Factory Management / Dashboard
            </p>

            <h1 className="mt-1 text-2xl font-bold">{activePage}</h1>

            <p className="mt-1 text-sm text-slate-400">
              Monitor your factory operations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 sm:flex">
              <Search size={17} className="text-slate-400" />

              <input
                placeholder="Search..."
                className="w-32 bg-transparent text-sm outline-none placeholder:text-slate-500"
              />
            </div>

            <button
              aria-label="Notifications"
              onClick={() => setActivePage("Notifications")}
              className="relative rounded-xl border border-slate-800 bg-slate-900 p-3 hover:bg-slate-800"
            >
              <Bell size={19} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
            </button>

            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">Factory Admin</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
          </div>
        </header>

        {/* Dashboard body */}
        <div className="space-y-6 p-5 md:p-8">

          {/* OVERVIEW PAGE */}
          {activePage === "Overview" ? (
            <>

              <div>
                <h2 className="text-xl font-semibold">Factory Overview</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Here's what's happening at your factory today.
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <KPICard
                  title="Total Production"
                  value="1,250"
                  change="+12.5%"
                  icon={Activity}
                  positive={true}
                />

                <KPICard
                  title="Active Machines"
                  value="24 / 28"
                  change="+2 machines"
                  icon={Factory}
                  positive={true}
                />

                <KPICard
                  title="Workers Present"
                  value="186"
                  change="+8.2%"
                  icon={Users}
                  positive={true}
                />

                <KPICard
                  title="Energy Usage"
                  value="3,840 kWh"
                  change="-4.3%"
                  icon={Zap}
                  positive={true}
                />

              </div>

              {/* Production chart and machine health */}
              <div className="grid gap-6 xl:grid-cols-3">

                <motion.section
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-5 xl:col-span-2"
                >
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">Production Overview</h3>
                      <p className="mt-1 text-xs text-slate-400">
                        Weekly production performance
                      </p>
                    </div>

                    <span className="rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-300">
                      This Week
                    </span>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={productionData}>
                        <defs>
                          <linearGradient id="productionFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                          </linearGradient>
                        </defs>

                        <CartesianGrid stroke="#263244" strokeDasharray="3 3" />
                        <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" fontSize={12} />

                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            border: "1px solid #334155",
                            borderRadius: "10px",
                            color: "#fff",
                          }}
                        />

                        <Area
                          type="monotone"
                          dataKey="production"
                          stroke="#22d3ee"
                          strokeWidth={3}
                          fill="url(#productionFill)"
                        />

                        <Area
                          type="monotone"
                          dataKey="target"
                          stroke="#64748b"
                          strokeDasharray="5 5"
                          fill="transparent"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <p className="mt-3 text-xs text-slate-500">
                    Sample production figures for demonstration.
                  </p>
                </motion.section>

                {/* Machine Health */}
                <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Machine Health</h3>
                      <p className="mt-1 text-xs text-slate-400">
                        Current machine status
                      </p>
                    </div>

                    <Gauge className="text-cyan-400" />
                  </div>

                  <div className="space-y-4">

                    <div className="flex items-center justify-between rounded-xl bg-slate-800/70 p-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="text-emerald-400" />
                        <div>
                          <p className="text-sm font-medium">Healthy</p>
                          <p className="text-xs text-slate-400">20 machines</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold">20</span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-slate-800/70 p-3">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="text-amber-400" />
                        <div>
                          <p className="text-sm font-medium">Warning</p>
                          <p className="text-xs text-slate-400">3 machines</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold">3</span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-slate-800/70 p-3">
                      <div className="flex items-center gap-3">
                        <Wrench className="text-rose-400" />
                        <div>
                          <p className="text-sm font-medium">Maintenance</p>
                          <p className="text-xs text-slate-400">1 machine</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold">1</span>
                    </div>

                  </div>

                  <div className="mt-5 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-3">
                    <p className="text-xs text-cyan-300">
                      24 of 28 machines are currently operational.
                    </p>
                  </div>
                </section>
              </div>

              {/* Workforce and Notifications */}
              <div className="grid gap-6 lg:grid-cols-2">

                <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                  <h3 className="font-semibold">Workforce Summary</h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Today's attendance overview
                  </p>

                  <div className="mt-5 grid grid-cols-3 gap-3">

                    <div className="rounded-xl bg-slate-800 p-3">
                      <p className="text-xs text-slate-400">Present</p>
                      <p className="mt-2 text-2xl font-bold text-emerald-400">186</p>
                    </div>

                    <div className="rounded-xl bg-slate-800 p-3">
                      <p className="text-xs text-slate-400">Absent</p>
                      <p className="mt-2 text-2xl font-bold text-rose-400">14</p>
                    </div>

                    <div className="rounded-xl bg-slate-800 p-3">
                      <p className="text-xs text-slate-400">Total</p>
                      <p className="mt-2 text-2xl font-bold">200</p>
                    </div>

                  </div>
                </section>

                <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                  <h3 className="font-semibold">Recent Notifications</h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Latest factory updates
                  </p>

                  <div className="mt-5 space-y-4">

                    <div className="flex items-start gap-3">
                      <AlertTriangle className="mt-1 text-amber-400" size={19} />
                      <div>
                        <p className="text-sm">Machine A2 requires inspection</p>
                        <p className="mt-1 text-xs text-slate-500">10 minutes ago</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-1 text-emerald-400" size={19} />
                      <div>
                        <p className="text-sm">Daily production target reached</p>
                        <p className="mt-1 text-xs text-slate-500">35 minutes ago</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Zap className="mt-1 text-cyan-400" size={19} />
                      <div>
                        <p className="text-sm">Energy consumption decreased</p>
                        <p className="mt-1 text-xs text-slate-500">1 hour ago</p>
                      </div>
                    </div>

                  </div>
                </section>

              </div>

            </>

          ) : activePage === "Factory Analytics" ? (

            /* FACTORY ANALYTICS PAGE */
            <FactoryAnalytics />

          ) : (

            /* OTHER PAGES - PLACEHOLDERS */
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
              <h2 className="text-xl font-semibold">{activePage}</h2>
              <p className="mt-2 text-sm text-slate-400">
                This page will be developed in the next stage.
              </p>
            </section>

          )}

          {/* Footer */}
          <footer className="border-t border-slate-800 pt-5 text-center text-xs text-slate-500">
            AURA Smart Factory Management System · Demonstration Dashboard
          </footer>

        </div>
      </main>
    </div>
  );
}

export default App;
