import React from 'react';
import { Check } from 'lucide-react';

interface Step {
    label: string;
    description?: string;
}

interface StepperProps {
    steps: Step[];
    currentStep: number;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
    return (
        <div className="w-full py-6">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;
                    const isUpcoming = index > currentStep;

                    return (
                        <React.Fragment key={index}>
                            {/* Step Circle */}
                            <div className="flex flex-col items-center relative">
                                <div
                                    className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all
                    ${isCompleted ? 'bg-[#2563EB] text-white' : ''}
                    ${isCurrent ? 'bg-blue-100 text-[#2563EB] ring-4 ring-blue-100' : ''}
                    ${isUpcoming ? 'bg-slate-200 text-slate-500' : ''}
                  `}
                                >
                                    {isCompleted ? <Check size={20} /> : index + 1}
                                </div>
                                <div className="mt-2 text-center">
                                    <p
                                        className={`text-sm font-semibold ${isCurrent ? 'text-[#2563EB]' : isCompleted ? 'text-slate-700' : 'text-slate-500'
                                            }`}
                                    >
                                        {step.label}
                                    </p>
                                    {step.description && (
                                        <p className="text-xs text-slate-500 mt-0.5">{step.description}</p>
                                    )}
                                </div>
                            </div>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div
                                    className={`flex-1 h-0.5 mx-4 transition-all ${index < currentStep ? 'bg-[#2563EB]' : 'bg-slate-200'
                                        }`}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}
