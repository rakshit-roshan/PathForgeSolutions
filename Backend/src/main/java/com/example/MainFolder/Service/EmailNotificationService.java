package com.example.MainFolder.Service;

import com.example.MainFolder.Entity.ContactEntity;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.client.WebClient;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class EmailNotificationService {

    private static final Logger logger = LoggerFactory.getLogger(EmailNotificationService.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");
    private static final String BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

    private final String emailProvider;
    private final JavaMailSender mailSender; // For Gmail SMTP (commented out but kept for reference)
    private final String adminRecipients;
    private final String companyName;
    private final String companyLogoUrl;
    private final String fromEmail;
    
    // Brevo API configuration
    private final String brevoApiKey;
    private final String brevoSenderEmail;
    private final String brevoSenderName;
    private final WebClient webClient;

    public EmailNotificationService(
            @Autowired(required = false) JavaMailSender mailSender,
            @Value("${mail.provider:brevo}") String emailProvider,
            @Value("${mail.notifications.admin:}") String adminRecipients,
            @Value("${mail.notifications.company-name:PathForge Solutions}") String companyName,
            @Value("${mail.notifications.company-logo-url:}") String companyLogoUrl,
            @Value("${spring.mail.username:}") String fromEmail,
            @Value("${brevo.api.key:}") String brevoApiKey,
            @Value("${brevo.sender.email:}") String brevoSenderEmail,
            @Value("${brevo.sender.name:PathForge Solutions}") String brevoSenderName) {
        this.mailSender = mailSender;
        this.emailProvider = emailProvider != null ? emailProvider.toLowerCase() : "brevo";
        this.adminRecipients = adminRecipients;
        this.companyName = companyName;
        this.companyLogoUrl = companyLogoUrl;
        this.fromEmail = fromEmail;
        this.brevoApiKey = brevoApiKey;
        this.brevoSenderEmail = brevoSenderEmail;
        this.brevoSenderName = brevoSenderName;
        
        // Initialize WebClient for Brevo API
        this.webClient = WebClient.builder()
                .baseUrl(BREVO_API_URL)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
        
        // Log configuration status on startup
        logger.info("EmailNotificationService initialized - Provider: {}, Admin recipients: {}", 
                   this.emailProvider, 
                   adminRecipients.isEmpty() ? "NOT CONFIGURED" : adminRecipients);
        
        if ("brevo".equals(this.emailProvider)) {
            logger.info("Brevo API configured - Sender: {}", 
                       brevoSenderEmail.isEmpty() ? "NOT CONFIGURED" : brevoSenderEmail);
        } else if ("gmail".equals(this.emailProvider)) {
            logger.info("Gmail SMTP configured - From email: {}", 
                       fromEmail.isEmpty() ? "NOT CONFIGURED" : fromEmail);
        }
    }

    /**
     * Sends an HTML email to the admin(s) whenever a new contact inquiry is submitted.
     */
    public void sendContactSubmissionNotification(@NonNull ContactEntity contact) {
        // Validate configuration
        if (!StringUtils.hasText(adminRecipients)) {
            logger.warn("Admin email notification skipped: 'mail.notifications.admin' is not configured.");
            System.out.println("========== EMAIL SKIPPED: Admin recipients not configured ==========");
            return;
        }

        String[] recipients = parseRecipients(adminRecipients);
        if (recipients.length == 0) {
            logger.warn("Admin email notification skipped: No valid recipient emails found.");
            System.out.println("========== EMAIL SKIPPED: No valid recipient emails ==========");
            return;
        }

        // Route to appropriate email provider
        if ("brevo".equals(emailProvider)) {
            sendEmailViaBrevo(contact, recipients);
        } else if ("gmail".equals(emailProvider)) {
            sendEmailViaGmail(contact, recipients);
        } else {
            logger.error("Unknown email provider: {}. Supported providers: 'brevo', 'gmail'", emailProvider);
            System.out.println("========== EMAIL ERROR: Unknown provider: " + emailProvider + " ==========");
        }
    }

    /**
     * Send email using Brevo API (Recommended for production/cloud hosting)
     */
    private void sendEmailViaBrevo(ContactEntity contact, String[] recipients) {
        // Validate Brevo configuration
        if (!StringUtils.hasText(brevoApiKey)) {
            logger.error("Cannot send email via Brevo: 'brevo.api.key' is not configured.");
            System.out.println("========== EMAIL ERROR: Brevo API key not configured ==========");
            return;
        }

        if (!StringUtils.hasText(fromEmail)) {
            logger.error("Cannot send email via Brevo: 'brevo.sender.email' is not configured.");
            System.out.println("========== EMAIL ERROR: Brevo sender email not configured ==========");
            return;
        }

        try {
            logger.info("Attempting to send email via Brevo API for contact id {} to recipients: {}", 
                       contact.getId(), String.join(", ", recipients));
            System.out.println("========== SENDING EMAIL VIA BREVO ==========");
            System.out.println("From: " + fromEmail + " (" + brevoSenderName + ")");
            System.out.println("To: " + String.join(", ", recipients));
            System.out.println("Contact ID: " + contact.getId());

            String subject = String.format("[%s] New %s Inquiry from %s",
                    companyName, safe(contact.getServiceType()), safe(contact.getName()));
            String htmlBody = buildHtmlBody(contact);

            // Build Brevo API request payload
            Map<String, Object> sender = new HashMap<>();
            sender.put("email", fromEmail);
            sender.put("name", brevoSenderName);

            Map<String, Object> payload = new HashMap<>();
            payload.put("sender", sender);
            payload.put("to", Arrays.stream(recipients)
                    .map(email -> {
                        Map<String, String> recipient = new HashMap<>();
                        recipient.put("email", email);
                        return recipient;
                    })
                    .toList());
            payload.put("subject", subject);
            payload.put("htmlContent", htmlBody);

            // Send email via Brevo API
            String response = webClient.post()
                    .header("api-key", brevoApiKey)
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(30))
                    .block();

            logger.info("✓ Admin notification email sent successfully via Brevo for contact inquiry id {} to {}", 
                       contact.getId(), String.join(", ", recipients));
            System.out.println("========== EMAIL SENT SUCCESSFULLY VIA BREVO ==========");
            System.out.println("Response: " + (response != null ? response : "Success"));
            
        } catch (Exception e) {
            logger.error("Failed to send admin notification email via Brevo for contact id {}: {}", 
                       contact.getId(), e.getMessage(), e);
            System.out.println("========== EMAIL SEND ERROR (BREVO) ==========");
            System.out.println("Error: " + e.getMessage());
            System.out.println("Error Class: " + e.getClass().getName());
            e.printStackTrace();
        }
    }

    /**
     * Send email using Gmail SMTP (For local development - may not work on cloud hosting)
     * NOTE: This implementation is kept for reference but commented out in favor of Brevo API
     */
    private void sendEmailViaGmail(ContactEntity contact, String[] recipients) {
        // Validate Gmail configuration
        if (!StringUtils.hasText(fromEmail)) {
            logger.error("Cannot send email via Gmail: 'spring.mail.username' (from email) is not configured.");
            System.out.println("========== EMAIL ERROR: From email (spring.mail.username) not configured ==========");
            return;
        }

        if (mailSender == null) {
            logger.error("Cannot send email via Gmail: JavaMailSender bean is not available.");
            System.out.println("========== EMAIL ERROR: JavaMailSender bean not available ==========");
            return;
        }

        try {
            logger.info("Attempting to send email via Gmail SMTP for contact id {} to recipients: {}", 
                       contact.getId(), String.join(", ", recipients));
            System.out.println("========== SENDING EMAIL VIA GMAIL SMTP ==========");
            System.out.println("From: " + fromEmail);
            System.out.println("To: " + String.join(", ", recipients));
            System.out.println("Contact ID: " + contact.getId());

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());

            // Set FROM address (required by SMTP servers)
            helper.setFrom(fromEmail, companyName);
            
            // Set recipients
            helper.setTo(recipients);
            
            // Set subject
            helper.setSubject(String.format("[%s] New %s Inquiry from %s",
                    companyName, safe(contact.getServiceType()), safe(contact.getName())));
            
            // Set HTML body
            helper.setText(buildHtmlBody(contact), true);

            // Send email
            mailSender.send(message);
            
            logger.info("✓ Admin notification email sent successfully via Gmail SMTP for contact inquiry id {} to {}", 
                       contact.getId(), String.join(", ", recipients));
            System.out.println("========== EMAIL SENT SUCCESSFULLY VIA GMAIL SMTP ==========");
            
        } catch (MessagingException e) {
            logger.error("Failed to construct admin notification email via Gmail for contact id {}: {}", 
                       contact.getId(), e.getMessage(), e);
            System.out.println("========== EMAIL CONSTRUCTION ERROR (GMAIL) ==========");
            System.out.println("Error: " + e.getMessage());
            e.printStackTrace();
        } catch (org.springframework.mail.MailException e) {
            logger.error("Failed to send admin notification email via Gmail for contact id {}: {}", 
                       contact.getId(), e.getMessage(), e);
            System.out.println("========== EMAIL SEND ERROR (GMAIL) ==========");
            System.out.println("Error: " + e.getMessage());
            System.out.println("Error Class: " + e.getClass().getName());
            e.printStackTrace();
        } catch (Exception e) {
            logger.error("Unexpected error sending admin notification email via Gmail for contact id {}: {}", 
                       contact.getId(), e.getMessage(), e);
            System.out.println("========== UNEXPECTED EMAIL ERROR (GMAIL) ==========");
            System.out.println("Error: " + e.getMessage());
            System.out.println("Error Class: " + e.getClass().getName());
            e.printStackTrace();
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
