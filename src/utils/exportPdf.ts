//src/utils/exportPdf.ts
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportWeekAsPDF(elementId: string) {
  const element = document.getElementById(elementId);
  if (!element) throw new Error("Element not found");

  // Temporarily add a class that sets safe background + text colors
  element.classList.add("force-light-colors");

  await new Promise(resolve => setTimeout(resolve, 10)); // let DOM apply style

  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("landscape", "pt", "a4");
  const width = pdf.internal.pageSize.getWidth();
  const height = (canvas.height * width) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, width, height);
  pdf.save("week-view.pdf");

  element.classList.remove("force-light-colors"); // clean up
}

