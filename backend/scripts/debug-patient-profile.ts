
import { PrismaClient } from '@prisma/client';
import { transformToPatient } from '../src/utils/transformers';

const prisma = new PrismaClient();

async function main() {
    console.log("Debugging Patient Profile Data...");

    // Find a ClinicalPatientView
    const view = await prisma.clinicianPatientView.findFirst({
        include: {
            person: {
                include: {
                    contacts: true,
                    _count: {
                        select: {
                            appointments: true,
                            sessions: true,
                            assessments: true
                        }
                    }
                }
            }
        }
    });

    if (!view) {
        console.log("No patients found.");
        return;
    }

    console.log(`Found patient view for: ${view.person.firstName} ${view.person.lastName}`);

    // Transform
    const patient = transformToPatient(view);

    console.log("Transformed Patient Data:");
    console.log(JSON.stringify(patient, null, 2));

    if (patient.stats && typeof patient.stats.appointments === 'number') {
        console.log("SUCCESS: Stats present.");
    } else {
        console.log("FAILURE: Stats missing.");
    }

    if (Array.isArray(patient.contacts)) {
        console.log("SUCCESS: Contacts present (array).");
    } else {
        console.log("FAILURE: Contacts missing.");
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
