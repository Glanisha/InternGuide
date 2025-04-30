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

// Mock data for development
const mockData = {
  rawData: {
    facultyName: "Test Faculty",
    mentees: [
      { name: "Student 1", appliedInternships: 5, acceptedInternships: 2, rejectedInternships: 3, cgpa: 3.5, skills: ["JavaScript", "React"] },
      { name: "Student 2", appliedInternships: 7, acceptedInternships: 3, rejectedInternships: 4, cgpa: 3.8, skills: ["Python", "Django"] },
      { name: "Student 3", appliedInternships: 3, acceptedInternships: 1, rejectedInternships: 2, cgpa: 3.2, skills: ["Java", "Spring"] },
    ],
    overallStats: {
      totalInternships: 20,
      acceptanceRate: 0.3,
      averageCompletion: 0.8
    }
  },
  analysis: {
    analysis: JSON.stringify({
      personalized_insights: {
        "Student 1": "This student shows strong technical skills but could improve interview performance.",
        "Student 2": "Excellent academic performance with good internship conversion rates.",
        "Student 3": "Needs to apply to more internships to increase chances of acceptance."
      },
      recommendations: [
        "Conduct mock interviews for students",
        "Focus on communication skills development",
        "Encourage students to apply to more positions"
      ],
      overall_performance_summary: "The cohort shows good technical skills but needs improvement in soft skills and should increase application volume."
    })
  }
};

const MenteeAnalysis = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  // Function to check if cached data is still valid
  const isCacheValid = (cachedData) => {
    if (!cachedData || !cachedData.timestamp) return false;
    const cacheAge = (Date.now() - cachedData.timestamp) / (1000 * 60 * 60);
    return cacheAge < CACHE_EXPIRY_HOURS;
  };

  // Function to parse the analysis string - improved for better error handling
  const parseAnalysis = (analysisString) => {
    try {
      if (!analysisString) return null;
      
      // More robust cleaning - handle different JSON formats
      let cleanedString = analysisString;
      
      // Remove markdown code blocks if present
      cleanedString = cleanedString.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      
      // Fix common JSON issues that might cause parsing errors
      // Replace unescaped quotes inside strings
      cleanedString = cleanedString.replace(/(?<=":.*[^\\])"(?=.*,)/g, '\\"');
      
      // Attempt to parse with a more robust approach using a try-catch for each step
      try {
        return JSON.parse(cleanedString);
      } catch (parseError) {
        console.error('Initial JSON parse failed, attempting fallback parsing:', parseError);
        
        // Fallback: Try to create a valid JSON object manually
        const defaultAnalysis = {
          personalized_insights: {},
          recommendations: [],
          overall_performance_summary: "Unable to parse analysis data correctly. Please check the data format."
        };
        
        // Try to extract parts that might be valid
        try {
          // Extract insights if possible
          const insightsMatch = cleanedString.match(/"personalized_insights"\s*:\s*(\{[^}]*\})/);
          if (insightsMatch && insightsMatch[1]) {
            try {
              defaultAnalysis.personalized_insights = JSON.parse(insightsMatch[1]);
            } catch (e) {
              console.warn('Could not parse insights:', e);
            }
          }
          
          // Extract recommendations if possible
          const recsMatch = cleanedString.match(/"recommendations"\s*:\s*(\[[^\]]*\])/);
          if (recsMatch && recsMatch[1]) {
            try {
              defaultAnalysis.recommendations = JSON.parse(recsMatch[1]);
            } catch (e) {
              console.warn('Could not parse recommendations:', e);
            }
          }
          
          // Extract summary if possible
          const summaryMatch = cleanedString.match(/"overall_performance_summary"\s*:\s*"([^"]*)"/);
          if (summaryMatch && summaryMatch[1]) {
            defaultAnalysis.overall_performance_summary = summaryMatch[1];
          }
        } catch (extractError) {
          console.error('Failed to extract partial data:', extractError);
        }
        
        return defaultAnalysis;
      }
    } catch (e) {
      console.error('Error parsing analysis:', e);
      setError('Failed to parse analysis data');
      return {
        personalized_insights: {},
        recommendations: [],
        overall_performance_summary: "Error parsing analysis data"
      };
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

        // Check for token
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token missing");
        }

        // If no valid cache, make API call
        const response = await axios.get('http://localhost:8000/api/faculty/analytics', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }).catch(error => {
          // Enhanced error logging
          if (error.response) {
            console.error('Server responded with:', error.response.status);
            console.error('Response data:', error.response.data);
            console.error('Response headers:', error.response.headers);
          } else if (error.request) {
            console.error('No response received:', error.request);
          } else {
            console.error('Request setup error:', error.message);
          }
          
          // In development, fall back to mock data
          if (process.env.NODE_ENV === 'development') {
            console.warn('API request failed, using mock data instead');
            setData(mockData);
            setUsingMockData(true);
            setLoading(false);
            return;
          }
          
          throw error;
        });

        // Only update state if we got a real response (not mock data)
        if (response) {
          setData(response.data);
          setLoading(false);
          
          // Cache the new data with timestamp
          const dataToCache = {
            data: response.data,
            timestamp: Date.now()
          };
          localStorage.setItem(CACHE_KEY, JSON.stringify(dataToCache));
        }
      } catch (error) {
        console.error('Full error object:', error);
        setError(error.response?.data?.message || error.message || 'Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Clear cache function
  const clearCache = () => {
    localStorage.removeItem(CACHE_KEY);
    setData(null);
    setLoading(true);
    setError(null);
    fetchData(); // Re-fetch data
  };

  if (loading) {
    return (
      <div className="text-center p-10 text-xl text-white">
        Loading analysis...
        {error && <div className="text-red-400 mt-2">{error}</div>}
      </div>
    );
  }

  if (error && !usingMockData) {
    return (
      <div className="text-center p-10 text-xl text-red-400">
        {error}
        <button 
          onClick={clearCache}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center p-10 text-xl text-white">
        No data available
        <button 
          onClick={clearCache}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const { rawData, analysis } = data;
  const mentees = rawData.mentees || [];

  // Parse the analysis data
  const parsedAnalysis = parseAnalysis(analysis?.analysis);
  if (!parsedAnalysis) {
    return (
      <div className="text-center p-10 text-xl text-red-400">
        Error processing analysis data
        <button 
          onClick={clearCache}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-center text-white">Mentee Analysis - {rawData.facultyName}</h1>
        {usingMockData && (
          <div className="bg-yellow-500 text-black px-3 py-1 rounded-md text-sm font-bold">
            Using Mock Data
          </div>
        )}
      </div>

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
            <li>Acceptance Rate: {((rawData.overallStats?.acceptanceRate || 0) * 100).toFixed(1)}%</li>
            <li>Average Completion: {((rawData.overallStats?.averageCompletion || 0) * 100).toFixed(1)}%</li>
          </ul>
          <button 
            onClick={clearCache}
            className="mt-4 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Refresh Data
          </button>
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