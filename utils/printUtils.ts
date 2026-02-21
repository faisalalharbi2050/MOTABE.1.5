// Basic print styles to hide everything except the print container when printing
export const injectPrintStyles = () => {
  if (document.getElementById('custom-print-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'custom-print-styles';
  style.innerHTML = `
    @media print {
      body * {
        visibility: hidden;
      }
      #print-root, #print-root * {
        visibility: visible;
      }
      #print-root {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }
      @page {
        size: A4 landscape;
        margin: 1cm;
      }
      .no-print {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(style);
};

export const triggerPrint = (contentId: string) => {
  window.print();
};
