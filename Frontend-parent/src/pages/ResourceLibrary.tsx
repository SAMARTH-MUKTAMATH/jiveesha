import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Search, Filter, FileText, Video, Download,
    Link as LinkIcon, Wrench, Heart, ExternalLink, Eye,
    Calendar, User, Clock, HardDrive, Star, Share2, BookOpen
} from 'lucide-react';
import Layout from '../components/Layout';
import resourceService from '../services/resource.service';
import type { Resource, ResourceFilters } from '../services/resource.service';

type CategoryFilter = 'all' | 'article' | 'video' | 'document' | 'tool' | 'link';

export default function ResourceLibrary() {
    const navigate = useNavigate();
    const [resources, setResources] = useState<Resource[]>([]);
    const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
    const [topicFilter, setTopicFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

    const topics = [
        'Autism Spectrum Disorder',
        'ADHD',
        'Speech & Language Delays',
        'Motor Skills Development',
        'Social Skills',
        'Behavioral Support',
        'Parent Training',
        'Therapy Techniques',
        'Educational Strategies',
    ];

    useEffect(() => {
        loadResources();
    }, []);

    useEffect(() => {
        filterResources();
    }, [resources, categoryFilter, topicFilter, searchQuery, showFavoritesOnly]);

    const loadResources = async () => {
        try {
            const response = await resourceService.getResources();
            if (response.success) {
                setResources(response.data);
            }
            setLoading(false);
        } catch (error) {
            console.error('Failed to load resources:', error);
            setLoading(false);
        }
    };

    const filterResources = () => {
        let filtered = resources;

        // Filter by favorites
        if (showFavoritesOnly) {
            filtered = filtered.filter(r => r.isFavorite);
        }

        // Filter by category
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(r => r.category === categoryFilter);
        }

        // Filter by topic
        if (topicFilter !== 'all') {
            filtered = filtered.filter(r => r.topics && r.topics.includes(topicFilter.toLowerCase().replace(/\s+/g, '-')));
        }

        // Filter by search
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(r =>
                r.title.toLowerCase().includes(query) ||
                r.description.toLowerCase().includes(query) ||
                r.author?.toLowerCase().includes(query)
            );
        }

        setFilteredResources(filtered);
    };

    const handleToggleFavorite = async (resource: Resource) => {
        try {
            await resourceService.toggleFavorite(resource.id);
            await loadResources();
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
        }
    };

    const handleViewResource = async (resource: Resource) => {
        try {
            await resourceService.trackView(resource.id);

            if (resource.category === 'link') {
                window.open(resource.resourceUrl, '_blank');
            } else if (resource.category === 'document') {
                await resourceService.trackDownload(resource.id);
                window.open(resource.resourceUrl, '_blank');
            } else {
                // Navigate to resource detail page (future)
                window.open(resource.resourceUrl, '_blank');
            }
        } catch (error) {
            console.error('Failed to track view:', error);
        }
    };

    const getCategoryIcon = (category: Resource['category']) => {
        const icons: Record<string, typeof FileText> = {
            article: FileText,
            video: Video,
            document: Download,
            tool: Wrench,
            link: LinkIcon,
        };
        return icons[category] || FileText;
    };

    const getCategoryColor = (category: Resource['category']) => {
        const colors: Record<string, { bg: string; text: string; border: string }> = {
            article: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
            video: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
            document: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
            tool: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
            link: { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200' },
        };
        return colors[category] || { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' };
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
                        <p className="mt-4 text-slate-600">Loading resources...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-slate-600 hover:text-[#2563EB] font-semibold transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Dashboard</span>
                </button>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex flex-col gap-1">
                        <p className="text-slate-600 text-sm font-semibold uppercase tracking-wide">
                            Learning Center
                        </p>
                        <h1 className="text-slate-900 text-3xl md:text-4xl font-black leading-tight tracking-tight">
                            Resource Library
                        </h1>
                        <p className="text-slate-600 text-base">
                            Educational materials, tools, and support resources
                        </p>
                    </div>

                    <button
                        onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${showFavoritesOnly
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-red-50 hover:bg-red-100 text-red-700'
                            }`}
                    >
                        <Heart size={18} fill={showFavoritesOnly ? 'currentColor' : 'none'} />
                        <span>{showFavoritesOnly ? 'Show All' : 'My Favorites'}</span>
                    </button>
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
                                placeholder="Search resources..."
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
                                <option value="article">Articles</option>
                                <option value="video">Videos</option>
                                <option value="document">Documents</option>
                                <option value="tool">Tools</option>
                                <option value="link">External Links</option>
                            </select>
                        </div>

                        {/* Topic Filter */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-3.5 text-slate-400" size={18} />
                            <select
                                value={topicFilter}
                                onChange={(e) => setTopicFilter(e.target.value)}
                                className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all appearance-none"
                            >
                                <option value="all">All Topics</option>
                                {topics.map((topic) => (
                                    <option key={topic} value={topic}>
                                        {topic}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                        <p className="text-sm font-semibold text-slate-600 mb-1">Total</p>
                        <p className="text-2xl font-bold text-slate-900">{resources.length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                        <p className="text-sm font-semibold text-slate-600 mb-1">Articles</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {resources.filter(r => r.category === 'article').length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                        <p className="text-sm font-semibold text-slate-600 mb-1">Videos</p>
                        <p className="text-2xl font-bold text-purple-600">
                            {resources.filter(r => r.category === 'video').length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                        <p className="text-sm font-semibold text-slate-600 mb-1">Documents</p>
                        <p className="text-2xl font-bold text-green-600">
                            {resources.filter(r => r.category === 'document').length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                        <p className="text-sm font-semibold text-slate-600 mb-1">Favorites</p>
                        <p className="text-2xl font-bold text-red-600">
                            {resources.filter(r => r.isFavorite).length}
                        </p>
                    </div>
                </div>

                {/* Resources Grid */}
                {filteredResources.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredResources.map((resource) => {
                            const Icon = getCategoryIcon(resource.category);
                            const categoryColor = getCategoryColor(resource.category);

                            return (
                                <div
                                    key={resource.id}
                                    className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-all group"
                                >
                                    {/* Thumbnail */}
                                    {resource.thumbnailUrl ? (
                                        <div className="relative h-48 bg-slate-100 overflow-hidden">
                                            <img
                                                src={resource.thumbnailUrl}
                                                alt={resource.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            {resource.category === 'video' && resource.duration && (
                                                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs font-bold rounded">
                                                    {resource.duration}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className={`h-48 flex items-center justify-center ${categoryColor.bg}`}>
                                            <Icon className={categoryColor.text} size={64} />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="p-6 space-y-4">
                                        {/* Category Badge */}
                                        <div className="flex items-center justify-between">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${categoryColor.bg} ${categoryColor.text} ${categoryColor.border}`}>
                                                <Icon size={14} />
                                                {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
                                            </span>
                                            <button
                                                onClick={() => handleToggleFavorite(resource)}
                                                className="text-red-600 hover:text-red-700 transition-colors"
                                            >
                                                <Heart
                                                    size={20}
                                                    fill={resource.isFavorite ? 'currentColor' : 'none'}
                                                />
                                            </button>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-lg font-bold text-slate-900 line-clamp-2">
                                            {resource.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-sm text-slate-600 line-clamp-3">
                                            {resource.description}
                                        </p>

                                        {/* Topics */}
                                        {resource.topics && resource.topics.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {resource.topics.slice(0, 2).map((topic) => (
                                                    <span
                                                        key={topic}
                                                        className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded"
                                                    >
                                                        {topic.replace(/-/g, ' ')}
                                                    </span>
                                                ))}
                                                {resource.topics.length > 2 && (
                                                    <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded">
                                                        +{resource.topics.length - 2} more
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Metadata */}
                                        <div className="pt-4 border-t border-slate-200 space-y-2 text-xs text-slate-600">
                                            {resource.author && (
                                                <div className="flex items-center gap-2">
                                                    <User size={14} className="text-[#2563EB]" />
                                                    <span>{resource.author}</span>
                                                </div>
                                            )}
                                            {resource.publishedDate && (
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} className="text-[#2563EB]" />
                                                    <span>{formatDate(resource.publishedDate)}</span>
                                                </div>
                                            )}
                                            {resource.fileSize && (
                                                <div className="flex items-center gap-2">
                                                    <HardDrive size={14} className="text-[#2563EB]" />
                                                    <span>{resource.fileSize}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1">
                                                    <Eye size={14} className="text-[#2563EB]" />
                                                    <span>{resource.viewCount} views</span>
                                                </div>
                                                {resource.category === 'document' && (
                                                    <div className="flex items-center gap-1">
                                                        <Download size={14} className="text-[#2563EB]" />
                                                        <span>{resource.downloadCount} downloads</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <button
                                            onClick={() => handleViewResource(resource)}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
                                        >
                                            {resource.category === 'link' ? (
                                                <>
                                                    <ExternalLink size={18} />
                                                    <span>Visit Link</span>
                                                </>
                                            ) : resource.category === 'document' ? (
                                                <>
                                                    <Download size={18} />
                                                    <span>Download</span>
                                                </>
                                            ) : resource.category === 'video' ? (
                                                <>
                                                    <Video size={18} />
                                                    <span>Watch Video</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Eye size={18} />
                                                    <span>View Resource</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center">
                        <BookOpen className="mx-auto text-slate-300 mb-4" size={64} />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                            {resources.length === 0 ? 'No Resources Available' : 'No Matching Resources'}
                        </h3>
                        <p className="text-slate-600">
                            {resources.length === 0
                                ? 'Resources are being curated for you.'
                                : 'Try adjusting your filters or search query.'}
                        </p>
                    </div>
                )}
            </div>
        </Layout>
    );
}
