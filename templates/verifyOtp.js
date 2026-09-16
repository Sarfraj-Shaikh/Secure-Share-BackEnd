const capitalizeName = (name = "") => {
  return name.trim().toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

const escapeHtml = (value = "") => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export const verifyOTPEmail = (name, otp) => {

  const siteName = escapeHtml(process.env.SITE_NAME);
  const userName = escapeHtml(capitalizeName(name));
  const safeOTP = escapeHtml(otp);
  const currentYear = new Date().getFullYear();

  return `
    <!DOCTYPE html >
    <html lang="en">

      <head>
        <meta charset="UTF-8">

          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          >

            <meta
              name="color-scheme"
              content="light"
            >

              <meta
                name="supported-color-schemes"
                content="light"
              >

                <title>${siteName} | Verification Code</title>

                <style>
                  @media only screen and (max-width: 600px) {

      .email - wrapper {
                    padding: 20px 10px !important;
      }

                  .email-card {
                    width: 100% !important;
                  border-radius: 10px !important;
      }

                  .header {
                    padding: 28px 20px !important;
      }

                  .content {
                    padding: 34px 22px !important;
      }

                  .heading {
                    font - size: 24px !important;
                  line-height: 32px !important;
      }

                  .body-text {
                    font - size: 15px !important;
                  line-height: 24px !important;
      }

                  .otp-box {
                    padding: 20px 12px !important;
      }

                  .otp {
                    font - size: 30px !important;
                  letter-spacing: 7px !important;
      }

                  .security-box {
                    padding: 14px !important;
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

                            <div
                              style="
                  margin-top: 7px;
                  color: #d1d5db;
                  font-size: 13px;
                  line-height: 20px;
                "
                            >
                              Email verification
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
                              Your verification code
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
                              Hello
                              <strong style="color: #111827;">
                                ${userName}
                              </strong>,
                            </p>

                            <p
                              class="body-text"
                              style="
                  margin: 0 0 26px 0;
                  color: #4b5563;
                  font-size: 15px;
                  line-height: 25px;
                "
                            >
                              Use the verification code below to continue with your
                              <strong style="color: #111827;">
                                ${siteName}
                              </strong>
                              account.
                            </p>

                            <!-- OTP -->
                            <table
                              role="presentation"
                              width="100%"
                              cellpadding="0"
                              cellspacing="0"
                              border="0"
                              style="
                  margin: 0 0 24px 0;
                "
                            >

                              <tr>

                                <td
                                  class="otp-box"
                                  align="center"
                                  style="
                      padding: 24px 16px;
                      background-color: #f9fafb;
                      border: 1px solid #e5e7eb;
                      border-radius: 10px;
                    "
                                >

                                  <div
                                    style="
                        margin-bottom: 10px;
                        color: #6b7280;
                        font-size: 12px;
                        line-height: 18px;
                        font-weight: 600;
                        letter-spacing: 0.8px;
                        text-transform: uppercase;
                      "
                                  >
                                    Verification Code
                                  </div>

                                  <div
                                    class="otp"
                                    style="
                        color: #111827;
                        font-size: 34px;
                        line-height: 42px;
                        font-weight: 700;
                        letter-spacing: 9px;
                        font-family: Arial, Helvetica, sans-serif;
                      "
                                  >
                                    ${safeOTP}
                                  </div>

                                </td>

                              </tr>

                            </table>

                            <!-- Expiry -->
                            <p
                              align="center"
                              style="
                  margin: 0 0 28px 0;
                  color: #6b7280;
                  font-size: 13px;
                  line-height: 20px;
                "
                            >
                              This code is valid for
                              <strong style="color: #374151;">
                                5 minutes
                              </strong>.
                            </p>

                            <!-- Security Notice -->
                            <table
                              role="presentation"
                              width="100%"
                              cellpadding="0"
                              cellspacing="0"
                              border="0"
                              style="
                  margin-top: 4px;
                "
                            >

                              <tr>

                                <td
                                  class="security-box"
                                  style="
                      padding: 15px 16px;
                      background-color: #f9fafb;
                      border-left: 3px solid #d1d5db;
                    "
                                >

                                  <p
                                    style="
                        margin: 0;
                        color: #6b7280;
                        font-size: 13px;
                        line-height: 20px;
                      "
                                  >
                                    For your security, never share this verification
                                    code with anyone. ${siteName} will never ask you
                                    for this code by phone, email, or message.
                                  </p>

                                </td>

                              </tr>

                            </table>

                            <!-- Didn't Request -->
                            <p
                              class="body-text"
                              style="
                  margin: 24px 0 0 0;
                  color: #9ca3af;
                  font-size: 13px;
                  line-height: 20px;
                "
                            >
                              If you didn't request this verification code, you can
                              safely ignore this email.
                            </p>

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

                            <p
                              style="
                  margin: 0;
                  color: #9ca3af;
                  font-size: 12px;
                  line-height: 18px;
                "
                            >
                              &copy; ${currentYear} ${siteName}. All rights reserved.
                            </p>

                          </td>

                        </tr>

                      </table>

                      <div
                        style="
            height: 20px;
            line-height: 20px;
          "
                      >
                        &nbsp;
                      </div>

                    </td>

                  </tr>

                </table>

              </body>

            </html>
            `;
};
