/**
 * Cognitive Analytics Layer
 * Based on Cognitive Diagnostic Assessment (CDA) - Rule Space Method
 * and Executive Function Theory (Educational Use)
 *
 * Integrated with NeuroQuiz RB-ADA
 * Algorithm Author: Saiful Iqbal
 * Lead Developer, Team ChendAwan
 *
 * Reference: Tatsuoka, K. K. (2009). Cognitive assessment: An introduction 
 * to the Rule Space Method. Routledge.
 */

'use strict';

const TATSUOKA_REFERENCE = {
    title: "Cognitive Assessment: An Introduction to the Rule Space Method",
    author: "Kikumi K. Tatsuoka",
    year: 2009,
    publisher: "Taylor & Francis / Routledge",
    summary: "This foundational work introduces the Rule Space Method (RSM), a cognitive diagnostic technique that transforms item response patterns into measurable attribute mastery probabilities. RSM helps interpret test results beyond aggregate scores by identifying underlying knowledge strengths and weaknesses, enabling customized assessment feedback. It has been applied in large-scale assessments such as the PSAT and other educational diagnostics.",
    apa: "Tatsuoka, K. K. (2009). Cognitive assessment: An introduction to the Rule Space Method. Routledge."
};

function computeKnowledgeMasteryScore(history, categoryPerformance) {
    if (!history || history.length === 0) return {};
    
    const mastery = {};
    
    Object.entries(categoryPerformance || {}).forEach(([category, data]) => {
        if (data.total > 0) {
            const accuracy = data.correct / data.total;
            const categoryHistory = history.filter(h => h.category === category);
            
            if (categoryHistory.length > 0) {
                const recentAccuracy = categoryHistory.slice(-5).filter(h => h.isCorrect).length / Math.min(5, categoryHistory.length);
                const weightedMastery = (accuracy * 0.6) + (recentAccuracy * 0.4);
                mastery[category] = Math.max(0, Math.min(1, weightedMastery));
            } else {
                mastery[category] = Math.max(0, Math.min(1, accuracy));
            }
        }
    });
    
    return mastery;
}

function computeDifficultyAdaptationRate(history) {
    if (!history || history.length < 2) return 0;
    
    let adaptationCount = 0;
    let totalChanges = 0;
    
    for (let i = 1; i < history.length; i++) {
        const prev = history[i - 1];
        const curr = history[i];
        
        if (prev.difficulty !== curr.difficulty) {
            totalChanges++;
            if (curr.isCorrect && curr.difficulty > prev.difficulty) {
                adaptationCount++;
            } else if (!curr.isCorrect && curr.difficulty < prev.difficulty) {
                adaptationCount++;
            }
        }
    }
    
    return totalChanges > 0 ? adaptationCount / totalChanges : 0;
}

function computeLevelRecoveryRate(dropCount, promotionCount) {
    if (dropCount === 0) return promotionCount > 0 ? 1 : 0;
    return Math.max(0, Math.min(1, promotionCount / dropCount));
}

function computeConsistencyIndex(history) {
    if (!history || history.length < 3) return 0;
    
    const outcomes = history.map(h => h.isCorrect ? 1 : 0);
    const mean = outcomes.reduce((a, b) => a + b, 0) / outcomes.length;
    
    if (mean === 0 || mean === 1) return 0;
    
    const variance = outcomes.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / outcomes.length;
    const maxVariance = mean * (1 - mean);
    
    return maxVariance > 0 ? 1 - (variance / maxVariance) : 0;
}

function computeErrorPersistenceRate(history) {
    if (!history || history.length < 2) return 0;
    
    let errorSequences = 0;
    let totalErrors = 0;
    
    for (let i = 1; i < history.length; i++) {
        if (!history[i].isCorrect) {
            totalErrors++;
            if (!history[i - 1].isCorrect) {
                errorSequences++;
            }
        }
    }
    
    return totalErrors > 0 ? errorSequences / totalErrors : 0;
}

function computeProcessingSpeedIndex(history) {
    if (!history || history.length === 0) return 0;
    
    const times = history.map(h => h.timeTakenMs || 0).filter(t => t > 0);
    if (times.length === 0) return 0;
    
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    
    if (maxTime === minTime) return 1;
    
    const normalizedSpeed = 1 - ((avgTime - minTime) / (maxTime - minTime));
    return Math.max(0, Math.min(1, normalizedSpeed));
}

function computeImpulsivityIndex(history) {
    if (!history || history.length === 0) return 0;
    
    const fastThreshold = history.reduce((sum, h) => sum + (h.timeTakenMs || 0), 0) / history.length * 0.5;
    const fastIncorrect = history.filter(h => (h.timeTakenMs || 0) < fastThreshold && !h.isCorrect).length;
    const totalFast = history.filter(h => (h.timeTakenMs || 0) < fastThreshold).length;
    
    return totalFast > 0 ? fastIncorrect / totalFast : 0;
}

function computeAnalyticalTendencyIndex(history) {
    if (!history || history.length === 0) return 0;
    
    const avgTime = history.reduce((sum, h) => sum + (h.timeTakenMs || 0), 0) / history.length;
    const slowThreshold = avgTime * 1.5;
    const slowCorrect = history.filter(h => (h.timeTakenMs || 0) > slowThreshold && h.isCorrect).length;
    const totalSlow = history.filter(h => (h.timeTakenMs || 0) > slowThreshold).length;
    
    return totalSlow > 0 ? slowCorrect / totalSlow : 0;
}

function computeCognitiveEnduranceIndex(history) {
    if (!history || history.length < 5) return 0;
    
    const firstHalf = history.slice(0, Math.floor(history.length / 2));
    const secondHalf = history.slice(Math.floor(history.length / 2));
    
    const firstAccuracy = firstHalf.filter(h => h.isCorrect).length / firstHalf.length;
    const secondAccuracy = secondHalf.filter(h => h.isCorrect).length / secondHalf.length;
    
    const performanceDrop = firstAccuracy - secondAccuracy;
    return Math.max(0, Math.min(1, 1 - (performanceDrop * 2)));
}

function computeSelfRegulationIndex(history, dropCount, promotionCount) {
    if (!history || history.length < 3) return 0;
    
    let recoveryCount = 0;
    let dropEvents = 0;
    
    for (let i = 1; i < history.length; i++) {
        if (history[i].hasDroppedLevel && !history[i - 1].hasDroppedLevel) {
            dropEvents++;
            const subsequentCorrect = history.slice(i + 1, i + 4).filter(h => h.isCorrect).length;
            if (subsequentCorrect >= 2) {
                recoveryCount++;
            }
        }
    }
    
    const recoveryFromDrops = dropEvents > 0 ? recoveryCount / dropEvents : 0;
    const promotionBonus = promotionCount > 0 ? 0.2 : 0;
    
    return Math.max(0, Math.min(1, recoveryFromDrops + promotionBonus));
}

function analyzeCognitiveProfile(performanceSummary) {
    if (!performanceSummary) {
        return {
            cda: {
                knowledgeMastery: {},
                adaptability: 0,
                consistency: 0,
                recovery: 0,
                errorPersistence: 0
            },
            executiveFunction: {
                processingSpeed: 0,
                impulsivityControl: 0,
                analyticalThinking: 0,
                endurance: 0,
                selfRegulation: 0
            }
        };
    }
    
    const history = performanceSummary.performanceHistory || [];
    const categoryPerformance = performanceSummary.categoryPerformance || {};
    const dropCount = performanceSummary.dropCount || 0;
    const promotionCount = performanceSummary.promotionCount || 0;
    
    if (history.length === 0) {
        return {
            cda: {
                knowledgeMastery: {},
                adaptability: 0,
                consistency: 0,
                recovery: 0,
                errorPersistence: 0
            },
            executiveFunction: {
                processingSpeed: 0,
                impulsivityControl: 0,
                analyticalThinking: 0,
                endurance: 0,
                selfRegulation: 0
            }
        };
    }
    
    const knowledgeMastery = computeKnowledgeMasteryScore(history, categoryPerformance);
    const adaptability = computeDifficultyAdaptationRate(history);
    const recovery = computeLevelRecoveryRate(dropCount, promotionCount);
    const consistency = computeConsistencyIndex(history);
    const errorPersistence = computeErrorPersistenceRate(history);
    
    const processingSpeed = computeProcessingSpeedIndex(history);
    const impulsivityControl = 1 - computeImpulsivityIndex(history);
    const analyticalThinking = computeAnalyticalTendencyIndex(history);
    const endurance = computeCognitiveEnduranceIndex(history);
    const selfRegulation = computeSelfRegulationIndex(history, dropCount, promotionCount);
    
    const profile = {
        cda: {
            knowledgeMastery: knowledgeMastery,
            adaptability: Math.max(0, Math.min(1, adaptability)),
            consistency: Math.max(0, Math.min(1, consistency)),
            recovery: Math.max(0, Math.min(1, recovery)),
            errorPersistence: Math.max(0, Math.min(1, errorPersistence))
        },
        executiveFunction: {
            processingSpeed: Math.max(0, Math.min(1, processingSpeed)),
            impulsivityControl: Math.max(0, Math.min(1, impulsivityControl)),
            analyticalThinking: Math.max(0, Math.min(1, analyticalThinking)),
            endurance: Math.max(0, Math.min(1, endurance)),
            selfRegulation: Math.max(0, Math.min(1, selfRegulation))
        }
    };

    profile.professionalSummary = generateProfessionalSummary(profile, performanceSummary);

    return profile;
}

function generateProfessionalSummary(cognitiveProfile, performanceSummary) {
    if (!cognitiveProfile || !performanceSummary) {
        return "Insufficient data to generate cognitive summary.";
    }

    const cda = cognitiveProfile.cda || {};
    const executive = cognitiveProfile.executiveFunction || {};
    const history = performanceSummary.performanceHistory || [];
    const categoryPerformance = performanceSummary.categoryPerformance || {};
    const finalLevel = performanceSummary.finalLevel || performanceSummary.currentLevel || 1;
    const dropCount = performanceSummary.dropCount || 0;
    const promotionCount = performanceSummary.promotionCount || 0;

    const parts = [];

    const adaptability = cda.adaptability || 0;
    const recovery = cda.recovery || 0;
    const analyticalThinking = executive.analyticalThinking || 0;
    const processingSpeed = executive.processingSpeed || 0;
    const impulsivityControl = executive.impulsivityControl || 0;
    const consistency = cda.consistency || 0;
    const endurance = executive.endurance || 0;
    const selfRegulation = executive.selfRegulation || 0;

    if (recovery >= 0.6 && dropCount > 0) {
        parts.push("you demonstrate strong adaptive recovery");
        if (promotionCount > 0) {
            parts.push("with successful level promotions after initial difficulty drops");
        }
    } else if (recovery < 0.4 && dropCount > 0) {
        parts.push("you show moderate recovery patterns");
    }

    if (analyticalThinking >= 0.7) {
        parts.push("analytical persistence");
    } else if (analyticalThinking >= 0.5) {
        parts.push("moderate analytical thinking");
    }

    const timingAnalysis = [];
    if (processingSpeed >= 0.7 && impulsivityControl >= 0.7) {
        timingAnalysis.push("a careful reasoning approach");
    } else if (processingSpeed < 0.4 && impulsivityControl < 0.5) {
        timingAnalysis.push("quick responses with occasional impulsivity");
    } else if (processingSpeed >= 0.6) {
        timingAnalysis.push("balanced response timing");
    }

    const categoryInsights = [];
    const categoryNames = Object.keys(categoryPerformance);
    if (categoryNames.length > 0) {
        const topCategories = categoryNames
            .map(cat => ({
                name: cat,
                accuracy: categoryPerformance[cat].correct / categoryPerformance[cat].total
            }))
            .sort((a, b) => b.accuracy - a.accuracy)
            .slice(0, 2);

        if (topCategories.length > 0) {
            const categoryList = topCategories.map(c => c.name.toLowerCase()).join(" and ");
            if (timingAnalysis.length > 0) {
                timingAnalysis.push(`particularly in ${categoryList}-related questions`);
            } else {
                timingAnalysis.push(`strong performance in ${categoryList} categories`);
            }
        }
    }

    if (timingAnalysis.length > 0) {
        parts.push(`Your response timing suggests ${timingAnalysis.join(", ")}.`);
    }

    const levelAssessment = [];
    if (finalLevel === 3) {
        levelAssessment.push("university-level");
    } else if (finalLevel === 2) {
        levelAssessment.push("secondary-level");
    } else {
        levelAssessment.push("elementary-level");
    }

    if (analyticalThinking >= 0.6) {
        levelAssessment.push("analytical thinking");
    } else {
        levelAssessment.push("cognitive engagement");
    }

    if (promotionCount > 0 && adaptability >= 0.6) {
        levelAssessment.push("with signs of upward adaptability");
    } else if (consistency >= 0.7) {
        levelAssessment.push("with consistent performance patterns");
    } else if (endurance >= 0.7) {
        levelAssessment.push("with strong cognitive endurance");
    }

    if (selfRegulation >= 0.7) {
        levelAssessment.push("and effective self-regulation");
    }

    if (levelAssessment.length > 0) {
        parts.push(`Overall, your cognitive engagement aligns closely with ${levelAssessment.join(", ")}.`);
    }

    if (parts.length === 0) {
        return "Based on your interaction pattern, you show a developing cognitive profile with room for growth in adaptive learning strategies.";
    }

    return `Based on your interaction pattern, ${parts.join(", ")}.`;
}

function getTatsuokaReference() {
    return TATSUOKA_REFERENCE;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { analyzeCognitiveProfile, generateProfessionalSummary, getTatsuokaReference };
}

if (typeof window !== 'undefined') {
    window.CognitiveAnalyzer = { 
        analyzeCognitiveProfile,
        generateProfessionalSummary,
        getTatsuokaReference 
    };
}
