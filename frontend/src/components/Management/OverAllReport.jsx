import { useState, useEffect } from 'react';
import { FiDownload, FiTrash2, FiRefreshCw, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const OverallReport = () => {
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedReports, setSavedReports] = useState([]);
  const [activeTab, setActiveTab] = useState('report');
  const [expandedSections, setExpandedSections] = useState({
    executive: true,
    overview: true,
    industry: true,
    sdg: true,
    placement: true,
    recommendations: true
  });

  // Load saved reports from localStorage
  useEffect(() => {
    const storedReports = JSON.parse(localStorage.getItem('internshipReports') || '[]');
    setSavedReports(storedReports);
  }, []);
  
  const generateReport = async () => {
    setIsLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');
  
      const response = await fetch('http://localhost:8000/api/management/generate', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) throw new Error('Failed to fetch report');
      
      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Report generation failed');
  
      const newReport = {
        ...data,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        rawData: JSON.stringify(data, null, 2)
      };
  
      setReportData(newReport);
      
      const updatedReports = [newReport, ...savedReports].slice(0, 5);
      setSavedReports(updatedReports);
      localStorage.setItem('internshipReports', JSON.stringify(updatedReports));
  
    } catch (err) {
      setError(err.message);
      console.error('Report error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteReport = (id) => {
    const updatedReports = savedReports.filter(r => r.id !== id);
    setSavedReports(updatedReports);
    localStorage.setItem('internshipReports', JSON.stringify(updatedReports));
    if (reportData?.id === id) setReportData(null);
  };
  
  const cleanMarkdown = (text) => {
    if (!text) return '';
    
    // Remove markdown formatting
    return text
      .replace(/\\/g, '') // Remove backslashes
      .replace(/\*/g, '')   // Remove asterisks
      .replace(/#{1,6}\s?/g, '') // Remove headings
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1') // Remove links
      .replace(/\n\s*\n/g, '\n\n') // Normalize line breaks
      .trim();
  };
  
  const exportToPDF = async () => {
    setIsLoading(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Add title
      pdf.setFontSize(20);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Internship Program Report', 105, 20, { align: 'center' });
      
      // Add date
      pdf.setFontSize(12);
      pdf.text(`Generated on ${formatDate(reportData.timestamp)}`, 105, 28, { align: 'center' });
      
      // Process report sections
      let yPosition = 40;
      const sections = reportData.report.split('\n\n');
      
      // Executive Summary
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 139); // Dark blue
      pdf.text('Executive Summary', 15, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0); // Black
      const execSummary = cleanMarkdown(sections[0]);
      const execLines = pdf.splitTextToSize(execSummary, 180);
      pdf.text(execLines, 15, yPosition);
      yPosition += execLines.length * 7 + 15;
      
      // Metrics
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 139); // Dark blue
      pdf.text('Key Metrics', 15, yPosition);
      yPosition += 10;
      
      const metrics = reportData.metrics || {};
      const metricsData = [
        { label: 'Total Students', value: metrics.totalStudents || 'N/A', color: [0, 0, 255] },
        { label: 'Total Mentors', value: metrics.totalMentors || 'N/A', color: [128, 0, 128] },
        { label: 'Participation Rate', value: metrics.participationRate || 'N/A', color: [0, 128, 0] },
        { label: 'Placement Rate', value: metrics.placementRate || 'N/A', color: [255, 165, 0] }
      ];
      
      for (let i = 0; i < metricsData.length; i++) {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }
  
        const x = 15 + (i % 2) * 95;
        const y = yPosition + Math.floor(i / 2) * 30;
  
        pdf.setFillColor(240, 240, 240);
        pdf.roundedRect(x, y, 85, 25, 3, 3, 'F');
        pdf.setDrawColor(200, 200, 200);
        pdf.roundedRect(x, y, 85, 25, 3, 3, 'D');
  
        pdf.setFontSize(10);
        pdf.setTextColor(...metricsData[i].color);
        pdf.text(metricsData[i].label, x + 5, y + 8);
  
        pdf.setFontSize(14);
        pdf.setTextColor(0, 0, 0);
        pdf.text(metricsData[i].value.toString(), x + 5, y + 18);
      }
  
      yPosition += Math.ceil(metricsData.length / 2) * 30 + 15;
  
      for (let i = 1; i < sections.length; i++) {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }
  
        const section = sections[i];
        const sectionTitle = section.split('\n')[0].trim();
        const sectionContent = section.split('\n').slice(1).join('\n');
  
        pdf.setFontSize(16);
        pdf.setTextColor(0, 0, 139); // Dark blue
        pdf.text(cleanMarkdown(sectionTitle), 15, yPosition);
        yPosition += 10;
  
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0); // Black
        const contentLines = pdf.splitTextToSize(cleanMarkdown(sectionContent), 180);
        pdf.text(contentLines, 15, yPosition);
        yPosition += contentLines.length * 7 + 15;
      }
  
      pdf.save(`internship-report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      setError('Failed to generate PDF');
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderReportContent = () => {
    if (!reportData) return null;

    return (
      <div id="report-pdf-content" className="bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-700">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-400">Internship Program Report</h1>
          <p className="text-gray-300 mt-2">
            Generated on {formatDate(reportData.timestamp)}
          </p>
        </div>

        {/* Executive Summary */}
        <div className="mb-8">
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection('executive')}
          >
            <h2 className="text-2xl font-semibold text-blue-400">Executive Summary</h2>
            {expandedSections.executive ? <FiChevronUp className="text-gray-300" /> : <FiChevronDown className="text-gray-300" />}
          </div>
          {expandedSections.executive && (
            <div className="mt-4 text-gray-300 whitespace-pre-line">
              {cleanMarkdown(reportData.report.split('\n\n')[0])}
            </div>
          )}
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="text-sm font-medium text-blue-400">Total Students</h3>
            <p className="text-2xl font-bold text-white">
              {reportData.metrics?.totalStudents || 'N/A'}
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="text-sm font-medium text-purple-400">Total Mentors</h3>
            <p className="text-2xl font-bold text-white">
              {reportData.metrics?.totalMentors || 'N/A'}
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="text-sm font-medium text-green-400">Participation Rate</h3>
            <p className="text-2xl font-bold text-white">
              {reportData.metrics?.participationRate || 'N/A'}
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="text-sm font-medium text-amber-400">Placement Rate</h3>
            <p className="text-2xl font-bold text-white">
              {reportData.metrics?.placementRate || 'N/A'}
            </p>
          </div>
        </div>

        {/* Report Sections */}
        {reportData.report.split('\n\n').slice(1).map((section, index) => {
          const sectionTitle = section.split('\n')[0].replace('', '').trim();
          const sectionKey = sectionTitle.toLowerCase().replace(/\s+/g, '-');
          const sectionContent = section.split('\n').slice(1).join('\n');

          return (
            <div key={index} className="mb-8">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection(sectionKey)}
              >
                <h2 className="text-xl font-semibold text-blue-400">{cleanMarkdown(sectionTitle)}</h2>
                {expandedSections[sectionKey] ? <FiChevronUp className="text-gray-300" /> : <FiChevronDown className="text-gray-300" />}
              </div>
              {expandedSections[sectionKey] && (
                <div className="mt-4 text-gray-300 whitespace-pre-line">
                  {cleanMarkdown(sectionContent)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderRawData = () => {
    if (!reportData) return null;
    
    return (
      <div className="bg-gray-900 p-4 rounded-lg overflow-auto max-h-[600px] border border-gray-700">
        <pre className="text-sm text-gray-300">
          {JSON.stringify(JSON.parse(reportData.rawData), null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white">Internship Analytics</h1>
          <div className="flex gap-4">
            <button
              onClick={generateReport}
              disabled={isLoading}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <FiRefreshCw className="animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <FiRefreshCw className="mr-2" />
                  Generate Report
                </>
              )}
            </button>
            {reportData && (
              <button
                onClick={exportToPDF}
                disabled={isLoading}
                className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                <FiDownload className="mr-2" />
                Export PDF
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-900/50 border-l-4 border-red-500 text-red-300 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Saved Reports Sidebar */}
          <div className="lg:col-span-1 bg-gray-900 rounded-lg shadow p-4 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Reports</h2>
            {savedReports.length === 0 ? (
              <p className="text-gray-400">No reports generated yet</p>
            ) : (
              <ul className="space-y-2">
                {savedReports.map((report) => (
                  <li key={report.id}>
                    <div
                      onClick={() => setReportData(report)}
                      className={`w-full text-left p-3 rounded-md transition-colors cursor-pointer ${
                        reportData?.id === report.id ? 'bg-blue-900/50 text-blue-300' : 'hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-white">
                          {formatDate(report.timestamp)}
                        </span>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteReport(report.id);
                          }}
                          className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                          title="Delete report"
                        >
                          <FiTrash2 size={16} />
                        </div>
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {report.metrics?.totalStudents} students • {report.metrics?.placementRate} placement
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {reportData ? (
              <div className="bg-gray-900 rounded-lg shadow overflow-hidden border border-gray-800">
                {/* Tabs */}
                <div className="flex border-b border-gray-800">
                  <button
                    onClick={() => setActiveTab('report')}
                    className={`px-4 py-3 font-medium ${
                      activeTab === 'report' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'
                    }`}
                  >
                    Formatted Report
                  </button>
                  <button
                    onClick={() => setActiveTab('raw')}
                    className={`px-4 py-3 font-medium ${
                      activeTab === 'raw' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'
                    }`}
                  >
                    Raw Data
                  </button>
                </div>

                {/* Tab Content */}
                <div className="p-4">
                  {activeTab === 'report' ? renderReportContent() : renderRawData()}
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 rounded-lg shadow p-8 text-center border border-gray-800">
                <h2 className="text-xl font-medium text-white mb-2">No Report Generated</h2>
                <p className="text-gray-400 mb-4">
                  Generate a report to view detailed analytics and metrics
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverallReport;