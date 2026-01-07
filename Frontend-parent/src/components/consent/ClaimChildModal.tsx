import React, { useState, useRef } from 'react';
import { X, ShieldCheck, CheckCircle2, XCircle, Activity, Key, Loader2, User } from 'lucide-react';
import { consentService } from '../../services/consent.service';

interface ClaimChildModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

const ClaimChildModal: React.FC<ClaimChildModalProps> = ({ onClose, onSuccess }) => {
    const [token, setToken] = useState(['', '', '', '', '', '', '', '']);
    const [status, setStatus] = useState<'idle' | 'validating' | 'success' | 'error' | 'claiming'>('idle');
    const [validatedData, setValidatedData] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState('');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleTokenChange = (index: number, value: string) => {
        if (value.length > 1) value = value.slice(-1);
        const newToken = [...token];
        newToken[index] = value.toUpperCase();
        setToken(newToken);

        if (value && index < 7) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !token[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const validateToken = async () => {
        const fullToken = token.slice(0, 4).join('') + '-' + token.slice(4).join('');
        if (token.join('').length !== 8) return;

        setStatus('validating');
        setErrorMsg('');
        try {
            const response = await consentService.validateToken(fullToken);
            if (response.success && response.data) {
                setValidatedData(response.data);
                setStatus('success');
            } else {
                setStatus('error');
                setErrorMsg(response.error?.message || 'Invalid or expired token');
            }
        } catch (err: any) {
            const message = err.response?.data?.error?.message || err.message || 'Token validation failed';
            setStatus('error');
            setErrorMsg(message);
        }
    };

    const claimAccess = async () => {
        if (!validatedData) return;

        setStatus('claiming');
        try {
            const response = await consentService.claimToken(validatedData.token);
            if (response.success) {
                onSuccess();
                onClose();
            } else {
                setStatus('success');
                setErrorMsg(response.error?.message || 'Failed to claim access');
            }
        } catch (err: any) {
            const message = err.response?.data?.error?.message || err.message || 'Failed to claim access';
            setStatus('success');
            setErrorMsg(message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200 backdrop-blur-[2px]">
            <div className="bg-white rounded-[1.5rem] shadow-2xl max-w-lg w-full animate-in zoom-in-95 duration-200 border border-slate-200 overflow-hidden">
                {/* Header */}
                <div className="bg-white border-b border-slate-100 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                                <Key size={18} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Import via Token</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                            disabled={status === 'validating' || status === 'claiming'}
                        >
                            <X size={20} className="text-slate-400" />
                        </button>
                    </div>
                </div>

                <div className="p-8">
                    {status === 'idle' || status === 'validating' || status === 'error' ? (
                        <div className="space-y-6">
                            <div className="text-center">
                                <p className="text-sm text-slate-500 font-medium">Enter the 8-character code to link a child record</p>
                            </div>

                            <div className="flex items-center justify-center gap-2">
                                {token.map((char, i) => (
                                    <React.Fragment key={i}>
                                        <input
                                            ref={el => { inputRefs.current[i] = el; }}
                                            type="text"
                                            maxLength={1}
                                            value={char}
                                            onChange={(e) => handleTokenChange(i, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(i, e)}
                                            className={`w-9 h-12 bg-slate-50 border-2 rounded-xl text-center text-xl font-black transition-all outline-none ${status === 'error' ? 'border-red-200 text-red-600' : 'border-slate-200 text-purple-600 focus:border-purple-600 focus:ring-4 focus:ring-purple-500/10'
                                                }`}
                                            disabled={status === 'validating'}
                                        />
                                        {i === 3 && <div className="w-3 h-0.5 bg-slate-300 rounded-full" />}
                                    </React.Fragment>
                                ))}
                            </div>

                            {status === 'error' && (
                                <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3 animate-in shake duration-300">
                                    <XCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                                    <div>
                                        <p className="text-xs font-black text-red-900 uppercase tracking-wider mb-1">Invalid Token</p>
                                        <p className="text-xs text-red-700 font-medium">{errorMsg}</p>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={validateToken}
                                disabled={token.join('').length !== 8 || status === 'validating'}
                                className="w-full h-12 bg-purple-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {status === 'validating' ? (
                                    <>
                                        <Loader2 className="animate-spin" size={16} />
                                        Validating...
                                    </>
                                ) : (
                                    'Verify Token'
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in zoom-in-95 duration-300">
                            {/* Success Preview */}
                            <div className="bg-green-50 border border-green-200 p-6 rounded-2xl flex flex-col items-center text-center gap-3">
                                <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-green-900 tracking-tight">Token Verified</h4>
                                    <p className="text-[10px] text-green-700 font-black uppercase tracking-widest mt-1">Found 1 Matching Record</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4">
                                <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
                                    <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Child Name</p>
                                        <p className="text-base font-black text-slate-900">{validatedData?.child?.fullName}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Grantor</p>
                                        <p className="text-xs font-bold text-slate-700">{validatedData?.grantor?.name}</p>
                                        <p className="text-[9px] font-black text-purple-600 uppercase tracking-tighter capitalize">{validatedData?.grantor?.type}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Access Level</p>
                                        <p className="text-xs font-bold text-slate-700 capitalize">{validatedData?.accessLevel}</p>
                                    </div>
                                </div>
                            </div>

                            {errorMsg && (
                                <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-red-700 font-bold flex items-center gap-2">
                                    <XCircle size={14} />
                                    {errorMsg}
                                </div>
                            )}

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setStatus('idle')}
                                    disabled={status === 'claiming'}
                                    className="flex-1 h-12 bg-slate-100 text-slate-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={claimAccess}
                                    disabled={status === 'claiming'}
                                    className="flex-2 h-12 bg-purple-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {status === 'claiming' ? (
                                        <>
                                            <Activity className="animate-spin" size={16} />
                                            Importing...
                                        </>
                                    ) : (
                                        'Confirm Import'
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                <div className="bg-slate-50 px-8 py-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 text-slate-400">
                        <ShieldCheck size={16} />
                        <p className="text-[9px] font-bold uppercase tracking-widest leading-none">Secure data transfer • encrypted records • hipaa compliant</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClaimChildModal;
