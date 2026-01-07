
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();
const API_URL = process.env.API_URL || 'http://127.0.0.1:5000/api/v1';

async function main() {
    console.log('🧪 Verifying Journal Data Leakage Protections...');

    try {
        // 1. Setup Test Data
        const parent1 = await prisma.user.findFirst({
            where: { role: 'parent' },
            include: { parent: true }
        });

        if (!parent1 || !parent1.parent) {
            throw new Error('Need at least one parent user for this test.');
        }

        const child1View = await prisma.parentChildView.findFirst({
            where: { parentId: parent1.parent.id }
        });

        if (!child1View) {
            throw new Error('Parent needs at least one child.');
        }

        // Create a standalone child (not linked to Parent 1)
        const child2 = await prisma.person.create({
            data: {
                firstName: 'Leakage',
                lastName: 'Test',
                dateOfBirth: new Date(),
                gender: 'other'
            }
        });

        console.log(`Parent 1: ${parent1.email}, Child 1: ${child1View.personId}`);
        console.log(`Standalone Child (Child 2): ${child2.id}`);

        // 2. Test Parent 1 access to Child 2 timeline (Should fail)
        console.log('\nTesting Parent 1 access to Child 2 timeline...');
        const res1 = await fetch(`${API_URL}/journal/parent/timeline/${child2.id}`, {
            headers: {
                'Authorization': `Bearer dev-token`,
                'X-User-ID': parent1.id
            }
        });

        if (res1.status === 403) {
            console.log('✅ Access Denied as expected! (403)');
        } else {
            console.error(`❌ Leakage Detected! Status: ${res1.status}`);
            const data = await res1.json();
            console.log('Data:', JSON.stringify(data, null, 2));
        }

        // 3. Test Parent 1 creating entry for Child 2 (Should fail)
        console.log('\nTesting Parent 1 creating entry for Child 2...');
        const res2 = await fetch(`${API_URL}/journal`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer dev-token`,
                'X-User-ID': parent1.id
            },
            body: JSON.stringify({
                personId: child2.id,
                entryType: 'observation',
                title: 'Malicious Entry',
                content: 'I should not be able to write here'
            })
        });

        if (res2.status === 403) {
            console.log('✅ Entry Creation Denied as expected! (403)');
        } else {
            console.error(`❌ Leakage Detected! Status: ${res2.status}`);
        }

        // 4. Test Clinician WITHOUT access to Child 1 (Should fail)
        const clinician = await prisma.user.findFirst({ where: { role: 'clinician' } });
        if (clinician) {
            console.log(`\nClinician: ${clinician.email}`);
            console.log('Testing Clinician access to Child 1 journal...');

            // Ensure clinician does NOT have access
            const currentAccess = await prisma.clinicianPatientView.findFirst({
                where: { clinicianId: clinician.id, personId: child1View.personId }
            });

            if (currentAccess) {
                console.log('Clinician already has access, skipping clinician rejection test.');
            } else {
                const res3 = await fetch(`${API_URL}/journal/patient/${child1View.personId}`, {
                    headers: {
                        'Authorization': `Bearer dev-token`,
                        'X-User-ID': clinician.id
                    }
                });

                if (res3.status === 403) {
                    console.log('✅ Clinician Access Denied as expected! (403)');
                } else {
                    console.error(`❌ Leakage Detected! Status: ${res3.status}`);
                }
            }
        }

        // Cleanup
        await prisma.person.delete({ where: { id: child2.id } });

        console.log('\n🎉 ALL LEAKAGE TESTS COMPLETED');

    } catch (err) {
        console.error('\n❌ VERIFICATION STOPPED:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
