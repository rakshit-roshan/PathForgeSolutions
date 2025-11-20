package com.example.MainFolder.Service;

import com.example.MainFolder.Entity.ContactEntity;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;

@Service
public class EmailNotificationService {

    private static final Logger logger = LoggerFactory.getLogger(EmailNotificationService.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");

    private final JavaMailSender mailSender;
    private final String adminRecipients;
    private final String companyName;
    private final String companyLogoUrl;

    public EmailNotificationService(JavaMailSender mailSender,
                                    @Value("${mail.notifications.admin:}") String adminRecipients,
                                    @Value("${mail.notifications.company-name:PathForge Solutions}") String companyName,
                                    @Value("${mail.notifications.company-logo-url:}") String companyLogoUrl) {
        this.mailSender = mailSender;
        this.adminRecipients = adminRecipients;
        this.companyName = companyName;
        this.companyLogoUrl = companyLogoUrl;
    }

    /**
     * Sends an HTML email to the admin(s) whenever a new contact inquiry is submitted.
     */
    public void sendContactSubmissionNotification(@NonNull ContactEntity contact) {
        if (!StringUtils.hasText(adminRecipients)) {
            logger.warn("Admin email notification skipped: 'mail.notifications.admin' is not configured.");
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());

            helper.setTo(parseRecipients(adminRecipients));
            helper.setSubject(String.format("[%s] New %s Inquiry from %s",
                    companyName, safe(contact.getServiceType()), safe(contact.getName())));
            helper.setText(buildHtmlBody(contact), true);

            mailSender.send(message);
            logger.info("Admin notification email sent for contact inquiry id {}", contact.getId());
        } catch (MessagingException e) {
            logger.error("Failed to construct admin notification email: {}", e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Failed to send admin notification email: {}", e.getMessage(), e);
        }
    }

    private String[] parseRecipients(String recipients) {
        return Arrays.stream(recipients.split(","))
                .map(String::trim)
                .filter(StringUtils::hasText)
                .toArray(String[]::new);
    }

    private String buildHtmlBody(ContactEntity contact) {
        String createdAt = contact.getCreatedAt() != null
                ? contact.getCreatedAt().format(DATE_FORMATTER)
                : "Just now";

        String logoSection = StringUtils.hasText(companyLogoUrl)
                ? "<img src=\"" + companyLogoUrl + "\" alt=\"" + companyName + " logo\" style=\"height:48px;margin-bottom:16px;\"/>"
                : "<h2 style=\"margin:0;color:#0a2540;font-weight:600;\">" + companyName + "</h2>";

        return "<!DOCTYPE html>" +
                "<html lang=\"en\">" +
                "<head><meta charset=\"UTF-8\"><title>New Contact Inquiry</title></head>" +
                "<body style=\"font-family:'Segoe UI',Arial,sans-serif;background-color:#f4f6fb;padding:24px;color:#0f172a;\">" +
                "  <div style=\"max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;box-shadow:0 10px 30px rgba(15,23,42,0.1);padding:32px;\">" +
                "    <div style=\"text-align:center;border-bottom:1px solid #e2e8f0;padding-bottom:24px;margin-bottom:24px;\">" +
                         logoSection +
                "      <p style=\"margin:8px 0 0;color:#64748b;font-size:14px;\">" + createdAt + "</p>" +
                "    </div>" +
                "    <h1 style=\"font-size:22px;color:#0f172a;margin-top:0;margin-bottom:8px;\">New Contact Submission</h1>" +
                "    <p style=\"color:#475569;margin-top:0;margin-bottom:24px;\">A prospective client just submitted their details. Here's a quick summary:</p>" +
                buildInfoSection("Client Details",
                        row("Name", safe(contact.getName())) +
                                row("Email", safe(contact.getEmail())) +
                                row("Phone", safe(contact.getPhone()))) +
                buildInfoSection("Request Overview",
                        row("Service Type", safe(contact.getServiceType())) +
                                row("Preferred Contact Method", safe(contact.getPreferredContactMethod())) +
                                row("Preferred Date", safe(contact.getPreferredDate())) +
                                row("Preferred Time", safe(contact.getPreferredTime()))) +
                buildInfoSection("Internship / Custom Inputs",
                        row("Track", safe(contact.getInternshipTrack())) +
                                row("Duration", safe(contact.getDuration())) +
                                row("Experience Level", safe(contact.getExperienceLevel())) +
                                row("Custom Idea", safe(contact.getCustomIdea()))) +
                "    <div style=\"margin-top:24px;background:#f8fafc;border-radius:10px;padding:20px;\">" +
                "      <h3 style=\"margin-top:0;margin-bottom:12px;color:#0f172a;\">Message</h3>" +
                "      <p style=\"margin:0;color:#475569;line-height:1.6;white-space:pre-line;\">" + escapeHtml(contact.getMessage()) + "</p>" +
                "    </div>" +
                "    <div style=\"margin-top:32px;text-align:center;color:#94a3b8;font-size:12px;\">" +
                "      <p style=\"margin:0;\">" + companyName + " • Automated notification</p>" +
                "    </div>" +
                "  </div>" +
                "</body>" +
                "</html>";
    }

    private String buildInfoSection(String heading, String rows) {
        return "<div style=\"margin-bottom:24px;\">" +
                "  <h3 style=\"margin:0 0 12px;color:#0f172a;\">" + heading + "</h3>" +
                "  <table style=\"width:100%;border-collapse:collapse;font-size:14px;\">" +
                rows +
                "  </table>" +
                "</div>";
    }

    private String row(String label, String value) {
        return "<tr>" +
                "<td style=\"padding:8px 12px;color:#64748b;width:40%;background:#f8fafc;border-bottom:1px solid #e2e8f0;\">" + label + "</td>" +
                "<td style=\"padding:8px 12px;color:#0f172a;border-bottom:1px solid #e2e8f0;background:#ffffff;\">" + escapeHtml(value) + "</td>" +
                "</tr>";
    }

    private String safe(String value) {
        return StringUtils.hasText(value) ? value.trim() : "Not provided";
    }

    private String escapeHtml(String value) {
        if (!StringUtils.hasText(value)) {
            return "Not provided";
        }
        return value.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}

