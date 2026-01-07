import React, { useState } from 'react';
import {
    Download,
    Upload,
    CheckCircle,
    AlertCircle,
    AlertTriangle,
    CloudUpload
} from 'lucide-react';

interface BulkStudentImportProps {
    onBack: () => void;
    onComplete: () => void;
}

interface CSVRow {
    id: string;
    name: string;
    grade: string;
    guardian: string;
    validationStatus: 'Valid' | 'Error' | 'Warning';
}

interface ImportHistoryItem {
    id: string;
    date: string;
    filename: string;
    records: number;
    status: 'Success' | 'Failed';
}

const BulkStudentImport: React.FC<BulkStudentImportProps> = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [importHistory] = useState<ImportHistoryItem[]>([
        { id: '1', date: 'Oct 24, 2023', filename: 'grade_3_students.csv', records: 28, status: 'Success' },
        { id: '2', date: 'Oct 15, 2023', filename: 'grade_4_students.csv', records: 32, status: 'Success' },
    ]);
    const [conflictResolution, setConflictResolution] = useState('skip');

    // Mock Parsed Data
    const [csvData] = useState<CSVRow[]>([
        { id: '1001', name: 'John Doe', grade: '3A', guardian: 'Jane Doe', validationStatus: 'Valid' },
        { id: '1002', name: 'Mary Smith', grade: '4B', guardian: 'Bob Smith', validationStatus: 'Valid' },
        { id: '1003', name: 'Invalid Entry', grade: '', guardian: '', validationStatus: 'Error' },
        { id: '1004', name: 'Alice Brown', grade: '3A', guardian: 'Charlie Brown', validationStatus: 'Valid' },
        { id: '1005', name: 'Robert Wilson', grade: '5C', guardian: 'Sarah Wilson', validationStatus: 'Warning' },
    ]);

    const validRows = csvData.filter(r => r.validationStatus === 'Valid').length;
    const errorRows = csvData.filter(r => r.validationStatus === 'Error').length;

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedFile(file);
            // Simulate processing delay then move to step 3
            setTimeout(() => setCurrentStep(3), 800);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setUploadedFile(file);
            setTimeout(() => setCurrentStep(3), 800);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    return (
        <div className="flex flex-col w-full h-full">
            {/* Header / Title */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#111318] dark:text-white">Bulk Student Import</h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Upload student data via CSV template</p>
            </div>

            {/* Stepper */}
            <div className="mb-10 w-full max-w-2xl mx-auto">
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-200 dark:bg-gray-700 -z-10"></div>

                    {[1, 2, 3].map((step) => (
                        <div key={step} className="flex flex-col items-center gap-2 bg-transparent">
                            <div className={`size-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${currentStep >= step
                                ? 'bg-[#135bec] text-white ring-4 ring-blue-50 dark:ring-blue-900/20'
                                : 'bg-white dark:bg-gray-800 text-gray-400 border-2 border-gray-200 dark:border-gray-600'
                                }`}>
                                {step}
                            </div>
                            <span className={`text-xs font-semibold ${currentStep >= step ? 'text-[#135bec]' : 'text-gray-400'
                                }`}>
                                {step === 1 ? 'Template' : step === 2 ? 'Upload' : 'Review'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <div className="glass-card rounded-2xl p-8 border border-white/50 dark:border-gray-700 shadow-sm bg-white/90 backdrop-blur-md max-w-4xl mx-auto mb-10 w-full">

                {/* Step 1: Download Template */}
                {currentStep === 1 && (
                    <div className="flex flex-col items-center text-center gap-6 py-8">
                        <div className="size-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#135bec]">
                            <Download size={32} />
                        </div>
                        <div className="max-w-md">
                            <h2 className="text-xl font-bold text-[#111318] dark:text-white mb-2">Download CSV Template</h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Get the official template to ensure your data is formatted correctly.
                                Includes required fields: Name, Grade, Guardian Name, Contact.
                            </p>
                        </div>
                        <button
                            onClick={() => setCurrentStep(2)}
                            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#135bec] text-white font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none"
                        >
                            <Download size={20} />
                            Download & Continue
                        </button>
                    </div>
                )}

                {/* Step 2: Upload File */}
                {currentStep === 2 && (
                    <div className="flex flex-col gap-6">
                        <div className="text-center mb-4">
                            <h2 className="text-xl font-bold text-[#111318] dark:text-white mb-2">Upload Student Data</h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Supported format: .csv or .xlsx (Max 5MB)
                            </p>
                        </div>

                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-10 flex flex-col items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                        >
                            <div className="size-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#135bec]">
                                <Upload size={32} />
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 font-medium">
                                Drag & Drop file here or
                            </p>
                            <label className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-600 text-[#111318] dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer">
                                Browse Files
                                <input type="file" className="hidden" accept=".csv,.xlsx" onChange={handleFileUpload} />
                            </label>
                        </div>
                    </div>
                )}

                {/* Step 3: Review & Confirm */}
                {currentStep === 3 && (
                    <div className="flex flex-col gap-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-[#111318] dark:text-white">Review Data</h2>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                    File: <span className="font-medium text-[#111318] dark:text-white">{uploadedFile?.name || 'students.csv'}</span>
                                </p>
                            </div>
                            <button
                                onClick={() => setCurrentStep(2)}
                                className="text-sm font-medium text-[#135bec] hover:underline"
                            >
                                Change File
                            </button>
                        </div>

                        {/* Validation Summary */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                <p className="text-xs text-gray-500 uppercase font-bold">Total Rows</p>
                                <p className="text-2xl font-bold text-[#111318] dark:text-white">{csvData.length}</p>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800">
                                <p className="text-xs text-green-600 dark:text-green-400 uppercase font-bold">Valid</p>
                                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{validRows}</p>
                            </div>
                            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800">
                                <p className="text-xs text-red-600 dark:text-red-400 uppercase font-bold">Errors</p>
                                <p className="text-2xl font-bold text-red-700 dark:text-red-300">{errorRows}</p>
                            </div>
                        </div>

                        {/* Data Preview Table */}
                        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 dark:bg-gray-800 text-xs font-semibold text-gray-500 uppercase">
                                    <tr>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">ID</th>
                                        <th className="px-4 py-3">Student Name</th>
                                        <th className="px-4 py-3">Grade</th>
                                        <th className="px-4 py-3">Guardian</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-surface-dark">
                                    {csvData.map((row) => (
                                        <tr key={row.id}>
                                            <td className="px-4 py-3">
                                                {row.validationStatus === 'Valid' ? (
                                                    <CheckCircle size={20} className="text-green-500" />
                                                ) : row.validationStatus === 'Error' ? (
                                                    <AlertCircle size={20} className="text-red-500" />
                                                ) : (
                                                    <AlertTriangle size={20} className="text-orange-500" />
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{row.id}</td>
                                            <td className={`px-4 py-3 ${row.validationStatus === 'Error' ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}>{row.name}</td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{row.grade}</td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{row.guardian}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Conflict Resolution */}
                        <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-800/30">
                            <h3 className="text-sm font-bold text-[#111318] dark:text-white mb-3">Conflict Resolution</h3>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="conflict"
                                        value="skip"
                                        checked={conflictResolution === 'skip'}
                                        onChange={(e) => setConflictResolution(e.target.value)}
                                        className="form-radio text-[#135bec] focus:ring-[#135bec]"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Skip duplicates</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="conflict"
                                        value="update"
                                        checked={conflictResolution === 'update'}
                                        onChange={(e) => setConflictResolution(e.target.value)}
                                        className="form-radio text-[#135bec] focus:ring-[#135bec]"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Update existing records</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                onClick={() => setCurrentStep(2)}
                                className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={onComplete}
                                disabled={errorRows > 0}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#135bec] text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {errorRows > 0 ? 'Fix Errors to Import' : 'Confirm Import'}
                                <CloudUpload size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* History Table */}
            <div className="max-w-4xl mx-auto w-full">
                <h3 className="text-lg font-bold text-[#111318] dark:text-white mb-4">Recent Imports</h3>
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-[#dbdfe6] dark:border-gray-700 overflow-hidden shadow-sm">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#f0f2f4] dark:bg-gray-800 text-xs font-semibold text-gray-500 uppercase">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Filename</th>
                                <th className="px-6 py-3">Records Added</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f0f2f4] dark:divide-gray-700">
                            {importHistory.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{item.date}</td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{item.filename}</td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{item.records}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                                            Undo
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default BulkStudentImport;
