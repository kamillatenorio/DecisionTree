document.getElementById('collectDataBtn').addEventListener('click', function() {
    const button = document.getElementById('collectDataBtn');
    const phaseTitle = document.getElementById('phaseTitle');
    const message = document.getElementById('message');
    const datasetContainer = document.getElementById('datasetContainer');
    const decisionTreeContainer = document.getElementById('decisionTreeContainer');

    let informationGains = []; // Array to store information gains of all trees

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

        // Hide the button
        button.style.display = 'none';

        // Clear the dataset display
        datasetContainer.style.display = 'none'; // Hide dataset
        decisionTreeContainer.innerHTML = ''; // Clear any previous trees

        // Calculate initial entropy of the entire dataset
        const initialEntropy = calculateInitialEntropy(dataset);

        // Generate the decision tree simulations and store information gains
        informationGains.push(createDecisionTreeSimulation('Smile', dataset, imageSources, initialEntropy));
        informationGains.push(createDecisionTreeSimulation('X-eyes', dataset, imageSources, initialEntropy, ['No X-eyes', 'X-eyes']));
        informationGains.push(createDecisionTreeSimulation('Blink', dataset, imageSources, initialEntropy, ['No Blink', 'Blink']));

        // Determine the maximum information gain
        const maxInformationGain = Math.max(...informationGains);

        // Make each tree clickable and validate the selection
        const treeNodes = document.querySelectorAll('.tree-node');
        treeNodes.forEach((treeNode, index) => {
            treeNode.style.cursor = 'pointer'; // Make the cursor a pointer to indicate it's clickable

            treeNode.addEventListener('click', () => {
                if (informationGains[index] === maxInformationGain) {
                    // Hide all other rectangles except the selected one
                    treeNodes.forEach((node, nodeIndex) => {
                        if (nodeIndex !== index) {
                            node.style.display = 'none';
                        }
                    });

                    // Proceed to the next phase with the selected rectangle
                    message.innerHTML = "The second step is focusing just on the left part or sometimes called the left branch of the decision tree to decide what nodes to put over there. Since the left node is 100% one class, the mission now is to discover what should be the next feature on the right side.";

                    // Create the next set of trees for the second phase
                    decisionTreeContainer.innerHTML = ''; // Clear previous trees
                    createSecondStepTree('X-eyes', dataset, imageSources, true); // Generate tree with "X-eyes"
                    createSecondStepTree('Blink', dataset, imageSources, true);  // Generate tree with "Blink"
                } else {
                    alert("The decision tree learning algorithm should choose the feature that generates more information gain. Please try again.");
                }
            });
        });
    }
});

// Function to calculate entropy
function calculateEntropy(biteCount, notBiteCount) {
    const total = biteCount + notBiteCount;
    const pBite = biteCount / total;
    const pNotBite = notBiteCount / total;

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

// Function to calculate the information gain after a split
function calculateInformationGain(initialEntropy, branchEntropies, branchSizes) {
    const weightedEntropy = calculateTreeEntropy(branchEntropies, branchSizes);
    return initialEntropy - weightedEntropy;
}

// Function to create the first step decision tree
function createDecisionTreeSimulation(feature, dataset, imageSources, initialEntropy, customLabels = null) {
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

    uniqueValues.forEach((value, index) => {
        const branchContainer = document.createElement('div');
        branchContainer.className = 'branch';

        const arrowLabel = document.createElement('div');
        arrowLabel.className = 'arrow-label';
        // Use custom labels if provided, otherwise use the value directly
        arrowLabel.textContent = customLabels ? customLabels[index] : value;

        const line = document.createElement('div');
        line.className = 'line';
        line.style.transform = index === 0 ? 'rotate(45deg)' : 'rotate(-45deg)'; // Rotate the line for left and right

        const labelRect = document.createElement('div');
        labelRect.className = 'label-rect';
        labelRect.textContent = index === 0 ? 'Bite' : feature; // Adjust label for second step
        labelRect.style.border = '1px solid #000';
        labelRect.style.borderRadius = '5px';
        labelRect.style.padding = '5px';
        labelRect.style.margin = '10px 0';

        const imagesContainer = document.createElement('div');
        imagesContainer.className = 'images-container';

        let biteCount = 0;
        let totalCount = 0;

        dataset.forEach((row, rowIndex) => {
            if (row[featureIndex] === value) {
                const img = document.createElement('img');
                img.src = imageSources[rowIndex];
                imagesContainer.appendChild(img);

                if (row[3] === 1) {
                    biteCount++;
                }
                totalCount++;
            }
        });

        const entropy = calculateEntropy(biteCount, totalCount - biteCount);

        branchEntropies.push(entropy);
        branchSizes.push(totalCount);

        const biteStats = document.createElement('div');
        biteStats.className = 'bite-stats';
        biteStats.textContent = `${biteCount}/${totalCount} ${biteCount === 1 ? 'bite' : 'bites'}`;

        const entropyDisplay = document.createElement('div');
        entropyDisplay.className = 'entropy';
        entropyDisplay.textContent = `Entropy: ${entropy.toFixed(2)}`;

        branchContainer.appendChild(arrowLabel); // Add the label above the line
        branchContainer.appendChild(line); // Add the line between ellipse and rectangle
        branchContainer.appendChild(labelRect); // Add the labeled rectangle
        branchContainer.appendChild(imagesContainer);
        branchContainer.appendChild(biteStats); // Add the bite stats below the images
        branchContainer.appendChild(entropyDisplay);

        // Add Information Gain below the monkeys
        const informationGain = calculateInformationGain(initialEntropy, [entropy], [totalCount]);
        const informationGainDisplay = document.createElement('div');
        informationGainDisplay.className = 'information-gain';
        informationGainDisplay.style.marginTop = '5px';
        informationGainDisplay.textContent = `Information Gain: ${informationGain.toFixed(2)}`;
        branchContainer.appendChild(informationGainDisplay);

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
    informationGainDisplay.textContent = `Overall Information Gain: ${informationGain.toFixed(2)}`;

    treeContainer.appendChild(treeEntropyDisplay);
    treeContainer.appendChild(informationGainDisplay);

    decisionTreeContainer.appendChild(treeContainer);

    return informationGain; // Return the information gain for this tree
}

// Function to create the second-step trees with adjustable width
function createSecondStepTree(secondFeature, dataset, imageSources, isSecondStep = false) {
    const decisionTreeContainer = document.getElementById('decisionTreeContainer');

    const treeContainer = document.createElement('div');
    treeContainer.className = 'tree-node';

    // Adjust width if it's the second step
    if (isSecondStep) {
        treeContainer.style.width = '500px'; // Increase width for second step
    }

    // Root node: Smile
    const rootNode = document.createElement('div');
    rootNode.className = 'ellipse';
    rootNode.textContent = 'Smile';
    treeContainer.appendChild(rootNode);

    const arrowContainer = document.createElement('div');
    arrowContainer.className = 'arrow-container';

    // Left branch (Smile)
    const leftBranch = createBranch('Smile', 'Bites', dataset.filter(row => row[0] === 'Smile'), imageSources, true);
    arrowContainer.appendChild(leftBranch);

    // Right branch (Not Smile -> Second Feature)
    const rightBranchContainer = document.createElement('div');
    rightBranchContainer.className = 'branch';

    const rightLine = document.createElement('div');
    rightLine.className = 'line';
    rightLine.style.transform = 'rotate(-45deg)';

    const rightArrowLabel = document.createElement('div');
    rightArrowLabel.className = 'arrow-label';
    rightArrowLabel.textContent = 'Not Smile';

    const secondNode = document.createElement('div');
    secondNode.className = 'ellipse';
    secondNode.textContent = secondFeature;

    const secondArrowContainer = document.createElement('div');
    secondArrowContainer.className = 'arrow-container';

    // Second Feature branches
    const secondBranch1 = createBranch(`${secondFeature}`, `${secondFeature}`, dataset.filter(row => row[0] === 'Not Smile' && row[secondFeatureIndex(secondFeature)] === `${secondFeature}`), imageSources, true);
    const secondBranch2 = createBranch(`No ${secondFeature}`, `No ${secondFeature}`, dataset.filter(row => row[0] === 'Not Smile' && row[secondFeatureIndex(secondFeature)] !== `${secondFeature}`), imageSources);

    secondArrowContainer.appendChild(secondBranch1);
    secondArrowContainer.appendChild(secondBranch2);

    rightBranchContainer.appendChild(rightArrowLabel);
    rightBranchContainer.appendChild(rightLine);
    rightBranchContainer.appendChild(secondNode);
    rightBranchContainer.appendChild(secondArrowContainer);

    arrowContainer.appendChild(rightBranchContainer);

    treeContainer.appendChild(arrowContainer);

    // Calculate overall information gain for this split
    const initialEntropy = calculateInitialEntropy(dataset.filter(row => row[0] === 'Not Smile'));
    const overallInformationGain = calculateInformationGain(
        initialEntropy,
        [secondBranch1.entropy, secondBranch2.entropy],
        [secondBranch1.totalCount, secondBranch2.totalCount]
    );

    const overallInfoGainDisplay = document.createElement('div');
    overallInfoGainDisplay.className = 'information-gain';
    overallInfoGainDisplay.style.fontWeight = 'bold';
    overallInfoGainDisplay.style.marginTop = '10px';
    overallInfoGainDisplay.textContent = `Overall Information Gain: ${overallInformationGain.toFixed(2)}`;

    // Add click functionality
    treeContainer.style.cursor = 'pointer'; // Indicate it's clickable
    treeContainer.addEventListener('click', function() {
        const allGains = document.querySelectorAll('.information-gain');
        let maxGain = -Infinity;
        allGains.forEach(gain => {
            const gainValue = parseFloat(gain.textContent.split(': ')[1]);
            if (gainValue > maxGain) maxGain = gainValue;
        });

        if (overallInformationGain.toFixed(2) == maxGain.toFixed(2)) {
            // Hide all other rectangles except the selected one
            const allTrees = document.querySelectorAll('.tree-node');
            allTrees.forEach(tree => {
                if (tree !== treeContainer) {
                    tree.style.display = 'none';
                }
            });

            alert("Correct! Proceeding with the selected tree.");
        } else {
            alert("Incorrect. Try selecting the tree with the highest information gain.");
        }
    });

    treeContainer.appendChild(overallInfoGainDisplay);

    decisionTreeContainer.appendChild(treeContainer);
}

// Helper function to get the index of a feature
function secondFeatureIndex(feature) {
    return { 'X-eyes': 1, 'Blink': 2 }[feature];
}

// Function to create a branch with a label, associated images, and bite stats
function createBranch(label, branchLabel, filteredDataset, imageSources, isLeft = false) {
    const branchContainer = document.createElement('div');
    branchContainer.className = 'branch';

    const line = document.createElement('div');
    line.className = 'line';
    line.style.transform = isLeft ? 'rotate(45deg)' : 'rotate(-45deg)'; // Rotate the line only for the left branch

    const arrowLabel = document.createElement('div');
    arrowLabel.className = 'arrow-label';
    arrowLabel.textContent = label;

    const labelRect = document.createElement('div');
    labelRect.className = 'label-rect';
    labelRect.textContent = branchLabel;
    labelRect.style.border = '1px solid #000';
    labelRect.style.borderRadius = '5px';
    labelRect.style.padding = '5px';
    labelRect.style.margin = '10px 0';

    const imagesContainer = document.createElement('div');
    imagesContainer.className = 'images-container';

    let biteCount = 0;
    let totalCount = 0;

    filteredDataset.forEach((row, rowIndex) => {
        const img = document.createElement('img');
        img.src = imageSources[dataset.indexOf(row)];
        imagesContainer.appendChild(img);

        if (row[3] === 1) {
            biteCount++;
        }
        totalCount++;
    });

    const entropy = calculateEntropy(biteCount, totalCount - biteCount);

    const biteStats = document.createElement('div');
    biteStats.className = 'bite-stats';
    biteStats.textContent = `${biteCount}/${totalCount} ${biteCount === 1 ? 'bite' : 'bites'}`;

    const entropyDisplay = document.createElement('div');
    entropyDisplay.className = 'entropy';
    entropyDisplay.textContent = `Entropy: ${entropy.toFixed(2)}`;

    branchContainer.appendChild(arrowLabel);
    branchContainer.appendChild(line);
    branchContainer.appendChild(labelRect);
    branchContainer.appendChild(imagesContainer);
    branchContainer.appendChild(biteStats); // Add bite stats below images
    branchContainer.appendChild(entropyDisplay); // Add entropy below images

    // Store the entropy and counts in the branch container
    branchContainer.entropy = entropy;
    branchContainer.totalCount = totalCount;

    return branchContainer;
}

// Updated dataset as provided
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
