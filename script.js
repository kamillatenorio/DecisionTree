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

        datasetContainer.parentNode.insertBefore(button, datasetContainer.nextSibling);

        // Change the button text to "Train the Model"
    button.textContent = "Train the Model";

        // Update the message text
    message.innerHTML = `Now that we have the dataset, let's use the decision tree supervised learning algorithm to create a model to predict if a monkey bites or not.`;
    } else if (button.textContent === "Train the Model") {
        // Change the title to "Training Phase - Step I"
    phaseTitle.textContent = "Training Phase – Iteration I";

        // Update the message text to the training phase instructions
    message.innerHTML = `Now it's time to provide our labeled data to the decision tree algorithm. 
    The decision tree algorithm observes the inputs and outputs and learns a model that can map from input to output 
    (i.e., predict new labels for new inputs). <br> <br> How does it learn a model that maps from input to output?
    Let's see... 
    <br> <br> 
    The first step of the decision tree algorithm in learning the model is to decide which feature (i.e., "Smile", "X-Eyes" 
    and "Wink") to use at the top of the tree (root node). The algorithm selects the feature that splits the data into groups 
    that are as homogeneous as possible. By homogeneous, we mean that the group contains as much of only one type of label as possible (either "bite" or 
    "not bite"). 
    <br></br>
    <span style="color: #574092; font-family: 'Fira Sans'; font-weight: 900; font-size: 18px">
    ! Task: Analyze the following three decision trees and select the one the algorithm would choose, i.e., the one with the feature that creates the purest groups.  
    </span> <br></br>
    <span style="color: rgb(98, 126, 110); font-family: 'Fira Sans'; font-weight: 900; font-style: italic;">
    <strong>Tip: Observe the groups formed by the features. The greatest purity is achieved when the proportion of biting monkeys on the left is as large as possible and as small as possible on the right.</strong>
    </span></br>`;
        // Hide the button
        button.style.display = 'none';

        // Clear the dataset display
        datasetContainer.style.display = 'none'; // Hide dataset
        decisionTreeContainer.innerHTML = ''; // Clear any previous trees

        // Calculate initial entropy of the entire dataset
        const initialEntropy = calculateInitialEntropy(dataset);

        // Generate the decision tree simulations and store information gains
        informationGains.push(createDecisionTreeSimulation('Lächeln', dataset, imageSources, initialEntropy, null, false)); // No label rectangles in Step I
        informationGains.push(createDecisionTreeSimulation('X-Augen', dataset, imageSources, initialEntropy, ['Keine X-Augen', 'X-Augen'], false));
        informationGains.push(createDecisionTreeSimulation('Blinzeln', dataset, imageSources, initialEntropy, null, false));

        // Determine the maximum information gain
        const maxInformationGain = Math.max(...informationGains);

        // Make each tree clickable and validate the selection
        const treeNodes = document.querySelectorAll('.tree-node');
        treeNodes.forEach((treeNode, index) => {
            treeNode.style.cursor = 'pointer'; // Make the cursor a pointer to indicate it's clickable

            treeNode.addEventListener('click', () => {
                if (informationGains[index] === maxInformationGain) {
                    // Change the title to "Training Phase - Step II"
                    phaseTitle.textContent = "Training Phase – Iteration II";

                    // Hide all other rectangles except the selected one
                    treeNodes.forEach((node, nodeIndex) => {
                        if (nodeIndex !== index) {
                            node.style.display = 'none';
                        }
                    });

                    // Proceed to the next phase with the selected rectangle
                    message.innerHTML = `After iteration I, the task is to select the next remaining feature ("X-Eyes" or "Wink") that creates the most homogeneous groups.
                     <br><br>  Which of the following features does the decision tree learning algorithm choose to create the most homogeneous groups? Select a feature. 
                    <br><br>
                    <span style="color: #574092; font-family: 'Fira Sans'; font-weight: 900; font-size: 18px;">
                        ! Task: Analyze the following 2 decision trees and select the one the algorithm would choose.
                     </span></br><br>
                    <span style="color: rgb(98, 126, 110); font-family: 'Fira Sans'; font-weight: 900; font-style: italic;">
                    Tip: Observe the groups formed by the features. The greatest purity is achieved when the proportion of biting monkeys on the left is as large as possible and as small as possible on the right.
                     </span></br>
                    `;

                    // Create the next set of trees for the second phase
                    decisionTreeContainer.innerHTML = ''; // Clear previous trees
                    createSecondStepTree('X-Augen', dataset, imageSources, true, false); // Generate tree with "X-eyes" (no rectangles above monkeys)
                    createSecondStepTree('Blinzeln', dataset, imageSources, true, false);  // Generate tree with "Blink" (no rectangles above monkeys)

                    // Add event listener for the correct tree in Step II
                    handleStepII();
                } else {
                    openModal("Tip: Observe the groups formed by the features. The greatest purity is achieved when the proportion of biting monkeys on the left is as large as possible and as small as possible on the right. Please try again.");
                }
            });
        });
    }
});

function handleStepII() {
    const treeNodes = document.querySelectorAll('.tree-node');

    // Assuming the first rectangle corresponds to index 0, and the second rectangle corresponds to index 1
    treeNodes.forEach((treeNode, index) => {
        treeNode.addEventListener('click', () => {
            if (index === 0) {
                // User clicked the first rectangle, proceed to "End of Training Phase"
                document.getElementById('phaseTitle').textContent = "End of Training Phase";

                // Hide all other rectangles except the selected one
                treeNodes.forEach(node => {
                    if (node !== treeNode) {
                        node.style.display = 'none';
                    }
                });

                // Update the message
                document.getElementById('message').textContent = "Congratulations! Now we have a trained model that we can use to predict whether a monkey will bite or not. But first, let's use the model to see if it predicts correctly.";

                // Clear images, entropy, information gain, and bite stats from the final tree and add proper rectangles
                clearFinalTreeAndAddLabels(treeNode);

                // Add the "Evaluate your model" button below the tree
                addEvaluateButton();
            } else if (index === 1) {
                // User clicked the second rectangle, show alert
                    openModal("Tipp: Beobachten Sie die Gruppen, die durch die Merkmale gebildet werden. Eine möglichst große Homogenität ist gegeben, wenn der Anteil der beißenden Affen links möglichst groß und rechts möglichst klein ist. Bitte versuchen Sie es erneut.");
            }
        });
    });
}

// Function to clear images, entropy, information gain, and bite stats from the final tree and add proper rectangles
function clearFinalTreeAndAddLabels(treeNode) {
    // Remove all image containers
    const imageContainers = treeNode.querySelectorAll('.images-container');
    imageContainers.forEach(container => container.remove());

    // Remove all entropy, information gain, and bite stats displays
    const extraDisplays = treeNode.querySelectorAll('.entropy, .information-gain, .tree-entropy, .bite-stats');
    extraDisplays.forEach(display => display.remove());

    // Add specific rectangles below the correct arrows
    const branchContainers = treeNode.querySelectorAll('.branch');

    // Ensure only one rectangle is added below each arrow
    if (branchContainers.length > 0) {
        // Remove any existing rectangles below the "Lächeln" arrow
        const existingRects = branchContainers[0].querySelectorAll('.label-rect');
        existingRects.forEach(rect => rect.remove());

        // Add "Bites" rectangle below the "Lächeln" arrow
        const biteLabel = document.createElement('div');
        biteLabel.className = 'label-rect';
        biteLabel.textContent = 'Bisse';
        branchContainers[0].appendChild(biteLabel);
    }

    // "X-eyes" branch (left branch of "Not Lächeln")
    if (branchContainers[1].querySelector('.branch')) {
        const leftBranch = branchContainers[1].querySelector('.branch');
        const leftLabel = document.createElement('div');
        leftLabel.className = 'label-rect';
        leftLabel.textContent = 'Bisse';
        leftBranch.appendChild(leftLabel);
    }

    // "No X-eyes" branch (right branch of "Not Lächeln")
    if (branchContainers[1].querySelectorAll('.branch')[1]) {
        const rightBranch = branchContainers[1].querySelectorAll('.branch')[1];
        const rightLabel = document.createElement('div');
        rightLabel.className = 'label-rect';
        rightLabel.textContent = 'Nicht beißen';
        rightBranch.appendChild(rightLabel);
    }

    // Make the final tree unclickable
    treeNode.style.cursor = 'default';
    treeNode.replaceWith(treeNode.cloneNode(true)); // Remove event listeners by cloning the node
}
 
// Function to add "Evaluate your model" button below the final tree
function addEvaluateButton() {
    const decisionTreeContainer = document.getElementById('decisionTreeContainer');

    const evaluateButton = document.createElement('button');
    evaluateButton.textContent = "Use your model";
    evaluateButton.id = "evaluateButton";
    evaluateButton.style.marginTop = "20px";
    evaluateButton.style.padding = "10px 20px";
    evaluateButton.style.fontSize = "16px";
    evaluateButton.style.display = "block";
    evaluateButton.style.margin = "20px auto";
    evaluateButton.style.fontFamily = "Fira Sans";
    evaluateButton.style.color = "white";
    evaluateButton.style.backgroundColor = "rgb(98, 126, 110)";
    evaluateButton.style.border = "none";
    evaluateButton.style.borderRadius = "20px";
    evaluateButton.style.cursor = "pointer";
    evaluateButton.style.boxShadow = "0 8px 12px rgba(17, 17, 17, 0.2)";


    decisionTreeContainer.appendChild(evaluateButton);

    // Add event listener to the button
    evaluateButton.addEventListener('click', () => {
        // Redirect to game1.html when the button is clicked
        window.location.href = 'game1.html';
    });
}


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
function createDecisionTreeSimulation(feature, dataset, imageSources, initialEntropy, customLabels = null, includeLabelRect = true) {
    const featureIndex = { 'Lächeln': 0, 'X-Augen': 1, 'Blinzeln': 2 }[feature];
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
        biteStats.textContent = `${biteCount}/${totalCount} ${biteCount === 1 ? 'Biss' : 'Bisse'}`;

        const entropyDisplay = document.createElement('div');
        entropyDisplay.className = 'entropy';
        entropyDisplay.textContent = ` `;

        branchContainer.appendChild(arrowLabel); // Add the label above the line
        branchContainer.appendChild(line); // Add the line between ellipse and images container

        if (includeLabelRect) {
            const labelRect = document.createElement('div');
            labelRect.className = 'label-rect';
            labelRect.textContent = index === 0 ? 'Bite' : feature; // Adjust label for second step
            labelRect.style.border = '1px solid #000';
            labelRect.style.borderRadius = '5px';
            labelRect.style.padding = '5px';
            labelRect.style.margin = '10px 0';
            branchContainer.appendChild(labelRect); // Add the labeled rectangle
        }

        branchContainer.appendChild(imagesContainer);
        branchContainer.appendChild(biteStats); // Add the bite stats below the images
        branchContainer.appendChild(entropyDisplay);

        // Add Information Gain below the monkeys
        const informationGain = calculateInformationGain(initialEntropy, [entropy], [totalCount]);
        const informationGainDisplay = document.createElement('div');
        informationGainDisplay.className = 'information-gain';
        informationGainDisplay.style.marginTop = '5px';
        informationGainDisplay.textContent = ``;
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
    treeEntropyDisplay.textContent = ``;

    const informationGainDisplay = document.createElement('div');
    informationGainDisplay.className = 'information-gain';
    informationGainDisplay.style.fontWeight = 'bold';
    informationGainDisplay.style.marginTop = '10px';
    informationGainDisplay.textContent = `  `;

    treeContainer.appendChild(treeEntropyDisplay);
    treeContainer.appendChild(informationGainDisplay);

    decisionTreeContainer.appendChild(treeContainer);

    return informationGain; // Return the information gain for this tree
}

// Function to create the second-step trees with adjustable width
function createSecondStepTree(secondFeature, dataset, imageSources, isSecondStep = false, includeLabelRect = true) {
    const decisionTreeContainer = document.getElementById('decisionTreeContainer');

    const treeContainer = document.createElement('div');
    treeContainer.className = 'tree-node';

    // Adjust width if it's the second step
    if (isSecondStep) {
        treeContainer.style.width = '600px'; // Increase width for second step
    }

    // Root node: Lächeln
    const rootNode = document.createElement('div');
    rootNode.className = 'ellipse';
    rootNode.textContent = 'Lächeln';
    treeContainer.appendChild(rootNode);

    const arrowContainer = document.createElement('div');
    arrowContainer.className = 'arrow-container';

    // Helper function to get the index of a feature
    function secondFeatureIndex(feature) {
        return { 'X-Augen': 1, 'Blinzeln': 2 }[feature];
    }

    // Left branch (Smile)
    const leftBranchData = dataset.map((row, index) => ({ row, index })).filter(item => item.row[0] === 'Smile');
    const leftBranch = createBranch('Smile', 'Bite', leftBranchData, imageSources, true);
    arrowContainer.appendChild(leftBranch);

    // Right branch (Not Smiling -> Second Feature)
    const rightBranchContainer = document.createElement('div');
    rightBranchContainer.className = 'branch';

    const rightLine = document.createElement('div');
    rightLine.className = 'line';
    rightLine.style.transform = 'rotate(-45deg)';

    const rightArrowLabel = document.createElement('div');
    rightArrowLabel.className = 'arrow-label';
    rightArrowLabel.textContent = 'Not Smiling';

    const secondNode = document.createElement('div');
    secondNode.className = 'ellipse';
    secondNode.textContent = secondFeature;

    const secondArrowContainer = document.createElement('div');
    secondArrowContainer.className = 'arrow-container';

    // Include indices in filtered data for the second feature branches
    const secondBranch1Data = dataset.map((row, index) => ({ row, index })).filter(item =>
        item.row[0] === 'Not Smiling' && item.row[secondFeatureIndex(secondFeature)] === secondFeature
    );

    const secondBranch2Data = dataset.map((row, index) => ({ row, index })).filter(item =>
        item.row[0] === 'Not Smiling' && item.row[secondFeatureIndex(secondFeature)] !== secondFeature
    );

    // Second Feature branches
    const secondBranch1 = createBranch(`${secondFeature}`, 'Bite', secondBranch1Data, imageSources, true, includeLabelRect);
    const secondBranch2 = createBranch(`No ${secondFeature}`, 'Not Bite', secondBranch2Data, imageSources, false, includeLabelRect);

    secondArrowContainer.appendChild(secondBranch1);
    secondArrowContainer.appendChild(secondBranch2);

    rightBranchContainer.appendChild(rightArrowLabel);
    rightBranchContainer.appendChild(rightLine);
    rightBranchContainer.appendChild(secondNode);
    rightBranchContainer.appendChild(secondArrowContainer);

    arrowContainer.appendChild(rightBranchContainer);

    treeContainer.appendChild(arrowContainer);

    // Calculate overall information gain for this split
    const initialEntropy = calculateInitialEntropy(dataset.filter(row => row[0] === 'Not Smiling'));
    const overallInformationGain = calculateInformationGain(
        initialEntropy,
        [secondBranch1.entropy, secondBranch2.entropy],
        [secondBranch1.totalCount, secondBranch2.totalCount]
    );

    const overallInfoGainDisplay = document.createElement('div');
    overallInfoGainDisplay.className = 'information-gain';
    overallInfoGainDisplay.style.fontWeight = 'bold';
    overallInfoGainDisplay.style.marginTop = '10px';
    //overallInfoGainDisplay.textContent = `Informationsgewinn: ${overallInformationGain.toFixed(2)}`;

    // Add click functionality
    treeContainer.style.cursor = 'pointer'; // Indicate it's clickable
    treeContainer.addEventListener('click', function () {
        const allGains = document.querySelectorAll('.information-gain');
        let maxGain = -Infinity;
        allGains.forEach(gain => {
            const gainValue = parseFloat(gain.textContent.split(': ')[1]);
            if (gainValue > maxGain) maxGain = gainValue;
        });

        if (overallInformationGain.toFixed(2) === maxGain.toFixed(2)) {
            // Change the title to "End of Training Phase"
            document.getElementById('phaseTitle').textContent = "Ende der Trainingsphase";

            // Hide all other rectangles except the selected one
            const allTrees = document.querySelectorAll('.tree-node');
            allTrees.forEach(tree => {
                if (tree !== treeContainer) {
                    tree.style.display = 'none';
                }
            });

            // Update the message
            document.getElementById('message').textContent = "Herzlichen Glückwunsch! Jetzt haben wir ein trainiertes Modell, das wir verwenden können, um vorherzusagen, ob ein Affe beißt oder nicht. Aber zuerst lassen Sie uns das Modell verwenden, um zu sehen, ob es korrekt vorhersagt.            ";

            // Clear images, entropy, information gain, and bite stats from the final tree and add proper rectangles
            clearFinalTreeAndAddLabels(treeContainer);

            // Add the "Evaluate your model" button
            addEvaluateButton();
        }
    });

    treeContainer.appendChild(overallInfoGainDisplay);

    decisionTreeContainer.appendChild(treeContainer);
}


// Helper function to get the index of a feature
function secondFeatureIndex(feature) {
    return { 'X-Augen': 1, 'Blinzeln': 2 }[feature];
}

// Function to create a branch with a label, associated images, and bite stats
function createBranch(label, branchLabel, filteredDataWithIndices, imageSources, isLeft = false, includeLabelRect = true) {
    const branchContainer = document.createElement('div');
    branchContainer.className = 'branch';

    const line = document.createElement('div');
    line.className = 'line';
    line.style.transform = isLeft ? 'rotate(45deg)' : 'rotate(-45deg)'; // Rotate the line accordingly

    const arrowLabel = document.createElement('div');
    arrowLabel.className = 'arrow-label';
    arrowLabel.textContent = label;

    const imagesContainer = document.createElement('div');
    imagesContainer.className = 'images-container';

    let biteCount = 0;
    let totalCount = 0;

    filteredDataWithIndices.forEach(item => {
        const { row, index } = item;

        const img = document.createElement('img');
        img.src = imageSources[index]; // Use the correct index
        imagesContainer.appendChild(img);

        if (row[3] === 1) {
            biteCount++;
        }
        totalCount++;
    });

    const entropy = calculateEntropy(biteCount, totalCount - biteCount);

    const biteStats = document.createElement('div');
    biteStats.className = 'bite-stats';
    biteStats.textContent = `${biteCount}/${totalCount} ${biteCount === 1 ? 'Biss' : 'Bisse'}`;

    const entropyDisplay = document.createElement('div');
    entropyDisplay.className = 'entropy';
    //entropyDisplay.textContent = `Entropie: ${entropy.toFixed(2)}`;

    branchContainer.appendChild(arrowLabel);
    branchContainer.appendChild(line);

    if (includeLabelRect) {
        const labelRect = document.createElement('div');
        labelRect.className = 'label-rect';
        labelRect.textContent = branchLabel;
        labelRect.style.border = '1px solid #000';
        labelRect.style.borderRadius = '5px';
        labelRect.style.padding = '5px';
        labelRect.style.margin = '10px 0';
        branchContainer.appendChild(labelRect);
    }

    branchContainer.appendChild(imagesContainer);
    branchContainer.appendChild(biteStats); // Add bite stats below images
    branchContainer.appendChild(entropyDisplay); // Add entropy below images

    // Store the entropy and counts in the branch container for later use
    branchContainer.entropy = entropy;
    branchContainer.totalCount = totalCount;

    return branchContainer;
}


function openModal(messageText) {
    const modal = document.getElementById("tipModal");
    const modalMessage = document.getElementById("modalMessage");
    const span = document.getElementsByClassName("close")[0];

    modalMessage.innerHTML = messageText;
    modal.style.display = "block";

    // Close the modal when the user clicks the close button (x)
    span.onclick = function() {
        modal.style.display = "none";
    };

    // Close the modal when the user clicks anywhere outside of the modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}

// Updated dataset as provided
const dataset = [
    ["Smile", "No X-Eyes", "Wink", 1],
    ["Smile", "X-Eyes", "No Wink", 1],
    ["Smile", "No X-Eyes", "No Wink", 1],
    ["Not Smiling", "X-Eyes", "No Wink", 1],
    ["Not Smiling", "No X-Eyes", "No Wink", 0],
    ["Not Smiling", "No X-Eyes", "Wink", 0],
    ["Not Smiling", "No X-Eyes", "Wink", 0],
    ["Not Smiling", "No X-Eyes", "No Wink", 0],
    ["Not Smiling", "No X-Eyes", "Wink", 0],
    ["Not Smiling", "No X-Eyes", "No Wink", 0],
    ["Not Smiling", "No X-Eyes", "No Wink", 0],
    ["Not Smiling", "No X-Eyes", "No Wink", 0],
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



