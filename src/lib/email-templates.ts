/**
 * Branded email templates for AgriVentures India.
 * Each function returns a complete HTML email string.
 */

const BRAND_COLOR = "#0A4A23"
const BRAND_NAME = "AgriVentures India"
const TAGLINE = "Making India's Agritech Startups Visible"

function layout(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${BRAND_NAME}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color:${BRAND_COLOR};padding:24px 32px;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">
                ${BRAND_NAME}
              </h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;padding:20px 32px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#6b7280;font-size:13px;text-align:center;">
                ${BRAND_NAME} &mdash; ${TAGLINE}
              </p>
              <p style="margin:8px 0 0;color:#9ca3af;font-size:11px;text-align:center;">
                You received this email because you have an account on ${BRAND_NAME}.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

/** Welcome email sent on registration. */
export function welcomeEmail(userName: string): string {
  return layout(`
    <h2 style="margin:0 0 16px;color:#111827;font-size:20px;font-weight:600;">
      Welcome, ${escapeHtml(userName)}!
    </h2>
    <p style="margin:0 0 12px;color:#374151;font-size:15px;line-height:1.6;">
      Thank you for joining AgriVentures India. We are building the most comprehensive
      directory of India&rsquo;s agritech startups, connecting founders, investors, and
      the broader agricultural ecosystem.
    </p>
    <p style="margin:0 0 12px;color:#374151;font-size:15px;line-height:1.6;">
      Here is what you can do next:
    </p>
    <ul style="margin:0 0 20px;padding-left:20px;color:#374151;font-size:15px;line-height:1.8;">
      <li>Discover verified agritech startups across India</li>
      <li>Submit your own startup for listing and verification</li>
      <li>Connect with investors and fellow founders</li>
      <li>Explore jobs in the agritech ecosystem</li>
    </ul>
    <p style="margin:0;color:#374151;font-size:15px;line-height:1.6;">
      We are glad to have you on board!
    </p>
  `)
}

/** Confirmation email when a startup is submitted. */
export function startupSubmittedEmail(
  founderName: string,
  startupName: string
): string {
  return layout(`
    <h2 style="margin:0 0 16px;color:#111827;font-size:20px;font-weight:600;">
      Startup Submitted Successfully
    </h2>
    <p style="margin:0 0 12px;color:#374151;font-size:15px;line-height:1.6;">
      Hi ${escapeHtml(founderName)},
    </p>
    <p style="margin:0 0 12px;color:#374151;font-size:15px;line-height:1.6;">
      Your startup <strong>${escapeHtml(startupName)}</strong> has been submitted to AgriVentures India.
      Our team will review your submission and you will be notified once the review is complete.
    </p>
    <p style="margin:0 0 12px;color:#374151;font-size:15px;line-height:1.6;">
      The review process typically takes 2&ndash;5 business days. You can track the status from
      your dashboard at any time.
    </p>
    <p style="margin:0;color:#374151;font-size:15px;line-height:1.6;">
      Thank you for being part of India&rsquo;s agritech revolution!
    </p>
  `)
}

/** Email sent when a startup verification status changes. */
export function verificationStatusEmail(
  founderName: string,
  startupName: string,
  status: string,
  notes?: string
): string {
  const isApproved = status.toLowerCase() === "approved"
  const statusColor = isApproved ? "#059669" : "#dc2626"
  const statusLabel = isApproved ? "Approved" : "Rejected"

  return layout(`
    <h2 style="margin:0 0 16px;color:#111827;font-size:20px;font-weight:600;">
      Verification Update: ${escapeHtml(startupName)}
    </h2>
    <p style="margin:0 0 12px;color:#374151;font-size:15px;line-height:1.6;">
      Hi ${escapeHtml(founderName)},
    </p>
    <p style="margin:0 0 12px;color:#374151;font-size:15px;line-height:1.6;">
      The verification status of <strong>${escapeHtml(startupName)}</strong> has been updated to:
    </p>
    <p style="margin:0 0 20px;">
      <span style="display:inline-block;padding:6px 16px;border-radius:20px;background-color:${statusColor}15;color:${statusColor};font-weight:600;font-size:14px;">
        ${statusLabel}
      </span>
    </p>
    ${
      notes
        ? `<div style="margin:0 0 20px;padding:16px;background-color:#f9fafb;border-radius:6px;border-left:3px solid ${statusColor};">
            <p style="margin:0;color:#374151;font-size:14px;line-height:1.5;">
              <strong>Reviewer Notes:</strong><br/>${escapeHtml(notes)}
            </p>
          </div>`
        : ""
    }
    <p style="margin:0;color:#374151;font-size:15px;line-height:1.6;">
      ${
        isApproved
          ? "Congratulations! Your startup is now verified on AgriVentures India and will receive a verification badge."
          : "You can update your startup details and resubmit for review from your dashboard."
      }
    </p>
  `)
}

/** Email sent to a founder when an investor requests an introduction. */
export function introRequestEmail(
  founderName: string,
  investorName: string,
  investorOrg: string,
  startupName: string,
  message: string
): string {
  return layout(`
    <h2 style="margin:0 0 16px;color:#111827;font-size:20px;font-weight:600;">
      New Introduction Request
    </h2>
    <p style="margin:0 0 12px;color:#374151;font-size:15px;line-height:1.6;">
      Hi ${escapeHtml(founderName)},
    </p>
    <p style="margin:0 0 12px;color:#374151;font-size:15px;line-height:1.6;">
      <strong>${escapeHtml(investorName)}</strong> from <strong>${escapeHtml(investorOrg)}</strong>
      has expressed interest in connecting with you regarding
      <strong>${escapeHtml(startupName)}</strong>.
    </p>
    <div style="margin:0 0 20px;padding:16px;background-color:#f0fdf4;border-radius:6px;border-left:3px solid ${BRAND_COLOR};">
      <p style="margin:0;color:#374151;font-size:14px;line-height:1.5;">
        <strong>Message:</strong><br/>${escapeHtml(message)}
      </p>
    </div>
    <p style="margin:0;color:#374151;font-size:15px;line-height:1.6;">
      You can accept or decline this introduction request from your dashboard.
    </p>
  `)
}

/** Email sent to an investor when a founder responds to their intro request. */
export function introResponseEmail(
  investorName: string,
  founderName: string,
  startupName: string,
  status: string,
  responseNote?: string
): string {
  const isAccepted = status.toLowerCase() === "accepted"
  const statusColor = isAccepted ? "#059669" : "#dc2626"
  const statusLabel = isAccepted ? "Accepted" : "Declined"

  return layout(`
    <h2 style="margin:0 0 16px;color:#111827;font-size:20px;font-weight:600;">
      Introduction Request ${statusLabel}
    </h2>
    <p style="margin:0 0 12px;color:#374151;font-size:15px;line-height:1.6;">
      Hi ${escapeHtml(investorName)},
    </p>
    <p style="margin:0 0 12px;color:#374151;font-size:15px;line-height:1.6;">
      <strong>${escapeHtml(founderName)}</strong> has <strong style="color:${statusColor};">${statusLabel.toLowerCase()}</strong>
      your introduction request for <strong>${escapeHtml(startupName)}</strong>.
    </p>
    ${
      responseNote
        ? `<div style="margin:0 0 20px;padding:16px;background-color:#f9fafb;border-radius:6px;border-left:3px solid ${statusColor};">
            <p style="margin:0;color:#374151;font-size:14px;line-height:1.5;">
              <strong>Note:</strong><br/>${escapeHtml(responseNote)}
            </p>
          </div>`
        : ""
    }
    <p style="margin:0;color:#374151;font-size:15px;line-height:1.6;">
      ${
        isAccepted
          ? "You can now connect directly. We will facilitate the introduction shortly."
          : "You may continue to discover other startups on the platform."
      }
    </p>
  `)
}

/** Escape HTML special characters to prevent XSS in email content. */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}
