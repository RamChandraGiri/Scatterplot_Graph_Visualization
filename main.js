//Whole D3 scripting part

//Define tooltip
const tooltip = document.getElementById('tooltip');

// Fetching JSON data
fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
    .then(res => res.json())
    .then(res => {
        const data = res;
        // Fetched array of object same as JSON 
        createSvg(data);
    })


function createSvg(data) {
    // Extracted object format
    // {
    //     Time: => 0
    //     Place: => 1
    //     Seconds: => 2
    //     Name: => 3
    //     Year: => 4
    //     Nationality: => 5
    //     Doping: => 6
    //     URL: => 7
    // }

    // Extract data and define constants
    const dataset = data;



    //Manipulate Time string from Json to create time objects
    const TIMES = data.map((d, i) => dataset[i].Time);

    var timesArr = [];
    for (i in TIMES) {
        var parsedTime = TIMES[i].split(':');
        timesArr[i] = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1])
    }
    var timeFormat = d3.timeFormat("%M:%S");



    //Create and arry of year from Json
    const yearsArr = data.map((d, i) => dataset[i].Year);
    var yearFormat = d3.format("d");


    // Create an SVG with height, width and padding property
    const width = 900;
    const height = 550;

    //Padding 
    const padding = {
        top: 20,
        right: 30,
        bottom: 40,
        left: 50
    };

    //Actual bar chart area inside SVG element
    const chartArea = {
        'width': width - padding.left - padding.right,
        'height': height - padding.top - padding.bottom
    };

    //SVG creation
    const svg = d3.select('#container').append('svg')
        .attr('width', width)
        .attr('height', height);


    //Y-Scale
    const yScale = d3.scaleTime()
        .domain([d3.max(timesArr), d3.min(timesArr)])
        .range([chartArea.height, 0])
        .nice();

    //X-Scale
    const xScale = d3.scaleLinear()
        .domain([d3.min(yearsArr) - 1, d3.max(yearsArr) + 1])
        .range([0, chartArea.width]);

    //Y-Axis
    const yAxis = svg.append('g')
        .classed('y-axis', true)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
        .call(d3.axisLeft(yScale).tickFormat(timeFormat));

    //X-Axis
    const xAxis = svg.append('g')
        .classed('x-axis', true)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(' + padding.left + ',' + (chartArea.height + padding.top) + ')')
        .call(d3.axisBottom(xScale).tickFormat(yearFormat));

    //Legends Y-Axis
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -(height / 2 + 20))
        .attr('y', 70)
        .text('Time (in minutes)');

    //Legends X-Axis
    svg.append('text')
        .attr('transform', 0)
        .attr('x', width / 2 - 5)
        .attr('y', height - 3)
        .text('Year');


    //Manipulate data to create circular dot
    svg.selectAll('circle')
        .data(dataset)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('data-xvalue', d => d.Year)
        .attr('data-yvalue', (d, i) => timesArr[i].toISOString())
        .attr('cx', (d, i) => padding.left + xScale(d.Year))
        .attr('cy', (d, i) => padding.top + yScale(timesArr[i]))
        .attr('r', 6)
        .attr('fill', d => d.Doping === '' ? 'orange' : 'skyblue')
        .attr('stroke', 'black')
        .on('mouseover', (d, i) => {
            tooltip.classList.add('show');

            tooltip.style.left = xScale(d.Year) + (padding.left) + 'px';
            tooltip.style.top = yScale(timesArr[i]) + 'px';
            tooltip.setAttribute('data-year', d.Year)

            tooltip.innerHTML = `
              ${d.Name} : ${d.Nationality} <br>
              Year : ${d.Year}, Time : ${d.Time}<br><br>
              ${d.Doping}
            `;
        })
        .on('mouseout', () => {
            tooltip.classList.remove('show');
        });

}