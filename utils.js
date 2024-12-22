// Star drawing function 
export function drawStar(graphics, x, y, radius, color, alpha = 0.1, lineWidth = 2) {
    graphics.lineStyle(lineWidth, color, alpha);
    graphics.fillStyle(color, alpha);

    const numPoints = 5;
    const outerRadius = radius;
    const innerRadius = radius / 2;

    graphics.beginPath();
    // Starting angle at -Math.PI / 2 to ensure the top point is exactly at 0 degrees
    for (let i = 0; i < numPoints * 2; i++) {
        const angle = -Math.PI / 2 + (i * Math.PI) / numPoints;
        const dist = i % 2 === 0 ? outerRadius : innerRadius;
        const px = x + Math.cos(angle) * dist;
        const py = y + Math.sin(angle) * dist;
        if (i === 0) {
            graphics.moveTo(px, py); // Start path at the first point
        } else {
            graphics.lineTo(px, py); // Draw lines to subsequent points
        }
    }
    graphics.closePath();
    graphics.fillPath();
    graphics.strokePath();
}

export function drawConnections(graphics, stations, offset = 15) {
    stations.forEach(station => {
        station.connections.forEach(connectedStationId => {
            const connectedStation = stations.find(s => s.id === connectedStationId);

            if (connectedStation) {
                const stationA = { x: station.x, y: station.y };
                const stationB = { x: connectedStation.x, y: connectedStation.y };

                const angle = Phaser.Math.Angle.Between(stationA.x, stationA.y, stationB.x, stationB.y);

                const startX = stationA.x + Math.cos(angle) * offset;
                const startY = stationA.y + Math.sin(angle) * offset;
                const endX = stationB.x - Math.cos(angle) * offset;
                const endY = stationB.y - Math.sin(angle) * offset;

                graphics.lineStyle(4, 0xffff00, 0.4);
                graphics.beginPath();
                graphics.moveTo(startX, startY);
                graphics.lineTo(endX, endY);
                graphics.strokePath();
            }
        });
    });
}

export function drawStations(graphics, stations, radius = 15, color = 0x4A3267) {
    stations.forEach(station => {
        drawStar(graphics, station.x, station.y, radius, color, 0.5);

        // Optionally add station names
        // graphics.scene.add.text(station.x + 20, station.y - 10, station.name, {
        //     fontSize: '12px',
        //     color: '#000000'
        // });
    });
}



export function createStationBarChart(scene, stationStates, station, colorMap, players) {
    const barChartGraphics = scene.add.graphics();
    const stationX = station.x;
    const stationY = station.y - 30; // Position above the station

    const barWidth = 20; // Width of each bar
    const spacing = 20; // Space between each bar
    const baseHeight = 5; // Base height per wagon for scaling
    const maxWagonHeight = 100; // Cap height for visual clarity

    // Get wagons for this station
    const wagons = stationStates[station.id]?.wagons || [];

    // Count wagons by player
    const wagonCounts = wagons.reduce((acc, wagonId) => {
        // Find which player owns the wagon
        const player = players.find(p => p.wagons.includes(wagonId));
        if (player) {
            acc[player.id] = (acc[player.id] || 0) + 1; // Increment count for that player
        }
        return acc;
    }, {});

    // Center the bar chart above the station
    let offsetX = stationX - ((Object.keys(wagonCounts).length - 1) * spacing) / 2;

    // Draw bars for each player's wagons
    Object.entries(wagonCounts).forEach(([playerId, count]) => {
        const color = colorMap[playerId] || 0xffffff; // Get color from colorMap or default to white
        const barHeight = Math.min(count * baseHeight, maxWagonHeight);

        // Draw bar
        barChartGraphics.fillStyle(color, 1);
        barChartGraphics.fillRect(offsetX, stationY - barHeight, barWidth, barHeight);

        // Add count text inside the bar
        scene.add.text(offsetX + barWidth / 2, stationY - barHeight / 2, count, {
            font: '12px Arial',
            fill: '#FFFFFF',
            align: 'center'
        }).setOrigin(0.5);

        offsetX += spacing; // Move to the next bar
    });

    return barChartGraphics;
}
export function drawLocomotives(scene, stationStates, stations, players, colorMap) {
    Object.entries(stationStates).forEach(([stationId, state]) => {
        const locomotives = state.locomotives;
        const station = stations.find(s => s.id === parseInt(stationId));

        locomotives.forEach(locomotiveId => {
            const player = players.find(p => p.locomotives.includes(locomotiveId));
            const color = colorMap[player.id] || 0x000000;

            // Draw locomotive as a rectangle
            scene.add.rectangle(
                station.x + locomotiveId * 10 - 20, // Slight offset for multiple locomotives
                station.y + 10, // Position below the station
                20, // Width
                10, // Height
                color // Color from colorMap
            ).setOrigin(0.5);

            // Add locomotive ID text
            scene.add.text(
                station.x + locomotiveId * 10 - 20,
                station.y + 20,
                `L${locomotiveId}`,
                { fontSize: '10px', fill: '#FFFFFF' }
            ).setOrigin(0.5);
        });
    });
}


