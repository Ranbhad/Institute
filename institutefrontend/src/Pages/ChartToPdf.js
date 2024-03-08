import React from 'react';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ChartToPdf = ({ chartData, chartTitle }) => {
  const chartRef = React.useRef();

  const handlePrint = useReactToPrint({
    content: () => chartRef.current,
  });

  const handleExportToPdf = () => {
    if (chartRef.current) {
      const pdf = new jsPDF();
      const contentWidth = chartRef.current.offsetWidth;
      const contentHeight = chartRef.current.offsetHeight;

      pdf.text(chartTitle, 10, 10);
      pdf.addImage(chartRef.current, 'PNG', 10, 20, contentWidth - 20, contentHeight - 20);

      pdf.save(`${chartTitle}_chart.pdf`);
    }
  };

  return (
    <div>
      <div ref={chartRef}>
        {/* Render your chart component here, using the provided chartData */}
        {/* Example: <ReactApexChart options={chartOptions} series={chartData} type="bar" /> */}
      </div>
      <button onClick={handlePrint}>Print Chart</button>
      <button onClick={handleExportToPdf}>Export to PDF</button>
    </div>
  );
};

export default ChartToPdf;
