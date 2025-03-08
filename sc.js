const MAX_FRAMES = 10;

document.getElementById('inputForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const pagesInput = document.getElementById('pagesInput').value.trim();
    const framesInput = document.getElementById('framesInput').value.trim();

    if (pagesInput === '' || framesInput === '') {
        alert('Please enter valid input.');
        return;
    }

    const pageNumbers = pagesInput.split(' ').map(Number);
    const numberOfFrames = parseInt(framesInput, 10);

    simulatePageReplacement(pageNumbers, numberOfFrames);
});

function simulatePageReplacement(pageNumbers, numberOfFrames) {
    const outputContainer = document.getElementById('outputContainer');
    outputContainer.innerHTML = ''; // Clear previous results

    // Initialize output content
    let output = '';

    // Simulate FIFO Page Replacement Algorithm
    const fifoResult = simulateFIFO(pageNumbers, numberOfFrames);
    output += formatAlgorithmResult('FIFO', fifoResult);

    // Simulate LRU Page Replacement Algorithm
    const lruResult = simulateLRU(pageNumbers, numberOfFrames);
    output += formatAlgorithmResult('LRU', lruResult);

    // Simulate Optimal Page Replacement Algorithm
    const optimalResult = simulateOptimal(pageNumbers, numberOfFrames);
    output += formatAlgorithmResult('Optimal', optimalResult);

    // Display results in the output container
    outputContainer.innerHTML = output;
}

function formatAlgorithmResult(algorithmName, result) {
    let formattedOutput = `<h3>${algorithmName} Page Replacement Algorithm</h3>`;
    formattedOutput += '<table>';
    formattedOutput += '<tr><th>Reference String</th><th>Page Frames</th></tr>';

    const { referenceString, framesSequence, hits, misses } = result;

    for (let i = 0; i < referenceString.length; i++) {
        formattedOutput += `<tr><td>${referenceString[i]}</td><td>${framesSequence[i]}</td></tr>`;
    }

    formattedOutput += '</table>';
    formattedOutput += `<p>Hits: ${hits}, Misses: ${misses}</p>`;
    formattedOutput += `<p>Hit Ratio: ${(hits / referenceString.length).toFixed(2)}, Miss Ratio: ${(misses / referenceString.length).toFixed(2)}</p>`;
    formattedOutput += '<hr>';

    return formattedOutput;
}

function simulateFIFO(pageNumbers, numberOfFrames) {
    let frames = Array(numberOfFrames).fill(-1);
    let framesSequence = [];
    let hits = 0;
    let misses = 0;
    let pointer = 0; // Pointer to track the oldest page

    for (const page of pageNumbers) {
        framesSequence.push(frames.join(' '));

        if (frames.includes(page)) {
            hits++;
        } else {
            frames[pointer] = page; // Replace the page at the pointer
            misses++;
            pointer = (pointer + 1) % numberOfFrames; // Move the pointer to the next frame
        }
    }

    return { referenceString: pageNumbers, framesSequence, hits, misses };
}

function simulateLRU(pageNumbers, numberOfFrames) {
    let frames = Array(numberOfFrames).fill(-1);
    let framesSequence = [];
    let hits = 0;
    let misses = 0;
    let least = [];

    for (let i = 0; i < pageNumbers.length; i++) {
        framesSequence.push(frames.join(' '));

        let avail = 0;
        for (let j = 0; j < numberOfFrames; j++) {
            if (frames[j] === pageNumbers[i]) {
                avail = 1;
                hits++;
                for (let k = 0; k < j; k++) {
                    least[k] = frames[k];
                }
                for (let k = j; k > 0; k--) {
                    frames[k] = least[k - 1];
                }
                frames[0] = pageNumbers[i];
                break;
            }
        }

        if (avail === 0) {
            for (let j = 0; j < numberOfFrames - 1; j++) {
                frames[j] = frames[j + 1];
            }
            frames[numberOfFrames - 1] = pageNumbers[i];
            misses++;
        }
    }

    return { referenceString: pageNumbers, framesSequence, hits, misses };
}

function simulateOptimal(pageNumbers, numberOfFrames) {
    let frames = Array(numberOfFrames).fill(-1);
    let framesSequence = [];
    let hits = 0;
    let misses = 0;

    for (let i = 0; i < pageNumbers.length; i++) {
        framesSequence.push(frames.join(' '));

        let avail = 0;
        for (let j = 0; j < numberOfFrames; j++) {
            if (frames[j] === pageNumbers[i]) {
                avail = 1;
                hits++;
                break;
            }
        }

        if (avail === 0) {
            let max_future = -1;
            let replace_page;
            for (let j = 0; j < numberOfFrames; j++) {
                let future = Number.MAX_SAFE_INTEGER;
                for (let k = i + 1; k < pageNumbers.length; k++) {
                    if (pageNumbers[k] === frames[j]) {
                        future = k;
                        break;
                    }
                }
                if (future > max_future) {
                    max_future = future;
                    replace_page = j;
                }
            }
            frames[replace_page] = pageNumbers[i];
            misses++;
        }
    }

    return { referenceString: pageNumbers, framesSequence, hits, misses };
}
