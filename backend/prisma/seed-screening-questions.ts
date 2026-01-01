import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const mchatQuestions = [
    {
        questionNumber: 1,
        questionText: "If you point at something across the room, does your child look at it?",
        isInitialScreener: true,
        criticalItem: true,
        scoringKey: "no",
        followUpPrompt: "Does your child look when you point and say 'look at the ____'?"
    },
    {
        questionNumber: 2,
        questionText: "Have you ever wondered if your child might be deaf?",
        isInitialScreener: true,
        criticalItem: false,
        scoringKey: "yes"
    },
    {
        questionNumber: 3,
        questionText: "Does your child play pretend or make-believe?",
        isInitialScreener: true,
        criticalItem: true,
        scoringKey: "no",
        followUpPrompt: "Does your child pretend to talk on the phone, feed a doll, or pretend other things?"
    },
    {
        questionNumber: 4,
        questionText: "Does your child like climbing on things?",
        isInitialScreener: true,
        criticalItem: false,
        scoringKey: "no"
    },
    {
        questionNumber: 5,
        questionText: "Does your child make unusual finger movements near his or her eyes?",
        isInitialScreener: true,
        criticalItem: false,
        scoringKey: "yes"
    },
    {
        questionNumber: 6,
        questionText: "Does your child point with one finger to ask for something or to get help?",
        isInitialScreener: true,
        criticalItem: true,
        scoringKey: "no",
        followUpPrompt: "Does your child point to show you something interesting or to get your attention?"
    },
    {
        questionNumber: 7,
        questionText: "Does your child point with one finger to show you something interesting?",
        isInitialScreener: true,
        criticalItem: true,
        scoringKey: "no",
        followUpPrompt: "When you are looking at a book with your child, does he or she look at the pictures when you point to them?"
    },
    {
        questionNumber: 8,
        questionText: "Is your child interested in other children?",
        isInitialScreener: true,
        criticalItem: false,
        scoringKey: "no"
    },
    {
        questionNumber: 9,
        questionText: "Does your child show you things by bringing them to you or holding them up for you to see - not to get help, but just to share?",
        isInitialScreener: true,
        criticalItem: true,
        scoringKey: "no",
        followUpPrompt: "Does your child show you objects by holding them out or giving them to you?"
    },
    {
        questionNumber: 10,
        questionText: "Does your child respond when you call his or her name?",
        isInitialScreener: true,
        criticalItem: true,
        scoringKey: "no",
        followUpPrompt: "If you call your child's name from across the room, does your child look or turn toward you?"
    },
    {
        questionNumber: 11,
        questionText: "When you smile at your child, does he or she smile back at you?",
        isInitialScreener: true,
        criticalItem: false,
        scoringKey: "no"
    },
    {
        questionNumber: 12,
        questionText: "Does your child get upset by everyday noises?",
        isInitialScreener: true,
        criticalItem: false,
        scoringKey: "yes"
    },
    {
        questionNumber: 13,
        questionText: "Does your child walk?",
        isInitialScreener: true,
        criticalItem: false,
        scoringKey: "no"
    },
    {
        questionNumber: 14,
        questionText: "Does your child look you in the eye when you are talking to him or her, playing with him or her, or dressing him or her?",
        isInitialScreener: true,
        criticalItem: true,
        scoringKey: "no",
        followUpPrompt: "Does your child look at you when you call his or her name?"
    },
    {
        questionNumber: 15,
        questionText: "Does your child try to copy what you do?",
        isInitialScreener: true,
        criticalItem: false,
        scoringKey: "no"
    },
    {
        questionNumber: 16,
        questionText: "If you turn your head to look at something, does your child look around to see what you are looking at?",
        isInitialScreener: true,
        criticalItem: false,
        scoringKey: "no"
    },
    {
        questionNumber: 17,
        questionText: "Does your child try to get you to watch him or her?",
        isInitialScreener: true,
        criticalItem: false,
        scoringKey: "no"
    },
    {
        questionNumber: 18,
        questionText: "Does your child understand when you tell him or her to do something?",
        isInitialScreener: true,
        criticalItem: false,
        scoringKey: "no"
    },
    {
        questionNumber: 19,
        questionText: "If something new happens, does your child look at your face to see how you feel about it?",
        isInitialScreener: true,
        criticalItem: false,
        scoringKey: "no"
    },
    {
        questionNumber: 20,
        questionText: "Does your child like movement activities?",
        isInitialScreener: true,
        criticalItem: false,
        scoringKey: "no"
    }
];

async function seedMChatQuestions() {
    console.log('Seeding M-CHAT-R/F questions...');

    for (const question of mchatQuestions) {
        await prisma.mChatQuestion.upsert({
            where: {
                questionNumber_isInitialScreener: {
                    questionNumber: question.questionNumber,
                    isInitialScreener: question.isInitialScreener
                }
            },
            update: question,
            create: question
        });
    }

    console.log(`Seeded ${mchatQuestions.length} M-CHAT questions`);
}

async function seedASQQuestions() {
    console.log('Seeding ASQ-3 sample questions...');

    // Sample ASQ-3 questions for 24 months
    const asqSampleQuestions = [
        {
            ageRange: "24-months",
            domain: "communication",
            questionNumber: 1,
            questionText: "Without giving help by pointing or repeating the names, ask your child to \"Point to your nose,\" \"Point to your toes,\" and \"Point to your tummy.\" Does your child correctly point to all three?",
            yesValue: 10,
            sometimesValue: 5,
            notYetValue: 0
        },
        {
            ageRange: "24-months",
            domain: "gross_motor",
            questionNumber: 1,
            questionText: "Does your child kick a ball by swinging his or her leg forward without holding onto anything for support?",
            yesValue: 10,
            sometimesValue: 5,
            notYetValue: 0
        },
        {
            ageRange: "24-months",
            domain: "fine_motor",
            questionNumber: 1,
            questionText: "Does your child stack a small block or toy on top of another one?",
            yesValue: 10,
            sometimesValue: 5,
            notYetValue: 0
        },
        {
            ageRange: "24-months",
            domain: "problem_solving",
            questionNumber: 1,
            questionText: "If you put three small toys in front of your child, does he or she give you two when you ask for two?",
            yesValue: 10,
            sometimesValue: 5,
            notYetValue: 0
        },
        {
            ageRange: "24-months",
            domain: "personal_social",
            questionNumber: 1,
            questionText: "Does your child drink from a cup or glass, putting it down again with little spilling?",
            yesValue: 10,
            sometimesValue: 5,
            notYetValue: 0
        }
    ];

    for (const question of asqSampleQuestions) {
        await prisma.aSQQuestion.upsert({
            where: {
                ageRange_domain_questionNumber: {
                    ageRange: question.ageRange,
                    domain: question.domain,
                    questionNumber: question.questionNumber
                }
            },
            update: question,
            create: question
        });
    }

    console.log(`Seeded ${asqSampleQuestions.length} ASQ-3 sample questions`);
}

async function main() {
    await seedMChatQuestions();
    await seedASQQuestions();
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
