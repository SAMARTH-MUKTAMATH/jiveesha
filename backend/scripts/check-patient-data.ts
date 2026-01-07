import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Checking patient data in database...\n");

    // Get first patient
    const view = await prisma.clinicianPatientView.findFirst({
        include: {
            person: {
                include: {
                    contacts: true,
                    activities: true
                }
            }
        }
    });

    if (!view) {
        console.log("No patients found.");
        return;
    }

    console.log("=== PERSON DATA ===");
    console.log("ID:", view.person.id);
    console.log("First Name:", view.person.firstName);
    console.log("Last Name:", view.person.lastName);
    console.log("DOB:", view.person.dateOfBirth);
    console.log("Gender:", view.person.gender);
    console.log("Address:", view.person.addressLine1, view.person.city, view.person.state);

    console.log("\n=== CONTACTS ===");
    console.log("Count:", view.person.contacts.length);
    view.person.contacts.forEach((c, i) => {
        console.log(`Contact ${i + 1}:`, {
            name: `${c.firstName} ${c.lastName}`,
            phone: c.phone,
            email: c.email,
            relationship: c.relationship
        });
    });

    console.log("\n=== ACTIVITIES ===");
    console.log("Count:", view.person.activities.length);
    view.person.activities.slice(0, 3).forEach((a, i) => {
        console.log(`Activity ${i + 1}:`, {
            type: a.activityType,
            description: a.description,
            date: a.createdAt
        });
    });

    console.log("\n=== CLINICAL VIEW ===");
    console.log("Primary Concerns:", view.primaryConcerns);
    console.log("Case Status:", view.caseStatus);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
