
import React from 'react';
import { User, Shield, CheckCircle2, Check } from 'lucide-react';

interface StepperProps {
  currentStep: number;
  isSubStep?: boolean;
  labelSuffix?: string;
}

const Stepper: React.FC<StepperProps> = ({ currentStep, labelSuffix }) => {
  const steps = [
    { id: 1, label: 'Personal', icon: User },
    { id: 2, label: 'Verification', icon: Shield },
    { id: 3, label: 'Review', icon: CheckCircle2 },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex items-center justify-center w-full max-w-md relative">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center relative z-10">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border-2 
                    ${isCompleted 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : isActive 
                        ? 'bg-[#2563EB] border-[#2563EB] text-white' 
                        : 'bg-white border-slate-300 text-slate-400'}`}
                >
                  {isCompleted ? <Check size={20} strokeWidth={3} /> : <step.icon size={20} />}
                </div>
                <span 
                  className={`absolute -bottom-7 whitespace-nowrap text-sm font-medium transition-colors
                    ${isActive || isCompleted ? 'text-slate-800' : 'text-slate-400'}`}
                >
                  {step.id}. {step.label} {isCompleted && '✓'}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div 
                  className={`flex-1 h-[2px] mx-2 -mt-7 transition-colors
                    ${isCompleted ? 'bg-green-500' : 'bg-slate-200'}`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <p className="mt-12 text-sm font-medium text-slate-500 uppercase tracking-widest">
        Step {currentStep} of 3{labelSuffix ? `: ${labelSuffix}` : (currentStep === 2 ? ': Verification' : '')}
      </p>
    </div>
  );
};

export default Stepper;
