document.getElementById('collectDataBtn').addEventListener('click', function() {
    const button = document.getElementById('collectDataBtn');
    const phaseTitle = document.getElementById('phaseTitle');
    const message = document.getElementById('message');
    const datasetContainer = document.getElementById('datasetContainer');
    const decisionTreeContainer = document.getElementById('decisionTreeContainer');

    if (button.textContent === "Collect Data") {
        const tableBody = document.getElementById('tableBody');

        // Clear any existing rows
        tableBody.innerHTML = '';

        // Create table rows with images aligned to the left
        dataset.forEach((row, index) => {
            const tr = document.createElement('tr');

            const imgCell = document.createElement('td');
            const img = document.createElement('img');
            img.src = `${imageSources[index]}`;
            imgCell.appendChild(img);
            tr.appendChild(imgCell);

            row.forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            });

            tableBody.appendChild(tr);
        });

        // Display the dataset container
        datasetContainer.style.display = 'block';

        // Change the button text to "Let's start"
        button.textContent = "Let's start";

        // Update the message text
        message.innerHTML = "Now that we have the dataset, let's use the decision tree supervised learning algorithm to create a model to predict if a monkey bites or not.";
    } else if (button.textContent === "Let's start") {
        // Change to the Training Phase
        phaseTitle.textContent = "Training Phase";

        // Update the message text to the training phase instructions
        message.innerHTML = "1. The first step in the learning process is to decide which feature to use at the root node. That is the first node at the very top of the decision tree. But how do you choose what feature to split on at each node? The decision tree learning algorithm has to choose between the features Smile, X-eyes, and Blink. Which of these features results in the greatest purity of the labels on the left and right sub-branches?";

        // Clear the dataset display
        datasetContainer.style.display = 'none'; // Hide dataset
        decisionTreeContainer.innerHTML = ''; // Clear any previous trees

        // Generate the decision tree simulations
        createDecisionTreeSimulation('Smile', dataset, imageSources);
        createDecisionTreeSimulation('X-eyes', dataset, imageSources);
        createDecisionTreeSimulation('Blink', dataset, imageSources);
    }
});

function createDecisionTreeSimulation(feature, dataset, imageSources) {
    const featureIndex = { 'Smile': 0, 'X-eyes': 1, 'Blink': 2 }[feature];
    const uniqueValues = [...new Set(dataset.map(row => row[featureIndex]))];
    const decisionTreeContainer = document.getElementById('decisionTreeContainer');

    // Create the tree container
    const treeContainer = document.createElement('div');
    treeContainer.className = 'tree-node';

    // Create the root node
    const rootNode = document.createElement('div');
    rootNode.className = 'ellipse';
    rootNode.textContent = feature;
    treeContainer.appendChild(rootNode);

    const arrowContainer = document.createElement('div');
    arrowContainer.className = 'arrow-container';

    uniqueValues.forEach(value => {
        const branchContainer = document.createElement('div');
        branchContainer.className = 'branch';

        const arrow = document.createElement('div');
        arrow.className = 'arrow';

        const imagesContainer = document.createElement('div');
        imagesContainer.className = 'images-container';

        let totalCount = 0;
        let biteCount = 0;

        dataset.forEach((row, index) => {
            if (row[featureIndex] === value) {
                const img = document.createElement('img');
                img.src = imageSources[index];
                imagesContainer.appendChild(img);

                totalCount++;
                if (row[3] === 1) {
                    biteCount++;
                }
            }
        });

        const biteStats = document.createElement('div');
        biteStats.className = 'bite-stats';
        biteStats.textContent = `${biteCount}/${totalCount} bites`;

        branchContainer.appendChild(arrow);
        branchContainer.appendChild(imagesContainer);
        branchContainer.appendChild(biteStats);

        arrowContainer.appendChild(branchContainer);
    });

    treeContainer.appendChild(arrowContainer);
    decisionTreeContainer.appendChild(treeContainer);
}

// Global variables to make them accessible in both phases
const dataset = [
    ["Smile", "No X-eyes", "Blink", 1],
    ["Smile", "X-eyes", "No Blink", 1],
    ["Smile", "No X-eyes", "No Blink", 1],
    ["Not Smile", "X-eyes", "No Blink", 1],
    ["Not Smile", "No X-eyes", "No Blink", 0],
    ["Not Smile", "No X-eyes", "Blink", 0],
    ["Not Smile", "No X-eyes", "Blink", 0],
    ["Not Smile", "No X-eyes", "No Blink", 0],
    ["Not Smile", "No X-eyes", "Blink", 0],
    ["Not Smile", "No X-eyes", "No Blink", 0],
    ["Not Smile", "No X-eyes", "No Blink", 0],
    ["Not Smile", "No X-eyes", "No Blink", 0],
];

const imageSources = [
    '1.png', // Image 1
    '2.png', // Image 2
    '3.png', // Image 3
    '4.png', // Image 4
    '5.png', // Image 5
    '6.png', // Image 6
    '7.png', // Image 7
    '8.png', // Image 8
    '9.png', // Image 9
    '10.png', // Image 10
    '11.png', // Image 11
    '12.png', // Image 12
];
