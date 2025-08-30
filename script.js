
// Crop recommendation database (offline data)
const cropDatabase = {
    // High rainfall, moderate temperature crops
    rice: {
        cropName: "Rice",
        confidence: "95% Confidence",
        score: "9.5/10",
        yield: "4-6 tons/hectare",
        season: "Monsoon Season",
        reasoning: "Excellent match for high rainfall and warm temperatures. Rice thrives in waterlogged conditions with adequate nitrogen and phosphorus levels.",
        tags: ["High Yield", "Water Efficient", "Staple Crop", "Export Quality"],
        requirements: { minRainfall: 1000, maxRainfall: 3000, minTemp: 20, maxTemp: 35, minHumidity: 60 }
    },
    wheat: {
        cropName: "Wheat",
        confidence: "88% Confidence",
        score: "8.8/10",
        yield: "3-4 tons/hectare",
        season: "Winter Season",
        reasoning: "Well-suited for moderate rainfall and cooler temperatures. Good nitrogen levels will support healthy grain development.",
        tags: ["Winter Crop", "Drought Tolerant", "High Protein", "Market Stable"],
        requirements: { minRainfall: 300, maxRainfall: 1000, minTemp: 10, maxTemp: 25, minHumidity: 40 }
    },
    corn: {
        cropName: "Corn (Maize)",
        confidence: "92% Confidence",
        score: "9.2/10",
        yield: "6-8 tons/hectare",
        season: "Summer Season",
        reasoning: "Perfect for warm temperatures and moderate to high rainfall. High nitrogen content will boost kernel development.",
        tags: ["High Yield", "Versatile Use", "Feed Crop", "Biofuel"],
        requirements: { minRainfall: 500, maxRainfall: 2000, minTemp: 18, maxTemp: 32, minHumidity: 50 }
    },
    soybean: {
        cropName: "Soybean",
        confidence: "85% Confidence",
        score: "8.5/10",
        yield: "2-3 tons/hectare",
        season: "Summer Season",
        reasoning: "Good fit for moderate rainfall and warm temperatures. As a legume, it can fix nitrogen naturally.",
        tags: ["Protein Rich", "Nitrogen Fixing", "Oil Crop", "Export Value"],
        requirements: { minRainfall: 400, maxRainfall: 1200, minTemp: 15, maxTemp: 30, minHumidity: 45 }
    },
    barley: {
        cropName: "Barley",
        confidence: "80% Confidence",
        score: "8.0/10",
        yield: "2-4 tons/hectare",
        season: "Winter Season",
        reasoning: "Suitable for cooler temperatures and moderate rainfall. Tolerates lower nutrient levels well.",
        tags: ["Drought Tolerant", "Cool Season", "Feed Grain", "Brewing"],
        requirements: { minRainfall: 200, maxRainfall: 800, minTemp: 5, maxTemp: 20, minHumidity: 35 }
    },
    cotton: {
        cropName: "Cotton",
        confidence: "87% Confidence",
        score: "8.7/10",
        yield: "1-2 tons/hectare",
        season: "Summer Season",
        reasoning: "Thrives in warm temperatures with moderate rainfall. Requires good drainage and adequate phosphorus.",
        tags: ["Cash Crop", "Fiber Crop", "Export Value", "High Price"],
        requirements: { minRainfall: 500, maxRainfall: 1200, minTemp: 20, maxTemp: 35, minHumidity: 50 }
    },
    sugarcane: {
        cropName: "Sugarcane",
        confidence: "94% Confidence",
        score: "9.4/10",
        yield: "60-80 tons/hectare",
        season: "Year Round",
        reasoning: "Excellent for high rainfall and warm temperatures. High nitrogen and phosphorus levels support vigorous growth.",
        tags: ["High Yield", "Sugar Crop", "Biofuel", "Long Term"],
        requirements: { minRainfall: 1200, maxRainfall: 4000, minTemp: 20, maxTemp: 40, minHumidity: 65 }
    },
    tomato: {
        cropName: "Tomato",
        confidence: "83% Confidence",
        score: "8.3/10",
        yield: "20-40 tons/hectare",
        season: "Spring/Summer",
        reasoning: "Good for moderate rainfall and warm temperatures. Requires balanced nutrition and good drainage.",
        tags: ["High Value", "Vegetable Crop", "Processing", "Fresh Market"],
        requirements: { minRainfall: 400, maxRainfall: 1000, minTemp: 18, maxTemp: 30, minHumidity: 60 }
    },
    potato: {
        cropName: "Potato",
        confidence: "86% Confidence",
        score: "8.6/10",
        yield: "15-25 tons/hectare",
        season: "Cool Season",
        reasoning: "Suitable for moderate temperatures and rainfall. High phosphorus levels support excellent tuber development.",
        tags: ["Staple Crop", "High Nutrition", "Storage Crop", "Processing"],
        requirements: { minRainfall: 400, maxRainfall: 1000, minTemp: 10, maxTemp: 25, minHumidity: 55 }
    },
    chickpea: {
        cropName: "Chickpea",
        confidence: "78% Confidence",
        score: "7.8/10",
        yield: "1-2 tons/hectare",
        season: "Winter Season",
        reasoning: "Adapted to lower rainfall and cooler temperatures. As a legume, fixes nitrogen naturally.",
        tags: ["Protein Crop", "Drought Tolerant", "Pulse Crop", "Nitrogen Fixing"],
        requirements: { minRainfall: 200, maxRainfall: 600, minTemp: 10, maxTemp: 25, minHumidity: 40 }
    }
};

// Form validation
function validateForm(formData) {
    const errors = {};

    if (formData.rainfall < 0 || formData.rainfall > 5000) {
        errors.rainfall = "Rainfall must be between 0-5000mm";
    }
    if (formData.humidity < 0 || formData.humidity > 100) {
        errors.humidity = "Humidity must be between 0-100%";
    }
    if (formData.temperature < -10 || formData.temperature > 50) {
        errors.temperature = "Temperature must be between -10°C to 50°C";
    }
    if (formData.phosphorus < 0 || formData.phosphorus > 500) {
        errors.phosphorus = "Phosphorus must be between 0-500mg/kg";
    }
    if (formData.nitrogen < 0 || formData.nitrogen > 500) {
        errors.nitrogen = "Nitrogen must be between 0-500mg/kg";
    }

    return errors;
}

// Display validation errors
function displayErrors(errors) {
    // Clear previous errors
    document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
    document.querySelectorAll('.input').forEach(el => el.classList.remove('input-error'));

    // Display new errors
    for (const [field, message] of Object.entries(errors)) {
        const errorEl = document.getElementById(`${field}-error`);
        const inputEl = document.getElementById(field);
        if (errorEl && inputEl) {
            errorEl.textContent = message;
            inputEl.classList.add('input-error');
        }
    }
}

// Calculate crop suitability score
function calculateSuitability(crop, params) {
    let score = 0;
    const req = crop.requirements;

    // Rainfall score (40% weight)
    if (params.rainfall >= req.minRainfall && params.rainfall <= req.maxRainfall) {
        score += 40;
    } else {
        const rainfallDiff = Math.min(
            Math.abs(params.rainfall - req.minRainfall),
            Math.abs(params.rainfall - req.maxRainfall)
        );
        score += Math.max(0, 40 - (rainfallDiff / 100));
    }

    // Temperature score (30% weight) 
    if (params.temperature >= req.minTemp && params.temperature <= req.maxTemp) {
        score += 30;
    } else {
        const tempDiff = Math.min(
            Math.abs(params.temperature - req.minTemp),
            Math.abs(params.temperature - req.maxTemp)
        );
        score += Math.max(0, 30 - tempDiff);
    }

    // Humidity score (20% weight)
    if (params.humidity >= req.minHumidity) {
        score += 20;
    } else {
        const humidityDiff = req.minHumidity - params.humidity;
        score += Math.max(0, 20 - humidityDiff / 2);
    }

    // Nutrient bonus (10% weight)
    if (params.nitrogen > 50 && params.phosphorus > 30) {
        score += 10;
    } else {
        score += Math.max(0, (params.nitrogen / 50 + params.phosphorus / 30) * 5);
    }

    return Math.min(100, Math.max(0, score));
}

// Get crop recommendations based on parameters
function getCropRecommendations(params) {
    const recommendations = [];

    for (const [key, crop] of Object.entries(cropDatabase)) {
        const suitability = calculateSuitability(crop, params);
        if (suitability > 40) { // Only include crops with >40% suitability
            recommendations.push({
                ...crop,
                suitability: suitability,
                score: `${(suitability / 10).toFixed(1)}/10`
            });
        }
    }

    // Sort by suitability score
    recommendations.sort((a, b) => b.suitability - a.suitability);

    if (recommendations.length === 0) {
        // Fallback recommendations for extreme conditions
        return [
            {
                cropName: "Barley",
                confidence: "65% Confidence",
                score: "6.5/10",
                yield: "1-2 tons/hectare",
                season: "Cool Season",
                reasoning: "Most tolerant option for current conditions. Consider soil improvement and irrigation adjustments.",
                tags: ["Hardy Crop", "Stress Tolerant"]
            }
        ];
    }

    return recommendations;
}

// Generate soil and fertilizer advice
function generateAdvice(params) {
    let soilAdvice = "Based on your soil conditions: ";
    let fertilizerAdvice = "Fertilizer recommendations: ";

    if (params.nitrogen < 30) {
        soilAdvice += "Consider adding organic matter to improve nitrogen levels. ";
        fertilizerAdvice += "Apply nitrogen-rich fertilizers like urea or compost. ";
    } else if (params.nitrogen > 200) {
        soilAdvice += "Nitrogen levels are high - ensure good drainage to prevent leaching. ";
        fertilizerAdvice += "Reduce nitrogen application and focus on phosphorus and potassium. ";
    } else {
        soilAdvice += "Nitrogen levels are adequate for most crops. ";
        fertilizerAdvice += "Maintain current nitrogen levels with balanced fertilization. ";
    }

    if (params.phosphorus < 20) {
        soilAdvice += "Low phosphorus may limit root development. ";
        fertilizerAdvice += "Add phosphorus-rich fertilizers like rock phosphate. ";
    } else if (params.phosphorus > 100) {
        soilAdvice += "Phosphorus levels are excellent for crop growth. ";
        fertilizerAdvice += "Continue current phosphorus management practices. ";
    } else {
        soilAdvice += "Phosphorus levels are suitable for healthy growth. ";
        fertilizerAdvice += "Maintain phosphorus with standard fertilizer applications. ";
    }

    if (params.humidity < 40) {
        soilAdvice += "Consider mulching to retain soil moisture in low humidity conditions.";
    } else if (params.humidity > 80) {
        soilAdvice += "Ensure good drainage to prevent waterlogging in high humidity.";
    }

    return { soilAdvice, fertilizerAdvice };
}

// Display results
function displayResults(recommendations, params) {
    const resultsContainer = document.getElementById('resultsState');
    const primary = recommendations[0];
    const alternatives = recommendations.slice(1, 4); // Show up to 3 alternatives
    const advice = generateAdvice(params);

    resultsContainer.innerHTML = `
                <!-- Primary Recommendation -->
                <div class="bg-primary/5 border border-primary/20 rounded-lg p-5 mb-4">
                    <div class="flex items-start justify-between mb-3">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                                <svg class="text-primary w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 class="text-xl font-semibold" data-testid="text-primary-crop">
                                    ${primary.cropName}
                                </h3>
                                <div class="flex items-center gap-2">
                                    <span class="badge badge-default">Best Match</span>
                                    <span class="text-sm text-muted-foreground" data-testid="text-confidence">
                                        ${primary.confidence}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-2xl font-bold text-primary" data-testid="text-score">
                                ${primary.score}
                            </div>
                            <div class="text-sm text-muted-foreground">Suitability Score</div>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div class="text-center">
                            <div class="text-lg font-semibold" data-testid="text-yield">
                                ${primary.yield}
                            </div>
                            <div class="text-sm text-muted-foreground">Expected Yield</div>
                        </div>
                        <div class="text-center">
                            <div class="text-lg font-semibold" data-testid="text-season">
                                ${primary.season}
                            </div>
                            <div class="text-sm text-muted-foreground">Growing Season</div>
                        </div>
                    </div>

                    <div class="bg-background/50 rounded-lg p-3 mb-3">
                        <h4 class="font-medium mb-2">Why ${primary.cropName} is Recommended:</h4>
                        <p class="text-sm text-muted-foreground" data-testid="text-reasoning">
                            ${primary.reasoning}
                        </p>
                    </div>

                    <div class="flex flex-wrap gap-2">
                        ${primary.tags.map((tag, index) => `
                            <span class="badge bg-green-100 text-green-800" data-testid="tag-primary-${index}">
                                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                ${tag}
                            </span>
                        `).join('')}
                    </div>
                </div>

                <!-- Alternative Recommendations -->
                ${alternatives.length > 0 ? `
                    <div class="space-y-3">
                        ${alternatives.map((alt, index) => `
                            <div class="bg-accent/30 border border rounded-lg p-4" data-testid="card-alternative-${index}">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="flex items-center gap-3">
                                        <div class="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center">
                                            <div class="w-2 h-2 bg-secondary rounded-full"></div>
                                        </div>
                                        <h4 class="font-semibold" data-testid="text-alt-crop-${index}">
                                            ${alt.cropName}
                                        </h4>
                                    </div>
                                    <span class="text-lg font-bold text-secondary" data-testid="text-alt-score-${index}">
                                        ${alt.score}
                                    </span>
                                </div>
                                <p class="text-sm text-muted-foreground mb-2" data-testid="text-alt-reasoning-${index}">
                                    ${alt.reasoning}
                                </p>
                                <div class="flex gap-2">
                                    <span class="badge badge-outline bg-orange-100 text-orange-800">
                                        ${alt.season}
                                    </span>
                                    <span class="badge badge-outline bg-gray-100 text-gray-800">
                                        ${alt.yield}
                                    </span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                <!-- Additional Information -->
                <div class="bg-muted/30 rounded-lg p-4 mt-6">
                    <h4 class="font-medium mb-3 flex items-center gap-2">
                        <svg class="text-primary w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Additional Recommendations
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <h5 class="font-medium mb-1">Soil Management</h5>
                            <p class="text-muted-foreground" data-testid="text-soil-advice">
                                ${advice.soilAdvice}
                            </p>
                        </div>
                        <div>
                            <h5 class="font-medium mb-1">Fertilizer Tips</h5>
                            <p class="text-muted-foreground" data-testid="text-fertilizer-advice">
                                ${advice.fertilizerAdvice}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Reset Button -->
                <button 
                    type="button" 
                    class="button button-outline w-full mt-4"
                    onclick="resetForm()"
                    data-testid="button-reset"
                >
                    Analyze Different Parameters
                </button>
            `;
}

// Show different states
function showState(stateName) {
    document.getElementById('emptyState').classList.add('hidden');
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('resultsState').classList.add('hidden');
    document.getElementById('generalError').classList.add('hidden');

    if (stateName) {
        document.getElementById(stateName).classList.remove('hidden');
    }
}

// Reset form
function resetForm() {
    document.getElementById('cropForm').reset();
    showState('emptyState');
    document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
    document.querySelectorAll('.input').forEach(el => el.classList.remove('input-error'));
}

// Handle form submission
document.getElementById('cropForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const params = {
        rainfall: parseFloat(formData.get('rainfall')) || 0,
        humidity: parseFloat(formData.get('humidity')) || 0,
        temperature: parseFloat(formData.get('temperature')) || 0,
        phosphorus: parseFloat(formData.get('phosphorus')) || 0,
        nitrogen: parseFloat(formData.get('nitrogen')) || 0
    };

    // Validate input
    const errors = validateForm(params);
    if (Object.keys(errors).length > 0) {
        displayErrors(errors);
        return;
    }

    // Clear previous errors
    displayErrors({});

    // Show loading state
    showState('loadingState');

    // Simulate AI processing delay
    setTimeout(() => {
        try {
            const recommendations = getCropRecommendations(params);

            if (recommendations.length === 0) {
                throw new Error('No suitable crops found for these conditions');
            }

            displayResults(recommendations, params);
            showState('resultsState');

            // Save to localStorage for offline access
            localStorage.setItem('lastRecommendation', JSON.stringify({
                params,
                recommendations,
                timestamp: new Date().toISOString()
            }));

        } catch (error) {
            document.getElementById('errorMessage').textContent = error.message;
            showState('generalError');
        }
    }, 2000); // 2 second delay to simulate processing
});

// Load previous recommendation if available
window.addEventListener('load', function () {
    const saved = localStorage.getItem('lastRecommendation');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            // Only auto-load if less than 24 hours old
            const hoursSince = (new Date() - new Date(data.timestamp)) / (1000 * 60 * 60);
            if (hoursSince < 24) {
                // Fill form with previous values
                document.getElementById('rainfall').value = data.params.rainfall;
                document.getElementById('humidity').value = data.params.humidity;
                document.getElementById('temperature').value = data.params.temperature;
                document.getElementById('phosphorus').value = data.params.phosphorus;
                document.getElementById('nitrogen').value = data.params.nitrogen;
            }
        } catch (error) {
            console.log('Could not load previous recommendation');
        }
    }
});

// Add some sample data button for demo
function addSampleData() {
    document.getElementById('rainfall').value = 1200;
    document.getElementById('humidity').value = 65;
    document.getElementById('temperature').value = 25;
    document.getElementById('phosphorus').value = 45;
    document.getElementById('nitrogen').value = 75;
}

// Add keyboard shortcut for sample data (Ctrl+S)
document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        addSampleData();
    }
});
