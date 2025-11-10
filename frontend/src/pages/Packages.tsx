import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PackageCard } from '@/components/PackageCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { packageApi } from '@/services/api';
import { Search, Filter, X, ArrowUpDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Packages() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [priceFilter, setPriceFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const itemsPerPage = 9;

  const buildQueryParams = () => {
    const params: Record<string, string | number> = {
      page,
      limit: itemsPerPage,
      sortBy
    };

    if (searchQuery) params.search = searchQuery;
    if (selectedTags.length > 0) params.tags = selectedTags.join(',');

    if (priceFilter === 'low') params.price = '0:1000';
    if (priceFilter === 'medium') params.price = '1000:2000';
    if (priceFilter === 'high') params.price = '2000:';

    if (durationFilter === 'short') params.duration = '0:5';
    if (durationFilter === 'medium') params.duration = '6:10';
    if (durationFilter === 'long') params.duration = '11:';

    return params;
  };

  const { data: packages, isLoading } = useQuery({
    queryKey: ['packages', searchQuery, page, sortBy, priceFilter, durationFilter, selectedTags],
    queryFn: async () => {
      const params = buildQueryParams();
      const response = await packageApi.list(params);
      return response;
    }
  });

  const { data: allTags } = useQuery({
    queryKey: ['all-tags'],
    queryFn: async () => {
      const { tags } = await packageApi.getTags();
      return tags;
    }
  });

  const totalPages = packages?.totalPages || 0;

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setPage(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setPriceFilter('all');
    setDurationFilter('all');
    setSelectedTags([]);
    setSortBy('newest');
    setPage(1);
  };

  const hasActiveFilters = searchQuery || priceFilter !== 'all' || durationFilter !== 'all' || selectedTags.length > 0;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="gradient-bg py-12">
          <div className="container mx-auto px-4">
            <h1 className="mb-4 text-center text-4xl font-bold text-white">
              Explore Travel Packages
            </h1>
            <p className="mb-8 text-center text-white/90">
              Find your perfect adventure from our curated collection
            </p>
            
            <div className="mx-auto max-w-2xl">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search destinations, cities, or packages..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="container mx-auto px-4 py-8">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              
              <Select value={priceFilter} onValueChange={(value) => { setPriceFilter(value); setPage(1); }}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="low">Under $1000</SelectItem>
                  <SelectItem value="medium">$1000 - $2000</SelectItem>
                  <SelectItem value="high">Over $2000</SelectItem>
                </SelectContent>
              </Select>

              <Select value={durationFilter} onValueChange={(value) => { setDurationFilter(value); setPage(1); }}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Durations</SelectItem>
                  <SelectItem value="short">1-5 days</SelectItem>
                  <SelectItem value="medium">6-10 days</SelectItem>
                  <SelectItem value="long">11+ days</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <X className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={(value) => { setSortBy(value); setPage(1); }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="duration">Duration: Short to Long</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {allTags && allTags.length > 0 && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="mb-2 text-sm font-medium">Filter by Tags:</div>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="h-96 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : packages?.data && packages.data.length > 0 ? (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                Showing {packages.data.length} of {packages.count} packages
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {packages.data.map((pkg) => (
                  <PackageCard key={pkg.id} {...pkg} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-12 flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-2 px-4">
                    <span className="text-sm text-muted-foreground">
                      Page {page} of {totalPages}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery || hasActiveFilters 
                  ? 'No packages found matching your filters.' 
                  : 'No packages available yet.'}
              </p>
              {hasActiveFilters && (
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
