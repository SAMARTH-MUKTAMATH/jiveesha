/**
 * MODULAR SCREENING SCORER
 * 
 * This utility contains isolated scoring functions for different screening types.
 * To add a new screening type, simply add a new scoring function here.
 * No other code changes are needed!
 */

/**
 * M-CHAT-R Scoring Logic
 */
export function scoreMChatR(responses: Record<string, string>): {
    totalScore: number;
    criticalScore: number;
    riskLevel: string;
    screenerResult: string;
    followUpRequired: boolean;
    professionalReferral: boolean;
} {
    // Critical items: 2, 5, 12 (reverse scored), others (normally scored)
    const criticalItems = [2, 5, 12];
    const reverseScored = [1, 2, 3, 6, 7, 9, 10, 13, 14, 15, 23]; // Items where "NO" = 1 point

    let totalScore = 0;
    let criticalScore = 0;

    Object.entries(responses).forEach(([questionId, answer]) => {
        const questionNum = parseInt(questionId);
        const isReverse = reverseScored.includes(questionNum);
        const isCritical = criticalItems.includes(questionNum);

        let points = 0;
        if ((answer === 'no' && isReverse) || (answer === 'yes' && !isReverse)) {
            points = 1;
        }

        totalScore += points;
        if (isCritical && points === 1) {
            criticalScore += 1;
        }
    });

    // Determine risk and follow-up
    let riskLevel = 'low';
    let screenerResult = 'pass';
    let followUpRequired = false;
    let professionalReferral = false;

    if (totalScore >= 8) {
        riskLevel = 'high';
        screenerResult = 'fail';
        professionalReferral = true;
    } else if (totalScore >= 3 || criticalScore >= 2) {
        riskLevel = 'medium';
        screenerResult = 'follow_up_needed';
        followUpRequired = true;
    }

    return {
        totalScore,
        criticalScore,
        riskLevel,
        screenerResult,
        followUpRequired,
        professionalReferral
    };
}

/**
 * ASQ-3 Scoring Logic
 */
export function scoreASQ3(
    responses: Record<string, string>,
    ageRange: string
): {
    domainScores: Record<string, number>;
    totalScore: number;
    riskLevel: string;
    areasOfConcern: string[];
    recommendations: string[];
} {
    const domains = ['communication', 'gross_motor', 'fine_motor', 'problem_solving', 'personal_social'];
    const domainScores: Record<string, number> = {};

    // Calculate scores per domain
    domains.forEach(domain => {
        let score = 0;
        Object.entries(responses).forEach(([questionId, answer]) => {
            if (questionId.startsWith(domain)) {
                if (answer === 'yes') score += 10;
                else if (answer === 'sometimes') score += 5;
                // 'not_yet' = 0
            }
        });
        domainScores[domain] = score;
    });

    const totalScore = Object.values(domainScores).reduce((sum, score) => sum + score, 0);

    // Determine areas of concern (scores below cutoff)
    // Cutoffs vary by age, using simplified example
    const cutoffs: Record<string, number> = {
        communication: 35,
        gross_motor: 40,
        fine_motor: 35,
        problem_solving: 35,
        personal_social: 30
    };

    const areasOfConcern = domains.filter(domain =>
        domainScores[domain] < cutoffs[domain]
    );

    let riskLevel = 'low';
    if (areasOfConcern.length >= 2) {
        riskLevel = 'high';
    } else if (areasOfConcern.length === 1) {
        riskLevel = 'medium';
    }

    // Generate recommendations
    const recommendations: string[] = [];
    if (areasOfConcern.length > 0) {
        recommendations.push('Discuss results with pediatrician');
        recommendations.push('Consider developmental evaluation');
        areasOfConcern.forEach(area => {
            recommendations.push(`Focus on ${area.replace('_', ' ')} activities`);
        });
    } else {
        recommendations.push('Continue age-appropriate activities');
        recommendations.push('Rescreen at next milestone');
    }

    return {
        domainScores,
        totalScore,
        riskLevel,
        areasOfConcern,
        recommendations
    };
}

/**
 * Generate recommendations based on screening results
 * This is a generic function that works with any screening type
 */
export function generateRecommendations(
    screeningType: string,
    riskLevel: string,
    screenerResult?: string
): string[] {
    const recommendations: string[] = [];

    if (screeningType === 'M-CHAT-R' || screeningType === 'M-CHAT-F') {
        if (riskLevel === 'high' || screenerResult === 'fail') {
            recommendations.push('Contact your pediatrician immediately');
            recommendations.push('Request referral for comprehensive autism evaluation');
            recommendations.push('Early intervention services may be beneficial');
            recommendations.push('Document specific behaviors of concern');
        } else if (riskLevel === 'medium' || screenerResult === 'follow_up_needed') {
            recommendations.push('Complete M-CHAT Follow-Up interview');
            recommendations.push('Monitor development closely');
            recommendations.push('Discuss concerns at next pediatric visit');
        } else {
            recommendations.push('Development appears on track');
            recommendations.push('Continue routine developmental monitoring');
            recommendations.push('Rescreen at 30 months if concerns arise');
        }
    } else if (screeningType.startsWith('ASQ')) {
        if (riskLevel === 'high') {
            recommendations.push('Schedule developmental evaluation');
            recommendations.push('Contact early intervention program');
            recommendations.push('Discuss results with pediatrician');
        } else if (riskLevel === 'medium') {
            recommendations.push('Provide learning activities in concern areas');
            recommendations.push('Rescreen in 2-3 months');
            recommendations.push('Monitor progress closely');
        } else {
            recommendations.push('Development progressing well');
            recommendations.push('Continue age-appropriate activities');
            recommendations.push('Complete next ASQ at recommended interval');
        }
    } else {
        // Generic recommendations for unknown screening types
        if (riskLevel === 'high') {
            recommendations.push('Discuss results with healthcare provider');
            recommendations.push('Consider further evaluation');
        } else if (riskLevel === 'medium') {
            recommendations.push('Monitor development closely');
            recommendations.push('Rescreen in 2-3 months');
        } else {
            recommendations.push('Continue routine monitoring');
        }
    }

    return recommendations;
}

/**
 * EXTENSIBILITY EXAMPLE:
 * To add a new screening type (e.g., STAT-Rapid), just add:
 * 
 * export function scoreSTATRapid(responses: Record<string, string>): { ... } {
 *   // Your scoring logic here
 * }
 * 
 * Then update the controller's completeScreening function to call it.
 * No database migrations needed!
 */
