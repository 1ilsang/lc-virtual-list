const URL = "https://source.unsplash.com/random/400*400";

const getRandomDelay = () => Math.random() * 2000;

const fetchItem = async (page, step = 30) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // throw new Error("WTF"); // Fire Error!
        const resultList = [];
        const startIndex = page * step;
        const endIndex = startIndex + step;
        for (let i = startIndex; i < endIndex; i++) {
          resultList.push({
            url: URL,
            index: i,
          });
        }
        console.log(
          "API Response!",
          `PageNo. ${page}, startIndex: ${startIndex}, endIndex: ${endIndex}`
        );
        resolve(resultList);
      } catch (e) {
        reject(e);
      }
    }, getRandomDelay());
  });
};

export default fetchItem;
