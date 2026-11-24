import { Resend } from 'resend';
import { ENV } from '../config/env.js';
import { EmailLog } from '../models/EmailLog.js';
import { logger } from '../utils/logger.js';
import { Types } from 'mongoose';

const resend = ENV.RESEND_API_KEY ? new Resend(ENV.RESEND_API_KEY) : null;

export interface IWinnerEmailData {
  userName: string;
  userEmail: string;
  userId?: Types.ObjectId;
  bondNumber: string;
  series?: string;
  prizeCategory: string;
  prizeTitleBn: string;
  prizeTitleEn: string;
  grossAmount: number;
  estimatedTax: number;
  netAmount: number;
  drawNumber: string;
  drawDate: string;
}

export const emailService = {
  /**
   * Sends the official winner notification email
   */
  sendWinnerEmail: async (data: IWinnerEmailData): Promise<boolean> => {
    const subject = 'Congratulations! Your Prize Bond Has Won 🇧🇩';
    const seriesText = data.series ? ` (${data.series} সিরিজ)` : '';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; padding: 24px; margin: 0; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #1d4ed8, #4338ca); color: #ffffff; padding: 32px 24px; text-align: center; }
          .badge { display: inline-block; background: #fef08a; color: #854d0e; font-weight: bold; font-size: 12px; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; margin-bottom: 8px; }
          .title { font-size: 24px; font-weight: 800; margin: 8px 0; }
          .content { padding: 32px 24px; }
          .prize-card { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
          .prize-amount { font-size: 32px; font-weight: 900; color: #15803d; font-family: monospace; }
          .table { width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 14px; }
          .table th, .table td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #e2e8f0; }
          .table th { color: #64748b; font-weight: 600; width: 40%; }
          .table td { color: #0f172a; font-weight: 600; }
          .btn { display: inline-block; background: #2563eb; color: #ffffff !important; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 10px; margin-top: 16px; text-align: center; }
          .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 24px; font-size: 12px; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="badge">🎉 OFFICIAL WINNER NOTIFICATION</span>
            <div class="title">অভিনন্দন! Congratulations!</div>
            <div>বাংলাদেশ প্রাইজবন্ড ড্র ফলাফল</div>
          </div>
          <div class="content">
            <p>Dear <strong>${data.userName}</strong>,</p>
            <p>Great news! One of your saved Bangladesh 100 Taka Prize Bonds has won a prize in the official <strong>${data.drawNumber}th Draw</strong> held on <strong>${data.drawDate}</strong>.</p>
            
            <div class="prize-card">
              <div style="font-size: 14px; font-weight: bold; color: #166534; margin-bottom: 4px;">
                ${data.prizeTitleBn} (${data.prizeTitleEn})
              </div>
              <div class="prize-amount">৳${data.grossAmount.toLocaleString('en-US')}</div>
              <div style="font-size: 12px; color: #15803d; margin-top: 4px;">Gross Prize Amount</div>
            </div>

            <table class="table">
              <tr>
                <th>Winning Bond Number:</th>
                <td style="font-family: monospace; font-size: 16px; color: #2563eb;">${data.bondNumber}${seriesText}</td>
              </tr>
              <tr>
                <th>Draw Identifier:</th>
                <td>${data.drawNumber}th Draw (${data.drawDate})</td>
              </tr>
              <tr>
                <th>Gross Prize Amount:</th>
                <td>৳${data.grossAmount.toLocaleString('en-US')}</td>
              </tr>
              <tr>
                <th>Estimated Withholding Tax (20%):</th>
                <td style="color: #dc2626;">-৳${data.estimatedTax.toLocaleString('en-US')}</td>
              </tr>
              <tr>
                <th>Estimated Net Receivable:</th>
                <td style="color: #15803d; font-size: 16px;">৳${data.netAmount.toLocaleString('en-US')}</td>
              </tr>
            </table>

            <p style="font-size: 13px; color: #64748b;">
              *Note: Under Section 55 of Bangladesh Income Tax Ordinance, a 20% source tax is deducted upon prize claim. You have up to 2 years from the draw date to claim this prize through Bangladesh Bank or authorized commercial banks.
            </p>

            <div style="text-align: center;">
              <a href="${ENV.CLIENT_URL}/dashboard" class="btn">View in Dashboard</a>
            </div>
          </div>
          <div class="footer">
            <p>This is an automated notification from Bangladesh Prize Bond Monitoring & Winner Notification Platform.</p>
            <p>© ${new Date().getFullYear()} Bangladesh Prize Bond Services. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return emailService.sendMail({
      to: data.userEmail,
      userId: data.userId,
      subject,
      html,
      template: 'winner_notification'
    });
  },

  /**
   * Generic sender with database logging & graceful error handling
   */
  sendMail: async (options: {
    to: string;
    userId?: Types.ObjectId;
    subject: string;
    html: string;
    template: string;
  }): Promise<boolean> => {
    try {
      if (resend) {
        await resend.emails.send({
          from: ENV.EMAIL_FROM,
          to: options.to,
          subject: options.subject,
          html: options.html
        });
      } else {
        logger.info(`[Email Service - Simulated] To: ${options.to} | Subject: ${options.subject}`);
      }

      await EmailLog.create({
        recipientEmail: options.to.toLowerCase(),
        user: options.userId || null,
        subject: options.subject,
        template: options.template,
        status: 'sent',
        attempts: 1,
        sentAt: new Date()
      });

      return true;
    } catch (error: any) {
      logger.error(`[Email Service] Failed to send email to ${options.to}: ${error.message}`);

      await EmailLog.create({
        recipientEmail: options.to.toLowerCase(),
        user: options.userId || null,
        subject: options.subject,
        template: options.template,
        status: 'failed',
        attempts: 1,
        lastError: error.message
      });

      return false;
    }
  }
};
