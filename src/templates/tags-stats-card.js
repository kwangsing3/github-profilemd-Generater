const Card = require('./card');
const Icons = require('../content/icon');

function createStatsCard(title, statsData, theme) {
    let cHeight = statsData.length*38 > 200? statsData.length*38:200;
    const width = 340;
    const card = new Card(title, width, cHeight, theme);
    const svg = card.getSVG();

    // draw icon
    const panel = svg.append('g').attr('transform', `translate(30,20)`);
    const labelHeight = 14;
    panel
        .selectAll(null)
        .data(statsData)
        .enter()
        .append('g')
        .attr('transform', (d) => {
            const y = labelHeight * d.index * 1.8;
            return `translate(0,${y+2})`;
        })
        .attr('width', labelHeight)
        .attr('height', labelHeight)
        .attr('fill', theme.icon_color)
        .html((d) => d.icon);

    // draw text
    panel
        .selectAll(null)
        .data(statsData)
        .enter()
        .append('text')
        .text((d) => {
            return `${d.name}`;
        })
        .attr('x', -width )
        .attr('y', (d) => labelHeight * d.index * 1.8 + labelHeight)
        .style('fill', theme.text_color)
        .style('font-size', `${labelHeight}px`)
        .append("animate")
        .attr("attributeName", "x")
        .attr("from", -width )
        .attr("to", labelHeight * 1.5)
        .attr("dur","0.3s")
        .attr("fill","freeze")
        .attr("begin", (d,i)=> i *0.1);
    // counter text
    panel
        .selectAll(null)
        .data(statsData)
        .enter()
        .append('text')
        .text((d) => {
            return `${d.value}`;
        })
        .attr('x', -width )
        .attr('y', (d) => labelHeight * d.index * 1.8 + labelHeight)
        .style('fill', theme.text_color)
        .style('font-size', `${labelHeight}px`)
        .append("animate")
        .attr("attributeName", "x")
        .attr("from", -width )
        .attr("to", 130)
        .attr("dur","0.3s")
        .attr("fill","freeze")
        .attr("begin", (d,i)=> i *0.1);
    const panelForGitHubLogo = svg
        .append('g')
        .attr('transform', `translate(220,20)`);
    panelForGitHubLogo
        .append('g')
        .attr('transform', `scale(6)`)
        .style('fill', theme.icon_color)
        .html(Icons.GITHUB);

    return card.toString();
}

module.exports = createStatsCard;
