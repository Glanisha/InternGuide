import { useEffect, useState } from "react";
import axios from "axios";
import { FiBriefcase, FiTrendingUp, FiAward } from "react-icons/fi";

export default function InternshipStats() {
  const [stats, setStats] = useState({
    totalInternships: 0,
    industryCollaboration: {
      totalCompanies: 0,
      topCompanies: []
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        }
      });
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      setError("Failed to fetch dashboard stats");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchStats();
  }, []);
  
  const statsCardStyle = "p-4 rounded-xl bg-neutral-900/50 border border-white/10 backdrop-blur-md";

  const StatCard = ({ title, value, icon }) => (
    <div className={statsCardStyle}>
      <div className="flex items-center gap-4">
        <div className="text-2xl">{icon}</div>
        <div className="flex-1">
          <p className="text-sm text-neutral-400">{title}</p>
          <p className="text-xl text-white font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );

  if (loading) return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-4 md:p-6">
      <div className="bg-red-900/30 border border-red-800/50 rounded-xl p-6 text-center">
        <h3 className="text-lg font-medium text-white mb-2">Error loading data</h3>
        <p className="text-neutral-400 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
          Internship Statistics
        </h1>
        <p className="text-neutral-400 mt-2">Overview of internship program</p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Internships"
          value={stats.totalInternships}
          icon={<FiBriefcase size={24} className="text-indigo-400" />}
        />
        <StatCard
          title="Partner Companies"
          value={stats.industryCollaboration?.totalCompanies}
          icon={<FiBriefcase size={24} className="text-orange-400" />}
        />
      </div>

      {/* Enhanced Companies List */}
      <div className={`${statsCardStyle} mb-8`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium text-white flex items-center gap-2">
            <FiTrendingUp className="text-blue-400" />
            Top Partner Companies
          </h2>
          <span className="text-sm bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full">
            {stats.industryCollaboration?.topCompanies?.length} companies
          </span>
        </div>
        
        <div className="space-y-4">
          {stats.industryCollaboration?.topCompanies?.slice(0, 5).map((company, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-4 bg-neutral-800/40 rounded-lg hover:bg-neutral-800/60 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold">
                    {company.name.charAt(0)}
                  </div>
                  {index < 3 && (
                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-xs text-white font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {index + 1}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-white">{company.name}</h3>
                  <p className="text-xs text-neutral-400">Industry Partner</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-white font-medium">{company.count}</p>
                  <p className="text-xs text-neutral-400">opportunities</p>
                </div>
                <FiAward className={`text-xl ${
                  index === 0 ? 'text-yellow-400' : 
                  index === 1 ? 'text-gray-300' : 
                  index === 2 ? 'text-amber-600' : 'text-neutral-500'
                }`} />
              </div>
            </div>
          ))}
        </div>
        
       
      </div>
    </div>
  );
}