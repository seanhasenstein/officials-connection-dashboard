import { CAMP_DIRECTOR } from '../constants/contact';

const { name, email, phone } = CAMP_DIRECTOR;

function generateTextEmail(
  body: string[],
  includeMoreInfoLinks: boolean,
  signOff: string | undefined
) {
  return `${body.map(p => p).join('\n\n')}${
    includeMoreInfoLinks
      ? `\n\nFor more information and online registration please visit our website at https://officialsconnection.org.`
      : ''
  }${signOff ? `\n\n${signOff}` : ''}\n\n${name.first} ${
    name.last
  }\nWBYOC Director\nCoordinator of Basketball Officials\nLakeshore Officials Association\n${
    phone.formatted
  }\n${email}
 `;
}

function generateHtmlEmail(
  body: string[],
  includeMoreInfoLinks: boolean,
  signOff: string | undefined
) {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <title>WBYOC Email</title>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <style type="text/css">
        /* CLIENT_SPECIFIC STYLES */
        body,
        table,
        td,
        a {
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        table,
        td {
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
        }
        img {
          -ms-interpolation-mode: bicubic;
        }
  
        /* RESET STYLES */
        img {
          border: 0;
          height: auto;
          line-height: 100%;
          outline: none;
          text-decoration: none;
        }
        table {
          border-collapse: collapse !important;
        }
        body {
          height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
        }
  
        /* iOS BLUE LINKS */
        a[x-apple-data-detectors] {
          color: inherit !important;
          text-decoration: none !important;
          font-size: inherit !important;
          font-family: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
        }
  
        /* GMAIL BLUE LINKS */
        u + #body a {
          color: inherit;
          text-decoration: none;
          font-size: inherit;
          font-family: inherit;
          font-weight: inherit;
          line-height: inherit;
        }
  
        /* SAMSUNG MAIL BLUE LINKS */
        #MessageViewBody a {
          color: inherit;
          text-decoration: none;
          font-size: inherit;
          font-family: inherit;
          font-weight: inherit;
          line-height: inherit;
        }
  
        /* Universal styles for links and stuff */
  
        /* Responsive styles */
        @media screen and (max-width: 600px) {
          .mobile {
            padding: 0 !important;
            width: 100% !important;
          }
  
          .mobile-padding {
            padding: 24px !important;
          }
        }
      </style>
    </head>
    <body
      id="body"
      style="
        margin: 0 !important;
        padding: 0 !important;
        background-color: #f3f4f6;
      "
    >
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        role="presentation"
        width="100%"
      >
        <tr>
          <td align="center" style="padding: 24px 0 0" class="mobile">
            <table
              class="mobile"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              width="600"
              bgcolor="#ffffff"
              style="
                background-color: #ffffff;
                color: #1f2937;
                margin: 0;
                padding: 0;
                border-radius: 4px;
              "
            >
              <tr>
                <td style="padding: 48px 64px" class="mobile-padding">
                  <table
                    class="mobile"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    width="100%"
                  >
                    <tr>
                      <td
                        style="
                          padding: 0 0 16px;
                          border-bottom: 1px solid rgba(156, 163, 175, 0.3);
                        "
                      >
                        <img
                          src="https://res.cloudinary.com/dra3wumrv/image/upload/v1645723704/officials-connection/email-logo.png"
                          alt="Officials Connection - WI Basketball Yearbook Officials Camps"
                          width="220"
                        />
                      </td>
                    </tr>

                    ${body
                      .map((p, i) => {
                        if (i === 0) {
                          return `<tr>
                            <td style="padding: 28px 0 14px 0">
                              <p
                                style="
                                  margin: 0;
                                  font-size: 15px;
                                  color: #1f2937;
                                  line-height: 1.5;
                                "
                              >
                                ${p}
                              </p>
                            </td>
                          </tr>`;
                        } else if (
                          i === body.length - 1 &&
                          !includeMoreInfoLinks
                        ) {
                          return `<tr>
                        <td style="padding: 14px 0${signOff ? '' : ' 26px'}">
                          <p
                            style="
                              margin: 0;
                              font-size: 15px;
                              color: #1f2937;
                              line-height: 1.5;
                            "
                          >${p}</p>
                        </td>
                      </tr>`;
                        } else {
                          return `<tr>
                            <td style="padding: 14px 0">
                              <p
                                style="
                                  margin: 0;
                                  font-size: 15px;
                                  color: #1f2937;
                                  line-height: 1.5;
                                "
                              >${p}</p>
                            </td>
                          </tr>`;
                        }
                      })
                      .join('')}

                      ${
                        includeMoreInfoLinks
                          ? `<tr>
                      <td style="padding: 14px 0${signOff ? '' : ' 26px'}">
                        <p
                          style="
                            margin: 0;
                            font-size: 15px;
                            color: #1f2937;
                            line-height: 1.5;
                          "
                        >
                          For more information and online registration visit our website at <a href="https://officialsconnection.org" style="text-decoration: underline; color: #2563eb">officialsconnection.org</a>.
                        </p>
                      </td>
                    </tr>`
                          : ''
                      }

                      ${
                        signOff
                          ? `<tr>
                      <td style="padding: 14px 0 26px">
                        <p
                          style="
                            margin: 0;
                            font-size: 15px;
                            color: #1f2937;
                            line-height: 1.5;
                          "
                        >${signOff}</p>
                      </td>
                    </tr>`
                          : ''
                      }
  
                    <tr>
                      <td style="padding: 0 0 1px">
                        <p
                          style="
                            margin: 0;
                            font-size: 16px;
                            font-weight: 600;
                            color: #000;
                            line-height: 1.5;
                          "
                        >
                          ${name.first} ${name.last}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 0 0 1px">
                        <p
                          style="
                            margin: 0;
                            font-size: 15px;
                            color: #6b7280;
                            line-height: 1.5;
                          "
                        >
                          WBYOC Director
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 0 0 1px">
                        <p
                          style="
                            margin: 0;
                            font-size: 15px;
                            color: #6b7280;
                            line-height: 1.5;
                          "
                        >
                          Coordinator of Basketball Officials
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 0 0 1px">
                        <p
                          style="
                            margin: 0;
                            font-size: 15px;
                            color: #6b7280;
                            line-height: 1.5;
                          "
                        >
                          Lakeshore Officials Association
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 0 0 1px">
                        <p
                          style="
                            margin: 0;
                            font-size: 15px;
                            color: #6b7280;
                            line-height: 1.5;
                          "
                        >
                          <a
                            href="tel:+1${phone.raw}"
                            style="text-decoration: underline; color: #2563eb"
                            >${phone.formatted}</a
                          >
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 0">
                        <p
                          style="
                            margin: 0;
                            font-size: 15px;
                            color: #6b7280;
                            line-height: 1.5;
                          "
                        >
                          <a
                            href="mailto:${email}"
                            style="text-decoration: underline; color: #2563eb"
                            >${email}</a
                          >
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 0" class="mobile">
            <table
              class="mobile"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              width="600"
              style="color: #1f2937; margin: 0; padding: 0"
            >
              <tr>
                <td
                  style="padding: 32px 0; text-align: center; font-size: 14px"
                  class="mobile-padding"
                >
                  <table
                    class="mobile"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    width="100%"
                  >
                    <tr>
                      <td style="padding: 0 0 2px">
                        <p
                          style="
                            margin: 0;
                            font-size: 14px;
                            color: #6b7280;
                            line-height: 1.5;
                          "
                        >
                          <a
                            href="https://officialsconnection.org"
                            style="text-decoration: none; color: #6b7280"
                            >www.officialsconnection.org</a
                          >
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 0 0 2px">
                        <p
                          style="
                            margin: 0;
                            font-size: 14px;
                            color: #6b7280;
                            line-height: 1.5;
                          "
                        >
                          1026 Wilson St, Plymouth, WI
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 0 0 2px">
                        <p
                          style="
                            margin: 0;
                            font-size: 14px;
                            color: #6b7280;
                            line-height: 1.5;
                          "
                        >
                          &copy; ${new Date().getFullYear()} Officials Connection.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 0">
                        <p
                          style="
                            margin: 0;
                            font-size: 14px;
                            color: #6b7280;
                            line-height: 1.5;
                          "
                        >
                          <a
                            href="%unsubscribe_url%"
                            style="text-decoration: none; color: #2563eb"
                            >Unsubscribe from our emails</a
                          >
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
}

export default function generateEmail(
  body: string[],
  includeMoreInfoLinks: boolean,
  signOff: string | undefined
) {
  const text = generateTextEmail(body, includeMoreInfoLinks, signOff);
  const html = generateHtmlEmail(body, includeMoreInfoLinks, signOff);
  return { html, text };
}
