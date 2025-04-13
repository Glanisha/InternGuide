import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Configure ChartJS to use dark mode
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Cache key
const CACHE_KEY = 'menteeAnalysisData';
const CACHE_EXPIRY_HOURS = 5;

const MenteeAnalysis = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to check if cached data is still valid
  const isCacheValid = (cachedData) => {
    if (!cachedData || !cachedData.timestamp) return false;
    const cacheAge = (Date.now() - cachedData.timestamp) / (1000 * 60 * 60);
    return cacheAge < CACHE_EXPIRY_HOURS;
  };

  // Function to parse the analysis string
  const parseAnalysis = (analysisString) => {
    try {
      if (!analysisString) return null;
      const cleanedString = analysisString.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanedString);
    } catch (e) {
      console.error('Error parsing analysis:', e);
      setError('Failed to parse analysis data');
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if valid cached data exists
        const cachedData = JSON.parse(localStorage.getItem(CACHE_KEY));
        if (cachedData && isCacheValid(cachedData)) {
          setData(cachedData.data);
          setLoading(false);
          return;
        }

        // If no valid cache, make API call
        const response = await axios.get('http://localhost:8000/api/faculty/analytics', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json'
          }
        });
        
        // Update state
        setData(response.data);
        setLoading(false);
        
        // Cache the new data with timestamp
        const dataToCache = {
          data: response.data,
          timestamp: Date.now()
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(dataToCache));
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Clear cache function (optional - can be exposed via UI if needed)
  const clearCache = () => {
    localStorage.removeItem(CACHE_KEY);
  };

  if (loading) return <div className="text-center p-10 text-xl text-white">Loading analysis...</div>;
  if (error) return <div className="text-center p-10 text-xl text-red-400">{error}</div>;
  if (!data) return <div className="text-center p-10 text-xl text-white">No data available</div>;

  const { rawData, analysis } = data;
  const mentees = rawData.mentees || [];

  // Parse the analysis data
  const parsedAnalysis = parseAnalysis(analysis?.analysis);
  if (!parsedAnalysis) {
    return <div className="text-center p-10 text-xl text-red-400">Error processing analysis data</div>;
  }

  // Chart data configurations
  const internshipData = {
    labels: mentees.map((m) => m.name),
    datasets: [
      {
        label: 'Applied Internships',
        data: mentees.map((m) => m.appliedInternships || 0),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1
      },
      {
        label: 'Accepted Internships',
        data: mentees.map((m) => m.acceptedInternships || 0),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1
      },
      {
        label: 'Rejected Internships',
        data: mentees.map((m) => m.rejectedInternships || 0),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1
      }
    ]
  };

  const cgpaData = {
    labels: mentees.map((m) => m.name),
    datasets: [
      {
        label: 'CGPA',
        data: mentees.map((m) => m.cgpa || 0),
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 1
      }
    ]
  };

  const skillFrequency = {};
  mentees.forEach((m) => {
    (m.skills || []).forEach((skill) => {
      skillFrequency[skill] = (skillFrequency[skill] || 0) + 1;
    });
  });

  const skillData = {
    labels: Object.keys(skillFrequency),
    datasets: [
      {
        label: 'Skill Distribution',
        data: Object.values(skillFrequency),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(99, 102, 241, 0.8)',
          'rgba(225, 29, 72, 0.8)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(99, 102, 241, 1)',
          'rgba(225, 29, 72, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Chart options with dark mode styling
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#E5E7EB',
          font: {
            size: 14
          }
        }
      },
    },
    scales: {
      x: {
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
    }
  };

  const { personalized_insights: personalizedInsights = {}, recommendations = [], overall_performance_summary: overallSummary = "No summary available" } = parsedAnalysis;

  return (
    <div className="p-6 space-y-10 bg-black min-h-screen">
      <h1 className="text-3xl font-bold text-center text-white">Mentee Analysis - {rawData.facultyName}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Internship Stats Card */}
        <div className="glass-card p-6 rounded-xl backdrop-blur-sm border border-gray-700 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">Internship Stats</h2>
          <Bar data={internshipData} options={chartOptions} />
        </div>

        {/* CGPA Comparison Card */}
        <div className="glass-card p-6 rounded-xl backdrop-blur-sm border border-gray-700 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">CGPA Comparison</h2>
          <Bar data={cgpaData} options={chartOptions} />
        </div>

        {/* Skill Distribution Card */}
        <div className="glass-card p-6 rounded-xl backdrop-blur-sm border border-gray-700 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">Skill Distribution</h2>
          <Doughnut data={skillData} options={chartOptions} />
        </div>

        {/* Overall Stats Card */}
        <div className="glass-card p-6 rounded-xl backdrop-blur-sm border border-gray-700 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">Overall Stats</h2>
          <ul className="text-gray-200 list-disc list-inside space-y-2">
            <li>Total Internships: {rawData.overallStats?.totalInternships || 0}</li>
            <li>Acceptance Rate: {(rawData.overallStats?.acceptanceRate || 0) * 100}%</li>
            <li>Average Completion: {(rawData.overallStats?.averageCompletion || 0) * 100}%</li>
          </ul>
        </div>
      </div>

      {/* AI Analysis Summary Card */}
      <div className="glass-card p-8 rounded-xl backdrop-blur-sm border border-gray-700 shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-white">Analysis Summary</h2>
        <div className="space-y-6">
          <p className="text-gray-300 italic text-lg">{overallSummary}</p>
          
          {Object.keys(personalizedInsights).length > 0 && (
            <div className="grid md:grid-cols-3 gap-5">
              {Object.entries(personalizedInsights).map(([name, insight]) => (
                <div key={name} className="glass-card-inner p-5 rounded-lg border border-gray-600 shadow-md">
                  <h3 className="font-bold text-lg text-white">{name}</h3>
                  <p className="text-gray-300 text-sm mt-3">{insight}</p>
                </div>
              ))}
            </div>
          )}
          
          {recommendations.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-white mb-4">Recommendations</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                {recommendations.map((rec, i) => (
                  <li key={i} className="text-base">{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenteeAnalysis;