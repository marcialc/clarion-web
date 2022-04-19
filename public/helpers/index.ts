const generateRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    //Math.random() 
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

const capitalizeWord = (word: string) => {
  const str = word.toLocaleLowerCase();
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const round = (num: number) => {
  return Math.round(num * 100) / 100
}

const numberWithCommas = (num: number) => {
  const internationalNumberFormat = new Intl.NumberFormat('en-US')
  console.log()
  return internationalNumberFormat.format(num);
}

export { generateRandomColor, capitalizeWord, round, numberWithCommas }