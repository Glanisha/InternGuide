import { useEffect, useState } from "react";
import axios from "axios";
import {
  FiUsers,
  FiBriefcase,
  FiPieChart,
  FiBarChart2,
  FiTrendingUp,
  FiAward,
  FiGlobe
} from "react-icons/fi";
import { Pie, Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
);

export default function Stats() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalMentors: 0,
    totalViewers: 0,
    activeInternships: 0,
    ongoingInternships: 0,
    pendingApplications: 0,
    totalInternships: 0,
    participationRate: "0%",
    industryCollaboration: {
      totalCompanies: 0,
      allCompanies: [],
      topCompanies: []
    },
    sdgAnalytics: {
      sdgDistribution: [],
      studentSdgParticipation: []
    },
    placementAnalytics: {
      placementRate: "0%",
      totalApplications: 0,
      acceptedApplications: 0,
      industryDistribution: [],
      preferredRoles: [],
      popularSkills: []
    },
    departmentStats: {
      departments: []
    },
    modeDistribution: {
      remote: 0,
      hybrid: 0,
      onsite: 0
    }
  });

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
      console.error("Failed to fetch dashboard stats:", err);
    }
  };
  
  useEffect(() => {
    fetchStats();
  }, []);
  
  const statsCardStyle = 
    "p-4 rounded-xl bg-neutral-900/50 border border-white/10 backdrop-blur-md";

    const StatCard = ({ title, value, icon, trend }) => (
        <div className={statsCardStyle}>
          <div className="flex items-center gap-4">
            <div className="text-2xl">{icon}</div>
            <div className="flex-1">
              <p className="text-sm text-neutral-400">{title}</p>
              <p className="text-xl text-white font-semibold">{value}</p>
            </div>
            {typeof trend === 'number' && (
              <div
                className={`px-2 py-1 rounded-md text-xs ${
                  trend > 0 ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                }`}
              >
                {trend > 0 ? `↑ ${trend}%` : `↓ ${Math.abs(trend)}%`}
              </div>
            )}
          </div>
        </div>
      );
      
      const ChartCard = ({ title, children, icon }) => (
        <div className={`${statsCardStyle} col-span-1 md:col-span-2`}>
          <div className="flex items-center gap-2 mb-4">
            {icon && <div className="text-lg">{icon}</div>}
            <h3 className="font-medium text-white">{title}</h3>
          </div>
          {children}
        </div>
      );
      
  // Prepare data for charts
  const sdgData = {
    labels: stats.sdgAnalytics?.sdgDistribution.map(sdg => sdg.sdg),
    datasets: [
      {
        label: 'SDG Distribution',
        data: stats.sdgAnalytics?.sdgDistribution.map(sdg => sdg.count),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#8AC24A', '#F06292', '#7986CB', '#E57373',
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40'
        ],
        borderWidth: 1
      }
    ]
  };

  const companyData = {
    labels: stats.industryCollaboration?.topCompanies.map(company => company.name),
    datasets: [
      {
        label: 'Internships',
        data: stats.industryCollaboration?.topCompanies.map(company => company.count),
        backgroundColor: '#3B82F6',
        borderWidth: 1
      }
    ]
  };

  const industryData = {
    labels: stats.placementAnalytics?.industryDistribution.map(ind => ind.industry),
    datasets: [
      {
        label: 'Internships by Industry',
        data: stats.placementAnalytics?.industryDistribution.map(ind => ind.count),
        backgroundColor: '#10B981',
        borderWidth: 1
      }
    ]
  };

  const skillsData = {
    labels: stats.placementAnalytics?.popularSkills.map(skill => skill.skill),
    datasets: [
      {
        label: 'Student Skills',
        data: stats.placementAnalytics?.popularSkills.map(skill => skill.count),
        backgroundColor: [
          '#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#6366F1',
          '#8B5CF6', '#EC4899', '#F97316', '#14B8A6', '#0EA5E9'
        ],
        borderWidth: 1
      }
    ]
  };

  const modeData = {
    labels: ['Remote', 'Hybrid', 'Onsite'],
    datasets: [
      {
        data: [
          stats.modeDistribution?.remote || 0,
          stats.modeDistribution?.hybrid || 0,
          stats.modeDistribution?.onsite || 0
        ],
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
        borderWidth: 1
      }
    ]
  };

  const studentParticipationData = {
    labels: stats.sdgAnalytics?.studentSdgParticipation.map(sdg => sdg.sdg),
    datasets: [
      {
        label: 'Students Participating',
        data: stats.sdgAnalytics?.studentSdgParticipation.map(sdg => sdg.students),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
          Admin Dashboard
        </h1>
        <p className="text-neutral-400 mt-2">Comprehensive overview of your internship program</p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={<FiUsers size={24} className="text-blue-400" />}
        />
        <StatCard
          title="Total Mentors"
          value={stats.totalMentors}
          icon={<FiUsers size={24} className="text-purple-400" />}
        />
        <StatCard
          title="Total Viewers"
          value={stats.totalViewers}
          icon={<FiUsers size={24} className="text-pink-400" />}
        />
        <StatCard
          title="Active Internships"
          value={stats.activeInternships}
          icon={<FiBriefcase size={24} className="text-green-400" />}
        />
        <StatCard
          title="Ongoing Internships"
          value={stats.ongoingInternships}
          icon={<FiBriefcase size={24} className="text-yellow-400" />}
        />
        <StatCard
          title="Pending Applications"
          value={stats.pendingApplications}
          icon={<FiBriefcase size={24} className="text-red-400" />}
        />
        <StatCard
          title="Total Internships"
          value={stats.totalInternships}
          icon={<FiBriefcase size={24} className="text-indigo-400" />}
        />
        <StatCard
          title="Total Applications"
          value={stats.placementAnalytics?.totalApplications}
          icon={<FiBarChart2 size={24} className="text-blue-400" />}
        />
        <StatCard
          title="Accepted Applications"
          value={stats.placementAnalytics?.acceptedApplications}
          icon={<FiAward size={24} className="text-green-400" />}
        />
        <StatCard
          title="Participation Rate"
          value={stats.participationRate}
          icon={<FiTrendingUp size={24} className="text-teal-400" />}
        />
        <StatCard
          title="Placement Rate"
          value={stats.placementAnalytics?.placementRate}
          icon={<FiAward size={24} className="text-indigo-400" />}
        />
        <StatCard
          title="Total Companies"
          value={stats.industryCollaboration?.totalCompanies}
          icon={<FiBriefcase size={24} className="text-orange-400" />}
        />
      </div>

      {/* Visualization Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ChartCard title="SDG Distribution" icon={<FiGlobe className="text-blue-400" />}>
          <div className="h-64">
            <Pie 
              data={sdgData} 
              options={{ 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      color: '#E5E7EB',
                      font: {
                        size: 10
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        </ChartCard>

        <ChartCard title="Top Companies" icon={<FiBriefcase className="text-green-400" />}>
          <div className="h-64">
            <Bar 
              data={companyData} 
              options={{ 
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      color: '#E5E7EB'
                    },
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)'
                    }
                  },
                  x: {
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
        </ChartCard>

        <ChartCard title="Industry Distribution" icon={<FiPieChart className="text-purple-400" />}>
          <div className="h-64">
            <Bar 
              data={industryData} 
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
        </ChartCard>

        <ChartCard title="Work Mode Distribution" icon={<FiBarChart2 className="text-yellow-400" />}>
          <div className="h-64">
            <Doughnut 
              data={modeData} 
              options={{ 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      color: '#E5E7EB',
                      font: {
                        size: 12
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        </ChartCard>

        {stats.placementAnalytics?.popularSkills?.length > 0 && (
          <ChartCard title="Top Student Skills" icon={<FiTrendingUp className="text-red-400" />}>
            <div className="h-64">
              <Pie 
                data={skillsData} 
                options={{ 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        color: '#E5E7EB',
                        font: {
                          size: 10
                        }
                      }
                    }
                  }
                }} 
              />
            </div>
          </ChartCard>
        )}

        {stats.sdgAnalytics?.studentSdgParticipation?.length > 0 && (
          <ChartCard title="Student SDG Participation" icon={<FiGlobe className="text-teal-400" />}>
            <div className="h-64">
              <Line 
                data={studentParticipationData} 
                options={{ 
                  maintainAspectRatio: false,
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        color: '#E5E7EB'
                      },
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                      }
                    },
                    x: {
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
                      labels: {
                        color: '#E5E7EB'
                      }
                    }
                  }
                }} 
              />
            </div>
          </ChartCard>
        )}
      </div>

      {/* Additional Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.placementAnalytics?.preferredRoles?.length > 0 && (
          <ChartCard title="Top Preferred Roles">
            <div className="space-y-2">
              {stats.placementAnalytics.preferredRoles.map((role, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-neutral-300">{role.role}</span>
                  <span className="text-white font-medium">{role.count}</span>
                </div>
              ))}
            </div>
          </ChartCard>
        )}

        {stats.departmentStats?.departments?.length > 0 && (
          <ChartCard title="Department Stats">
            <div className="space-y-2">
              {stats.departmentStats.departments.map((dept, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-neutral-300">{dept.department}</span>
                  <span className="text-white font-medium">{dept.count}</span>
                </div>
              ))}
            </div>
          </ChartCard>
        )}

        <ChartCard title="Industry Collaboration">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-neutral-300">Total Companies</span>
              <span className="text-white font-medium">{stats.industryCollaboration?.totalCompanies}</span>
            </div>
            {stats.industryCollaboration?.topCompanies?.slice(0, 5).map((company, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-neutral-300">{company.name}</span>
                <span className="text-white font-medium">{company.count}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}