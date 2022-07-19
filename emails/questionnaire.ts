type QuestionnaireEmailParams = {
  _id: string;
  firstName: string;
  camp: string;
  nextYearsDates: string;
};

// function generateHtml({
//   _id,
//   firstName,
//   camp,
//   nextYearsDates,
// }: QuestionnaireEmailParams) {
//   return `
//   <!DOCTYPE html>
//   <html lang="en">
//     <head>
//       <title>2022 WBYOC Camp Wrap Up</title>
//       <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
//       <meta name="viewport" content="width=device-width, initial-scale=1" />
//       <meta http-equiv="X-UA-Compatible" content="IE=edge" />
//       <style type="text/css">
//         /* CLIENT_SPECIFIC STYLES */
//         body,
//         table,
//         td,
//         a {
//           -webkit-text-size-adjust: 100%;
//           -ms-text-size-adjust: 100%;
//         }
//         table,
//         td {
//           mso-table-lspace: 0pt;
//           mso-table-rspace: 0pt;
//         }
//         img {
//           -ms-interpolation-mode: bicubic;
//         }

//         /* RESET STYLES */
//         img {
//           border: 0;
//           height: auto;
//           line-height: 100%;
//           outline: none;
//           text-decoration: none;
//         }
//         table {
//           border-collapse: collapse !important;
//         }
//         body {
//           height: 100% !important;
//           margin: 0 !important;
//           padding: 0 !important;
//           width: 100% !important;
//         }

//         /* iOS BLUE LINKS */
//         a[x-apple-data-detectors] {
//           color: inherit !important;
//           text-decoration: none !important;
//           font-size: inherit !important;
//           font-family: inherit !important;
//           font-weight: inherit !important;
//           line-height: inherit !important;
//         }

//         /* GMAIL BLUE LINKS */
//         u + #body a {
//           color: inherit;
//           text-decoration: none;
//           font-size: inherit;
//           font-family: inherit;
//           font-weight: inherit;
//           line-height: inherit;
//         }

//         /* SAMSUNG MAIL BLUE LINKS */
//         #MessageViewBody a {
//           color: inherit;
//           text-decoration: none;
//           font-size: inherit;
//           font-family: inherit;
//           font-weight: inherit;
//           line-height: inherit;
//         }

//         /* Universal styles for links and stuff */

//         /* Responsive styles */
//         @media screen and (max-width: 600px) {
//           .mobile {
//             padding: 0 !important;
//             width: 100% !important;
//           }

//           .mobile-padding {
//             padding: 24px !important;
//           }
//         }
//       </style>
//     </head>
//     <body
//       id="body"
//       style="
//         margin: 0 !important;
//         padding: 0 !important;
//         background-color: #f3f4f6;
//       "
//     >
//       <table
//         border="0"
//         cellpadding="0"
//         cellspacing="0"
//         role="presentation"
//         width="100%"
//       >
//         <tr>
//           <td align="center" style="padding: 24px 0 0" class="mobile">
//             <table
//               class="mobile"
//               border="0"
//               cellpadding="0"
//               cellspacing="0"
//               role="presentation"
//               width="600"
//               bgcolor="#ffffff"
//               style="
//                 background-color: #ffffff;
//                 color: #1f2937;
//                 margin: 0;
//                 padding: 0;
//                 border-radius: 4px;
//               "
//             >
//               <tr>
//                 <td style="padding: 48px 64px" class="mobile-padding">
//                   <table
//                     class="mobile"
//                     border="0"
//                     cellpadding="0"
//                     cellspacing="0"
//                     role="presentation"
//                     width="100%"
//                   >
//                     <tr>
//                       <td
//                         style="
//                           padding: 0 0 16px;
//                           border-bottom: 1px solid rgba(156, 163, 175, 0.3);
//                         "
//                       >
//                         <img
//                           src="https://res.cloudinary.com/dra3wumrv/image/upload/v1645723704/officials-connection/email-logo.png"
//                           alt="Officials Connection - WI Basketball Yearbook Officials Camps"
//                           width="220"
//                         />
//                       </td>
//                     </tr>

//                     <tr>
//                       <td style="padding: 24px 0 0 0">
//                         <p
//                           style="
//                             margin: 0 0 8px;
//                             font-size: 15px;
//                             color: #1f2937;
//                             line-height: 1.5;
//                           "
//                         >
//                           Hi ${firstName},
//                         </p>
//                         <p
//                           style="
//                             margin: 0;
//                             font-size: 15px;
//                             color: #1f2937;
//                             line-height: 1.5;
//                           "
//                         >
//                         Thanks again for taking the time out of your busy schedule to attend the ${camp} officials camp. The comments I've received have been extremely positive on the training and instruction that the WBYOC staff provided. I hope this was true for you as well. I'd appreciate it if you could take a few minutes to complete <a href="https://officialsconnection.org/post-camp-questionnaire?camp=${camp.toLowerCase()}&rid=${_id}" style="color: #1d4ed8; text-decoration: underline;">this questionnaire</a>. Your feedback helps us to remain one of the top officials camps around.
//                         </p>
//                       </td>
//                     </tr>

//                     <tr>
//                       <td style="padding: 24px 0 0 0">
//                         <p
//                           style="
//                             margin: 0;
//                             font-size: 15px;
//                             color: #1f2937;
//                             line-height: 1.5;
//                           "
//                         >
//                         Included with this message is a listing of the officials from your camp session. Providing this was a request a few years back from the questionnaire. The networking and camaraderie of WBYOC officials during camp and after is really great to see. The clinicians contact info is also included. If you have a rule or interpretation, a play situation, court coverage, mechanic question etc. please don't hesitate to contact one of them or myself. We are willing to help not only at camp, but after camp and future years down the road.
//                         </p>
//                       </td>
//                     </tr>

//                     <tr>
//                       <td style="padding: 24px 0 0 0">
//                         <p
//                           style="
//                             margin: 0;
//                             font-size: 15px;
//                             color: #1f2937;
//                             line-height: 1.5;
//                           "
//                         >
//                         Finally, the tentative dates for next year's ${camp} camp are ${nextYearsDates}. Information and registration should be available at <a href="https://officialsconnection.org" style="color: #1d4ed8; text-decoration: underline;">www.officialsconnection.org</a> in December.
//                         </p>
//                       </td>
//                     </tr>

//                     <tr>
//                       <td style="padding: 24px 0 0 0">
//                         <p
//                           style="
//                             margin: 0;
//                             font-size: 15px;
//                             color: #1f2937;
//                             line-height: 1.5;
//                           "
//                         >
//                         Any further questions or comments please don't hesitate to reach out. Have a great rest of your summer and a great upcoming basketball season.
//                         </p>
//                       </td>
//                     </tr>

//                     <tr>
//                       <td style="padding: 24px 0 28px 0">
//                         <p
//                           style="
//                             margin: 0;
//                             font-size: 15px;
//                             color: #1f2937;
//                             line-height: 1.5;
//                           "
//                         >
//                           Sincerely,
//                         </p>
//                       </td>
//                     </tr>

//                     <tr>
//                       <td style="padding: 0 0 1px">
//                         <p
//                           style="
//                             margin: 0;
//                             font-size: 16px;
//                             font-weight: 600;
//                             color: #111827;
//                             line-height: 1.5;
//                           "
//                         >
//                           Tom Rusch
//                         </p>
//                       </td>
//                     </tr>
//                     <tr>
//                       <td style="padding: 0 0 1px">
//                         <p
//                           style="
//                             margin: 0;
//                             font-size: 15px;
//                             color: #6b7280;
//                             line-height: 1.5;
//                           "
//                         >
//                           WBYOC Director
//                         </p>
//                       </td>
//                     </tr>
//                     <tr>
//                       <td style="padding: 0 0 1px">
//                         <p
//                           style="
//                             margin: 0;
//                             font-size: 15px;
//                             color: #6b7280;
//                             line-height: 1.5;
//                           "
//                         >
//                           rusch@lutheranhigh.com
//                         </p>
//                       </td>
//                     </tr>
//                     <tr>
//                       <td style="padding: 0 0 1px">
//                         <p
//                           style="
//                             margin: 0;
//                             font-size: 15px;
//                             color: #6b7280;
//                             line-height: 1.5;
//                           "
//                         >
//                           (920) 698-2400
//                         </p>
//                       </td>
//                     </tr>
//                   </table>
//                 </td>
//               </tr>
//             </table>
//           </td>
//         </tr>
//         <tr>
//           <td align="center" style="padding: 0" class="mobile">
//             <table
//               class="mobile"
//               border="0"
//               cellpadding="0"
//               cellspacing="0"
//               role="presentation"
//               width="600"
//               style="color: #1f2937; margin: 0; padding: 0"
//             >
//               <tr>
//                 <td
//                   style="padding: 32px 0; text-align: center; font-size: 14px"
//                   class="mobile-padding"
//                 >
//                   <table
//                     class="mobile"
//                     border="0"
//                     cellpadding="0"
//                     cellspacing="0"
//                     role="presentation"
//                     width="100%"
//                   >
//                     <tr>
//                       <td style="padding: 0 0 2px">
//                         <p
//                           style="
//                             margin: 0;
//                             font-size: 14px;
//                             color: #6b7280;
//                             line-height: 1.5;
//                           "
//                         >
//                           <a
//                             href="https://officialsconnection.org"
//                             style="text-decoration: none; color: #6b7280"
//                             >www.officialsconnection.org</a
//                           >
//                         </p>
//                       </td>
//                     </tr>
//                     <tr>
//                       <td style="padding: 0 0 2px">
//                         <p
//                           style="
//                             margin: 0;
//                             font-size: 14px;
//                             color: #6b7280;
//                             line-height: 1.5;
//                           "
//                         >
//                           1026 Wilson St, Plymouth, WI
//                         </p>
//                       </td>
//                     </tr>
//                     <tr>
//                       <td style="padding: 0 0 2px">
//                         <p
//                           style="
//                             margin: 0;
//                             font-size: 14px;
//                             color: #6b7280;
//                             line-height: 1.5;
//                           "
//                         >
//                           &copy; ${new Date().getFullYear()} Officials Connection.
//                         </p>
//                       </td>
//                     </tr>
//                     <tr>
//                       <td style="padding: 0">
//                         <p
//                           style="
//                             margin: 0;
//                             font-size: 14px;
//                             color: #6b7280;
//                             line-height: 1.5;
//                           "
//                         >
//                           <a
//                             href="%unsubscribe_url%"
//                             style="text-decoration: none; color: #2563eb"
//                             >Unsubscribe from our emails</a
//                           >
//                         </p>
//                       </td>
//                     </tr>
//                   </table>
//                 </td>
//               </tr>
//             </table>
//           </td>
//         </tr>
//       </table>
//     </body>
//   </html>`;
// }

function generateHtml({
  firstName,
  camp,
  nextYearsDates,
}: QuestionnaireEmailParams) {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <title>2022 WBYOC Camp Wrap Up</title>
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
                      <td style="padding: 24px 0 0 0">
                        <p
                          style="
                            margin: 0 0 8px;
                            font-size: 15px;
                            color: #1f2937;
                            line-height: 1.5;
                          "
                        >
                          Hi ${firstName},
                        </p>
                        <p
                          style="
                            margin: 0;
                            font-size: 15px;
                            color: #1f2937;
                            line-height: 1.5;
                          "
                        >
                        Thanks again for taking the time out of your busy schedule to attend the ${camp} officials camp. The comments I've received have been extremely positive on the training and instruction that the WBYOC staff provided. I hope this was true for you as well.
                        </p>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 24px 0 0 0">
                        <p
                          style="
                            margin: 0;
                            font-size: 15px;
                            color: #1f2937;
                            line-height: 1.5;
                          "
                        >
                        Included with this message is a listing of the officials from your camp session. The networking and camaraderie of WBYOC officials during camp and after is really great to see. The clinicians contact info is also included. If you have a rule or interpretation, a play situation, court coverage, mechanic question etc. please don't hesitate to contact one of them or myself. We are willing to help not only at camp, but after camp and future years down the road.
                        </p>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 24px 0 0 0">
                        <p
                          style="
                            margin: 0;
                            font-size: 15px;
                            color: #1f2937;
                            line-height: 1.5;
                          "
                        >
                        Finally, the tentative dates for next year's ${camp} camp are ${nextYearsDates}. Information and registration should be available at <a href="https://officialsconnection.org" style="color: #1d4ed8; text-decoration: underline;">www.officialsconnection.org</a> in December.
                        </p>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 24px 0 0 0">
                        <p
                          style="
                            margin: 0;
                            font-size: 15px;
                            color: #1f2937;
                            line-height: 1.5;
                          "
                        >
                        Any further questions or comments please don't hesitate to reach out. Have a great rest of your summer and a great upcoming basketball season.
                        </p>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 24px 0 28px 0">
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
                          rusch@lutheranhigh.com
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
                          (920) 698-2400
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

// function generateText({ _id, firstName }: QuestionnaireEmailParams) {
//   return `
//   Hi ${firstName},\n\nThanks again for taking the time out of your busy schedule to attend the 2022 WBYOC Kaukauna officials camp, to work on your craft as a basketball official. The comments I’ve received from campers have been extremely positive on the training and instruction that the WBYOC staff provided. I hope this was true for you as well. I would appreciate it if you could take a few minutes to complete the following questionnaire.\n\nhttps://officialsconnection.org/post-camp-questionnaire?camp=kaukauna&rid=${_id}\n\nYour feedback is taken seriously to make improvements that help us continue to be one of the top officials camps in the area.\n\nIncluded with this message is a listing of the officials from your camp session. This information is provided for your use only, to stay in touch with the officials that you met. Providing this list was a request a few years back from the questionnaire. The networking and camaraderie of WBYOC officials both during camp and after is really great to see. The clinicians contact info is included as well. If you have a rule or interpretation, a play situation, court coverage, mechanic question etc. please don’t hesitate to contact one of them or myself. We are willing to help not only at camp, but after camp and future years down the road.\n\nFinally, the tentative 2023 WBYOC Kaukauna camp dates are June 16th, 17th, and 18th. Look for registration information on our website at www.officialsconnection.org sometime around December. I hope to work with you again at camp next year.\n\nAny further questions or comments please don’t hesitate to reach out. Have a great rest of your summer and a great 2022–23 basketball season.\n\nSincerely,\n\nTom Rusch\nWBYOC Director\nrusch@lutheranhigh.com\n(920) 698-2400
//   `;
// }

function generateText({
  firstName,
  camp,
  nextYearsDates,
}: QuestionnaireEmailParams) {
  return `
  Hi ${firstName},\n\nThanks again for taking the time out of your busy schedule to attend the 2022 WBYOC ${camp} officials camp, to work on your craft as a basketball official. The comments I've received from campers have been extremely positive on the training and instruction that the WBYOC staff provided. I hope this was true for you as well.\n\nIncluded with this message is a listing of the officials from your camp session. This information is provided for your use only, to stay in touch with the officials that you met. The networking and camaraderie of WBYOC officials both during camp and after is really great to see. The clinicians contact info is included as well. If you have a rule or interpretation, a play situation, court coverage, mechanic question etc. please don't hesitate to contact one of them or myself. We are willing to help not only at camp, but after camp and future years down the road.\n\nFinally, the tentative 2023 WBYOC ${camp} camp dates are ${nextYearsDates}. Look for registration information on our website at www.officialsconnection.org sometime around December. I hope to work with you again at camp next year.\n\nAny further questions or comments please don't hesitate to reach out. Have a great rest of your summer and a great 2022-23 basketball season.\n\nSincerely,\n\nTom Rusch\nWBYOC Director\nrusch@lutheranhigh.com\n(920) 698-2400
  `;
}

export default function generateEmail(params: QuestionnaireEmailParams) {
  const html = generateHtml(params);
  const text = generateText(params);
  return { html, text };
}
