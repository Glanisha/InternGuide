export default function StatCard({ title, value, color }) {
    return (
      <GlassCard className="transition-transform hover:transform hover:scale-105">
        <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>
        <div className={`text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
          {value}
        </div>
      </GlassCard>
    );
  }