// common function for insert json into function
const insertJson = (targetFunction, data) => {
  //console.log("data?", data);
  const { invoices, plays } = data;

  let result = [];
  for (let invoice of invoices) {
    for (let perf of invoice.performances) {
      const play = plays[perf.playID];
      const temp = targetFunction(perf, play.type);
      result.push(temp);
    }
  }
  return result;
};

// // Parsing html strings for validation
// const parseHTMLString = (htmlString) =>{
//
// }

module.exports = {
  insertJson,
};
