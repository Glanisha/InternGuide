import Internship from "../models/internship.model.js";
import Student from '../models/student.model.js';
import Faculty from "../models/faculty.model.js";
import Management from "../models/management.model.js";
import fetch from "node-fetch";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = process.env.GEMINI_API_URL;

async function generateGeminiReport(prompt) {
    try {
        const response = await fetch(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            }
        );

        const result = await response.json();
        return result.candidates?.[0]?.content?.parts?.[0]?.text || "No report generated";
    } catch (error) {
        console.error("Gemini API error:", error);
        throw error;
    }
}

export const generateInternshipReport = async (req, res) => {
    try {
        const authToken = req.headers.authorization?.split(' ')[1];
        if (!authToken) {
            return res.status(401).json({
                success: false,
                message: "Authorization token required"
            });
        }

        const statsData = await fetchStatsData(authToken);
        if (!statsData) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch statistics data"
            });
        }

        const prompt = `
        Generate a comprehensive internship program report with these metrics:

        **Program Overview**
        - Students: ${statsData.totalStudents || 0}
        - Mentors: ${statsData.totalMentors || 0}
        - Active Internships: ${statsData.activeInternships || 0}
        - Participation Rate: ${statsData.participationRate || "0%"}

        **Industry Collaboration**
        - Partner Companies: ${statsData.industryCollaboration?.totalCompanies || 0}
        ${statsData.industryCollaboration?.topCompanies?.length > 0 
            ? "- Top Companies:\n" + 
              statsData.industryCollaboration.topCompanies.slice(0, 3)
                .map(c => `  • ${c.name}: ${c.count} internships`).join('\n')
            : "- No company data available"}

        **SDG Alignment**
        ${statsData.sdgAnalytics?.sdgDistribution?.length > 0
            ? "- Top SDGs:\n" + 
              statsData.sdgAnalytics.sdgDistribution.slice(0, 3)
                .map(s => `  • ${s.sdg}: ${s.count}`).join('\n')
            : "- No SDG data available"}

        **Placement Statistics**
        - Placement Rate: ${statsData.placementAnalytics?.placementRate || "0%"}
        ${statsData.placementAnalytics?.popularSkills?.length > 0
            ? "- In-Demand Skills:\n" + 
              statsData.placementAnalytics.popularSkills.slice(0, 3)
                .map(s => `  • ${s.skill}: ${s.count}`).join('\n')
            : "- No skill data available"}

        Provide 3 key recommendations for program improvement.
        Format with clear headings and bullet points.
        `;

        const generatedReport = await generateGeminiReport(prompt);

        res.json({
            success: true,
            report: generatedReport,
            metrics: {
                totalStudents: statsData.totalStudents,
                totalMentors: statsData.totalMentors,
                participationRate: statsData.participationRate,
                placementRate: statsData.placementAnalytics?.placementRate
            }
        });

    } catch (error) {
        console.error("Report generation error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error during report generation"
        });
    }
};

export const getAllFacultyWithMentees = async (req, res) => {
  try {
    const faculty = await Faculty.find()
      .populate({
        path: "assignedStudents",
        select: "name email department cgpa skills achievements"
      })
      .select("name email department assignedStudents mentoringCapacity isAvailableForMentoring")
      .lean();

    res.status(200).json(faculty);
  } catch (error) {
    console.error("Error fetching faculty with mentees:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFacultyMenteesDetails = async (req, res) => {
  try {
    const { facultyId } = req.params;

    const faculty = await Faculty.findById(facultyId)
      .populate({
        path: "assignedStudents",
        select: "name email department cgpa skills achievements appliedInternships progress feedback"
      })
      .lean();

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    res.status(200).json(faculty.assignedStudents);
  } catch (error) {
    console.error("Error fetching faculty mentees:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const generateProgramMetrics = async (req, res) => {
  try {
    const userId = req.user?.id;

    const students = await Student.find()
      .populate({
        path: "appliedInternships.internship",
        select: "title company description sdgGoals"
      })
      .populate("assignedMentor", "name email department")
      .lean();

    const faculty = await Faculty.find()
      .select("name email department assignedStudents mentoringCapacity")
      .lean();

    const totalStudents = students.length;
    const totalFaculty = faculty.length;
    const internshipsCompleted = students.reduce((acc, student) => {
      const internships = student.appliedInternships || [];
      return acc + internships.filter(i => i.status === "Accepted").length;
    }, 0);

    const ratings = students.flatMap(s => 
      s.feedback?.map(f => f.rating) || []
    );
    const averageRating = ratings.length > 0 
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)
      : 0;

      let prompt = `Generate a comprehensive program success metrics report for the institutional internship program with focus on these management priorities:\n\n`;

      prompt += `1. Program Overview:\n`;
      prompt += `- Total Students: ${totalStudents}\n`;
      prompt += `- Total Faculty Mentors: ${totalFaculty}\n`;
      prompt += `- Internship Participation Rate: ${((internshipsCompleted/totalStudents)*100).toFixed(2)}%\n`;
      prompt += `- Average Mentor Rating: ${averageRating}/5\n\n`;

      prompt += `2. SDG Alignment Analysis:\n`;
      const sdgCounts = {};
      students.forEach(student => {
        student.appliedInternships?.forEach(internship => {
          if (internship.internship?.sdgGoals) {
            internship.internship.sdgGoals.forEach(sdg => {
              sdgCounts[sdg] = (sdgCounts[sdg] || 0) + 1;
            });
          }
        });
      });
      
      if (Object.keys(sdgCounts).length > 0) {
        prompt += `The internships are contributing to these Sustainable Development Goals:\n`;
        Object.entries(sdgCounts).forEach(([sdg, count]) => {
          prompt += `- SDG ${sdg}: ${count} internships\n`;
        });
      } else {
        prompt += `No SDG data available for current internships.\n`;
      }
   
      prompt += `\n3. Mentorship Effectiveness:\n`;
      prompt += `- Average mentees per mentor: ${(totalStudents/totalFaculty).toFixed(1)}\n`;

      const mentorLoads = faculty.map(f => f.assignedStudents?.length || 0);
      const maxLoad = Math.max(...mentorLoads);
      const minLoad = Math.min(...mentorLoads);
      prompt += `- Current load distribution: Ranges from ${minLoad} to ${maxLoad} mentees per mentor\n`;
      prompt += `- ${faculty.filter(f => (f.assignedStudents?.length || 0) >= f.mentoringCapacity).length} mentors at or above capacity\n\n`;
      
      // Placement Analytics (Covering Internship Placement Analytics)
      prompt += `4. Placement Analytics:\n`;
      // Group by department
      const deptStats = {};
      students.forEach(student => {
        const dept = student.department;
        if (!deptStats[dept]) deptStats[dept] = { students: 0, placements: 0 };
        deptStats[dept].students++;
        deptStats[dept].placements += student.appliedInternships?.filter(i => i.status === "Accepted").length || 0;
      });
      
      prompt += `Department-wise placement rates:\n`;
      Object.entries(deptStats).forEach(([dept, stats]) => {
        const rate = (stats.placements/stats.students*100).toFixed(1);
        prompt += `- ${dept}: ${rate}% placement rate (${stats.placements}/${stats.students})\n`;
      });
      
      // Recommendations (Covering Report Generation for Improvement)
      prompt += `\n5. Recommendations:\n`;
      prompt += `Based on the data analysis, provide:\n`;
      prompt += `- 3 key strengths of the current program\n`;
      prompt += `- 3 actionable areas for improvement\n`;
      prompt += `- Suggestions for better SDG alignment\n`;
      prompt += `- Strategies for optimizing mentor-mentee ratios\n`;
      prompt += `- Department-specific recommendations based on placement rates\n\n`;
      
      prompt += `Format the report with clear section headings, use bullet points for readability, and include relevant statistics in each section. Highlight any concerning trends or exceptional performances.`;
    const geminiResponse = await fetch(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        })
      }
    );

    const result = await geminiResponse.json();

    if (!result.candidates || !result.candidates[0]?.content?.parts[0]?.text) {
      console.error("Gemini error or empty response:", result);
      return res.status(500).json({ message: "Failed to generate report" });
    }

    const generatedReport = result.candidates[0].content.parts[0].text;

    // Save report to management
    await Management.findOneAndUpdate(
      { userId },
      { 
        $push: { 
          reportsGenerated: {
            report: generatedReport,
            reportType: "Program"
          } 
        },
        $set: {
          "programAnalytics.completionRate": (internshipsCompleted / totalStudents * 100).toFixed(2),
          "programAnalytics.averageRating": averageRating
        }
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      report: generatedReport,
      metrics: {
        totalStudents,
        totalFaculty,
        internshipsCompleted,
        averageRating
      }
    });

  } catch (error) {
    console.error("Error generating program metrics:", error);
    res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
};

export const trackSDGContributions = async (req, res) => {
  try {
    const internships = await Internship.find().select("sdgGoals");
    
    const sdgMap = {};
    internships.forEach(internship => {
      internship.sdgGoals?.forEach(sdg => {
        if (!sdgMap[sdg]) {
          sdgMap[sdg] = { count: 0, internships: [] };
        }
        sdgMap[sdg].count++;
        sdgMap[sdg].internships.push(internship._id);
      });
    });

    // Update management SDG tracking
    await Management.findOneAndUpdate(
      { userId: req.user?.id },
      { 
        sdgTracking: Object.keys(sdgMap).map(sdg => ({
          sdg,
          contribution: sdgMap[sdg].count,
          internshipsCount: sdgMap[sdg].internships.length
        }))
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      sdgContributions: Object.keys(sdgMap).map(sdg => ({
        sdg,
        count: sdgMap[sdg].count,
        internships: sdgMap[sdg].internships.length
      }))
    });
  } catch (error) {
    console.error("Error tracking SDG contributions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



//lizas management controllers for review system 
export const getReviews = async (req, res) => {
  try {
    const management = await Management.findOne({ userId: req.user.id }).populate({
      path: "receivedReviews.reviewId",
      populate: {
        path: "student.id",
        select: "name department"
      }
    });

    if (!management) {
      return res.status(404).json({ success: false, message: "Management user not found" });
    }

    const reviews = management.receivedReviews.map(item => {
      const review = item.reviewId?.toObject?.() || {};
      if (review.isAnonymous) {
        review.student = { name: "Anonymous", department: "Hidden" };
      }
      return {
        ...review,
        status: item.status,
        managementCreatedAt: item.createdAt
      };
    });

    res.status(200).json({
      success: true,
      reviews
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ success: false, message: "Failed to fetch reviews" });
  }
};

export const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["unread", "read", "archived"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const management = await Management.findOneAndUpdate(
      { userId: req.user.id, "receivedReviews.reviewId": id },
      { $set: { "receivedReviews.$.status": status } },
      { new: true }
    );

    if (!management) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.status(200).json({
      success: true,
      message: "Review status updated successfully"
    });
  } catch (error) {
    console.error("Error updating review status:", error);
    res.status(500).json({ success: false, message: "Failed to update review status" });
  }
};

export const getReviewAnalytics = async (req, res) => {
  try {
    const management = await Management.findOne({ userId: req.user.id })
      .populate("receivedReviews.reviewId");

    if (!management) {
      return res.status(404).json({ success: false, message: "Management user not found" });
    }

    const reviews = management.receivedReviews.map(item => item.reviewId);

    const analytics = {
      totalReviews: reviews.length,
      averageMentorshipRating: calculateAverage(reviews, "mentorshipRating"),
      averageInternshipRating: calculateAverage(reviews, "internshipRating"),
      averageSdgAlignmentRating: calculateAverage(reviews, "sdgAlignmentRating"),
      averageIndustryRelevanceRating: calculateAverage(reviews, "industryRelevanceRating"),
      averageOverallExperience: calculateAverage(reviews, "overallExperience"),
      ratingDistribution: getRatingDistribution(reviews),
      commonSuggestions: getCommonSuggestions(reviews)
    };

    res.status(200).json({
      success: true,
      analytics
    });
  } catch (error) {
    console.error("Error fetching review analytics:", error);
    res.status(500).json({ success: false, message: "Failed to fetch analytics" });
  }
};

// Helper functions
function calculateAverage(reviews, field) {
  const validReviews = reviews.filter(review => review[field]);
  if (validReviews.length === 0) return 0;
  return validReviews.reduce((sum, review) => sum + review[field], 0) / validReviews.length;
}

function getRatingDistribution(reviews) {
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach(review => {
    if (review.overallExperience) {
      distribution[review.overallExperience]++;
    }
  });
  return distribution;
}

function getCommonSuggestions(reviews) {
  const suggestions = reviews
    .filter(review => review.suggestions)
    .map(review => review.suggestions);
  
  // Simple implementation - in production you might use NLP for better analysis
  const wordFrequency = {};
  suggestions.forEach(text => {
    text.split(/\s+/).forEach(word => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
      if (cleanWord.length > 3) { // Ignore short words
        wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;
      }
    });
  });
  
  return Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));
}




