# PHASE 3-P1: RESOURCE LIBRARY & BROWSE
## Build Educational Resource Library with Search & Filtering

**Prompt ID:** 3-P1  
**Phase:** 3 - Parent Portal Frontend  
**Section:** P - Resources & Settings  
**Dependencies:** 3-O4 complete (PEP section complete)  
**Estimated Time:** 35-40 minutes

---

## 🎯 OBJECTIVE

Create the resource library page where parents can:
- Browse educational resources and materials
- Search resources by keyword
- Filter by category (articles, videos, documents, tools, links)
- Filter by topic/tag (autism, ADHD, speech delay, motor skills, etc.)
- View resource details
- Save resources to favorites
- Download resources (PDFs, documents)
- Share resources with clinicians
- Access external links
- Responsive grid layout

**Resource Categories:**
- 📄 **Articles**: Educational articles about child development
- 🎥 **Videos**: Tutorial videos, webinars, demonstrations
- 📁 **Documents**: PDFs, guides, checklists, worksheets
- 🛠️ **Tools**: Interactive tools, calculators, assessments
- 🔗 **External Links**: Helpful websites, organizations, support groups

**Topics/Tags:**
- Autism Spectrum Disorder
- ADHD
- Speech & Language Delays
- Motor Skills Development
- Social Skills
- Behavioral Support
- Parent Training
- Therapy Techniques
- Educational Strategies

**Styling:** Match Frontend-clinician patterns with #2563EB blue

---

## 📂 WORKING DIRECTORY

```
/Users/anikaet/Downloads/Jiveesha-Clinical/Frontend-parent/
```

---

## 📝 TASK INSTRUCTIONS

### Step 1: Create Resource Service

**File:** `src/services/resource.service.ts`

**Action:** CREATE this new file:

```typescript
import api from './api';

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'article' | 'video' | 'document' | 'tool' | 'link';
  topics: string[]; // e.g., ["autism", "motor-skills"]
  author?: string;
  publishedDate?: string;
  thumbnailUrl?: string;
  resourceUrl: string; // Download URL or external link
  isPremium: boolean;
  isFavorite: boolean;
  downloadCount: number;
  viewCount: number;
  duration?: string; // For videos: "15:30"
  fileSize?: string; // For documents: "2.5 MB"
  createdAt: string;
  updatedAt: string;
}

export interface ResourceFilters {
  category?: string;
  topic?: string;
  search?: string;
}

class ResourceService {
  async getResources(filters?: ResourceFilters): Promise<{ success: boolean; data: Resource[] }> {
    const params = filters || {};
    const response = await api.get('/parent/resources', { params });
    return response.data;
  }

  async getResource(id: string): Promise<{ success: boolean; data: Resource }> {
    const response = await api.get(`/parent/resources/${id}`);
    return response.data;
  }

  async toggleFavorite(id: string): Promise<{ success: boolean; data: Resource }> {
    const response = await api.post(`/parent/resources/${id}/favorite`);
    return response.data;
  }

  async getFavorites(): Promise<{ success: boolean; data: Resource[] }> {
    const response = await api.get('/parent/resources/favorites');
    return response.data;
  }

  async trackView(id: string): Promise<{ success: boolean }> {
    const response = await api.post(`/parent/resources/${id}/view`);
    return response.data;
  }

  async trackDownload(id: string): Promise<{ success: boolean }> {
    const response = await api.post(`/parent/resources/${id}/download`);
    return response.data;
  }

  async shareResource(id: string, clinicianIds: string[]): Promise<{ success: boolean }> {
    const response = await api.post(`/parent/resources/${id}/share`, { clinicianIds });
    return response.data;
  }
}

export default new ResourceService();
```

---

### Step 2: Create Resource Library Page

**File:** `src/pages/ResourceLibrary.tsx`

**Action:** CREATE this new file:

```typescript
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Search, Filter, FileText, Video, Download,
  Link as LinkIcon, Wrench, Heart, ExternalLink, Eye,
  Calendar, User, Clock, HardDrive, Star, Share2, BookOpen
} from 'lucide-react';
import Layout from '../components/Layout';
import resourceService, { Resource, ResourceFilters } from '../services/resource.service';

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
      filtered = filtered.filter(r => r.topics.includes(topicFilter.toLowerCase().replace(/\s+/g, '-')));
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
    const icons = {
      article: FileText,
      video: Video,
      document: Download,
      tool: Wrench,
      link: LinkIcon,
    };
    return icons[category];
  };

  const getCategoryColor = (category: Resource['category']) => {
    const colors = {
      article: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
      video: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
      document: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
      tool: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
      link: { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200' },
    };
    return colors[category];
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
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              showFavoritesOnly
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
                    {resource.topics.length > 0 && (
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
```

---

### Step 3: Update App.tsx with Resource Route

**File:** `src/App.tsx`

**Action:** ADD the new route:

```typescript
import ResourceLibrary from './pages/ResourceLibrary';

// In the Routes section, add:
<Route
  path="/resources"
  element={isAuthenticated ? <ResourceLibrary /> : <Navigate to="/login" />}
/>
```

---

### Step 4: Update Layout Navigation

**File:** `src/components/Layout.tsx`

**Action:** UPDATE the navLinks to add "Resources":

```typescript
const navLinks = [
  { label: 'Dashboard', path: '/dashboard', active: window.location.pathname === '/dashboard' },
  { label: 'My Children', path: '/children', active: window.location.pathname === '/children' },
  { label: 'Screening', path: '/screening/select', active: window.location.pathname.startsWith('/screening') },
  { label: 'Results', path: '/results', active: false },
  { label: 'PEP Builder', path: '/pep', active: window.location.pathname.startsWith('/pep') },
  { label: 'Resources', path: '/resources', active: window.location.pathname.startsWith('/resources') },
];
```

---

### Step 5: Run and Test

```bash
cd /Users/anikaet/Downloads/Jiveesha-Clinical/Frontend-parent
npm run dev
```

**Test Flow:**
1. Navigate to "Resources" in navigation
2. See resource library page
3. View resource grid
4. Test search functionality
5. Test category filter
6. Test topic filter
7. Click "My Favorites"
8. Toggle favorite on a resource
9. Click "Visit Link" on link resource
10. Click "Download" on document resource
11. Click "Watch Video" on video resource
12. View stats cards
13. Test responsive layout

---

## ✅ SUCCESS CRITERIA

1. ✅ Resource service created
2. ✅ Resource library page working
3. ✅ Resource grid displays
4. ✅ Search filters resources
5. ✅ Category filter works
6. ✅ Topic filter works
7. ✅ Favorites toggle works
8. ✅ "My Favorites" view works
9. ✅ Stats cards display
10. ✅ Resource actions work (view/download/link)
11. ✅ Navigation updated
12. ✅ Empty state displays
13. ✅ Responsive layout

---

## 🧪 TESTING CHECKLIST

- [ ] Navigate to /resources
- [ ] Resource library loads
- [ ] Stats cards accurate
- [ ] Resource grid displays
- [ ] Search by keyword works
- [ ] Category filter works
- [ ] Topic filter works
- [ ] Click "My Favorites"
- [ ] Favorites view shows only favorited items
- [ ] Toggle favorite (heart icon)
- [ ] Favorite count updates
- [ ] Click "Visit Link" (opens new tab)
- [ ] Click "Download" (opens document)
- [ ] Click "Watch Video" (opens video)
- [ ] View count increases
- [ ] Empty state when no resources
- [ ] Empty state when no matches
- [ ] Mobile responsive (375px)
- [ ] Tablet responsive (768px)
- [ ] Desktop responsive (1200px+)

---

## 🎨 DESIGN CONSISTENCY

- ✅ Resource cards with thumbnails
- ✅ Category badges color-coded
- ✅ Topic tags
- ✅ Favorite heart icon
- ✅ Stats grid (5 columns)
- ✅ Search and filter bar
- ✅ Action buttons (view/download/link)
- ✅ Metadata with icons
- ✅ Grid layout (3 columns)
- ✅ #2563EB blue color scheme
- ✅ Lucide React icons
- ✅ Hover effects on cards

---

## ⏭️ NEXT PROMPT

**PHASE_3-P2** - Settings & Account Management (FINAL!)

---

**Files Created:**
- ✅ `src/services/resource.service.ts`
- ✅ `src/pages/ResourceLibrary.tsx`

**Files Modified:**
- ✅ `src/App.tsx`
- ✅ `src/components/Layout.tsx`

**Mark complete and proceed to 3-P2 (Final prompt!)** ✅
