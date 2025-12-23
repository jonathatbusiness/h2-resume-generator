import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportElementToPdf({
  element,
  filename = "cv.pdf",
  scale = 1,
}) {
  if (!element) throw new Error("Elemento de exportação não encontrado.");

  console.log("📏 Dimensões do elemento:", {
    offsetWidth: element.offsetWidth,
    offsetHeight: element.offsetHeight,
    clientWidth: element.clientWidth,
    clientHeight: element.clientHeight,
    scrollWidth: element.scrollWidth,
    scrollHeight: element.scrollHeight,
  });

  const prevTransform = element.style.transform;
  const prevZoom = element.style.zoom;
  const prevTransformOrigin = element.style.transformOrigin;

  element.style.transform = "none";
  element.style.zoom = "1";
  element.style.transformOrigin = "top left";

  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    backgroundColor: "#ffffff",
    removeContainer: true,
  });

  element.style.transform = prevTransform;
  element.style.zoom = prevZoom;
  element.style.transformOrigin = prevTransformOrigin;

  console.log("🖼️ Dimensões do canvas:", {
    width: canvas.width,
    height: canvas.height,
    scale: scale,
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.95);

  const pdfWidth = canvas.width;
  const pdfHeight = canvas.height;

  console.log("📄 Dimensões do PDF (em px):", {
    pdfWidth,
    pdfHeight,
  });

  const pdf = new jsPDF({
    orientation: pdfWidth > pdfHeight ? "l" : "p",
    unit: "px",
    format: [pdfWidth, pdfHeight],
    compress: true,
    hotfixes: ["px_scaling"],
  });

  pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

  pdf.save(filename);
}
