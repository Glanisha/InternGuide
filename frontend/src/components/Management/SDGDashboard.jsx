import { useEffect, useState } from "react";
import axios from "axios";
import { FiGlobe, FiUsers, FiTrendingUp, FiBarChart2, FiPieChart } from "react-icons/fi";
import { Doughnut, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

// SDG color mapping (official UN SDG colors)
const sdgColors = {
  "Quality Education": "#C5192D",
  "Industry Innovation": "#FD9D24",
  "Responsible Consumption": "#BF8B2E",
  "Decent Work": "#3F7E44",
  "Decent Work and Economic Growth": "#3F7E44",
  "Responsible Consumption and Production": "#BF8B2E",
  "Sustainable Cities": "#FD6925",
  "Peace and Justice": "#02558B",
  "Gender Equality": "#EF402B",
  "Industry, Innovation and Infrastructure": "#FD9D24",
  "Reduced Inequalities": "#DD1367",
  "Economic Growth": "#3F7E44",
  "Sustainable Cities and Communities": "#FD6925",
  "Climate Action": "#26BDE2",
  "Sustainable Consumption": "#BF8B2E",
  "some goals": "#999999" // Fallback color
};

export default function SDGDashboard() {
  const [stats, setStats] = useState({
    sdgAnalytics: {
      sdgDistribution: [],
      studentSdgParticipation: []
    },
    totalStudents: 0,
    participationRate: "0%"
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
      setError("Failed to fetch SDG statistics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchStats();
  }, []);

  const statsCardStyle = "p-4 rounded-xl bg-neutral-900/50 border border-white/10 backdrop-blur-md";

  const StatCard = ({ title, value, icon, description }) => (
    <div className={statsCardStyle}>
      <div className="flex items-start gap-4">
        <div className="text-2xl p-2 rounded-lg bg-white/10">{icon}</div>
        <div className="flex-1">
          <p className="text-sm text-neutral-400">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {description && <p className="text-xs text-neutral-500 mt-1">{description}</p>}
        </div>
      </div>
    </div>
  );

  // Prepare SDG data for charts
  const sdgDistributionData = {
    labels: stats.sdgAnalytics?.sdgDistribution?.map(sdg => sdg.sdg),
    datasets: [{
      data: stats.sdgAnalytics?.sdgDistribution?.map(sdg => sdg.count),
      backgroundColor: stats.sdgAnalytics?.sdgDistribution?.map(sdg => 
        sdgColors[sdg.sdg] || '#666666'
      ),
      borderWidth: 0
    }]
  };

  const studentParticipationData = {
    labels: stats.sdgAnalytics?.studentSdgParticipation?.map(sdg => sdg.sdg),
    datasets: [{
      label: 'Students',
      data: stats.sdgAnalytics?.studentSdgParticipation?.map(sdg => sdg.students),
      backgroundColor: stats.sdgAnalytics?.studentSdgParticipation?.map(sdg => 
        sdgColors[sdg.sdg] || '#666666'
      ),
      borderWidth: 0
    }]
  };

  // Sort SDGs by count (descending)
  const sortedSdgs = [...(stats.sdgAnalytics?.sdgDistribution || [])]
    .sort((a, b) => b.count - a.count);

  if (loading) return (
    <div className="p-6 flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-6 bg-red-900/30 border border-red-800/50 rounded-xl text-center">
      <h3 className="text-lg font-medium text-white mb-2">Error loading SDG data</h3>
      <p className="text-neutral-400 mb-4">{error}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
          SDG Impact Dashboard
        </h1>
        <p className="text-neutral-400 mt-2">
          Tracking progress towards Sustainable Development Goals
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={<FiUsers className="text-blue-400" />}
          description="Engaged with SDGs"
        />
        <StatCard
          title="Participation Rate"
          value={stats.participationRate}
          icon={<FiTrendingUp className="text-green-400" />}
          description="Students involved in SDG projects"
        />
        <StatCard
          title="SDGs Covered"
          value={stats.sdgAnalytics?.sdgDistribution?.length || 0}
          icon={<FiGlobe className="text-purple-400" />}
          description="Unique Sustainable Development Goals"
        />
      </div>

      {/* SDG Visualization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* SDG Distribution Doughnut */}
        <div className={statsCardStyle}>
          <div className="flex items-center gap-2 mb-4">
            <FiPieChart className="text-blue-400" />
            <h3 className="font-medium text-white">SDG Distribution</h3>
          </div>
          <div className="h-64">
            <Doughnut 
              data={sdgDistributionData}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      color: '#E5E7EB',
                      font: {
                        size: 10
                      },
                      padding: 16
                    }
                  }
                },
                cutout: '65%'
              }}
            />
          </div>
        </div>

        {/* Student Participation Bar Chart */}
        <div className={statsCardStyle}>
          <div className="flex items-center gap-2 mb-4">
            <FiBarChart2 className="text-green-400" />
            <h3 className="font-medium text-white">Student Participation</h3>
          </div>
          <div className="h-64">
            <Bar
              data={studentParticipationData}
              options={{
                indexAxis: 'y',
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                  x: {
                    beginAtZero: true,
                    ticks: {
                      color: '#E5E7EB'
                    },
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)'
                    }
                  },
                  y: {
                    ticks: {
                      color: '#E5E7EB'
                    },
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)'
                    }
                  }
                },
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Top SDGs List */}
      <div className={statsCardStyle}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium text-white flex items-center gap-2">
            <FiTrendingUp className="text-yellow-400" />
            Top Sustainable Development Goals
          </h2>
          <span className="text-sm bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full">
            {sortedSdgs.length} SDGs tracked
          </span>
        </div>

        <div className="space-y-3">
          {sortedSdgs.slice(0, 5).map((sdg, index) => (
            <div key={index} className="flex items-center p-3 bg-neutral-800/40 rounded-lg hover:bg-neutral-800/60 transition-colors">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-4"
                style={{ backgroundColor: sdgColors[sdg.sdg] || '#666666' }}
              >
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white">{sdg.sdg}</h3>
                <div className="flex items-center mt-1">
                  <div className="w-full bg-neutral-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${(sdg.count / sortedSdgs[0].count) * 100}%`,
                        backgroundColor: sdgColors[sdg.sdg] || '#666666'
                      }}
                    ></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-white">{sdg.count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedSdgs.length > 5 && (
          <button className="w-full mt-4 text-sm text-blue-400 hover:text-blue-300 transition-colors">
            View all SDGs →
          </button>
        )}
      </div>

      
    </div>
  );
}