const Card = require('./card');
const d3 = require('d3');
const Icons = require('../content/icon');

function createHorizontalBarCard(title, data, theme) {
  let width = 600;
  let margin = ({top: 20, right: width*0.18, bottom: 15, left: 38})

  //let cardHeight = 200;
  let barHeight = 20;
  let cardHeight =  (barHeight*data.length)+ margin.top + margin.bottom + 55;
  
  const card = new Card(title, width + margin.left, cardHeight, theme);
  const svg = card.getSVG();
  
  
  let height = Math.ceil((data.length + 0.1) * barHeight) + margin.top + margin.bottom;

  let total = 0;
  data.forEach(element => {
      total += element.value;
  });
  for (let i = 0 ; i < data.length ; i++){
      data[i].value = Math.round(data[i].value*(100/total)) ;
  }
  //data = Object.assign(data.sort((a, b) => d3.descending(a.value, b.value)), {format: "%"})
  

  let x = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.value)])
  .range([margin.left, width - margin.right]);
  let y = d3.scaleBand()
  .domain(d3.range(data.length))
  .rangeRound([margin.top, height - margin.bottom])
  .padding(0.1);

  //bar
  svg.append("g")
  .selectAll("rect")
  .data(data)
  .join("rect")
    .attr("fill", d => d.color)
    .attr("x", x(0))
    .attr("y", (d, i) => y(i))
    .attr("width", 0)
    .attr("height", y.bandwidth())
    .attr("rx", 10)
    .attr("ry", 10)
  .append("animate")
    .attr("attributeName", "width")
    .attr("from", 0)
    .attr("to",  d => x(d.value) - x(0))
    .attr("dur","0.6s")
    .attr("fill","freeze")
    .attr("begin",(d, i)=>i*0.2)
//text on bar     
let fontsize = 14;   
svg.append("g")
    .attr("text-anchor", "end")
    .attr("font-family", "sans-serif")
    .attr("font-size", fontsize)
  .selectAll("text")
  .data(data)
  .join("text")
    .attr("x", 0)
    .attr("y", (d, i) => y(i) + y.bandwidth() / 2)
    .attr("dy", "0.35em")
    .attr("dx", -4)
    .style("stroke",theme.bg_color)
    .style("stroke-width","3px")
    .text(d => d.name)
    .append("animate")
    .attr("attributeName", "x")
    .attr("from", 0)
    .attr("to",  d => x(d.value))
    .attr("dur","0.6s")
    .attr("fill","freeze")
    .attr("begin",(d, i)=>i*0.2);
svg.append("g")
    .attr("fill", theme.text_color)
    .attr("text-anchor", "end")
    .attr("font-family", "sans-serif")
    .attr("font-size", fontsize)
  .selectAll("text")
  .data(data)
  .join("text")
    .attr("x", 0)
    .attr("y", (d, i) => y(i) + y.bandwidth() / 2)
    .attr("dy", "0.35em")
    .attr("dx", -4)
    .text(d => d.name)
    .append("animate")
    .attr("attributeName", "x")
    .attr("from", 0)
    .attr("to",  d => x(d.value))
    .attr("dur","0.6s")
    .attr("fill","freeze")
    .attr("begin",(d, i)=>i*0.2);
  
  /*let xAxis = g => g
  .attr("transform", `translate(0,${margin.top})`)
  .attr("color", theme.text_color)
  .call(d3.axisTop(x).ticks(width / 80, data.format))
  .call(g => g.select(".domain").remove());*/
  let yAxis = g => g
  .attr("transform", `translate(${margin.left},0)`)
  .attr("color", theme.text_color)
  .call(d3.axisLeft(y).tickFormat(i => data[i].value+"%").tickSizeOuter(0).tickSizeInner(0))
  /*svg.append("g")
      .call(xAxis);*/
  svg.append("g")
      .call(yAxis);

  const panelForICON = svg
      .append('g')
      .attr('transform', `translate(${width - margin.right+20} , ${margin.top})`);
  panelForICON.append('g')
      .attr('transform', `scale(${(Math.min(data.length,4))})`)
      .style('fill', theme.icon_color)
      .html(Icons.REPOS);
  return card.toString();
}

module.exports = createHorizontalBarCard;
