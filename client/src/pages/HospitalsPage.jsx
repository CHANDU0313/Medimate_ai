import React, { useState, useEffect } from 'react';
import { Search, MapPin, Navigation, Phone, ExternalLink, Filter, Hospital, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function HospitalsPage() {
  const { language, t } = useLanguage();
  const isTelugu = language === 'te';
  const h = t.hospitals;

  const [searchQuery, setSearchQuery] = useState('Guntur');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [facilities, setFacilities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState(null);
  const [userCoords, setUserCoords] = useState(null);

  const fetchFacilities = async (query = searchQuery, filter = selectedFilter, coords = userCoords) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (filter) params.append('filter', filter);
      if (coords?.lat && coords?.lng) {
        params.append('lat', coords.lat.toString());
        params.append('lng', coords.lng.toString());
      }
      params.append('language', language);

      const res = await fetch(`/api/hospitals?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.facilities)) {
          setFacilities(data.facilities);
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Hospital API fetch failed, using local offline dataset:', err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchFacilities(searchQuery, selectedFilter, userCoords);
  }, [selectedFilter, language]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFacilities(searchQuery, selectedFilter, userCoords);
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus(
        isTelugu
          ? 'మీ బ్రౌజర్‌లో జియోలొకేషన్ సదుపాయం లేదు.'
          : 'Geolocation is not supported by your browser.'
      );
      return;
    }

    setLocationStatus(
      isTelugu
        ? 'లొకేషన్ అనుమతి అడుగుతున్నాము...'
        : 'Requesting location permission to calculate distance...'
    );

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        setLocationStatus(
          isTelugu
            ? `లొకేషన్ గుర్తించబడింది (${coords.lat.toFixed(2)}, ${coords.lng.toFixed(2)}) — దూరం క్రమబద్ధీకరించబడింది`
            : `Location acquired (${coords.lat.toFixed(2)}, ${coords.lng.toFixed(2)}) — sorted by distance`
        );
        fetchFacilities(searchQuery, selectedFilter, coords);
      },
      (err) => {
        setLocationStatus(
          isTelugu
            ? 'లొకేషన్ అనుమతి తిరస్కరించబడింది. మీరు మాన్యువల్‌గా నగరం పేరుతో శోధించవచ్చు.'
            : 'Location permission was denied. You can still search manually by city or PIN code.'
        );
      }
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {h.title}
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm">
          {h.subtitle}
        </p>
      </div>

      {/* Search Input & Location Button (Matching Screenshot 2) */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label htmlFor="search-input" className="block text-xs font-bold text-slate-700 mb-1.5">
              {h.searchLabel}
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" aria-hidden="true" />
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={h.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="sm:self-end">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-colors shadow-xs"
            >
              {isLoading ? (isTelugu ? 'శోధిస్తోంది...' : 'Searching...') : h.searchBtn}
            </button>
          </div>
        </form>

        {/* Use My Location + Privacy Note (Matching Screenshot 2) */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleUseLocation}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <Navigation className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
            <span>{h.useLocationBtn}</span>
          </button>

          <p className="text-[11px] text-slate-500 leading-tight">
            {h.locationPrivacyNote}
          </p>
        </div>

        {locationStatus && (
          <p className="text-xs text-teal-800 font-medium bg-teal-50 p-2.5 rounded-lg border border-teal-100">
            {locationStatus}
          </p>
        )}
      </div>

      {/* Filter Chips (Matching Screenshot 2: All, Hospital, Clinic, Within 10 km) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs" role="group" aria-label="Facility filters">
        {[
          { id: 'All', label: h.filters.all },
          { id: 'Hospital', label: h.filters.hospital },
          { id: 'Clinic', label: h.filters.clinic },
          { id: 'Within 10 km', label: h.filters.within10km }
        ].map((chip) => (
          <button
            key={chip.id}
            type="button"
            onClick={() => setSelectedFilter(chip.id)}
            aria-pressed={selectedFilter === chip.id}
            className={`px-3.5 py-1.5 rounded-full font-bold transition-all ${
              selectedFilter === chip.id
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Facility List on Left, Map View on Right (Matching Screenshot 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Facility Cards */}
        <div className="lg:col-span-6 space-y-4">
          {facilities.length > 0 ? (
            facilities.map((facility) => (
              <div
                key={facility.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 hover:border-teal-500/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                    {isTelugu ? facility.nameTe : facility.nameEn}
                  </h3>
                  {facility.emergency24x7 && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold">
                      {isTelugu ? '24/7 ఎమర్జెన్సీ' : '24/7 Emergency'}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {isTelugu ? facility.addressTe : facility.addressEn} · <span className="font-semibold text-teal-800">[{facility.distanceKm} {h.card.distanceKm}]</span>
                </p>

                <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
                  {facility.phone && (
                    <span>
                      {h.card.phoneLabel}
                      <strong className="text-slate-700">{facility.phone}</strong>
                    </span>
                  )}
                  <span>
                    {h.card.sourceLabel}
                    <strong>{facility.source}</strong>
                  </span>
                </div>

                <div className="pt-2">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900 hover:underline"
                  >
                    <span>{h.card.getDirections}</span>
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-700">
                {isTelugu ? 'వైద్యశాలలు కనుగొనబడలేదు' : 'No facilities found for this search.'}
              </p>
              <p className="text-xs text-slate-500">
                {isTelugu ? 'వేరే నగరం లేదా పిన్ కోడ్ ప్రయత్నించండి (ఉదా: గుంటూరు, విశాఖపట్నం, తిరుపతి).' : 'Try searching for another town or PIN code (e.g. Guntur, Visakhapatnam, Tirupati).'}
              </p>
            </div>
          )}

          {/* Outdated Info Notice (Matching Screenshot 2) */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
            {h.outdatedNotice}
          </div>
        </div>

        {/* Right Column: Interactive OpenStreetMap View */}
        <div className="lg:col-span-6 bg-slate-100 rounded-3xl border border-slate-200/90 overflow-hidden h-[450px] relative shadow-2xs flex flex-col justify-between">
          <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs text-xs font-bold text-slate-800">
            {h.mapPlaceholder}
          </div>

          <iframe
            title="OpenStreetMap Andhra Pradesh"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            src="https://www.openstreetmap.org/export/embed.html?bbox=80.35%2C16.25%2C80.55%2C16.38&amp;layer=mapnik"
            className="w-full h-full border-0"
          />

          <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] text-slate-600 border border-slate-200">
            {h.osmAttribution}
          </div>
        </div>

      </div>

    </div>
  );
}
