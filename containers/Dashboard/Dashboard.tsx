import React, { useEffect, useState } from "react";
import axios from "axios";
import LineChart from "../Chart/chart.component";
import AutoFillDropDown from "../../components/autoFillDropDown/autofilldropdown.component";
import loadingAnimation from "../../public/lottie/loading-box.json";
import chartLoading from "../../public/lottie/chart-loading.json";
import { Player } from "@lottiefiles/react-lottie-player";
import useDeviceDetect from "../../utils/useDeviceDetect";
import { Alert, Button, ButtonGroup, Snackbar, styled } from "@mui/material";
import { getColors } from "../Chart/helper";

type CoinT = {
  id: string,
  percentages: number[];
  priceDifferences: number[];
  prices: number[];
}

const options: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
}

const ChartWrapper = styled('div', { label: 'ChartWrapper' })(({ theme }: any) => ({
  [theme.breakpoints.up("md")]: {
    // Below 600px
    width: '80%',
    margin: '0 auto'
  },
  width: "100%",
  margin: '0'
}));

const DayFilterWrapper = styled('div', { label: 'DayFilterWrapper' })(({ theme }: any) => ({
  [theme.breakpoints.up("md")]: {
    // Below 600px
    width: '80%',
    margin: '0 auto'
  },
  display: 'flex',
  justifyContent: 'flex-end',
  width: '100%',
  margin: '0'
}));

const days = [1, 7, 30, 365, 1825];

export const Dashboard = () => {
  const [data, setData] = useState<any>({});
  const [selectedCoins, setSelectedCoins] = useState<string[]>([
    "ethereum",
    "bitcoin",
  ]);
  const [day, setDay] = useState<number>(0);
  const [listCoins, setListCoins] = useState<any[]>([]);
  const [listCoinsName, setListCoinsName] = useState<any[]>([]);
  const { isMobile } = useDeviceDetect();
  const [repeatedCoin, setRepeatedCoin] = React.useState(false);
  
  useEffect(() => {
    getCoinData();
    setChartData();
  }, [selectedCoins]);

  useEffect(() => {
    setChartData();
  }, [day]);

  const getCoinData = () => {
    axios
      .get(`https://rocky-depths-43170.herokuapp.com/api/coin/coinGecko`)
      .then((res) => {
        const response = res.data;
        const list_coins: any[] = [];
        const list_coin_name: string[] = [];

        response.map((coin: any) => {
          list_coins.push({
            name: coin.name,
            id: coin.id,
          });
          list_coin_name.push(coin.name);
        });
        setListCoins(list_coins);
        setListCoinsName(list_coin_name);
      })
      .catch((err) => {
        console.error("ERROR: ", err);
      });
  };

  const setChartData = () => {
    getChartData()
      .then((response) => {
        setData(response);
      })
      .catch((err) => {
        console.log("ERROR IN FETCHING CHART DATA");
      });
  };

  const getChartData = async () => {
    const datasets: any[] = [];
    let label: any[] = [];

    const coinsEndpoint = `https://rocky-depths-43170.herokuapp.com/api/coin/history?values=${days[day]},${selectedCoins.join(',')}`;
    const res = await axios.get(coinsEndpoint);

    const coins = res.data.coins;
    const dates = res.data.dates;
    const colors = getColors();

    coins.forEach((coin: CoinT, i: number) => {
      datasets.push({
            label: coin.id.toLocaleLowerCase(),
            data: coin.percentages,
            moreData: {
              price: coin.prices,
              difference:  coin.priceDifferences,
            },
            borderColor: colors[i],
            backgroundColor: colors[i],
            borderWidth: 2,
            pointBorderWidth: 0.2,
          });
    })

    dates.forEach((date: string) => {
      const d = new Date(date)
      label.push(d.toLocaleDateString("en-US", options))
    })

    const new_data = {
      labels: label,
      datasets,
    };
    return new_data;
  };

  const handleInput = (input: any) => {
    const coin: string = input.toLocaleLowerCase();
    const coinList: any[] = [...selectedCoins];
    const coinIdIndex: number = listCoins.findIndex((el: any) => {
      return el.name.toLocaleLowerCase() === coin;
    });

    if (coinIdIndex === -1) {
      return;
    }

    if(selectedCoins.includes(coin)) {
      setRepeatedCoin(true);
      return;
    }

    if (coinList.length > 4) return;

    coinList.push((listCoins[coinIdIndex] as any).id);
    setSelectedCoins(coinList);
    setChartData();
  };

  const handleDeletion = (event: any) => {
    let selected_coins = [...selectedCoins];

    selected_coins = selected_coins.filter((el) => {
      return el !== event;
    });
    setSelectedCoins(selected_coins);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setRepeatedCoin(false);
  };

  const handleTimeLineSelection = (id: any) => {
    console.log("handleTimeLineSelection: ", id)
    setDay(id);
  };

  const activeStyle = { background: '#6440ecb0', color: 'white !important' }

  return (
    <div style={{ width: "100%" }}>
      <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={repeatedCoin} autoHideDuration={2500} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          Coin already selected!
        </Alert>
      </Snackbar>
      {listCoins.length > 0 ? (
        <AutoFillDropDown
          list={listCoinsName}
          callback={handleInput}
          selectedList={selectedCoins}
          label="Cryptos"
          disabled={selectedCoins.length > 4}
        />
      ) : (
        <Player
          autoplay
          loop
          src={loadingAnimation}
          style={{ height: "150px", width: "150px", margin: "-50px auto" }}
        />
      )}
      <DayFilterWrapper>
          <ButtonGroup style={{ margin: '1rem 0'}} variant="outlined" size="small" aria-label="small button group">
            <Button onClick={() => handleTimeLineSelection(0)} disabled={day === 0} sx={day === 0 ? activeStyle: null}>24h</Button>
            <Button onClick={() => handleTimeLineSelection(1)} disabled={day === 1} sx={day === 1 ? activeStyle: null}>7D</Button>
            <Button onClick={() => handleTimeLineSelection(2)} disabled={day === 2} sx={day === 2 ? activeStyle: null}>1M</Button>
            <Button onClick={() => handleTimeLineSelection(3)} disabled={day === 3} sx={day === 3 ? activeStyle: null}>1Y</Button>
            <Button onClick={() => handleTimeLineSelection(4)} disabled={day === 4} sx={day === 4 ? activeStyle: null}>5Y</Button>
          </ButtonGroup>
      </DayFilterWrapper>
      <ChartWrapper>
        {Object.keys(data).length !== 0 ? (
          <LineChart
            data={data}
            list={selectedCoins}
            deleteCallback={handleDeletion}
          />
        ) : (
          <Player autoplay loop src={chartLoading} />
        )}
      </ChartWrapper>
    </div>
  );
};
