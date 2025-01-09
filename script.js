// Initialize variables
let licenseType = 'standard';
let unifiedPeople = 100000;
let interactedPeople = 10000;

// Set up event listeners
document.querySelectorAll('input[name="license"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        licenseType = e.target.value;
        updateCalculations();
    });
});

document.getElementById('unifiedSlider').addEventListener('input', (e) => {
    unifiedPeople = parseInt(e.target.value);
    document.getElementById('unifiedValue').textContent = `${unifiedPeople.toLocaleString()} people`;
    checkValidation();
    updateCalculations();
});

document.getElementById('interactedSlider').addEventListener('input', (e) => {
    interactedPeople = parseInt(e.target.value);
    document.getElementById('interactedValue').textContent = `${interactedPeople.toLocaleString()} people`;
    checkValidation();
    updateCalculations();
});

function checkValidation() {
    const existingWarning = document.getElementById('validation-warning');
    if (existingWarning) {
        existingWarning.remove();
    }

    if (interactedPeople > unifiedPeople) {
        const warning = document.createElement('div');
        warning.id = 'validation-warning';
        warning.className = 'warning';
        warning.innerHTML = `
            <strong>Warning:</strong> Interacted People (${interactedPeople.toLocaleString()}) 
            cannot exceed Unified People (${unifiedPeople.toLocaleString()}). 
            Please adjust your values.
        `;
        
        const interactedSlider = document.getElementById('interactedValue');
        interactedSlider.parentNode.insertBefore(warning, interactedSlider.nextSibling);
    }
}

function calculateUnifiedCost(totalPeople) {
    if (totalPeople <= 100000) return { cost: 0, packs: 0, packSize: 100000, pricePerPack: 0 };

    const additionalPeople = totalPeople - 100000;
    let pricePerPack, packSize = 100000;

    if (totalPeople <= 500000) pricePerPack = 1643.90;
    else if (totalPeople <= 2000000) pricePerPack = 1232.90;
    else pricePerPack = 821.90;

    const packs = Math.ceil(additionalPeople / packSize);
    return {
        cost: packs * pricePerPack,
        packs,
        packSize,
        pricePerPack
    };
}

function calculateInteractedCost(totalPeople) {
    if (totalPeople <= 10000) return { cost: 0, packs: 0, packSize: 0, pricePerPack: 0 };

    let pricePerPack, packSize;
    
    if (totalPeople <= 50000) {
        pricePerPack = 205.50;
        packSize = 5000;
    } else if (totalPeople <= 250000) {
        pricePerPack = 246.60;
        packSize = 10000;
    } else {
        pricePerPack = 411.00;
        packSize = 50000;
    }

    const additionalPeople = totalPeople - 10000;
    const packs = Math.ceil(additionalPeople / packSize);
    return {
        cost: packs * pricePerPack,
        packs,
        packSize,
        pricePerPack
    };
}

function findOptimizations() {
    const optimizations = [];

    // License optimization
    if (licenseType === 'standard') {
        optimizations.push('Consider switching to Attach license to save £575.40 per month if you have qualifying D365 applications.');
    }

    // Unified People optimizations
    const currentUnifiedCost = calculateUnifiedCost(unifiedPeople).cost;

    if (unifiedPeople > 100000) {
        // Check Tier 2
        if (unifiedPeople <= 500000) {
            const currentPacks = Math.ceil((unifiedPeople - 100000) / 100000);
            const currentCost = currentPacks * 1643.90;
            const tier2Packs = Math.ceil((500001 - 100000) / 100000);
            const tier2Cost = tier2Packs * 1232.90;

            if (tier2Cost < currentCost) {
                optimizations.push(`Consider increasing to 500,001 Unified People to use Tier 2 pricing. This would reduce your Unified People cost from £${currentCost.toFixed(2)} to £${tier2Cost.toFixed(2)}.`);
            }
        }

        // Check Tier 3
        if (unifiedPeople <= 2000000) {
            const currentPacks = Math.ceil((unifiedPeople - 100000) / 100000);
            const currentCost = unifiedPeople <= 500000 
                ? currentPacks * 1643.90 
                : currentPacks * 1232.90;
            const tier3Packs = Math.ceil((2000001 - 100000) / 100000);
            const tier3Cost = tier3Packs * 821.90;

            if (tier3Cost < currentCost) {
                optimizations.push(`Consider increasing to 2,000,001 Unified People to use Tier 3 pricing. This would reduce your Unified People cost from £${currentCost.toFixed(2)} to £${tier3Cost.toFixed(2)}.`);
            }
        }
    }

    // Interacted People optimizations
    if (interactedPeople > 10000) {
        // Check Tier 2
        if (interactedPeople <= 50000) {
            const currentPacks = Math.ceil((interactedPeople - 10000) / 5000);
            const currentCost = currentPacks * 205.50;
            const tier2Packs = Math.ceil((50001 - 10000) / 10000);
            const tier2Cost = tier2Packs * 246.60;

            if (tier2Cost < currentCost) {
                optimizations.push(`Consider increasing to 50,001 Interacted People to use Tier 2 pricing. This would reduce your Interacted People cost from £${currentCost.toFixed(2)} to £${tier2Cost.toFixed(2)}.`);
            }
        }

        // Check Tier 3
        if (interactedPeople <= 250000) {
            const currentPacks = interactedPeople <= 50000 
                ? Math.ceil((interactedPeople - 10000) / 5000)
                : Math.ceil((interactedPeople - 10000) / 10000);
            const currentCost = interactedPeople <= 50000 
                ? currentPacks * 205.50
                : currentPacks * 246.60;
            const tier3Packs = Math.ceil((250001 - 10000) / 50000);
            const tier3Cost = tier3Packs * 411.00;

            if (tier3Cost < currentCost) {
                optimizations.push(`Consider increasing to 250,001 Interacted People to use Tier 3 pricing. This would reduce your Interacted People cost from £${currentCost.toFixed(2)} to £${tier3Cost.toFixed(2)}.`);
            }
        }
    }

    return optimizations;
}

function updateCalculations() {
    const baseCost = licenseType === 'standard' ? 1397.30 : 821.90;
    const unifiedCost = calculateUnifiedCost(unifiedPeople);
    const interactedCost = calculateInteractedCost(interactedPeople);
    const totalCost = baseCost + unifiedCost.cost + interactedCost.cost;

    // Update total price
    document.getElementById('totalPrice').textContent = `£${totalCost.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    // Update base cost
    document.getElementById('baseCost').textContent = `£${baseCost.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Update Unified breakdown
    let unifiedText = 'Base: 100,000 people (included)';
    if (unifiedCost.packs > 0) {
        unifiedText += `<br>Additional: ${unifiedCost.packs.toLocaleString()} packs of ${unifiedCost.packSize.toLocaleString()} people`;
        unifiedText += `<br>Pack price: £${unifiedCost.pricePerPack.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        unifiedText += `<br>Total cost: £${unifiedCost.cost.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    document.getElementById('unifiedBreakdown').innerHTML = unifiedText;

    // Update Interacted breakdown
    let interactedText = 'Base: 10,000 people (included)';
    if (interactedCost.packs > 0) {
        interactedText += `<br>Additional: ${interactedCost.packs.toLocaleString()} packs of ${interactedCost.packSize.toLocaleString()} people`;
        interactedText += `<br>Pack price: £${interactedCost.pricePerPack.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        interactedText += `<br>Total cost: £${interactedCost.cost.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    document.getElementById('interactedBreakdown').innerHTML = interactedText;

    // Update optimizations
    const optimizations = findOptimizations();
    const optimizationsElement = document.getElementById('optimizations');
    
    if (optimizations.length > 0) {
        optimizationsElement.innerHTML = `
            <h2>Optimization Suggestions</h2>
            ${optimizations.map(opt => `<div class="suggestion">${opt}</div>`).join('')}
        `;
        optimizationsElement.style.display = 'block';
    } else {
        optimizationsElement.style.display = 'none';
    }
}

// Initial calculation
updateCalculations();
