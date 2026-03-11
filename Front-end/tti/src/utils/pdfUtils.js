/**
 * printToPDF — opens a clean, styled print window from HTML content.
 * Call this with the innerHTML of the section to print + a title string.
 */
export function printToPDF(htmlContent, title = "Document") {
  const win = window.open("", "_blank", "width=900,height=700");
  if (!win) {
    alert("Please allow pop-ups to download the PDF.");
    return;
  }

  win.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&display=swap');

          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

          body {
            font-family: 'Barlow', Arial, sans-serif;
            background: #ffffff;
            color: #1e293b;
            font-size: 13px;
            padding: 36px 44px;
          }

          /* ── Print letterhead ── */
          .pdf-header {
            display: flex;
            align-items: center;
            gap: 18px;
            padding-bottom: 18px;
            border-bottom: 3px solid #0274BE;
            margin-bottom: 24px;
          }
          .pdf-logo-circle {
            width: 52px; height: 52px;
            border-radius: 50%;
            background: #0274BE;
            display: flex; align-items: center; justify-content: center;
            font-weight: 900; color: #fff; font-size: 13px;
            flex-shrink: 0;
          }
          .pdf-title-block h1 {
            font-size: 16px; font-weight: 800; color: #0274BE; margin: 0 0 2px;
          }
          .pdf-title-block p {
            font-size: 11px; color: #94a3b8; margin: 0; letter-spacing: 1.5px; text-transform: uppercase;
          }
          .pdf-meta {
            margin-left: auto; text-align: right;
          }
          .pdf-meta p { font-size: 11px; color: #94a3b8; margin: 2px 0; }
          .pdf-meta strong { color: #1e293b; }

          /* ── Section title ── */
          .pdf-section-title {
            font-size: 14px; font-weight: 700; color: #1e293b;
            margin: 20px 0 12px;
            padding-bottom: 6px;
            border-bottom: 1px solid #e2e8f0;
          }

          /* ── Table ── */
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12.5px;
            margin-bottom: 20px;
          }
          thead tr {
            background: #f1f5f9;
            border-bottom: 2px solid #e2e8f0;
          }
          th {
            padding: 10px 14px;
            text-align: left;
            font-size: 10.5px;
            font-weight: 700;
            color: #94a3b8;
            letter-spacing: 0.8px;
            text-transform: uppercase;
            white-space: nowrap;
          }
          td {
            padding: 11px 14px;
            border-bottom: 1px solid #e2e8f0;
            color: #1e293b;
            vertical-align: middle;
          }
          tbody tr:last-child td { border-bottom: none; }
          tbody tr:nth-child(even) { background: #f8fafc; }

          /* ── Code badge ── */
          .badge {
            display: inline-block;
            padding: 2px 9px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 700;
          }
          .badge-blue  { background: #dbeafe; color: #1d4ed8; }
          .badge-green { background: #dcfce7; color: #15803d; }
          .badge-red   { background: #fee2e2; color: #dc2626; }
          .badge-amber { background: #fef9c3; color: #a16207; }
          .badge-grey  { background: #f1f5f9; color: #64748b; }

          /* ── Summary boxes ── */
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 14px;
            margin-bottom: 24px;
          }
          .summary-box {
            border: 1px solid #e2e8f0;
            border-top: 3px solid #0274BE;
            border-radius: 6px;
            padding: 14px 16px;
          }
          .summary-box .label {
            font-size: 10px; font-weight: 700; color: #94a3b8;
            letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px;
          }
          .summary-box .value {
            font-size: 20px; font-weight: 800; color: #1e293b;
          }
          .summary-box.accent .value { color: #0274BE; }
          .summary-box.danger .value { color: #dc2626; }
          .summary-box.success .value { color: #15803d; }

          /* ── Progress bar ── */
          .progress-wrap {
            background: #f1f5f9;
            border-radius: 99px;
            height: 10px;
            overflow: hidden;
            margin: 6px 0 2px;
          }
          .progress-bar {
            height: 100%;
            border-radius: 99px;
            background: #0274BE;
          }

          /* ── Footer ── */
          .pdf-footer {
            margin-top: 32px;
            padding-top: 14px;
            border-top: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            font-size: 10.5px;
            color: #94a3b8;
          }

          @media print {
            body { padding: 20px 28px; }
            @page { margin: 12mm 14mm; }
          }
        </style>
      </head>
      <body>
        <!-- Letterhead -->
        <div class="pdf-header">
          <div class="pdf-logo-circle">TTI</div>
          <div class="pdf-title-block">
            <h1>Thika Technical Training Institute</h1>
            <p>Student Portal — Official Document</p>
          </div>
          <div class="pdf-meta">
            <p>Generated: <strong>${new Date().toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}</strong></p>
            <p>Time: <strong>${new Date().toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })}</strong></p>
          </div>
        </div>

        ${htmlContent}

        <div class="pdf-footer">
          <span>Thika Technical Training Institute &mdash; Student Portal</span>
          <span>This is a system-generated document.</span>
        </div>
      </body>
    </html>
  `);

  win.document.close();

  // Give fonts time to load then print
  setTimeout(() => {
    win.focus();
    win.print();
  }, 800);
}