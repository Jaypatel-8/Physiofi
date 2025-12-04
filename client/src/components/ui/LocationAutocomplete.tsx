'use client'

import { useState, useEffect, useRef } from 'react'
import { MapPinIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface LocationAutocompleteProps {
  onLocationSelect: (location: {
    street: string
    city: string
    state: string
    pincode: string
    country: string
    coordinates?: { lat: number; lng: number }
  }) => void
  initialValue?: {
    street?: string
    city?: string
    state?: string
    pincode?: string
  }
  className?: string
}

const LocationAutocomplete = ({ onLocationSelect, initialValue, className = '' }: LocationAutocompleteProps) => {
  const [address, setAddress] = useState({
    street: initialValue?.street || '',
    city: initialValue?.city || '',
    state: initialValue?.state || '',
    pincode: initialValue?.pincode || '',
    country: 'India'
  })
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }

    setIsLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          // Reverse geocoding using Nominatim (OpenStreetMap)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          )
          const data = await response.json()
          
          if (data.address) {
            const addr = data.address
            const location = {
              street: `${addr.house_number || ''} ${addr.road || addr.street || ''}`.trim(),
              city: addr.city || addr.town || addr.village || '',
              state: addr.state || '',
              pincode: addr.postcode || '',
              country: addr.country || 'India',
              coordinates: { lat: latitude, lng: longitude }
            }
            setAddress(location)
            onLocationSelect(location)
          }
        } catch (error) {
          console.error('Error fetching location:', error)
        } finally {
          setIsLoading(false)
        }
      },
      (error) => {
        console.error('Error getting location:', error)
        setIsLoading(false)
      }
    )
  }

  const searchAddress = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    try {
      // Using Nominatim for address autocomplete
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=5&addressdetails=1`
      )
      const data = await response.json()
      
      setSuggestions(data)
      setShowSuggestions(true)
    } catch (error) {
      console.error('Error searching address:', error)
    }
  }

  const handleSuggestionSelect = (suggestion: any) => {
    const addr = suggestion.address
    const location = {
      street: `${addr.house_number || ''} ${addr.road || addr.street || ''}`.trim(),
      city: addr.city || addr.town || addr.village || '',
      state: addr.state || '',
      pincode: addr.postcode || '',
      country: addr.country || 'India',
      coordinates: {
        lat: parseFloat(suggestion.lat),
        lng: parseFloat(suggestion.lon)
      }
    }
    setAddress(location)
    onLocationSelect(location)
    setShowSuggestions(false)
    setSuggestions([])
  }

  const handleInputChange = (field: string, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }))
    
    if (field === 'street' && value.length >= 3) {
      searchAddress(value)
    }
    
    // Update parent component
    onLocationSelect({ ...address, [field]: value })
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors text-sm font-semibold disabled:opacity-50"
        >
          <MapPinIcon className="h-4 w-4" />
          {isLoading ? 'Fetching...' : 'Use Current Location'}
        </button>
      </div>

      <div className="relative">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Street Address
        </label>
        <input
          ref={inputRef}
          type="text"
          value={address.street}
          onChange={(e) => handleInputChange('street', e.target.value)}
          onFocus={() => address.street.length >= 3 && setShowSuggestions(true)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10"
          placeholder="Start typing your address..."
        />
        {address.street && (
          <button
            type="button"
            onClick={() => {
              setAddress(prev => ({ ...prev, street: '' }))
              onLocationSelect({ ...address, street: '' })
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}

        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionSelect(suggestion)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                <p className="font-medium text-gray-900">{suggestion.display_name}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            City
          </label>
          <input
            type="text"
            value={address.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="City"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            State
          </label>
          <input
            type="text"
            value={address.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="State"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Pincode
          </label>
          <input
            type="text"
            value={address.pincode}
            onChange={(e) => handleInputChange('pincode', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Pincode"
            maxLength={6}
          />
        </div>
      </div>
    </div>
  )
}

export default LocationAutocomplete



