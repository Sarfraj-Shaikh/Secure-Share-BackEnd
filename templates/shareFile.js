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

export const fileSharingEmail = ({
    name, fileName, fileSize, fileExtension, mimeType, passwordProtected, expiryDate, downloadUrl,
}) => {

    const siteName = escapeHtml(process.env.SITE_NAME);
    const userName = escapeHtml(capitalizeName(name));

    const safeFileName = escapeHtml(fileName);
    const safeFileSize = escapeHtml(fileSize);
    const safeFileExtension = escapeHtml(fileExtension);
    const safeMimeType = escapeHtml(mimeType);
    const safeExpiryDate = escapeHtml(expiryDate);

    const safeDownloadUrl = String(downloadUrl || "")
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    const passwordStatus = passwordProtected ? "Yes" : "No";
    const currentYear = new Date().getFullYear();

    return `
    <!DOCTYPE html>
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

        <title>${siteName} | File Shared With You</title>

        <style>
          @media only screen and (max-width: 600px) {

            .email-wrapper {
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
              font-size: 24px !important;
              line-height: 32px !important;
            }

            .body-text {
              font-size: 15px !important;
              line-height: 24px !important;
            }

            .file-box {
              padding: 18px 14px !important;
            }

            .file-name {
              font-size: 16px !important;
            }

            .download-button {
              padding: 14px 24px !important;
              font-size: 14px !important;
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
                      Secure file sharing
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
                      You have received a file
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
                      A file has been shared with you through
                      <strong style="color: #111827;">
                        ${siteName}
                      </strong>.
                      You can download it using the button below.
                    </p>

                    <!-- File Details -->
                    <table
                      role="presentation"
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      class="file-box"
                      style="
                        margin: 0 0 28px 0;
                        background-color: #f9fafb;
                        border: 1px solid #e5e7eb;
                        border-radius: 10px;
                      "
                    >

                      <tr>

                        <td
                          style="
                            padding: 20px;
                          "
                        >

                          <div
                            style="
                              margin-bottom: 16px;
                              color: #111827;
                              font-size: 13px;
                              line-height: 18px;
                              font-weight: 700;
                              text-transform: uppercase;
                              letter-spacing: 0.6px;
                            "
                          >
                            File Details
                          </div>

                          <!-- File Name -->
                          <table
                            role="presentation"
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            style="margin-bottom: 10px;"
                          >
                            <tr>
                              <td
                                style="
                                  color: #6b7280;
                                  font-size: 13px;
                                  line-height: 20px;
                                  width: 42%;
                                "
                              >
                                Name
                              </td>

                              <td
                                class="file-name"
                                style="
                                  color: #111827;
                                  font-size: 14px;
                                  line-height: 20px;
                                  font-weight: 600;
                                  word-break: break-word;
                                "
                              >
                                ${safeFileName}
                              </td>
                            </tr>
                          </table>

                          <!-- File Size -->
                          <table
                            role="presentation"
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            style="margin-bottom: 10px;"
                          >
                            <tr>
                              <td
                                style="
                                  color: #6b7280;
                                  font-size: 13px;
                                  line-height: 20px;
                                  width: 42%;
                                "
                              >
                                Size
                              </td>

                              <td
                                style="
                                  color: #374151;
                                  font-size: 14px;
                                  line-height: 20px;
                                "
                              >
                                ${safeFileSize}
                              </td>
                            </tr>
                          </table>

                          <!-- Extension -->
                          <table
                            role="presentation"
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            style="margin-bottom: 10px;"
                          >
                            <tr>
                              <td
                                style="
                                  color: #6b7280;
                                  font-size: 13px;
                                  line-height: 20px;
                                  width: 42%;
                                "
                              >
                                Extension
                              </td>

                              <td
                                style="
                                  color: #374151;
                                  font-size: 14px;
                                  line-height: 20px;
                                "
                              >
                                ${safeFileExtension}
                              </td>
                            </tr>
                          </table>

                          <!-- MIME Type -->
                          <table
                            role="presentation"
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            style="margin-bottom: 10px;"
                          >
                            <tr>
                              <td
                                style="
                                  color: #6b7280;
                                  font-size: 13px;
                                  line-height: 20px;
                                  width: 42%;
                                "
                              >
                                Type
                              </td>

                              <td
                                style="
                                  color: #374151;
                                  font-size: 14px;
                                  line-height: 20px;
                                  word-break: break-word;
                                "
                              >
                                ${safeMimeType}
                              </td>
                            </tr>
                          </table>

                          <!-- Password Protected -->
                          <table
                            role="presentation"
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            style="margin-bottom: 10px;"
                          >
                            <tr>
                              <td
                                style="
                                  color: #6b7280;
                                  font-size: 13px;
                                  line-height: 20px;
                                  width: 42%;
                                "
                              >
                                Password Protected
                              </td>

                              <td
                                style="
                                  color: #374151;
                                  font-size: 14px;
                                  line-height: 20px;
                                "
                              >
                                ${passwordStatus}
                              </td>
                            </tr>
                          </table>

                          <!-- Expiry Date -->
                          <table
                            role="presentation"
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                          >
                            <tr>
                              <td
                                style="
                                  color: #6b7280;
                                  font-size: 13px;
                                  line-height: 20px;
                                  width: 42%;
                                "
                              >
                                Expiry Date
                              </td>

                              <td
                                style="
                                  color: #374151;
                                  font-size: 14px;
                                  line-height: 20px;
                                  font-weight: 600;
                                "
                              >
                                ${safeExpiryDate}
                              </td>
                            </tr>
                          </table>

                        </td>

                      </tr>

                    </table>

                    <!-- Download Button -->
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

                        <td align="center">

                          <a
                            href="${safeDownloadUrl}"
                            class="download-button"
                            style="
                              display: inline-block;
                              padding: 14px 30px;
                              background-color: #111827;
                              color: #ffffff;
                              text-decoration: none;
                              font-size: 15px;
                              line-height: 20px;
                              font-weight: 600;
                              border-radius: 7px;
                            "
                          >
                            Download File
                          </a>

                        </td>

                      </tr>

                    </table>

                    <!-- Expiry Notice -->
                    <p
                      align="center"
                      style="
                        margin: 0 0 28px 0;
                        color: #6b7280;
                        font-size: 13px;
                        line-height: 20px;
                      "
                    >
                      This link may expire based on the file's
                      configured expiry date.
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
                            For your security, only download files from
                            ${siteName} that you recognize. If you were not
                            expecting this file, you can safely ignore this email.
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