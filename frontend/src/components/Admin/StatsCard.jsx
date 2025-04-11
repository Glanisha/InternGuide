// src/components/admin/StatsCard.jsx
export default function StatCard({ title, value, icon }) {
    return (
      <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-4 transition-all hover:border-blue-500/30">
        <div className="flex items-center justify-between">
          <h3 className="text-sm text-neutral-400">{title}</h3>
          {icon}
        </div>
        <div className="text-2xl md:text-3xl font-bold mt-2">
          {value}
        </div>
      </div>
    );
  }