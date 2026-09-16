const capitalizeName = (name = "") => {
  return name
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const escapeHtml = (value = "") => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export const verifyAccountEmail = (name, verifyLink) => {
  const siteName = escapeHtml(process.env.SITE_NAME || "Your Company");
  const userName = escapeHtml(capitalizeName(name));
  const safeVerifyLink = escapeHtml(verifyLink);
  const currentYear = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">

  <title>${siteName} | Verify Your Account</title>

  <style>
    @media only screen and (max-width: 600px) {
      .email-wrapper {
        padding: 16px 10px !important;
      }

      .email-card {
        width: 100% !important;
        border-radius: 10px !important;
      }

      .content {
        padding: 30px 22px !important;
      }

      .header {
        padding: 28px 20px !important;
      }

      .header-title {
        font-size: 21px !important;
      }

      .heading {
        font-size: 24px !important;
        line-height: 32px !important;
      }

      .body-text {
        font-size: 15px !important;
        line-height: 24px !important;
      }

      .button-wrapper {
        padding: 8px 0 12px !important;
      }

      .button {
        display: block !important;
        width: 100% !important;
        box-sizing: border-box !important;
        padding: 15px 20px !important;
        font-size: 15px !important;
      }

      .link-box {
        padding: 14px !important;
      }

      .verification-link {
        font-size: 12px !important;
        line-height: 18px !important;
      }

      .footer {
        padding: 18px 20px !important;
      }
    }
  </style>
</head>

<body style="
  margin: 0;
  padding: 0;
  background-color: #ffffff;
  font-family: Arial, Helvetica, sans-serif;
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
">

  <!-- Main Wrapper -->
  <table
    role="presentation"
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
      width: 100%;
      background-color: #ffffff;
      margin: 0;
      padding: 0;
    "
  >
    <tr>
      <td
        class="email-wrapper"
        align="center"
        style="
          padding: 40px 20px;
          background-color: #ffffff;
        "
      >

        <!-- Email Card -->
        <table
          role="presentation"
          class="email-card"
          width="620"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            width: 100%;
            max-width: 620px;
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            overflow: hidden;
          "
        >

          <!-- Header -->
          <tr>
            <td
              class="header"
              align="center"
              style="
                padding: 32px 30px;
                background-color: #111827;
              "
            >

              <div
                class="header-title"
                style="
                  color: #ffffff;
                  font-size: 22px;
                  line-height: 28px;
                  font-weight: 700;
                  letter-spacing: -0.2px;
                "
              >
                ${siteName}
              </div>

              <div style="
                margin-top: 7px;
                color: #d1d5db;
                font-size: 13px;
                line-height: 20px;
              ">
                Secure account verification
              </div>

            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td
              class="content"
              style="
                padding: 42px 44px;
                background-color: #ffffff;
              "
            >

              <h1
                class="heading"
                style="
                  margin: 0 0 20px 0;
                  color: #111827;
                  font-size: 28px;
                  line-height: 36px;
                  font-weight: 700;
                  letter-spacing: -0.5px;
                "
              >
                Verify your account
              </h1>

              <p
                class="body-text"
                style="
                  margin: 0 0 18px 0;
                  color: #374151;
                  font-size: 16px;
                  line-height: 26px;
                "
              >
                Hello <strong style="color: #111827;">${userName}</strong>,
              </p>

              <p
                class="body-text"
                style="
                  margin: 0 0 18px 0;
                  color: #4b5563;
                  font-size: 15px;
                  line-height: 25px;
                "
              >
                Thank you for joining
                <strong style="color: #111827;">${siteName}</strong>.
                Please verify your email address to complete your account setup.
              </p>

              <!-- CTA -->
              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="margin: 28px 0;"
              >
                <tr>
                  <td
                    class="button-wrapper"
                    align="center"
                    style="padding: 4px 0;"
                  >

                    <a
                      href="${safeVerifyLink}"
                      class="button"
                      target="_blank"
                      style="
                        display: inline-block;
                        padding: 15px 32px;
                        background-color: #111827;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 7px;
                        font-size: 15px;
                        line-height: 20px;
                        font-weight: 700;
                        text-align: center;
                      "
                    >
                      Verify Account
                    </a>

                  </td>
                </tr>
              </table>

              <!-- Fallback Link -->
              <p
                class="body-text"
                style="
                  margin: 0 0 10px 0;
                  color: #6b7280;
                  font-size: 13px;
                  line-height: 20px;
                "
              >
                If the button above doesn't work, copy and paste the following
                link into your browser:
              </p>

              <div
                class="link-box"
                style="
                  padding: 15px;
                  background-color: #f9fafb;
                  border: 1px solid #e5e7eb;
                  border-radius: 7px;
                "
              >
                <a
                  href="${safeVerifyLink}"
                  target="_blank"
                  class="verification-link"
                  style="
                    color: #374151;
                    font-size: 13px;
                    line-height: 20px;
                    text-decoration: underline;
                    word-break: break-all;
                    overflow-wrap: anywhere;
                  "
                >
                  ${safeVerifyLink}
                </a>
              </div>

              <!-- Security Notice -->
              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="margin-top: 28px;"
              >
                <tr>
                  <td
                    style="
                      padding: 15px 16px;
                      background-color: #f9fafb;
                      border-left: 3px solid #d1d5db;
                    "
                  >
                    <p style="
                      margin: 0;
                      color: #6b7280;
                      font-size: 13px;
                      line-height: 20px;
                    ">
                      If you didn't create an account with
                      <strong style="color: #374151;">${siteName}</strong>,
                      you can safely ignore this email.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td
              class="footer"
              align="center"
              style="
                padding: 20px 30px;
                background-color: #f9fafb;
                border-top: 1px solid #e5e7eb;
              "
            >

              <p style="
                margin: 0;
                color: #9ca3af;
                font-size: 12px;
                line-height: 18px;
              ">
                &copy; ${currentYear} ${siteName}. All rights reserved.
              </p>

            </td>
          </tr>

        </table>

        <!-- Bottom Spacing -->
        <div style="height: 20px; line-height: 20px;">&nbsp;</div>

      </td>
    </tr>
  </table>

</body>
</html>
  `;
};
