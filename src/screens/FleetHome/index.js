import React, { useState, useEffect, useRef } from "react";
import cn from "classnames";
import moment from "moment";
import styles from "./FleetHome.module.sass";
import Icon from "../../components/Icon";
import { getHomepageSections, getHomepageSectionListings } from "../../utils/api";
import { HomepageSectionCard } from "./CardStyles";
import InlineDatePicker from "../../components/InlineDatePicker";
import GuestPicker from "../../components/GuestPicker";

const filterOptions = [
  { id: "experience", label: "Experience", icon: "star" },
  { id: "events", label: "Events", icon: "calendar" },
  { id: "stays", label: "Stays", icon: "home" },
  { id: "food", label: "Food", icon: "burger" },
  { id: "places", label: "Places", icon: "marker" },
];

const FleetHome = () => {
  const [activeFilter, setActiveFilter] = useState("experience");
  const [sectionsData, setSectionsData] = useState([]); // Array of { section, listings }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search state
  const [selectedDate, setSelectedDate] = useState(null);
  const [guests, setGuests] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const dateItemRef = useRef(null);
  const guestItemRef = useRef(null);
  
  // Determine if calendar should be shown (for Experience, Events, and Stays)
  const showCalendar = activeFilter === "experience" || activeFilter === "events" || activeFilter === "stays";
  
  // Format selected date for display
  const formattedDate = selectedDate 
    ? moment(selectedDate).format("MMM DD, YYYY") 
    : "Select date";
  
  // Format guest count for display
  const guestCountText = (() => {
    const total = guests.adults + guests.children;
    if (total === 0) return "Add guests";
    if (total === 1) return "1 guest";
    return `${total} guests`;
  })();
  
  // Handle date selection
  const handleDateSelect = (startDateStr, endDateStr) => {
    if (startDateStr) {
      const parsedDate = moment(startDateStr, "MMM DD, YYYY");
      if (parsedDate.isValid()) {
        setSelectedDate(parsedDate.toDate());
      }
    }
  };
  
  // Handle guest change
  const handleGuestChange = (newGuests) => {
    setGuests(newGuests);
  };
  
  // Close pickers when filter changes
  useEffect(() => {
    setShowDatePicker(false);
    setShowGuestPicker(false);
  }, [activeFilter]);
  
  // Fetch homepage sections and their listings
  useEffect(() => {
    const loadHomepageData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Step 1: Fetch all sections
        const fetchedSections = await getHomepageSections();
        console.log("✅ Fetched homepage sections:", fetchedSections);
        
        // Sort sections by sortOrder
        const sortedSections = [...fetchedSections].sort((a, b) => {
          const orderA = a.sortOrder !== undefined ? a.sortOrder : 999;
          const orderB = b.sortOrder !== undefined ? b.sortOrder : 999;
          return orderA - orderB;
        });
        
        // Step 2: Fetch listings for each section in parallel
        const sectionPromises = sortedSections.map(async (section) => {
          try {
            const sectionData = await getHomepageSectionListings(section.sectionId, 12, 0);
            return {
              section: sectionData.section || section,
              listings: sectionData.listings || [],
            };
          } catch (err) {
            console.warn(`⚠️ Failed to fetch listings for section ${section.sectionId}:`, err);
            return {
              section: section,
              listings: [], // Return empty listings array if fetch fails
            };
          }
        });
        
        const sectionsWithListings = await Promise.allSettled(sectionPromises);
        const resolvedSections = sectionsWithListings.map((result) => {
          if (result.status === "fulfilled") {
            return result.value;
          }
          return { section: {}, listings: [] };
        });
        
        setSectionsData(resolvedSections);
        console.log("✅ Loaded all sections with listings:", resolvedSections);
        
      } catch (err) {
        console.error("❌ Error loading homepage data:", err);
        setError(err.message || "Failed to load homepage data");
      } finally {
        setLoading(false);
      }
    };
    
    loadHomepageData();
  }, []);

  return (
    <div className={cn("section", styles.section)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.searchBar}>
          <div className={styles.searchField}>
            <Icon name="arrow-right" size="20" />
            <div className={styles.searchFieldContent}>
              <div className={styles.searchLabel}>Where to?</div>
              <input type="text" placeholder="Search Destination" className={styles.searchInput} />
            </div>
          </div>
          {showCalendar && (
            <>
              <div className={styles.searchDivider}></div>
              <div 
                className={styles.searchField}
                ref={dateItemRef}
                style={{ position: "relative" }}
              >
                <Icon name="calendar" size="20" />
                <div 
                  className={styles.searchFieldContent}
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  style={{ cursor: "pointer" }}
                >
                  <div className={styles.searchLabel}>Check-in</div>
                  <div className={styles.searchInput}>
                    {formattedDate}
                  </div>
                </div>
                <InlineDatePicker
                  visible={showDatePicker}
                  onClose={() => setShowDatePicker(false)}
                  onDateSelect={handleDateSelect}
                  selectedDate={selectedDate}
                  className={styles.datePicker}
                />
              </div>
            </>
          )}
          <div className={styles.searchDivider}></div>
          <div 
            className={styles.searchField}
            ref={guestItemRef}
            style={{ position: "relative" }}
          >
            <Icon name="user" size="20" />
            <div 
              className={styles.searchFieldContent}
              onClick={() => setShowGuestPicker(!showGuestPicker)}
              style={{ cursor: "pointer" }}
            >
              <div className={styles.searchLabel}>Guest Count</div>
              <div className={styles.searchInput}>{guestCountText}</div>
            </div>
            <GuestPicker
              visible={showGuestPicker}
              onClose={() => setShowGuestPicker(false)}
              onGuestChange={handleGuestChange}
              initialGuests={guests}
              className={styles.guestPicker}
            />
          </div>
          <button className={styles.searchButton}>Search</button>
        </div>

        <div className={styles.filtersContainer}>
          <div className={styles.filtersGrid}>
            {filterOptions.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={cn(styles.filterCard, {
                  [styles.filterCardActive]: activeFilter === filter.id,
                })}
                onClick={() => setActiveFilter(filter.id)}
              >
                <div className={styles.filterCardContent}>
                  <Icon name={filter.icon} size="20" />
                  <span>{filter.label}</span>
                </div>
                {filter.id !== "experience" && (
                  <div className={styles.comingSoonBadge}>Coming Soon</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Sections from API */}
        {loading && (
          <div style={{ padding: "3rem", textAlign: "center" }}>
            <p>Loading homepage sections...</p>
          </div>
        )}
        
        {error && (
          <div style={{ padding: "1rem", textAlign: "center", backgroundColor: "#fee", color: "#c33" }}>
            <p>⚠️ {error}</p>
          </div>
        )}
        
        {!loading && !error && sectionsData.length === 0 && (
          <div style={{ padding: "3rem", textAlign: "center" }}>
            <p>No sections available</p>
          </div>
        )}
        
        {!loading &&
          sectionsData.map((sectionData, index) => {
            if (!sectionData.section || !sectionData.listings || sectionData.listings.length === 0) {
              return null; // Skip sections with no listings
            }
            
            return (
              <HomepageSectionCard
                key={sectionData.section.sectionId || index}
                section={sectionData.section}
                listings={sectionData.listings}
              />
            );
          })}
      </div>
    </div>
  );
};

export default FleetHome;

