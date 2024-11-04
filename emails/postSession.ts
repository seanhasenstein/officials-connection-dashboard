import { FilmedGame } from '../types';

interface PostSession {
  registrationId: string;
  sessionId: string;
  firstName: string;
  year: string;
  camp: 'Kaukauna' | 'Plymouth' | 'UW-Stevens Point';
  filmedGames: FilmedGame[];
}

function generateHtmlEmail({
  registrationId,
  sessionId,
  firstName,
  year,
  camp,
  filmedGames,
}: PostSession) {
  return `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <title>2024 WBYOC Game Film</title>
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

                  <tr>
                    <td style="padding: 24px 0 6px">
                      <p
                        style="
                          margin: 0 0 24px;
                          font-size: 15px;
                          color: #1f2937;
                          line-height: 1.5;
                        "
                      >
                        Hi ${firstName},
                      </p>
                      <p
                        style="
                          margin: 0 0 24px;
                          font-size: 15px;
                          color: #1f2937;
                          line-height: 1.5;
                        "
                      >
                      Thanks for taking the time out of your busy schedule to attend the ${year} WBYOC ${camp} camp. The comments I've received have been extremely positive on the training and instruction that our staff provided. I hope this was true for you as well.
                      </p>
                      ${
                        filmedGames.length > 0
                          ? `<p
                        style="
                          margin: 0;
                          font-size: 15px;
                          color: #1f2937;
                          line-height: 1.5;
                        "
                      >
                        Here ${filmedGames.length > 1 ? 'are' : 'is'} the link${
                              filmedGames.length > 1 ? 's' : ''
                            } to your filmed game${
                              filmedGames.length > 1 ? 's' : ''
                            }.
                      </p>`
                          : ''
                      }
                    </td>
                  </tr>

                  ${
                    filmedGames.length > 0
                      ? `<tr>
                    <td style="padding: 0 0 24px">
                      ${filmedGames
                        .map(
                          fg =>
                            `<p
                        style="
                          margin: 0;
                          font-size: 15px;
                          color: #1f2937;
                          line-height: 2.5;
                        "
                      >
                        <a href=${fg.url} target="_blank" rel="noopener" style="text-decoration: underline; color: #2563eb">
                          ${fg.name}
                        </a>
                      </p>`
                        )
                        .join('')}
                    </td>
                  </tr>`
                      : ''
                  }

                  <tr>
                    <td style="padding: 0">
                      <p
                        style="
                          margin: 0 0 24px;
                          font-size: 15px;
                          color: #1f2937;
                          line-height: 1.5;
                        "
                      >
                      The networking and camaraderie of WBYOC officials during camp and after is really great to see. Here is a <a href="https://officialsconnection.org/session-contact-info?c=${camp.toLowerCase()}&s=${sessionId}" target="_blank" rel="noopener" style="text-decoration: underline; color: #2563eb">link to contact info</a> for everyone that attended your session. The clinicians contact info is also included. If you have a rule or interpretation, a play situation, court coverage, mechanic question etc. please don't hesitate to contact one of them or myself. We are willing to help not only at camp, but after camp and future years down the road.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 0 0 28px">
                      <p
                        style="
                          margin: 0;
                          font-size: 15px;
                          color: #1f2937;
                          line-height: 1.5;
                        "
                      >
                      Finally, we would appreciate if you could also take a few minutes to complete <a href="https://officialsconnection.org/questionnaire?camp=${camp.toLowerCase()}&rid=${registrationId}&sid=${sessionId}" style="color: #1d4ed8; text-decoration: underline;">this post camp questionnaire</a>. Your feedback helps us to make improvements to continue to be one of the top officials camps around.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 0 0 28px">
                      <p
                        style="
                          margin: 0;
                          font-size: 15px;
                          color: #1f2937;
                          line-height: 1.5;
                        "
                      >
                        Have a great rest of your summer.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 0 0 28px">
                      <p
                        style="
                          margin: 0;
                          font-size: 15px;
                          color: #1f2937;
                          line-height: 1.5;
                        "
                      >
                        Sincerely,
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 0 0 1px">
                      <p
                        style="
                          margin: 0;
                          font-size: 16px;
                          font-weight: 600;
                          color: #111827;
                          line-height: 1.5;
                        "
                      >
                        Tom Rusch
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
                        &copy; 2024 Officials Connection.
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
</html>
  `;
}

function generateTextEmail({
  registrationId,
  sessionId,
  firstName,
  year,
  camp,
  filmedGames,
}: PostSession) {
  return `
  Hi ${firstName},\nThanks for taking the time out of your busy schedule to attend the ${year} WBYOC ${camp} camp. The comments I've received have been extremely positive on the training and instruction that the staff provided. I hope this was true for you as well.\n\nHere ${
    filmedGames.length > 1 ? 'are' : 'is'
  } the link${filmedGames.length > 1 ? 's' : ''} to your filmed game${
    filmedGames.length > 1 ? 's' : ''
  } at the ${year} ${camp} Wisconsin Basketball Yearbook Officials Camp.\n\n${filmedGames
    .map(fg => `${fg.url}\n\n`)
    .join(
      ''
    )}\n\nWe'd appreciate if you could take a few minutes to complete <a href="https://officialsconnection.org/questionnaire?camp=${
    camp === 'UW-Stevens Point' ? 'stevensPoint' : camp.toLowerCase()
  }&rid=${registrationId}&sid=${sessionId}" style="color: #1d4ed8; text-decoration: underline;">this post camp questionnaire</a>. Your feedback helps us to continue to be one of the top officials camps around.\n\nHave a great rest of your summer.\n\nTom Rusch\nWBYOC Director\n
  `;
}

export default function generateEmail(params: PostSession) {
  const html = generateHtmlEmail(params);
  const text = generateTextEmail(params);
  return { html, text };
}
