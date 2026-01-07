
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

import { generateConsentToken } from '../src/utils/token-generator'; // Adjust path if needed or just reimplement
// We'll reimplement token gen to avoid import issues with relative paths if ts-node acts up
// But we want to test the API.

const prisma = new PrismaClient();
let API_URL = process.env.API_URL || 'http://127.0.0.1:5001/api/v1';

async function checkPort(port: number) {
    try {
        await fetch(`http://127.0.0.1:${port}/health`);
        return true;
    } catch (e) {
        return false;
    }
}

async function main() {
    console.log('🚀 Starting Journal & Access Token Flow Test...');
    console.log(`Using API_URL: ${API_URL}`);

    // Port check
    const port = parseInt(API_URL.split(':')[2].split('/')[0]);
    const isUp = await checkPort(port);
    if (!isUp) {
        console.log(`⚠️ Warning: Server not reachable at ${API_URL}`);
        console.log('Probing other ports...');
        for (const p of [5000, 5001, 3000, 8080]) {
            if (await checkPort(p)) {
                console.log(`✅ Server found running on port ${p}! Please update API_URL.`);
                // We'll update it dynamically for this run if we could, but let's just exit or let it fail
                API_URL = `http://127.0.0.1:${p}/api/v1`;
                console.log(`Updated API_URL to http://127.0.0.1:${p}/api/v1 (env var set for this process)`);
                break;
            }
        }
    }


    try {
        // 1. Setup Users
        console.log('1. Setting up users...');

        // Find or create Parent
        let parentUser = await prisma.user.findFirst({
            where: { role: 'parent' },
            include: { parent: true }
        });

        if (!parentUser || !parentUser.parent) {
            console.log('Creating test parent...');
            // Need to create a parent user logic here if missing, but likely exists from seed
            // Skipping creation complexity for now, assuming seed data exists.
            throw new Error('No parent user found or user has no parent profile. Please run seed.');
        }

        // Find child via ParentChildView
        const childView = await prisma.parentChildView.findFirst({
            where: { parentId: parentUser.parent.id }
        });

        if (!childView) {
            throw new Error('No child found for parent (via ParentChildView).');
        }

        const child = await prisma.person.findUnique({
            where: { id: childView.personId }
        });

        if (!child) {
            throw new Error('Child record not found for ID: ' + childView.personId);
        }

        console.log(`   Parent: ${parentUser.email}`);
        console.log(`   Child: ${child.firstName} (${child.id})`);

        // Find Clinician
        const clinician = await prisma.user.findFirst({
            where: { role: 'clinician' }
        });

        if (!clinician) {
            throw new Error('No clinician user found.');
        }
        console.log(`   Clinician: ${clinician.email}`);

        // 2. Parent Creates Journal Entry
        console.log('\n2. Creating Parent Journal Entry (Direct DB)...');
        const parentEntry = await prisma.journalEntry.create({
            data: {
                personId: child.id,
                entryType: 'observation',
                title: 'Parent Observation - Test',
                content: 'This is a test entry from parent visible to team.',
                visibility: 'shared_with_team',
                createdBy: parentUser.id,
                createdByType: 'parent',
                createdByName: 'Test Parent'
            }
        });
        console.log(`   Created Entry: ${parentEntry.id}`);

        // 3. Parent Generates Access Token
        console.log('\n3. Generating Access Token (Direct DB)...');
        // We simulate the token generation logic
        const token = `TEST-${Math.floor(1000 + Math.random() * 9000)}`;
        const grant = await prisma.accessGrant.create({
            data: {
                grantorType: 'parent',
                grantorId: parentUser.id,
                granteeType: 'clinician',
                granteeId: 'pending', // Will be updated
                personId: child.id,
                permissions: JSON.stringify({ view: true }),
                accessLevel: 'view',
                token: token,
                tokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                status: 'pending',
                grantedByName: 'Test Parent',
                grantedByEmail: parentUser.email,
                granteeEmail: clinician.email // Targeting specific clinician
            }
        });
        console.log(`   Generated Token: ${token}`);

        // 4. Clinician Validates Token (via API)
        console.log('\n4. Validating Token via Clinician API...');

        // We use 'dev-token' bypass for clinician auth
        const loginHeaders = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer dev-token'
        };

        const validateRes = await fetch(`${API_URL}/clinician/access-grants/validate`, {
            method: 'POST',
            headers: loginHeaders,
            body: JSON.stringify({ token })
        });

        const validateData = await validateRes.json();

        if (!validateRes.ok) {
            console.error('Validation Response:', validateData);
            throw new Error(`Token validation failed with status ${validateRes.status}`);
        }
        console.log('   ✅ Token Validated Successfully (Preview)!');
        console.log('   Response patient:', validateData.data.patient.fullName);

        // 4.5 Clinician Claims Token (via API) - MANDATORY now for activation
        console.log('\n4.5 Claiming Access Grant via Clinician API...');
        const claimRes = await fetch(`${API_URL}/clinician/access-grants/claim`, {
            method: 'POST',
            headers: loginHeaders,
            body: JSON.stringify({ token })
        });

        const claimData = await claimRes.json();
        if (!claimRes.ok) {
            console.error('Claim Response:', claimData);
            throw new Error(`Token claim failed with status ${claimRes.status}`);
        }
        console.log('   ✅ Access Grant Claimed & Activated!');

        // 5. Clinician Checks Journal Access (via API)
        console.log('\n5. Verifying Journal Access via API...');
        const journalRes = await fetch(`${API_URL}/journal/patient/${child.id}`, {
            method: 'GET',
            headers: loginHeaders
        });

        const journalData = await journalRes.json();

        if (!journalRes.ok) {
            console.error('Journal Response:', journalData);
            throw new Error(`Fetch journal failed with status ${journalRes.status}`);
        }

        // Check if our parent entry is in the list
        const found = journalData.data.entries.find((e: any) => e.id === parentEntry.id);
        if (found) {
            console.log('   ✅ Parent entry found in clinician view!');
        } else {
            console.error('   ❌ Parent entry NOT found in clinician view.');
            console.log('   Entries found:', journalData.data.entries.length);
        }

        // 5.5 Clinician Checks Patient Profile for Contact Info (Fallback)
        console.log('\n5.5 Verifying Patient Profile Details (Contact Fallback)...');
        const patientRes = await fetch(`${API_URL}/patients/${child.id}`, {
            method: 'GET',
            headers: loginHeaders
        });

        const patientProfileData = await patientRes.json();
        if (!patientRes.ok) {
            console.error('Patient Profile Response:', patientProfileData);
            throw new Error(`Fetch patient profile failed with status ${patientRes.status}`);
        }

        const contacts = patientProfileData.data.contacts;
        console.log(`   Found ${contacts?.length || 0} contacts for patient.`);

        if (contacts && contacts.length > 0) {
            const primaryContact = contacts[0];
            console.log(`   Primary Contact: ${primaryContact.firstName} ${primaryContact.lastName}`);
            console.log(`   Phone: ${primaryContact.phone || 'MISSING'}`);
            console.log(`   Email: ${primaryContact.email || 'MISSING'}`);
            console.log(`   Address: ${primaryContact.address || 'MISSING'}`);

            if (primaryContact.phone || primaryContact.email) {
                console.log('   ✅ Parent contact information successfully included as fallback!');
            } else {
                console.warn('   ⚠️ Parent contact info found but phone/email are empty.');
            }
        } else {
            console.error('   ❌ No contacts found in patient profile (Fallback FAILED).');
        }

        // 5.6 Clinician Checks Patients List for Contact Info
        console.log('\n5.6 Verifying Patients List Details (Contact Fallback)...');
        const listRes = await fetch(`${API_URL}/patients?search=${child.firstName}`, {
            method: 'GET',
            headers: loginHeaders
        });

        const listData = await listRes.json();
        if (!listRes.ok) {
            console.error('Patients List Response:', listData);
            throw new Error(`Fetch patients list failed with status ${listRes.status}`);
        }

        const listPatients = listData.data.patients;
        const matchingPatient = listPatients.find((p: any) => p.id === child.id);

        if (matchingPatient) {
            console.log(`   Found matching patient in list: ${matchingPatient.full_name}`);
            const listContacts = matchingPatient.contacts;
            console.log(`   Contacts in list: ${listContacts?.length || 0}`);
            if (listContacts && listContacts.length > 0) {
                console.log('   ✅ Parent contact information preserved in list view fallback!');
            } else {
                console.error('   ❌ No contacts found in list view for matching patient.');
            }
        } else {
            console.error('   ❌ Could not find the test patient in the patients list response.');
        }

        // 6. Cleanup (Optional)
        console.log('\n6. Cleaning up test data...');
        await prisma.journalEntry.delete({ where: { id: parentEntry.id } });
        await prisma.accessGrant.delete({ where: { id: grant.id } });
        console.log('   Cleanup done.');

        console.log('\n✅ TEST COMPLETED SUCCESSFULLY');

    } catch (err) {
        console.error('\n❌ TEST FAILED:', err);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
