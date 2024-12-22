import { drawStar, createStationBarChart, drawLocomotives, drawConnections, drawStations } from './utils.js';


const config = {
    type: Phaser.AUTO,
    width: 1250,
    height: 600,
    backgroundColor: '#87CEEB',
    parent: 'game-container',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
};

const game = new Phaser.Game(config);

function preload() {
    // Load the map image
    this.load.image('guinea-map', 'images/guinea-map.jpg');
}

function create() {


    //DEBUG

    this.input.on('pointerdown', (pointer) => {
        const x = pointer.worldX; // X coordinate in the world space
        const y = pointer.worldY; // Y coordinate in the world space
        console.log(`Clicked at: x = ${x}, y = ${y}`);
    });


    // ------- SETTING MAP, ZOOM, DRAGGIN OF THE MAP -----------
    // Add the map image
    const map = this.add.image(0, 0, 'guinea-map').setOrigin(0, 0);

    // Scale the map to fit the canvas size
    map.setDisplaySize(config.width, config.height);

    // Set camera bounds to the size of the map
    this.cameras.main.setBounds(0, 0, map.width, map.height);

    // Calculate the minimum zoom level
    const minZoomX = config.width / map.width;
    const minZoomY = config.height / map.height;
    const minZoom = Math.max(minZoomX, minZoomY); // Ensure no black bars appear

    // Enable mouse wheel zoom
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
        this.cameras.main.zoom -= deltaY * 0.001;

        // Clamp zoom to prevent zooming out too far
        this.cameras.main.zoom = Phaser.Math.Clamp(this.cameras.main.zoom, minZoom, 2);
    });

    // Variables for dragging
    let isDragging = false;
    let dragStartX, dragStartY;

    // Pointer down event
    this.input.on('pointerdown', (pointer) => {
        isDragging = true;
        dragStartX = pointer.x + this.cameras.main.scrollX;
        dragStartY = pointer.y + this.cameras.main.scrollY;
    });

    // Pointer move event
    this.input.on('pointermove', (pointer) => {
        if (isDragging) {
            this.cameras.main.scrollX = dragStartX - pointer.x;
            this.cameras.main.scrollY = dragStartY - pointer.y;
        }
    });

    // Pointer up event
    this.input.on('pointerup', () => {
        isDragging = false;
    });
    // ------- END OF SETTING MAP, ZOOM, DRAGGIN OF THE MAP -----------


    //Structures to store players, stations, locomotives

    const players = [
        {
            id: 1,
            name: "LocomotivePlayer1",
            type: "locomotive", // Type of player: "locomotive" or "wagon"
            locomotives: [1, 2, 3], // IDs of locomotives owned 
            wagons: [], // Empty for locomotive players
        },
        {
            id: 2,
            name: "LocomotivePlayer2",
            type: "locomotive",
            locomotives: [4, 5, 6],
            wagons: [],
        },
        {
            id: 3,
            name: "WagonPlayer1",
            type: "wagon",
            locomotives: [],
            wagons: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        },
        {
            id: 4,
            name: "WagonPlayer2",
            type: "wagon",
            locomotives: [],
            wagons: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        }
    ];


    const stations = [
        { id: 1, x: 446.5, y: 80.5, name: "14", connections: [2] },
        { id: 2, x: 713.5, y: 47, name: "13", connections: [1, 4] },
        { id: 3, x: 491.5, y: 448.5, name: "24", connections: [] },
        { id: 4, x: 813, y: 190.5, name: "2", connections: [2, 5, 6] },
        { id: 5, x: 1042.5, y: 214, name: "7", connections: [4] },
        { id: 6, x: 707, y: 276, name: "19", connections: [4, 7] },
        { id: 7, x: 651, y: 239, name: "16", connections: [6, 8] },
        { id: 8, x: 547.75, y: 285.5, name: "23", connections: [7, 9] },
        { id: 9, x: 649.5, y: 431.5, name: "25", connections: [8, 10] },
        { id: 10, x: 855.5, y: 572, name: "29", connections: [9] }
    ];

    const stationStates = {
        1: { locomotives: [1], wagons: [1, 2, 3, 20], players: [1, 3] },
        2: { locomotives: [4], wagons: [4, 5], players: [2, 3] },
        3: { locomotives: [], wagons: [], players: [] },
        4: { locomotives: [2, 5], wagons: [6, 7], players: [1, 2, 3] },
        5: { locomotives: [3], wagons: [8], players: [1, 4] },
        6: { locomotives: [6], wagons: [9, 10], players: [2, 4] },
        7: { locomotives: [], wagons: [11, 12, 13, 14, 15], players: [4] },
        8: { locomotives: [], wagons: [16, 17, 18, 19], players: [] },
        9: { locomotives: [], wagons: [], players: [] },
        10: { locomotives: [], wagons: [], players: [] }
    }



    // ------- Drawing stations and connections. Stations as stars (function)
    const stationGraphics = this.add.graphics(); // For drawing stations
    const connectionGraphics = this.add.graphics(); // For drawing connections

    const OFFSET = 15; // Offset for station positioning on the tracks

    // Draw connections
    drawConnections(connectionGraphics, stations);
    drawStations(stationGraphics, stations);



    // Draw locomotives and wagons
    const colorMap = {
        1: 0xff4500, // Red (Player 1 - Locomotives)
        2: 0x1e90ff, // Blue (Player 2 - Locomotives)
        3: 0x32cd32, // Lime Green (Player 3 - Wagons)
        4: 0xffff00  // Yellow (Player 4 - Wagons)
    };


    // Draw bar charts for wagons
    stations.forEach(station => {
        createStationBarChart(this, stationStates, station, colorMap, players);
    });

    // Draw locomotives
    drawLocomotives(this, stationStates, stations, players, colorMap);


}










function update() { }
