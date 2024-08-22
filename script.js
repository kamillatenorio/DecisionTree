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

        // Calculate initial entropy of the entire dataset
        const initialEntropy = calculateInitialEntropy(dataset);

        // Generate the decision tree simulations
        createDecisionTreeSimulation('Smile', dataset, imageSources, initialEntropy);
        createDecisionTreeSimulation('X-eyes', dataset, imageSources, initialEntropy);
        createDecisionTreeSimulation('Blink', dataset, imageSources, initialEntropy);
    }
});

// Function to calculate entropy
function calculateEntropy(biteCount, notBiteCount) {
    const total = biteCount + notBiteCount;
    const pBite = biteCount / total;
    const pNotBite = notBiteCount / total;

    // Handle cases where pBite or pNotBite are 0 to avoid log2(0)
    const entropyBite = pBite === 0 ? 0 : -pBite * Math.log2(pBite);
    const entropyNotBite = pNotBite === 0 ? 0 : -pNotBite * Math.log2(pNotBite);

    return entropyBite + entropyNotBite;
}

// Function to calculate weighted entropy for the entire tree
function calculateTreeEntropy(branchEntropies, branchSizes) {
    const totalSize = branchSizes.reduce((sum, size) => sum + size, 0);
    const weightedEntropy = branchEntropies.reduce((sum, entropy, index) => {
        return sum + (entropy * branchSizes[index]) / totalSize;
    }, 0);
    return weightedEntropy;
}

// Function to calculate the initial entropy of the entire dataset
function calculateInitialEntropy(dataset) {
    let biteCount = 0;
    let notBiteCount = 0;

    dataset.forEach(row => {
        if (row[3] === 1) {
            biteCount++;
        } else {
            notBiteCount++;
        }
    });

    return calculateEntropy(biteCount, notBiteCount);
}

function createDecisionTreeSimulation(feature, dataset, imageSources, initialEntropy) {
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

    let branchEntropies = [];
    let branchSizes = [];

    uniqueValues.forEach(value => {
        const branchContainer = document.createElement('div');
        branchContainer.className = 'branch';

        const arrow = document.createElement('div');
        arrow.className = 'arrow';

        const imagesContainer = document.createElement('div');
        imagesContainer.className = 'images-container';

        let biteCount = 0;
        let notBiteCount = 0;

        dataset.forEach((row, index) => {
            if (row[featureIndex] === value) {
                const img = document.createElement('img');
                img.src = imageSources[index];
                imagesContainer.appendChild(img);

                if (row[3] === 1) {
                    biteCount++;
                } else {
                    notBiteCount++;
                }
            }
        });

        const totalCount = biteCount + notBiteCount;
        const entropy = calculateEntropy(biteCount, notBiteCount);

        branchEntropies.push(entropy);
        branchSizes.push(totalCount);

        const biteStats = document.createElement('div');
        biteStats.className = 'bite-stats';
        biteStats.textContent = `${biteCount}/${totalCount} bites`;

        const entropyDisplay = document.createElement('div');
        entropyDisplay.className = 'entropy';
        entropyDisplay.textContent = `Entropy: ${entropy.toFixed(2)}`;

        branchContainer.appendChild(arrow);
        branchContainer.appendChild(imagesContainer);
        branchContainer.appendChild(biteStats);
        branchContainer.appendChild(entropyDisplay);

        arrowContainer.appendChild(branchContainer);
    });

    treeContainer.appendChild(arrowContainer);

    // Calculate and display the overall tree entropy
    const treeEntropy = calculateTreeEntropy(branchEntropies, branchSizes);
    const informationGain = initialEntropy - treeEntropy;

    const treeEntropyDisplay = document.createElement('div');
    treeEntropyDisplay.className = 'tree-entropy';
    treeEntropyDisplay.style.fontWeight = 'bold';
    treeEntropyDisplay.style.marginTop = '20px';
    treeEntropyDisplay.textContent = `Tree Entropy: ${treeEntropy.toFixed(2)}`;

    const informationGainDisplay = document.createElement('div');
    informationGainDisplay.className = 'information-gain';
    informationGainDisplay.style.fontWeight = 'bold';
    informationGainDisplay.style.marginTop = '10px';
    informationGainDisplay.textContent = `Information Gain: ${informationGain.toFixed(2)}`;

    treeContainer.appendChild(treeEntropyDisplay);
    treeContainer.appendChild(informationGainDisplay);

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
