import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, FileText, Activity, ArrowRight, ChevronRight } from 'lucide-react';

export default function Welcome() {
    const navigate = useNavigate();

    const features = [
        {
            icon: FileText,
            title: 'Screening Tools',
            description: 'Access validated screening tools like M-CHAT and ASQ-3',
        },
        {
            icon: Activity,
            title: 'Track Progress',
            description: 'Monitor your child\'s developmental milestones',
        },
        {
            icon: Users,
            title: 'Share with Professionals',
            description: 'Securely share results with clinicians and therapists',
        },
        {
            icon: Heart,
            title: 'Personalized Plans',
            description: 'Create home-based education plans (PEPs)',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-4xl w-full animate-in fade-in slide-in-from-top-4 duration-500">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-6">
                        <Heart className="text-[#2563EB]" size={40} />
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">
                        Welcome to Daira!
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Your partner in supporting your child's developmental journey
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-slate-100"
                        >
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                                <feature.icon className="text-[#2563EB]" size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                            <p className="text-slate-600 text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-slate-100">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">
                            Let's get started!
                        </h2>
                        <p className="text-slate-600">
                            Add your child's information to begin tracking their development
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/onboarding/add-child')}
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-[#2563EB] text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                        >
                            Add Your Child
                            <ArrowRight size={20} />
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-all border-2 border-slate-200"
                        >
                            Skip for Now
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-slate-500 mt-8">
                    You can add more children later from your dashboard
                </p>
            </div>
        </div>
    );
}
