import React, { useState } from 'react';
import { CheckCircle, Copy, Mail, X } from 'lucide-react';

interface Props {
    token: string;
    expiresAt: string;
    clinicianEmail: string;
    childName: string;
    onClose: () => void;
}

const TokenDisplay: React.FC<Props> = ({
    token,
    expiresAt,
    clinicianEmail,
    childName,
    onClose
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(token);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            alert('Failed to copy token');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                            <h2 className="text-xl font-bold text-gray-900">
                                Access Token Generated
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div>
                        <p className="text-sm text-gray-600 mb-2">Share this token with:</p>
                        <p className="font-medium text-gray-900">{clinicianEmail}</p>
                    </div>

                    {/* Token Display */}
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                        <div className="text-center mb-3">
                            <code className="text-2xl font-mono font-bold text-blue-700 tracking-wider">
                                {token}
                            </code>
                        </div>
                        <button
                            onClick={handleCopy}
                            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {copied ? (
                                <>
                                    <CheckCircle className="h-5 w-5 mr-2" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="h-5 w-5 mr-2" />
                                    Copy Token
                                </>
                            )}
                        </button>
                    </div>

                    {/* Info */}
                    <div className="space-y-3">
                        <div className="flex items-start space-x-2 text-sm">
                            <span className="text-gray-600">Child:</span>
                            <span className="font-medium text-gray-900">{childName}</span>
                        </div>
                        <div className="flex items-start space-x-2 text-sm">
                            <span className="text-gray-600">Valid until:</span>
                            <span className="font-medium text-gray-900">{formatDate(expiresAt)}</span>
                        </div>
                    </div>

                    {/* Warning */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-sm text-amber-800">
                            ⚠️ This token will expire in 7 days if not claimed by the clinician.
                        </p>
                    </div>

                    <p className="text-sm text-gray-600">
                        The clinician will use this token to claim access to {childName}'s information.
                    </p>
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TokenDisplay;
