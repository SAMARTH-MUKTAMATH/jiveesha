import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleResources = [
    {
        title: "Picture Exchange Communication System (PECS) Starter Guide",
        description: "Learn how to implement PECS at home to help your child communicate their needs using picture cards.",
        resourceType: "article",
        category: "communication",
        ageRange: "2-6",
        difficulty: "beginner",
        tags: JSON.stringify(["nonverbal", "AAC", "communication"]),
        author: "Speech Therapy Resources",
        contentUrl: "https://example.com/pecs-guide",
        isPublished: true,
        isFeatured: true
    },
    {
        title: "Social Stories for Autism - Daily Routines",
        description: "Collection of social stories to help children understand and navigate daily routines like brushing teeth, getting dressed, and mealtime.",
        resourceType: "worksheet",
        category: "social_skills",
        ageRange: "4-8",
        difficulty: "beginner",
        tags: JSON.stringify(["autism", "routines", "visual_supports"]),
        author: "Autism Teaching Resources",
        isPublished: true,
        isFeatured: true
    },
    {
        title: "Sensory Play Activities for Home",
        description: "50+ sensory play ideas using household items to support sensory development and regulation.",
        resourceType: "activity",
        category: "motor_development",
        ageRange: "2-6",
        difficulty: "beginner",
        tags: JSON.stringify(["sensory", "play", "fine_motor"]),
        author: "OT Parent Resources",
        isPublished: true,
        isFeatured: false
    },
    {
        title: "Turn-Taking Games for Social Skills",
        description: "Simple games and activities to practice turn-taking and joint attention at home.",
        resourceType: "activity",
        category: "social_skills",
        ageRange: "3-7",
        difficulty: "intermediate",
        tags: JSON.stringify(["social_skills", "play", "games"]),
        isPublished: true,
        isFeatured: false
    },
    {
        title: "Visual Schedule Creator App",
        description: "Free app to create visual schedules and timers for daily routines.",
        resourceType: "app",
        category: "behavior",
        ageRange: "2-12",
        difficulty: "beginner",
        tags: JSON.stringify(["visual_supports", "routines", "technology"]),
        author: "Assistive Tech Solutions",
        contentUrl: "https://example.com/visual-schedule-app",
        isPublished: true,
        isFeatured: true
    }
];

async function seedResources() {
    console.log('Seeding resource library...');

    for (const resource of sampleResources) {
        await prisma.resource.create({
            data: resource
        });
    }

    console.log(`Seeded ${sampleResources.length} resources`);
}

async function main() {
    await seedResources();
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
