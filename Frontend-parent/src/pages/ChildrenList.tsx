import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus, Search, Eye, Edit, Trash2, Baby, Key
} from 'lucide-react';

import ClaimChildModal from '../components/consent/ClaimChildModal';
import childrenService from '../services/children.service';
import type { Child } from '../services/children.service';

export default function ChildrenList() {
    const navigate = useNavigate();
    const [children, setChildren] = useState<Child[]>([]);
    const [filteredChildren, setFilteredChildren] = useState<Child[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [showClaimModal, setShowClaimModal] = useState(false);

    useEffect(() => {
        loadChildren();
    }, []);

    useEffect(() => {
        // Filter children based on search query
        if (searchQuery.trim() === '') {
            setFilteredChildren(children);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = children.filter(child =>
                child.firstName.toLowerCase().includes(query) ||
                child.lastName.toLowerCase().includes(query)
            );
            setFilteredChildren(filtered);
        }
    }, [searchQuery, children]);

    const loadChildren = async () => {
        try {
            const response = await childrenService.getChildren();
            if (response.success) {
                setChildren(response.data);
                setFilteredChildren(response.data);
            }
            setLoading(false);
        } catch (error) {
            console.error('Failed to load children:', error);
            setLoading(false);
        }
    };

    const calculateAge = (dateOfBirth: string) => {
        const age = childrenService.calculateAge(dateOfBirth);
        if (age.years === 0) {
            return `${age.months} months old`;
        } else if (age.years === 1) {
            return `1 year, ${age.months} months old`;
        } else {
            return `${age.years} years, ${age.months} months old`;
        }
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName[0]}${lastName[0]}`.toUpperCase();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
                    <p className="mt-4 text-slate-600">Loading children...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex flex-col gap-1">
                        <p className="text-slate-600 text-sm font-semibold uppercase tracking-wide">
                            Child Management
                        </p>
                        <h1 className="text-slate-900 text-3xl md:text-4xl font-black leading-tight tracking-tight">
                            My Children
                        </h1>
                        <p className="text-slate-600 text-base">
                            Manage profiles and track developmental progress
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowClaimModal(true)}
                            className="flex items-center justify-center gap-2 bg-white border-2 border-slate-200 hover:border-purple-200 text-slate-600 hover:text-purple-600 font-bold py-3 px-6 rounded-lg transition-all shadow-sm hover:shadow-md"
                        >
                            <Key size={20} />
                            <span>Import via Token</span>
                        </button>
                        <button
                            onClick={() => navigate('/onboarding/add-child')}
                            className="flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl"
                        >
                            <Plus size={20} />
                            <span>Add Child</span>
                        </button>
                    </div>
                </div>

                {/* Search Bar (Only show if there are children) */}
                {children.length > 0 && (
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                        <div className="relative">
                            <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search children by name..."
                                className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
                            />
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {children.length === 0 && (
                    <div className="flex items-center justify-center min-h-[50vh]">
                        <div className="text-center max-w-md mx-auto">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-6">
                                <Baby className="text-[#2563EB]" size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-3">
                                No Children Added Yet
                            </h2>
                            <p className="text-slate-600 mb-8 leading-relaxed">
                                Add your first child to start tracking developmental progress, complete screenings,
                                and create personalized education plans.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => setShowClaimModal(true)}
                                    className="flex items-center justify-center gap-2 bg-white border-2 border-slate-200 hover:border-purple-200 text-slate-600 hover:text-purple-600 font-bold py-3 px-8 rounded-lg transition-all shadow-sm hover:shadow-md"
                                >
                                    <Key size={20} />
                                    <span>Import via Token</span>
                                </button>
                                <button
                                    onClick={() => navigate('/onboarding/add-child')}
                                    className="flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-lg hover:shadow-xl"
                                >
                                    <Plus size={20} />
                                    <span>Add Your First Child</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Children Grid */}
                {filteredChildren.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredChildren.map((child) => (
                            <div
                                key={child.id}
                                className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-xl transition-all group"
                            >
                                {/* Card Header */}
                                <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 relative">
                                    <div className="flex items-center gap-4">
                                        <div className="size-16 rounded-full bg-white text-[#2563EB] flex items-center justify-center font-bold text-xl shadow-lg">
                                            {getInitials(child.firstName, child.lastName)}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900">
                                                {child.firstName} {child.lastName}
                                            </h3>
                                            <p className="text-sm text-slate-700 font-medium">
                                                {calculateAge(child.dateOfBirth)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-700 capitalize">
                                            {child.gender}
                                        </span>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-5 space-y-4">
                                    {/* Info */}
                                    {child.medicalHistory && (
                                        <div className="bg-slate-50 rounded-lg p-3">
                                            <p className="text-xs font-semibold text-slate-600 mb-1">Medical History</p>
                                            <p className="text-sm text-slate-700 line-clamp-2">{child.medicalHistory}</p>
                                        </div>
                                    )}

                                    {child.currentConcerns && (
                                        <div className="bg-amber-50 rounded-lg p-3">
                                            <p className="text-xs font-semibold text-slate-600 mb-1">Current Concerns</p>
                                            <p className="text-sm text-slate-700 line-clamp-2">{child.currentConcerns}</p>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200">
                                        <button
                                            onClick={() => {
                                                console.log('Navigating to child:', child.id, child.firstName, child.lastName);
                                                navigate(`/children/${child.id}`);
                                            }}
                                            className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg hover:bg-blue-50 transition-colors text-[#2563EB]"
                                            title="View Profile"
                                        >
                                            <Eye size={18} />
                                            <span className="text-xs font-semibold">View</span>
                                        </button>
                                        <button
                                            onClick={() => navigate(`/children/${child.id}/edit`)}
                                            className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                            <span className="text-xs font-semibold">Edit</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm(`Are you sure you want to delete ${child.firstName}?`)) {
                                                    // Delete logic will be implemented in 3-L3
                                                    console.log('Delete child:', child.id);
                                                }
                                            }}
                                            className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg hover:bg-red-50 transition-colors text-red-600"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                            <span className="text-xs font-semibold">Delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* No Search Results */}
                {children.length > 0 && filteredChildren.length === 0 && (
                    <div className="text-center py-12">
                        <Search className="mx-auto text-slate-300 mb-4" size={48} />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No children found</h3>
                        <p className="text-slate-600 mb-4">
                            No children match your search query "{searchQuery}"
                        </p>
                        <button
                            onClick={() => setSearchQuery('')}
                            className="text-[#2563EB] font-semibold hover:underline"
                        >
                            Clear search
                        </button>
                    </div>
                )}
            </div>

            {showClaimModal && (
                <ClaimChildModal
                    onClose={() => setShowClaimModal(false)}
                    onSuccess={() => {
                        loadChildren();
                        // Optional: Show success toast/alert
                    }}
                />
            )}
        </>
    );
}
