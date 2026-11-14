
import {
  Activity,
  Factory,
  Gauge,
  Package,
  Clock,
  TrendingUp,
  Zap,
} from "lucide-react";

import { motion } from "motion/react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Sample department production data
const departmentData = [
  { department: "Assembly", production: 420, target: 450 },
  { department: "Packaging", production: 350, target: 320 },
  { department: "Processing", production: 280, target: 300 },
  { department: "Quality", production: 200, target: 220 },
];

// Sample efficiency data
const efficiencyData = [
  { day: "Mon", efficiency: 82 },
  { day: "Tue", efficiency: 85 },
  { day: "Wed", efficiency: 80 },
  { day: "Thu", efficiency: 89 },
  { day: "Fri", efficiency: 87 },
  { day: "Sat", efficiency: 94 },
  { day: "Sun", efficiency: 92 },
];

// Analytics KPI cards
const kpiData = [
  {
    title: "Factory Efficiency",
    value: "92%",
    description: "Overall operational efficiency",
    icon: Gauge,
    color: "text-cyan-400",
  },
  {
    title: "Machine Utilization",
    value: "86%",
    description: "Available machine capacity used",
    icon: Factory,
    color: "text-violet-400",
  },
  {
    title: "Total Production",
    value: "1,250",
    description: "Units produced this week",
    icon: Package,
    color: "text-emerald-400",
  },
  {
    title: "Downtime",
    value: "12 hrs",
    description: "Recorded downtime this week",
    icon: Clock,
    color: "text-amber-400",
  },
];

function FactoryAnalytics() {
  return (
    <div className="space-y-6">

      {/* Page heading */}
      <div>
        <div className="flex items-center gap-2">
          <Activity className="text-cyan-400" size={22} />
          <h2 className="text-xl font-semibold">
            Factory Performance
          </h2>
        </div>

        <p className="mt-2 text-sm text-slate-400">
          Monitor factory efficiency, production and machine utilization.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiData.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">
                  {item.title}
                </p>

                <Icon size={21} className={item.color} />
              </div>

              <h3 className="mt-4 text-3xl font-bold text-white">
                {item.value}
              </h3>

              <p className="mt-2 text-xs text-slate-500">
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-6 xl:grid-cols-2">

        {/* Department production chart */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
        >
          <div className="mb-6">
            <h3 className="font-semibold text-white">
              Department-wise Production
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Actual production compared with targets
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData}>
                <CartesianGrid
                  stroke="#263244"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="department"
                  stroke="#94a3b8"
                  fontSize={11}
                />

                <YAxis stroke="#94a3b8" fontSize={12} />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "10px",
                    color: "#fff",
                  }}
                />

                <Legend />

                <Bar
                  dataKey="production"
                  name="Actual Production"
                  fill="#22d3ee"
                  radius={[5, 5, 0, 0]}
                />

                <Bar
                  dataKey="target"
                  name="Production Target"
                  fill="#64748b"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        {/* Efficiency trend chart */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
        >
          <div className="mb-6">
            <h3 className="font-semibold text-white">
              Factory Efficiency Trend
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Daily efficiency percentage
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={efficiencyData}>
                <CartesianGrid
                  stroke="#263244"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="day"
                  stroke="#94a3b8"
                  fontSize={12}
                />

                <YAxis
                  domain={[0, 100]}
                  stroke="#94a3b8"
                  fontSize={12}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "10px",
                    color: "#fff",
                  }}
                  formatter={(value) => [`${value}%`, "Efficiency"]}
                />

                <Line
                  type="monotone"
                  dataKey="efficiency"
                  stroke="#22d3ee"
                  strokeWidth={3}
                  dot={{ fill: "#22d3ee", r: 4 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

      </div>

      {/* Performance summary */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-emerald-400" size={21} />
          <h3 className="font-semibold">Performance Summary</h3>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">

          <div className="rounded-xl bg-slate-800/70 p-4">
            <div className="flex items-center gap-2">
              <Package size={18} className="text-cyan-400" />

              <p className="text-sm text-slate-300">
                Production Performance
              </p>
            </div>

            <p className="mt-3 text-sm text-slate-400">
              1,250 units have been produced in this illustrative
              weekly dataset. Compare each department's output
              with its production target.
            </p>
          </div>

          <div className="rounded-xl bg-slate-800/70 p-4">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-amber-400" />

              <p className="text-sm text-slate-300">
                Operational Efficiency
              </p>
            </div>

            <p className="mt-3 text-sm text-slate-400">
              The illustrative efficiency trend reaches 94%
              on Saturday. Monitoring this trend can help
              identify changes in factory performance.
            </p>
          </div>

        </div>
      </section>

      {/* Sample data notice */}
      <p className="text-center text-xs text-slate-500">
        Demonstration only — all figures and chart values are sample data,
        not live factory measurements.
      </p>

    </div>
  );
}

export default FactoryAnalytics;