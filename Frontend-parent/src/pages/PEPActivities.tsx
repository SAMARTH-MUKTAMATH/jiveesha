import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Plus, Search, Filter, CheckCircle2, Circle,
    Edit, Trash2, Music, Dumbbell, Palette, Gamepad2,
    TreePine, Activity, Brain, Users, MessageCircle, Hand,
    Sparkles, AlertCircle, Loader2, Eye, BarChart3
} from 'lucide-react';

import pepService from '../services/pep.service';
import type { PEP, PEPActivity, CreateActivityData } from '../services/pep.service';

type CategoryFilter = 'all' | 'sports' | 'music' | 'recreation' | 'arts' | 'games';
type StatusFilter = 'all' | 'completed' | 'incomplete';

export default function PEPActivities() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [pep, setPEP] = useState<PEP | null>(null);
    const [activities, setActivities] = useState<PEPActivity[]>([]);
    const [filteredActivities, setFilteredActivities] = useState<PEPActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<PEPActivity | null>(null);
    const [processing, setProcessing] = useState(false);

    const [formData, setFormData] = useState<CreateActivityData>({
        title: '',
        description: '',
        category: 'sports',
        domain: 'motor',
    });

    useEffect(() => {
        if (id) {
            loadData(id);
        }
    }, [id]);

    useEffect(() => {
        filterActivities();
    }, [activities, categoryFilter, statusFilter, searchQuery]);

    const loadData = async (pepId: string) => {
        try {
            const [pepRes, activitiesRes] = await Promise.all([
                pepService.getPEP(pepId),
                pepService.getActivities(pepId),
            ]);

            if (pepRes.success) {
                setPEP(pepRes.data);
            }
            if (activitiesRes.success) {
                setActivities(activitiesRes.data);

                // Calculate progress based on completed activities
                const totalActivities = activitiesRes.data.length;
                const completedActivities = activitiesRes.data.filter((a: any) => a.completed).length;
                const calculatedProgress = totalActivities > 0
                    ? Math.round((completedActivities / totalActivities) * 100)
                    : 0;

                // Update PEP with calculated progress
                if (pepRes.success) {
                    setPEP({
                        ...pepRes.data,
                        progress: calculatedProgress
                    });
                }
            }

            setLoading(false);
        } catch (error) {
            console.error('Failed to load data:', error);
            setLoading(false);
        }
    };

    const filterActivities = () => {
        let filtered = activities;

        // Filter by category
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(a => a.category === categoryFilter);
        }

        // Filter by status
        if (statusFilter === 'completed') {
            filtered = filtered.filter(a => a.completed);
        } else if (statusFilter === 'incomplete') {
            filtered = filtered.filter(a => !a.completed);
        }

        // Filter by search
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(a =>
                a.title.toLowerCase().includes(query) ||
                a.description.toLowerCase().includes(query)
            );
        }

        setFilteredActivities(filtered);
    };

    const handleAddActivity = async () => {
        if (!id || !formData.title || !formData.description) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            setProcessing(true);
            await pepService.createActivity(id, formData);
            await loadData(id);
            setShowAddModal(false);
            setFormData({
                title: '',
                description: '',
                category: 'sports',
                domain: 'motor',
            });
        } catch (error) {
            console.error('Failed to create activity:', error);
            alert('Failed to create activity. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    const handleEditActivity = async () => {
        if (!id || !selectedActivity || !formData.title || !formData.description) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            setProcessing(true);
            await pepService.updateActivity(id, selectedActivity.id, formData);
            await loadData(id);
            setShowEditModal(false);
            setSelectedActivity(null);
            setFormData({
                title: '',
                description: '',
                category: 'sports',
                domain: 'motor',
            });
        } catch (error) {
            console.error('Failed to update activity:', error);
            alert('Failed to update activity. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    const handleDeleteActivity = async () => {
        if (!id || !selectedActivity) return;

        try {
            setProcessing(true);
            await pepService.deleteActivity(id, selectedActivity.id);
            await loadData(id);
            setShowDeleteModal(false);
            setSelectedActivity(null);
        } catch (error) {
            console.error('Failed to delete activity:', error);
            alert('Failed to delete activity. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    const handleToggleCompletion = async (activity: PEPActivity) => {
        if (!id) return;

        try {
            await pepService.toggleActivityCompletion(id, activity.id);
            await loadData(id);
        } catch (error) {
            console.error('Failed to toggle completion:', error);
            alert('Failed to update activity. Please try again.');
        }
    };

    const getCategoryIcon = (category: PEPActivity['category']) => {
        const icons = {
            sports: Dumbbell,
            music: Music,
            recreation: TreePine,
            arts: Palette,
            games: Gamepad2,
        };
        return icons[category];
    };

    const getCategoryColor = (category: PEPActivity['category']) => {
        const colors = {
            sports: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
            music: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
            recreation: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
            arts: { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200' },
            games: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
        };
        return colors[category] || { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' };
    };

    const getDomainIcon = (domain: PEPActivity['domain']) => {
        const icons = {
            motor: Activity,
            social: Users,
            cognitive: Brain,
            communication: MessageCircle,
            adaptive: Hand,
        };
        return icons[domain];
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    /* 
      ========================================================================
      GENAI INTEGRATION POINT: Activity Generation
      ========================================================================
      
      When GenAI service is ready, implement this function:
      
      const handleGenerateFromResults = async () => {
        try {
          setProcessing(true);
          
          // 1. Get child's screening results
          const screenings = await screeningService.getScreenings(pep.childId);
          
          // 2. Call GenAI to generate activities
          const generated = await genAIService.generateActivities({
            screeningIds: screenings.map(s => s.id),
            childId: pep.childId,
            pepId: id,
          });
          
          // 3. Display generated activities for review
          setGeneratedActivities(generated.activities);
          setShowReviewModal(true);
          
        } catch (error) {
          console.error('Failed to generate activities:', error);
          alert('Failed to generate activities. Please try again.');
        } finally {
          setProcessing(false);
        }
      };
      
      Service will analyze:
      - Screening test results (M-CHAT, ASQ, etc.)
      - Child's age and profile
      - Identified developmental needs
      
      Will generate activities in categories:
      - Sports: Physical activities (balance, coordination, strength)
      - Music: Rhythm, singing, instrument exploration
      - Recreation: Outdoor activities, exploration, play
      - Arts: Creative expression, fine motor skills
      - Games: Cognitive games, social games, memory
      
      Each activity includes:
      - Title and description
      - Category and domain
      - Difficulty level
      - Materials needed
      - Instructions
      - Variations for different abilities
      
      ========================================================================
    */

    const handleGenerateFromResults = () => {
        alert('GenAI Integration Point: This will analyze screening results and generate targeted activities. Implementation pending.');
    };

    const handleSuggestSimilar = (activity: PEPActivity) => {
        alert(`GenAI Integration Point: This will suggest similar activities to replace "${activity.title}". Implementation pending.`);
    };

    if (loading) {
        return (
            <>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
                        <p className="mt-4 text-slate-600">Loading activities...</p>
                    </div>
                </div>
            </>
        );
    }

    if (!pep) {
        return (
            <>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">PEP Not Found</h2>
                        <p className="text-slate-600 mb-6">This PEP doesn't exist or has been deleted.</p>
                        <button
                            onClick={() => navigate('/pep')}
                            className="px-6 py-3 bg-[#2563EB] text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
                        >
                            Back to PEPs
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/pep')}
                    className="flex items-center gap-2 text-slate-600 hover:text-[#2563EB] font-semibold transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Back to PEPs</span>
                </button>

                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 mb-1">
                                PEP Activities
                            </h1>
                            <p className="text-slate-600">
                                For <strong>{pep.childName}</strong>
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-right">
                                <p className="text-sm text-slate-600">Progress</p>
                                <p className="text-2xl font-bold text-[#2563EB]">{pep.progress}%</p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-3">
                        <div
                            className="bg-[#2563EB] h-3 rounded-full transition-all duration-500"
                            style={{ width: `${pep.progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* GenAI Integration Button */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="size-12 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                            <Sparkles className="text-purple-600" size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900 mb-2">
                                AI-Powered Activity Generation
                            </h3>
                            <p className="text-sm text-slate-600 mb-4">
                                Generate personalized activities based on your child's screening results.
                                Activities will be tailored to their developmental needs in sports, music, recreation, arts, and games.
                            </p>
                            <button
                                onClick={handleGenerateFromResults}
                                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all"
                            >
                                <Sparkles size={18} />
                                <span>Generate Activities from Test Results</span>
                            </button>
                            <p className="text-xs text-purple-700 mt-3">
                                <strong>Integration Pending:</strong> This feature will be available once GenAI service is connected.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(`/pep/${id}/progress`)}
                            className="flex items-center gap-2 px-6 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg font-semibold transition-all"
                        >
                            <BarChart3 size={18} />
                            <span>View Progress</span>
                        </button>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
                        >
                            <Plus size={18} />
                            <span>Add Activity</span>
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                    <div className="grid md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search activities..."
                                className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-3.5 text-slate-400" size={18} />
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
                                className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all appearance-none"
                            >
                                <option value="all">All Categories</option>
                                <option value="sports">Sports</option>
                                <option value="music">Music</option>
                                <option value="recreation">Recreation</option>
                                <option value="arts">Arts</option>
                                <option value="games">Games</option>
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-3.5 text-slate-400" size={18} />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                                className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all appearance-none"
                            >
                                <option value="all">All Status</option>
                                <option value="completed">Completed</option>
                                <option value="incomplete">Incomplete</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                        <p className="text-sm font-semibold text-slate-600 mb-1">Total</p>
                        <p className="text-2xl font-bold text-slate-900">{activities.length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                        <p className="text-sm font-semibold text-slate-600 mb-1">Completed</p>
                        <p className="text-2xl font-bold text-green-600">
                            {activities.filter(a => a.completed).length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                        <p className="text-sm font-semibold text-slate-600 mb-1">In Progress</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {activities.filter(a => !a.completed).length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                        <p className="text-sm font-semibold text-slate-600 mb-1">Completion</p>
                        <p className="text-2xl font-bold text-[#2563EB]">{pep.progress}%</p>
                    </div>
                </div>

                {/* Activities List */}
                {filteredActivities.length > 0 ? (
                    <div className="space-y-4">
                        {filteredActivities.map((activity) => {
                            const CategoryIcon = getCategoryIcon(activity.category);
                            const DomainIcon = getDomainIcon(activity.domain);
                            const categoryColor = getCategoryColor(activity.category);

                            return (
                                <div
                                    key={activity.id}
                                    className={`bg-white rounded-xl shadow-md border-2 p-6 transition-all ${activity.completed
                                        ? 'border-green-200 bg-green-50/30'
                                        : 'border-slate-200 hover:shadow-lg'
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Completion Toggle */}
                                        <button
                                            onClick={() => handleToggleCompletion(activity)}
                                            className="shrink-0 mt-1"
                                        >
                                            {activity.completed ? (
                                                <CheckCircle2 className="text-green-600" size={28} />
                                            ) : (
                                                <Circle className="text-slate-300 hover:text-slate-400" size={28} />
                                            )}
                                        </button>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <h3 className={`text-lg font-bold mb-2 ${activity.completed ? 'text-slate-500 line-through' : 'text-slate-900'
                                                        }`}>
                                                        {activity.title}
                                                    </h3>
                                                    <p className={`text-sm mb-3 ${activity.completed ? 'text-slate-400' : 'text-slate-600'
                                                        }`}>
                                                        {activity.description}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Badges */}
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${categoryColor.bg} ${categoryColor.text} ${categoryColor.border}`}>
                                                    <CategoryIcon size={14} />
                                                    {activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}
                                                </span>
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-slate-100 text-slate-700 border-slate-200">
                                                    <DomainIcon size={14} />
                                                    {activity.domain.charAt(0).toUpperCase() + activity.domain.slice(1)}
                                                </span>
                                                {activity.completed && activity.completedAt && (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-green-100 text-green-700 border-green-200">
                                                        Completed {formatDate(activity.completedAt)}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <button
                                                    onClick={() => navigate(`/pep/${id}/activities/${activity.id}`)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg font-semibold text-sm transition-all"
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                    <span>View Details</span>
                                                </button>
                                                <button
                                                    onClick={() => handleSuggestSimilar(activity)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg font-semibold text-sm transition-all"
                                                    title="Suggest Similar Activity (GenAI Integration Point)"
                                                >
                                                    <Sparkles size={16} />
                                                    <span>Suggest Similar</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedActivity(activity);
                                                        setFormData({
                                                            title: activity.title,
                                                            description: activity.description,
                                                            category: activity.category,
                                                            domain: activity.domain,
                                                        });
                                                        setShowEditModal(true);
                                                    }}
                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-[#2563EB] rounded-lg font-semibold text-sm transition-all"
                                                >
                                                    <Edit size={16} />
                                                    <span>Edit</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedActivity(activity);
                                                        setShowDeleteModal(true);
                                                    }}
                                                    className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-semibold text-sm transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                    <span>Delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center">
                        <Activity className="mx-auto text-slate-300 mb-4" size={64} />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                            {activities.length === 0 ? 'No Activities Yet' : 'No Matching Activities'}
                        </h3>
                        <p className="text-slate-600 mb-6">
                            {activities.length === 0
                                ? 'Add activities manually or generate them from test results.'
                                : 'Try adjusting your filters or search query.'}
                        </p>
                        {activities.length === 0 && (
                            <div className="flex items-center justify-center gap-3">
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="px-6 py-3 bg-[#2563EB] text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
                                >
                                    Add Activity Manually
                                </button>
                                <button
                                    onClick={handleGenerateFromResults}
                                    className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all"
                                >
                                    Generate from Results
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Add Activity Modal */}
            {
                showAddModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-slate-900">Add Activity</h3>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="size-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600"
                                >
                                    <AlertCircle size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                                        Activity Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full h-12 px-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
                                        placeholder="e.g., Balance Beam Walking"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all resize-none"
                                        placeholder="Describe the activity and how to perform it..."
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                                            Category
                                        </label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value as CreateActivityData['category'] })}
                                            className="w-full h-12 px-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
                                        >
                                            <option value="sports">Sports</option>
                                            <option value="music">Music</option>
                                            <option value="recreation">Recreation</option>
                                            <option value="arts">Arts</option>
                                            <option value="games">Games</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                                            Domain
                                        </label>
                                        <select
                                            value={formData.domain}
                                            onChange={(e) => setFormData({ ...formData, domain: e.target.value as CreateActivityData['domain'] })}
                                            className="w-full h-12 px-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
                                        >
                                            <option value="motor">Motor</option>
                                            <option value="social">Social</option>
                                            <option value="cognitive">Cognitive</option>
                                            <option value="communication">Communication</option>
                                            <option value="adaptive">Adaptive</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    disabled={processing}
                                    className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddActivity}
                                    disabled={processing}
                                    className="flex-1 px-4 py-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} />
                                            <span>Adding...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={18} />
                                            <span>Add Activity</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Edit Activity Modal */}
            {
                showEditModal && selectedActivity && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-slate-900">Edit Activity</h3>
                                <button
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setSelectedActivity(null);
                                    }}
                                    className="size-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600"
                                >
                                    <AlertCircle size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                                        Activity Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full h-12 px-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all resize-none"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                                            Category
                                        </label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value as CreateActivityData['category'] })}
                                            className="w-full h-12 px-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
                                        >
                                            <option value="sports">Sports</option>
                                            <option value="music">Music</option>
                                            <option value="recreation">Recreation</option>
                                            <option value="arts">Arts</option>
                                            <option value="games">Games</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                                            Domain
                                        </label>
                                        <select
                                            value={formData.domain}
                                            onChange={(e) => setFormData({ ...formData, domain: e.target.value as CreateActivityData['domain'] })}
                                            className="w-full h-12 px-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
                                        >
                                            <option value="motor">Motor</option>
                                            <option value="social">Social</option>
                                            <option value="cognitive">Cognitive</option>
                                            <option value="communication">Communication</option>
                                            <option value="adaptive">Adaptive</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setSelectedActivity(null);
                                    }}
                                    disabled={processing}
                                    className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleEditActivity}
                                    disabled={processing}
                                    className="flex-1 px-4 py-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} />
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Edit size={18} />
                                            <span>Save Changes</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Delete Confirmation Modal */}
            {
                showDeleteModal && selectedActivity && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="size-12 rounded-full bg-red-100 flex items-center justify-center">
                                    <Trash2 className="text-red-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Delete Activity</h3>
                                    <p className="text-sm text-slate-600">This action cannot be undone</p>
                                </div>
                            </div>

                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                <p className="text-sm text-red-900 mb-2">
                                    You are about to permanently delete:
                                </p>
                                <p className="text-sm text-red-800">
                                    <strong>{selectedActivity.title}</strong>
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setSelectedActivity(null);
                                    }}
                                    disabled={processing}
                                    className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteActivity}
                                    disabled={processing}
                                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} />
                                            <span>Deleting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 size={18} />
                                            <span>Delete</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
}
