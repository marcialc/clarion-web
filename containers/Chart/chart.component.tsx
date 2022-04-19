import React, { useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { AiFillDelete, AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";
import styles from "../../styles/chart.module.scss";
import { capitalizeWord, numberWithCommas, round } from "../../public/helpers";
import { getColors, lines } from "./helper";
import { Card, CardContent, IconButton, styled } from "@mui/material";
import useDeviceDetect from "../../utils/useDeviceDetect";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

let delayed: boolean;

const LegendItemsWrapper = styled('div', { label: 'LegendItemsWrapper' })(({ theme }: any) => ({
  display: "flex",
  marginTop: '1rem',
  flexDirection: 'column',
  flexWrap: 'wrap'
}));

type LegendT = {
  name: string;
  percentage: string;
  price: number;
  difference: number;
  hidden: boolean;
};

const LineChart = ({ data, list, deleteCallback }: AppProps) => {
  const chartRef = useRef();
  const colors = getColors();

  const [legenItems, setlegenItems] = useState<LegendT[]>([]);
  const [date, setDate] = useState<[]>();

  useEffect(() => {
    const arr: any = [];
    list.forEach((el) => {
      const coin = {
        name: el,
        percentage: "0",
        price: 0,
        difference: 0,
        hidden: false,
      };
      arr.push(coin);
    });
    setlegenItems(arr);
  }, [list]);

  // plugin config
  const plugins = [lines];

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    interaction: {
      intersect: false,
      mode: "index",
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0)",
        cornerRadius: 6,
        boxPadding: 5,
        callbacks: {
          label: (coin: any) => {
            const arr: any[] = [...legenItems];
            const index = arr.findIndex((el: any) => {
              return el.name == coin.dataset.label.toLocaleLowerCase();
            });
            if (index > -1) {
              arr[index].percentage = coin.formattedValue;
              arr[index].price = round(
                coin.dataset.moreData?.price[coin.dataIndex]
              );
              arr[index].difference = round(
                coin.dataset.moreData?.difference[coin.dataIndex]
              );
            }
            setDate(coin.label);
            return "";
          },
          labelPointStyle: function (coin: any) {
            return {
              pointStyle: "triangle",
              rotation: 0,
            };
          },
        },
      },
    },
    hitRadius: 30,
    pointRadius: 0,
    pointHoverRadius: 5,
    pointHitRadius: 7,
    hoverBackgroundColor: "white",
    pointHoverBorderWidth: 3,
    animation: {
      onComplete: () => {
        delayed = true;
      },
      delay: (context: any) => {
        let delay = 0;
        if (context.type === "data" && context.mode === "default" && !delayed) {
          delay = context.dataIndex * 1 + context.datasetIndex * 1;
        }
        return delay;
      },
    },
  };

  const setBorderColor = () => {
    const newOptions = { ...options };
    newOptions.scales = {
      xAxes: {
        align: "center",
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
      yAxes: {
        ticks: {
          callback: function (value: any) {
            return "% " + value + "  ";
          },
        },
        grid: {
          display: true,
          drawBorder: false,
          drawOnChartArea: true,
          drawTicks: false,
          color: function (context: any, ...props: any) {
            if (context.tick.value === 0) return "rgba(255, 255, 255, 0.8)";
            return "rgba(255, 255, 255, 0.2)";
          },
        },
      },
    };

    return newOptions;
  };

  const getDisplayData = () => {
    return Object.keys(data.datasets).length === 0;
  };

  const lineGraph = getDisplayData() ? (
    <p>data is Loading...</p>
  ) : (
    <Line
      key="marcial"
      ref={chartRef}
      datasetIdKey="id"
      options={setBorderColor()}
      plugins={plugins}
      data={data}
    />
  );

  const handleDeleteCoin = (e: any, coin: string) => {
    e.stopPropagation();
    const chart: any = chartRef.current;

    const dataset: any = chart.data.datasets.filter((el: any) => {
      return el.label.toLocaleLowerCase() !== coin.toLocaleLowerCase();
    });

    chart.data.datasets = dataset;
    deleteCallback(coin);
    chart.update();
  };

  const handleHideCoin = (e: any, coin: string) => {
    e.stopPropagation();
    const chart: any = chartRef.current;
    const legend: LegendT[] = [...legenItems];

    const coinIndex: any = chart.data.datasets.findIndex((el: any) => {
      return el.label.toLocaleLowerCase() === coin.toLocaleLowerCase();
    });

    if (chart.getDatasetMeta(coinIndex).hidden) {
      chart.show(coinIndex);
      legend[coinIndex].hidden = false;
    } else {
      chart.hide(coinIndex);
      legend[coinIndex].hidden = true;
    }
    chart.update();
    setlegenItems(legend);
  };

  const isPercentPositive = (percent: string) => {
    const num = Number(percent);
    return num >= 0.0;
  };

  return (
    <div>
      {lineGraph}
      <LegendItemsWrapper>
        {legenItems &&
          legenItems.map((coin: LegendT, index: number) => {
            return (
              <Card
                key={coin.name}
                style={{
                  marginBottom: "5px",
                  backgroundColor: "#f8f8ff",
                  maxWidth: "100%",
                  borderRadius: "0.75rem",
                }}
                elevation={0}
              >
                <CardContent style={{ padding: "0.5rem 1rem", color: "#000" }}>
                  <div className={styles.card}>
                    <span>
                      <div
                        className={styles.line}
                        style={{ backgroundColor: colors[index] }}
                      ></div>
                      <p>{capitalizeWord(coin.name)}</p>
                    </span>
                    <p>${numberWithCommas(coin.price)}</p>
                    <p className={styles.difference}>${numberWithCommas(coin.difference)}</p>
                    <div
                      style={{
                        color: isPercentPositive(coin.percentage)
                          ? "green"
                          : "red",
                        fontWeight: "600",
                        display: "flex",
                      }}
                    >
                      {isPercentPositive(coin.percentage) ? (
                        <IoMdArrowUp />
                      ) : (
                        <IoMdArrowDown />
                      )}
                      <p>%{coin.percentage}</p>
                    </div>
                    <div className={styles.icons}>
                      <IconButton
                        aria-label="hide"
                        size="small"
                        onClick={(e) => handleHideCoin(e, coin.name)}
                      >
                        {
                          coin.hidden ? 
                          <AiFillEyeInvisible color="#11092A" />:
                          <AiFillEye color="#11092A" />
                        }
                        
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={(e) => handleDeleteCoin(e, coin.name)}
                      >
                        <AiFillDelete size="1rem" color="#11092A" />
                      </IconButton>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </LegendItemsWrapper>
    </div>
  );
};

type AppProps = {
  data: { labels: Array<any>; datasets: Array<any> };
  deleteCallback: (item: string) => void;
  list: Array<any>;
};

export default LineChart;
