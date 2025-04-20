import Internship from "../models/internship.model.js";
import Student from "../models/student.model.js";
import axios from "axios";
import cron from "node-cron";

// Function to send reminder emails
const sendReminderEmails = async (internship, daysLeft) => {
  try {
    // Get all students' emails from the database
    const students = await Student.find({}, { email: 1 });
    const studentEmails = students.map(student => student.email);

    // Prepare the HTML email content
    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
            .header { color: #2c3e50; text-align: center; }
            .section { margin-bottom: 20px; }
            .section-title { color: #3498db; border-bottom: 2px solid #eee; padding-bottom: 5px; }
            .highlight-box { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 15px; }
            .urgent-box { background-color: #fff3cd; padding: 15px; border-radius: 5px; margin-bottom: 15px; }
            .footer { margin-top: 20px; font-size: 0.9em; color: #7f8c8d; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>⏰ Internship Application Reminder</h1>
            <h2>${internship.title}</h2>
            <h3><em>at ${internship.company}</em></h3>
        </div>

        <div class="${daysLeft <= 3 ? 'urgent-box' : 'highlight-box'}">
            <h3 class="section-title">Application Deadline Approaching!</h3>
            <p>There are <strong>${daysLeft} day${daysLeft !== 1 ? 's' : ''} left</strong> to apply for this internship.</p>
            <p><strong>Final Deadline:</strong> ${internship.applicationDeadline.toDateString()}</p>
        </div>

        <div class="section">
            <h3 class="section-title">Position Details</h3>
            <p><strong>Department:</strong> ${internship.department}</p>
            <p><strong>Duration:</strong> ${internship.internshipDuration}</p>
            <p><strong>Mode:</strong> ${internship.mode}</p>
            ${internship.location ? `<p><strong>Location:</strong> ${internship.location}</p>` : ''}
            ${internship.stipend ? `<p><strong>Stipend:</strong> ${internship.stipend}</p>` : ''}
        </div>

        <div class="section">
            <h3 class="section-title">Brief Description</h3>
            <p>${internship.description.substring(0, 150)}...</p>
        </div>

        <div class="highlight-box">
            <h3 class="section-title">How to Apply</h3>
            <p>Please check your student portal or contact your mentor for application details.</p>
            <p style="font-weight: bold; color: ${daysLeft <= 3 ? '#dc3545' : '#28a745'};">
                ${daysLeft <= 3 ? 'Hurry! Deadline is approaching soon!' : 'Apply at your earliest convenience!'}
            </p>
        </div>

        <div class="footer">
            <p>Best regards,<br>The Internship Team<br>Ft. Conceicao Rodrigues College of Engineering</p>
        </div>
    </body>
    </html>
    `;

    // Send email via your email service
    await axios.post('http://localhost:8001/sendEmail', {
      email: studentEmails,
      text: emailHtml,
      contentType: 'text/html'
    });

    console.log(`Sent ${daysLeft}-day reminder for internship: ${internship.title}`);
  } catch (error) {
    console.error(`Error sending ${daysLeft}-day reminder emails:`, error.message);
  }
};

// Function to check for upcoming deadlines and send reminders
const checkDeadlinesAndSendReminders = async () => {
  try {
    const now = new Date();
    
    // Find internships with deadlines in exactly 7 or 3 days
    const upcoming7Days = new Date(now);
    upcoming7Days.setDate(upcoming7Days.getDate() + 7);
    
    const upcoming3Days = new Date(now);
    upcoming3Days.setDate(upcoming3Days.getDate() + 3);

    // Format dates to match at midnight (00:00:00)
    const startOf7Days = new Date(upcoming7Days.setHours(0, 0, 0, 0));
    const endOf7Days = new Date(upcoming7Days.setHours(23, 59, 59, 999));
    
    const startOf3Days = new Date(upcoming3Days.setHours(0, 0, 0, 0));
    const endOf3Days = new Date(upcoming3Days.setHours(23, 59, 59, 999));

    // Find internships with deadlines in 7 days
    const internships7Days = await Internship.find({
      applicationDeadline: {
        $gte: startOf7Days,
        $lte: endOf7Days
      },
      status: "Open"
    });

    // Find internships with deadlines in 3 days
    const internships3Days = await Internship.find({
      applicationDeadline: {
        $gte: startOf3Days,
        $lte: endOf3Days
      },
      status: "Open"
    });

    // Send reminders
    for (const internship of internships7Days) {
      await sendReminderEmails(internship, 7);
    }

    for (const internship of internships3Days) {
      await sendReminderEmails(internship, 3);
    }
  } catch (error) {
    console.error("Error in deadline reminder job:", error.message);
  }
};

// Schedule the job to run daily at 9 AM
const setupReminderCronJob = () => {
  // Run every day at 9:00 AM
  cron.schedule('0 9 * * *', checkDeadlinesAndSendReminders, {
    scheduled: true,
    timezone: "Asia/Kolkata" // Adjust to your timezone
  });

  console.log("Internship reminder emails job scheduled to run daily at 9 AM");
};

export { setupReminderCronJob };