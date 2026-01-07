
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Journal Entries Debug ---');
    const entries = await prisma.journalEntry.findMany({
        include: {
            person: true
        }
    });

    console.log(`Total entries: ${entries.length}`);

    const persons = await prisma.person.findMany();
    console.log(`Total persons: ${persons.length}`);

    const nameMap: Record<string, string[]> = {};
    for (const p of persons) {
        const name = `${p.firstName} ${p.lastName}`;
        if (!nameMap[name]) nameMap[name] = [];
        nameMap[name].push(p.id);
    }

    console.log('\n--- Duplicate Names Check ---');
    for (const [name, ids] of Object.entries(nameMap)) {
        if (ids.length > 1) {
            console.log(`Duplicate found: "${name}" has ${ids.length} IDs: ${ids.join(', ')}`);
        }
    }

    console.log('\n--- Journal Entries ---');
    for (const entry of entries) {
        console.log(`\n[${entry.person.firstName} ${entry.person.lastName}]`);
        console.log(`PersonID: ${entry.personId}`);
        console.log(`Title: ${entry.title}`);
        console.log(`Content: ${entry.content}`);
        console.log(`CreatedBy: ${entry.createdByName} (${entry.createdByType})`);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
