const sentToDb = (beginningHour: any, theHour: any) => {
  return new Promise(() => {});
};

const getMinusHours = (begH: boolean, theHour: string) => {
  return new Promise(resolve => {
    let theHourMinus1: string;
    let theHourMinus2: string;
    let theHourMinus3: string;
    let theHourMinus4: string;

    if (!begH) {
      theHourMinus1 = (parseInt(theHour) - 1).toString();
      theHourMinus2 = (parseInt(theHour) - 2).toString();
      theHourMinus3 = (parseInt(theHour) - 3).toString();
      theHourMinus4 = (parseInt(theHour) - 4).toString();
      resolve([theHourMinus1, theHourMinus2, theHourMinus3, theHourMinus4]);
    } else if (!!begH) {
      theHourMinus1 = (parseInt(theHour) - 76).toString();
      theHourMinus2 = (parseInt(theHour) - 77).toString();
      theHourMinus3 = (parseInt(theHour) - 77).toString();
      theHourMinus4 = (parseInt(theHour) - 78).toString();
      resolve([theHourMinus1, theHourMinus2, theHourMinus3, theHourMinus4]);
    }
  });
};

const mapAndGetSentiment = (allTweets: any[]) => {
  return new Promise(resolve => {
    let total = 0;
    let sentiment = 0;
    let done = false;
    let overallSentiment;
    allTweets.map(tw => {
      if (parseInt(tw.polarity) == 4) {
        sentiment += 1;
        total += 1;
        if (total == allTweets.length) {
          overallSentiment = sentiment / total;
          done = true;
        }
      } else if (parseInt(tw.polarity) == 0) {
        total += 1;
        if (total == allTweets.length) {
          overallSentiment = sentiment / total;
          done = true;
        }
      }
    });
    if (!!done) {
      console.log("we are done bitch");
      resolve(overallSentiment);
    }
  });
};
