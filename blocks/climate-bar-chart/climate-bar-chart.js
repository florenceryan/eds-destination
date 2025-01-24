export default async function decorate(block) {
  const formContent = await fetch('average-weather.json')
    .then((res) => res.json())
    .catch((err) => {
      console.error("Couldn't load weather data", err);
      return null;
    });

  const location = block.querySelector("p");

  if ( !formContent || !location ) return;

  // Extract location temperature data
  const locationHighTemps = extractLocationData(formContent, location);

  // Pass the location data to the bar chart function
  populateBarChart(locationHighTemps, block);
}

// Extract location temperature data from the weather data
function extractLocationData(data,location) {

  const months = [
    'Jan', 'Feb', 'March', 'April', 'May', 'June',
    'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
  ];

  // Find the location column index
  const locationIndex = data.columns.indexOf(location.innerText);

  if (locationIndex === -1) {
    console.error('location data not found in the dataset');
    return [];
  }

  // Map the rows in the `data.data` array
  return months.map((month, i) => {
    const row = data.data[i]; // Access the i-th row directly
    if (!row) {
      console.warn(`No data for month: ${month}`);
      return { month, temperature: 0 };
    }

    const temperature = parseFloat(row[location.innerText]) || 0; // Use "location" directly
    return { month, temperature };
  });
}

// Helper function to calculate color based on temperature range
function interpolateColor(temp, min, max) {
  const ratio = (temp - min) / (max - min); // Normalize temperature to a 0-1 range
  const startColor = [250, 188, 0]; // RGB for #fabc00 (yellow)
  const endColor = [211, 9, 0]; // RGB for #d30900 (red)

  // Interpolate each color channel
  const r = Math.round(startColor[0] + ratio * (endColor[0] - startColor[0]));
  const g = Math.round(startColor[1] + ratio * (endColor[1] - startColor[1]));
  const b = Math.round(startColor[2] + ratio * (endColor[2] - startColor[2]));

  return `rgb(${r}, ${g}, ${b})`;
}

// Create a bar chart with the location data
function populateBarChart(data, container) {

  // Find the min and max temperature values for color scaling
  const temps = data.map(({ temperature }) => temperature);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);

  // Create the chart container
  const chartContainer = document.createElement('div');
  chartContainer.classList.add('chart-container');
  container.appendChild(chartContainer);

  // Create bars for the temperature data
  data.forEach(({ month, temperature }) => {
    if (temperature) {
      const barWrapper = document.createElement('div');
      barWrapper.classList.add('bar-wrapper');

      const bar = document.createElement('div');
      bar.classList.add('bar');
      bar.style.height = `${temperature * 10}px`; // Scale the bar height

      // Set the bar color based on temperature
      bar.style.backgroundColor = interpolateColor(temperature, minTemp, maxTemp);

      const tempLabel = document.createElement('span');
      tempLabel.classList.add('bar-label');
      tempLabel.textContent = `${temperature}°`; // Add temperature label

      const monthLabel = document.createElement('div');
      monthLabel.classList.add('month-label');
      monthLabel.textContent = month; // Add month label

      // Assemble bar and labels
      barWrapper.appendChild(bar);
      barWrapper.appendChild(tempLabel);
      barWrapper.appendChild(monthLabel);
      chartContainer.appendChild(barWrapper);
    }
  });
}