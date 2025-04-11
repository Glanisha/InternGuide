import { useState, useEffect } from 'react';
import axios from 'axios';

const StudentReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [studentName, setStudentName] = useState('');

  // Load saved report on component mount
  useEffect(() => {
    const savedReport = localStorage.getItem('studentReport');
    if (savedReport) {
      try {
        const { report, studentName, timestamp } = JSON.parse(savedReport);
        // Only use if less than 1 hour old (optional)
        if (Date.now() - timestamp < 3600000) {
          setReport(report);
          setStudentName(studentName);
        } else {
          localStorage.removeItem('studentReport');
        }
      } catch (e) {
        console.error('Failed to parse saved report', e);
      }
    }
  }, []);

  const generateReport = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:8000/api/student/report',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const reportData = {
        report: response.data.report,
        studentName: response.data.studentName,
        timestamp: Date.now()
      };

      setReport(reportData.report);
      setStudentName(reportData.studentName);
      
      // Save to localStorage
      localStorage.setItem('studentReport', JSON.stringify(reportData));
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to generate report:', err);
      setError(err.response?.data?.message || 'Failed to generate report');
      setLoading(false);
    }
  };

  const clearReport = () => {
    setReport(null);
    setStudentName('');
    localStorage.removeItem('studentReport');
  };

  const downloadPDF = () => {
    const content = document.getElementById('report-content');
    if (!content) return;

    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Student Report - ${studentName}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              color: #333;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px;
              border-bottom: 1px solid #eee;
              padding-bottom: 20px;
            }
            h1 { 
              color: #2c5282; 
              margin-bottom: 10px;
            }
            .section { 
              margin-bottom: 20px;
              padding-bottom: 15px;
              border-bottom: 1px solid #f5f5f5;
            }
            .section-title {
              font-size: 1.2em;
              font-weight: bold;
              color: #2c5282;
              margin-bottom: 10px;
            }
            .footer { 
              margin-top: 40px; 
              font-size: 0.8em; 
              color: #666;
              text-align: center;
            }
            ul {
              padding-left: 20px;
            }
            li {
              margin-bottom: 8px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Student Evaluation Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
            ${studentName ? `<p><strong>For:</strong> ${studentName}</p>` : ''}
          </div>
          <div class="report-content">
            ${formatReportForPDF(report)}
          </div>
          <div class="footer">
            <p>This report was automatically generated based on student data.</p>
            <p>Last updated: ${new Date().toLocaleString()}</p>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const cleanReportText = (text) => {
    if (!text) return '';
    
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\#\#\# (.*?)\n/g, '$1\n')
      .replace(/\#\# (.*?)\n/g, '$1\n')
      .replace(/\n\s*\n/g, '\n\n');
  };

  const formatReportForPDF = (text) => {
    const cleanedText = cleanReportText(text);
    
    const sections = cleanedText.split('\n\n').filter(section => section.trim() !== '');
    
    return sections.map((section, index) => {
      const firstLine = section.split('\n')[0];
      const isSectionTitle = firstLine === firstLine.toUpperCase() || firstLine.endsWith(':');
      
      if (isSectionTitle) {
        return `
          <div class="section">
            <div class="section-title">${firstLine}</div>
            <div>${section.split('\n').slice(1).join('<br>')}</div>
          </div>
        `;
      }
      
      return `
        <div class="section">
          <div>${section.replace(/\n/g, '<br>')}</div>
        </div>
      `;
    }).join('');
  };

  const formatReportText = (text) => {
    if (!text) return null;
    
    const cleanedText = cleanReportText(text);
    const sections = cleanedText.split('\n\n').filter(section => section.trim() !== '');
    
    return sections.map((section, index) => {
      const firstLine = section.split('\n')[0];
      const isSectionTitle = firstLine === firstLine.toUpperCase() || firstLine.endsWith(':');
      
      return (
        <div key={index} className="mb-6 pb-6 border-b border-white/10">
          {isSectionTitle && (
            <h3 className="text-xl font-semibold text-blue-400 mb-2">
              {firstLine}
            </h3>
          )}
          <div className="whitespace-pre-line text-neutral-200">
            {isSectionTitle ? section.split('\n').slice(1).join('\n') : section}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Student Report</h2>
        <div className="flex gap-4">
          {!report ? (
            <button
              onClick={generateReport}
              disabled={loading}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                loading
                  ? 'bg-blue-400/50 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          ) : (
            <button
              onClick={clearReport}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-all"
            >
              Clear Report
            </button>
          )}
          {report && (
            <button
              onClick={downloadPDF}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-all"
            >
              Download PDF
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-lg text-red-300">
          {error}
        </div>
      )}

      <div
        id="report-content"
        className="bg-neutral-900/60 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-white"
      >
        {report ? (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold mb-2">Student Evaluation Report</h1>
              <p className="text-neutral-400">Generated on {new Date().toLocaleDateString()}</p>
              {studentName && (
                <p className="text-xl mt-4">For: {studentName}</p>
              )}
            </div>

            <div className="report-content">
              {formatReportText(report)}
            </div>

            <div className="mt-12 pt-6 border-t border-white/10 text-sm text-neutral-400">
              <p>This report was automatically generated based on student data.</p>
              <p>Last updated: {new Date().toLocaleString()}</p>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-neutral-400">
            {loading ? (
              <p>Generating your report...</p>
            ) : (
              <p>No report generated yet. Click "Generate Report" to create one.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentReport;