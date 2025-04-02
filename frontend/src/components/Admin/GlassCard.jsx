export default function GlassCard({ children, className = '' }) {
    return (
      <div className={`bg-gray-900 bg-opacity-20 backdrop-blur-lg rounded-lg p-6 ${className}`}>
        {children}
      </div>
    );
  }