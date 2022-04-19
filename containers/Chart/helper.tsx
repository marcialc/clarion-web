// lines plugin
export const lines = {
    id: "lines",
    beforeDatasetsDraw(chart: any) {
      const {
        ctx,
        legend,
        tooltip,
        scales: { x, y },
        chartArea: { top, bottom, left, right, width, height },
      } = chart;
      if (tooltip._active[0]) {
        ctx.beginPath();
        ctx.strokeStyle = "grey";
        ctx.lineWidth = 1;
        ctx.moveTo(tooltip._active[0].element.x, top);
        ctx.lineTo(tooltip._active[0].element.x, bottom);
        ctx.stroke();
        ctx.restore();
      }
    },
  };

  export const getColors = () => ["#DB3EB1", "#4D4DFF", "#F1BF42", "#5EBEDC", "#44D62C"];
