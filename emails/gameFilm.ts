import { FilmedGame } from '../types';

type GameFilmEmailParams = {
  firstName: string;
  year: string;
  camp: 'Kaukauna' | 'Plymouth';
  filmedGames: FilmedGame[];
};

function generateHtml({
  firstName,
  year,
  camp,
  filmedGames,
}: GameFilmEmailParams) {
  return `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <title>2023 WBYOC Game Film</title>
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
                    <td style="padding: 24px 0 28px 0">
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
                        We've had a few officials reach out saying they haven't received their game film emails so we are sending them all out again. Apologies if this is the first time you're seeing this (it might have gone to your spam folder the first time).
                      </p>
                      <p
                        style="
                          margin: 0;
                          font-size: 15px;
                          color: #1f2937;
                          line-height: 1.5;
                        "
                      >
                        Here ${filmedGames.length > 1 ? 'are' : 'is'} the link${
    filmedGames.length > 1 ? 's' : ''
  } to your filmed game${filmedGames.length > 1 ? 's' : ''} at the ${year}
                        ${camp} Wisconsin Basketball Yearbook Officials Camp.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 0 0 32px">
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
                        Thanks again for attending. We hope to see you next
                        year.
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
                        &copy; 2023 Officials Connection.
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

function generateText({
  firstName,
  year,
  camp,
  filmedGames,
}: GameFilmEmailParams) {
  return `
  Hi ${firstName},\nHere ${filmedGames.length > 1 ? 'are' : 'is'} the link${
    filmedGames.length > 1 ? 's' : ''
  } to your filmed game${
    filmedGames.length > 1 ? 's' : ''
  } at the ${year} ${camp} Wisconsin Basketball Yearbook Officials Camp.\n\n${filmedGames
    .map(fg => `${fg.url}\n\n`)
    .join(
      ''
    )}\nThanks again for attending. We hope to see you next year.\n\nTom Rusch\nWBYOC Director\n
  `;
}

export default function generateEmail(params: GameFilmEmailParams) {
  const html = generateHtml(params);
  const text = generateText(params);
  return { html, text };
}
