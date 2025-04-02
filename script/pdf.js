// Updated pdf-export.js with centered content
document.addEventListener("DOMContentLoaded", function () {
  const downloadBtn = document.createElement("button");
  downloadBtn.id = "downloadPdfBtn";
  downloadBtn.innerHTML = "⬇️ Download as PDF";
  downloadBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px 15px;
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-family: inherit;
        z-index: 1000;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;
  document.body.appendChild(downloadBtn);

  downloadBtn.addEventListener("click", async function () {
    try {
      downloadBtn.innerHTML = "⏳ Generating PDF...";
      downloadBtn.disabled = true;

      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
      );
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
      );

      const { jsPDF } = window.jspdf;

      // Temporary style adjustments for better PDF capture
      const originalStyles = {
        bodyOverflow: document.body.style.overflow,
        htmlOverflow: document.documentElement.style.overflow,
      };
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      const element = document.body;
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      // PDF dimensions in mm (A4)
      const pdfWidth = 210;
      const pdfHeight = 297;

      // Calculate aspect ratios
      const imgRatio = canvas.width / canvas.height;
      const pdfRatio = pdfWidth / pdfHeight;

      let imgWidth, imgHeight, xPos, yPos;

      if (imgRatio > pdfRatio) {
        // Image is wider than PDF
        imgWidth = pdfWidth - 20; // Add 10mm margin on each side
        imgHeight = imgWidth / imgRatio;
        xPos = 10; // Left margin
        yPos = (pdfHeight - imgHeight) / 2; // Center vertically
      } else {
        // Image is taller than PDF
        imgHeight = pdfHeight - 20; // Add 10mm margin on top/bottom
        imgWidth = imgHeight * imgRatio;
        xPos = (pdfWidth - imgWidth) / 2; // Center horizontally
        yPos = 10; // Top margin
      }

      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(canvas, "PNG", xPos, yPos, imgWidth, imgHeight);

      // Restore original styles
      document.body.style.overflow = originalStyles.bodyOverflow;
      document.documentElement.style.overflow = originalStyles.htmlOverflow;

      pdf.save("IRAKARAMA_Jean_Francois_Leon_Resume.pdf");
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert(
        "Failed to generate PDF. Please try printing the page instead (Ctrl+P)."
      );
    } finally {
      downloadBtn.innerHTML = "⬇️ Download as PDF";
      downloadBtn.disabled = false;
    }
  });

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();

      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
});
