import Card from './card.js';
import numberAbbreviate from 'number-abbreviate';

/*
    Headline profile numbers as a single card.
    `stats` is an array of { name, value, icon } in display order.
*/
function createOverviewCard(title, stats, theme) {
    const width = 340;
    const rowHeight = 28;
    const cHeight = Math.max(stats.length * rowHeight + 30, 120);
    const card = new Card(title, width, cHeight, theme);
    const svg = card.getSVG();

    const panel = svg.append('g').attr('transform', 'translate(30,20)');
    const iconSize = 16;

    stats.forEach((stat, i) => {
        const y = i * rowHeight;
        const row = panel.append('g').attr('transform', `translate(0, ${y})`);

        // icon
        row.append('g')
            .attr('transform', `translate(0, 2) scale(1)`)
            .style('fill', theme.icon_color)
            .html(stat.icon);

        // label
        row.append('text')
            .attr('x', iconSize + 10)
            .attr('y', iconSize - 2)
            .style('fill', theme.text_color)
            .style('font-size', `${iconSize}px`)
            .text(stat.name);

        // value (right aligned)
        row.append('text')
            .attr('x', width - 60)
            .attr('y', iconSize - 2)
            .attr('text-anchor', 'end')
            .style('fill', theme.title_color)
            .style('font-size', `${iconSize}px`)
            .style('font-weight', 'bold')
            .text(numberAbbreviate(stat.value, 1));
    });

    return card.toString();
}

export default createOverviewCard;
