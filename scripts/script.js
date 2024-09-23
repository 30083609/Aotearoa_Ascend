let angle = 0; // Initial angle for the satellite’s orbit (starting position)
let animationFrameId; // ID for the animation frame (used to start/stop animation)
let isPaused = false; // Flag to track whether the simulation is paused
let totalDistance = 0; // Tracks the total distance traveled by the satellite
let halfwayPoint = 180; // Halfway point at 180 degrees (halfway around the Earth)
let acceleration = 0; // Acceleration value (calculated from force/mass)
let fullOrbitDistance = 0; // Distance corresponding to one complete orbit (full 360 degrees)

// Satellite Position
function updateSatellitePosition(acceleration, totalDistanceToTravel) {
    const satellite = document.getElementById('satellite');
    const currentDataDisplay = document.getElementById('currentData');
    const radius = 35; // Radius of the orbit in SVG units
    const cx = 50; // Center x of the orbit
    const cy = 50; // Center y of the orbit
    const radian = ((angle - 90) * Math.PI) / 180; // Adjust angle to start at 12 o'clock

    const x = cx + radius * Math.cos(radian) - 6; // Calculate the satellite’s x position
    const y = cy + radius * Math.sin(radian) - 6; // Calculate the satellite’s y position

    satellite.setAttribute('x', x);
    satellite.setAttribute('y', y);
    satellite.setAttribute('transform', `rotate(${angle} ${x + 6} ${y + 6})`); // Rotate satellite based on current angle

    // Time Calculations
    const timeInSeconds = angle * 10; // Simulated time in seconds (scales with the angle)
    const timeInMinutes = (timeInSeconds / 60).toFixed(2); // Convert time to minutes
    const timeInHours = (timeInMinutes / 60).toFixed(2); // Convert time to hours

    // Speed Calculations
    const speedInMetersPerSecond = acceleration * timeInSeconds;
    const speedInKilometersPerHour = (speedInMetersPerSecond * 3.6).toFixed(2);

    // Distance Calculation
    totalDistance += (speedInMetersPerSecond * 0.1) / 1000; // Increment distance (convert to kilometers)

    // Check if the satellite has reached halfway around the Earth (180 degrees)
    if (angle >= halfwayPoint && !isPaused) {
        stopSimulation();
        alert("Halfway around the Earth reached!"); // Alert when halfway is reached
        return;
    }

    // Check if the satellite has completed a full orbit (360 degrees)
    if (angle >= 360) {
        stopSimulation();
        alert("Full orbit completed! Simulation finished."); // Alert when a full orbit is completed
        return;
    }

    // Display the data
    currentDataDisplay.innerHTML = `
        Acceleration: ${acceleration.toFixed(2)} m/s²<br>
        Time: ${timeInSeconds.toFixed(2)} seconds | ${timeInMinutes} minutes | ${timeInHours} hours<br>
        Speed: ${speedInMetersPerSecond.toFixed(2)} m/s | ${speedInKilometersPerHour} km/h<br>
        Distance Traveled: ${totalDistance.toFixed(2)} km
    `;

    angle = (angle + 0.1) % 360; // Increment the angle smoothly for animation
    animationFrameId = requestAnimationFrame(() => updateSatellitePosition(acceleration, totalDistanceToTravel));
}

// Initiate Simulation
function startSimulation() {
    const mass = parseFloat(document.getElementById('mass').value);
    const force = parseFloat(document.getElementById('force').value);
    const distance = parseFloat(document.getElementById('distance').value);

    if (isNaN(mass) || isNaN(force) || isNaN(distance) || mass <= 0 || force <= 0 || distance <= 0) {
        alert("Please enter valid positive numbers for mass, force, and distance."); // Input validation
        return;
    }

    acceleration = force / mass; // Calculate acceleration (force/mass)
    fullOrbitDistance = distance; // Set the total distance to travel (full orbit distance)

    angle = 0;
    totalDistance = 0;
    isPaused = false;
    cancelAnimationFrame(animationFrameId); // Reset animation if already running

    document.getElementById('stopButton').style.display = 'inline';
    document.getElementById('resumeButton').style.display = 'none';
    document.getElementById('startSimulationButton').style.display = 'none';

    updateSatellitePosition(acceleration, distance);
}

// Stop Simulation
function stopSimulation() {
    cancelAnimationFrame(animationFrameId); // Stop the animation
    animationFrameId = null;

    document.getElementById('stopButton').style.display = 'none';
    document.getElementById('resumeButton').style.display = 'inline';
    document.getElementById('startSimulationButton').style.display = 'none';

    isPaused = true; // Set paused state
    displayResults(); // Display final results when stopped
}

// Resume Simulation
function resumeSimulation() {
    if (isPaused) {
        isPaused = false;
        document.getElementById('stopButton').style.display = 'inline';
        document.getElementById('resumeButton').style.display = 'none';
        updateSatellitePosition(acceleration, fullOrbitDistance); // Resume from the paused state
    }
}

// Display Results
function displayResults() {
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = `
        <strong>Simulation Results:</strong><br>
        Current Angle: ${angle.toFixed(2)} degrees<br>
        Total Distance Traveled: ${totalDistance.toFixed(2)} km
    `;
}

// Language Switcher Functions
// Function to switch to Māori
function switchToMaori() {
    const elements = document.querySelectorAll('[data-en]');
    elements.forEach(element => {
        element.textContent = element.getAttribute('data-mi');
    });
    // Toggle visibility of the flags
    document.getElementById("maori-flag").style.display = "none";
    document.getElementById("nz-flag").style.display = "inline";
}

// Function to switch to English
function switchToEnglish() {
    const elements = document.querySelectorAll('[data-en]');
    elements.forEach(element => {
        element.textContent = element.getAttribute('data-en');
    });
    // Toggle visibility of the flags
    document.getElementById("maori-flag").style.display = "inline";
    document.getElementById("nz-flag").style.display = "none";
}

