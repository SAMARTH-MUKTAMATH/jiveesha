import { Router } from 'express';

const router = Router();

/**
 * Test endpoint to verify transformation is working
 * Returns snake_case data that should be transformed to camelCase
 */
router.get('/snake-case', (req, res) => {
    res.json({
        success: true,
        data: {
            first_name: 'Emma',
            last_name: 'Smith',
            date_of_birth: '2020-03-15',
            parent_id: 'parent-123',
            linked_patient_id: 'patient-456',
            created_at: new Date('2024-01-01T10:00:00Z'),
            nested_object: {
                some_field: 'value',
                another_field: 123,
                deep_nested: {
                    very_deep_field: 'deep value'
                }
            },
            array_field: [
                { item_name: 'First', item_value: 1 },
                { item_name: 'Second', item_value: 2 }
            ]
        }
    });
});

/**
 * Test endpoint with multiple children
 */
router.get('/children-sample', (req, res) => {
    res.json({
        success: true,
        data: [
            {
                id: 'child-1',
                parent_id: 'parent-123',
                first_name: 'Emma',
                last_name: 'Smith',
                date_of_birth: '2020-03-15',
                gender: 'female',
                linked_patient_id: null,
                created_at: new Date('2024-01-01'),
                updated_at: new Date('2024-01-02')
            },
            {
                id: 'child-2',
                parent_id: 'parent-123',
                first_name: 'Oliver',
                last_name: 'Smith',
                date_of_birth: '2018-07-22',
                gender: 'male',
                linked_patient_id: 'patient-456',
                created_at: new Date('2024-01-01'),
                updated_at: new Date('2024-01-02')
            }
        ]
    });
});

export default router;
