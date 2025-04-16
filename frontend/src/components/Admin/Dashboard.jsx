import { useEffect, useState } from "react";
import axios from "axios";
import {
  FiUsers,
  FiBriefcase,
} from "react-icons/fi";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalMentors: 0,
    totalViewers: 0,
    activeInternships: 0,
    ongoingInternships: 0,
    pendingApplications: 0
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

  const StatCard = ({ title, value, icon }) => (
    <div className={statsCardStyle}>
      <div className="flex items-center gap-4">
        <div className="text-2xl">{icon}</div>
        <div>
          <p className="text-sm text-neutral-400">{title}</p>
          <p className="text-xl text-white font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
          Admin Dashboard
        </h1>
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
      </div>

      
    </>
  );
}
