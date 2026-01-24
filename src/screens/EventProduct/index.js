import React, { useState, useRef, useEffect } from "react";
import cn from "classnames";
import moment from "moment";
import OutsideClickHandler from "react-outside-click-handler";
import styles from "./EventProduct.module.sass";
import Icon from "../../components/Icon";
import Loader from "../../components/Loader";
import Actions from "../../components/Actions";
import CommentsProduct from "../../components/CommentsProduct";
import Browse from "../../components/Browse";
import GuestPicker from "../../components/GuestPicker";
import { browse2 } from "../../mocks/browse";
import { useLocation } from "react-router-dom";
import { getEventDetails } from "../../utils/api";

const asNonEmptyString = (value) => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const asNumber = (value) => {
  const num = typeof value === "number" ? value : Number(value);
  return Number.isFinite(num) ? num : null;
};

const toIsoFromDateTimeParts = (dateValue, timeValue) => {
  const dateStr = asNonEmptyString(dateValue);
  const timeStr = asNonEmptyString(timeValue);
  if (!dateStr && !timeStr) return null;

  const candidates = [];
  if (dateStr && timeStr) {
    candidates.push(`${dateStr} ${timeStr}`);
    candidates.push(`${dateStr}, ${timeStr}`);
    candidates.push(`${dateStr}T${timeStr}`);
  }
  if (dateStr && !timeStr) candidates.push(dateStr);
  if (timeStr && !dateStr) candidates.push(timeStr);

  const formats = [
    moment.ISO_8601,
    "YYYY-MM-DD HH:mm",
    "YYYY-MM-DD hh:mm A",
    "YYYY-MM-DDTHH:mm",
    "DD/MM/YYYY, HH:mm",
    "DD/MM/YYYY, hh:mm a",
    "DD/MM/YYYY HH:mm",
    "DD/MM/YYYY hh:mm a",
    "MM/DD/YYYY, HH:mm",
    "MM/DD/YYYY, hh:mm a",
    "MM/DD/YYYY HH:mm",
    "MM/DD/YYYY hh:mm a",
  ];

  for (const c of candidates) {
    const m = moment(c, formats, true);
    if (m.isValid()) return m.toISOString();
  }

  const loose = moment(candidates[0]);
  return loose.isValid() ? loose.toISOString() : null;
};

const normalizeTicketTypes = (rawTypes, fallbackCurrency) => {
  if (!Array.isArray(rawTypes)) return [];
  return rawTypes
    .map((t, idx) => {
      const name =
        asNonEmptyString(t?.name) ||
        asNonEmptyString(t?.ticketName) ||
        asNonEmptyString(t?.ticket_name) ||
        `Ticket ${idx + 1}`;

      const price =
        asNumber(t?.price) ??
        asNumber(t?.ticketPrice) ??
        asNumber(t?.ticket_price) ??
        asNumber(t?.individualPrice) ??
        asNumber(t?.amount);

      const idRaw = t?.id ?? t?.ticketTypeId ?? t?.ticket_type_id ?? t?.typeId;
      const id = asNonEmptyString(idRaw) || (idRaw !== undefined && idRaw !== null ? String(idRaw) : null) || `tt-${idx}`;

      const currency = asNonEmptyString(t?.currency) || fallbackCurrency || "USD";

      const applicableSlots = Array.isArray(t?.applicableSlots)
        ? t.applicableSlots
        : Array.isArray(t?.slots)
          ? t.slots
          : [];

      return {
        id,
        name,
        price: Number.isFinite(price) ? price : 0,
        currency,
        applicableSlots,
      };
    })
    .filter(Boolean);
};

// Dummy event data with all required fields
const dummyEventData = {
  eventId: 1,
  coverImage: "/images/content/main-pic-1.jpg",
  title: "Summer Music Festival 2024",
  description: "Join us for an unforgettable weekend of live music, art, and community. Featuring top artists from around the world, local food vendors, and interactive art installations. This is a family-friendly event with activities for all ages.",
  gallery: [
    "/images/content/main-pic-2.jpg",
    "/images/content/main-pic-3.jpg",
    "/images/content/main-pic-4.jpg",
    "/images/content/main-pic-5.jpg",
    "/images/content/main-pic-6.jpg",
    "/images/content/browse-pic-1.jpg",
    "/images/content/browse-pic-2.jpg",
    "/images/content/browse-pic-3.jpg",
  ],
  startDate: "2024-07-15",
  startTime: "14:00",
  endDate: "2024-07-17",
  endTime: "22:00",
  isMultiDayEvent: true,
  eventMode: "Offline", // "Online" or "Offline"
  venueSearchLocation: "Central Park, New York",
  fullVenueAddress: "123 Park Avenue, New York, NY 10001, United States",
  latitude: 40.785091,
  longitude: -73.968285,
  totalCapacity: 10000,
  ticketPrice: 75,
  currency: "USD",
  ticketTypes: [
    { id: "general", name: "General Admission", price: 75 },
    { id: "vip", name: "VIP", price: 150 },
    { id: "premium", name: "Premium", price: 200 },
  ],
  bookingCutoffTime: "2024-07-14T12:00:00", // ISO format
  cancellationAllowed: true,
  cancellationCutoff: "2024-07-10T00:00:00", // ISO format
  refundPercentage: 80,
  organizerName: "City Events Co.",
  organizerEmail: "contact@cityevents.com",
  organizerPhone: "+1 (555) 123-4567",
  termsAndPolicies: "All tickets are non-transferable. Refunds are available up to 5 days before the event. No refunds will be issued after the cancellation cutoff date. Event may be cancelled or postponed due to weather or other circumstances beyond our control.",
  publishStatus: "Published", // "Published", "Draft", "Cancelled"
  whatYoullDo: [
    {
      title: "Join me in an exclusive lounge",
      description: "I'd love to get to know you and hear what the spirit of the Paralympics means to you.",
      image: "/images/content/main-pic-2.jpg",
    },
    {
      title: "Hear the story behind my medals",
      description: "Behind each medal is the journey of an athlete who kept going, despite adversity.",
      image: "/images/content/main-pic-3.jpg",
    },
    {
      title: "The Paralympic mindset",
      description: "I'll share the skills I've gained through competing in the Paralympics for 30 years.",
      image: "/images/content/main-pic-4.jpg",
    },
    {
      title: "Reflect on your own resilience",
      description: "I'll guide you through a mindset exercise to unlock the strengths that have come out of your setbacks.",
      image: "/images/content/main-pic-5.jpg",
    },
  ],
};

const EventProduct = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const eventIdFromQuery = searchParams.get("id");

  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0, pets: 0 });
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const guestItemRef = useRef(null);
  const [selectedTicketType, setSelectedTicketType] = useState("general");
  const [showTicketTypePicker, setShowTicketTypePicker] = useState(false);
  const ticketTypeItemRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!eventIdFromQuery) {
          if (!mounted) return;
          setEvent(dummyEventData);
          return;
        }

        const payload = await getEventDetails(eventIdFromQuery);

        const derivedId = payload?.eventId ?? payload?.event_id ?? payload?.id ?? payload?._id ?? eventIdFromQuery;

        const derivedCover =
          asNonEmptyString(payload?.coverImage) ||
          asNonEmptyString(payload?.coverImageUrl) ||
          asNonEmptyString(payload?.coverPhotoUrl) ||
          asNonEmptyString(payload?.imageUrl) ||
          asNonEmptyString(payload?.bannerUrl) ||
          asNonEmptyString(payload?.thumbnailUrl);

        const rawGallery = payload?.gallery ?? payload?.images ?? payload?.photos ?? payload?.media;
        const derivedGallery = Array.isArray(rawGallery)
          ? rawGallery
              .map((g) => {
                if (typeof g === "string") return asNonEmptyString(g);
                if (g && typeof g === "object") {
                  return (
                    asNonEmptyString(g?.url) ||
                    asNonEmptyString(g?.src) ||
                    asNonEmptyString(g?.imageUrl)
                  );
                }
                return null;
              })
              .filter(Boolean)
          : [];

        const ticketSaleEndIso =
          toIsoFromDateTimeParts(payload?.ticketSaleEndDate, payload?.ticketSaleEndTime) ||
          toIsoFromDateTimeParts(payload?.ticketSaleEnd, payload?.ticketSaleEndTime) ||
          asNonEmptyString(payload?.ticketSaleEndDateTime) ||
          asNonEmptyString(payload?.ticketSaleEndDatetime) ||
          asNonEmptyString(payload?.ticketSaleEndAt) ||
          asNonEmptyString(payload?.bookingCutoffTime) ||
          asNonEmptyString(payload?.bookingCutoff);

        const rawTicketTypes = payload?.ticketTypes || payload?.tickets || payload?.ticket_types;
        const normalizedTicketTypes = normalizeTicketTypes(rawTicketTypes, payload?.currency || dummyEventData.currency);

        const inferredTicketCurrency = asNonEmptyString(payload?.currency) || dummyEventData.currency;
        const inferredTicketPrice =
          asNumber(payload?.ticketPrice) ??
          asNumber(payload?.ticket_price) ??
          asNumber(payload?.price) ??
          asNumber(payload?.amount);
        const inferredTicketName =
          asNonEmptyString(payload?.ticketTypeName) ||
          asNonEmptyString(payload?.ticketName) ||
          asNonEmptyString(payload?.ticket_type) ||
          asNonEmptyString(payload?.ticketType) ||
          "General Admission";
        const inferredTicketTypes = Number.isFinite(inferredTicketPrice)
          ? [{ id: "default", name: inferredTicketName, price: inferredTicketPrice, currency: inferredTicketCurrency, applicableSlots: [] }]
          : [];

        const rawSlots =
          payload?.applicableSlots ||
          payload?.slots ||
          normalizedTicketTypes.flatMap((t) => t.applicableSlots || []);
        const slotNames = Array.isArray(rawSlots)
          ? rawSlots
              .map((s) => {
                if (typeof s === "string") return asNonEmptyString(s);
                if (s && typeof s === "object") {
                  return asNonEmptyString(s?.name) || asNonEmptyString(s?.title);
                }
                return null;
              })
              .filter(Boolean)
          : [];

        const derivedArtists = slotNames.map((name, index) => ({
          title: name,
          description: "",
          image: dummyEventData.gallery[index % dummyEventData.gallery.length],
        }));

        const derivedVenueSearchLocation =
          asNonEmptyString(payload?.venueSearchLocation) ||
          asNonEmptyString(payload?.venue) ||
          asNonEmptyString(payload?.location) ||
          asNonEmptyString(payload?.venueName) ||
          asNonEmptyString(payload?.city);

        const derivedFullVenueAddress =
          asNonEmptyString(payload?.fullVenueAddress) ||
          asNonEmptyString(payload?.address) ||
          asNonEmptyString(payload?.venueAddress) ||
          asNonEmptyString(payload?.fullAddress);

        const derivedLatitude = asNumber(payload?.latitude) ?? asNumber(payload?.lat);
        const derivedLongitude = asNumber(payload?.longitude) ?? asNumber(payload?.lng) ?? asNumber(payload?.lon);

        const normalizedEvent = {
          ...dummyEventData,
          ...payload,
          eventId: derivedId,
          title: payload?.title || payload?.eventName || payload?.name || dummyEventData.title,
          description: payload?.description || payload?.about || payload?.details || dummyEventData.description,
          coverImage: derivedCover || dummyEventData.coverImage,
          gallery: derivedGallery.length > 0 ? derivedGallery : dummyEventData.gallery,
          startDate: payload?.startDate || payload?.start_date || dummyEventData.startDate,
          startTime: payload?.startTime || payload?.start_time || dummyEventData.startTime,
          endDate: payload?.endDate || payload?.end_date || dummyEventData.endDate,
          endTime: payload?.endTime || payload?.end_time || dummyEventData.endTime,
          eventMode: payload?.eventMode || payload?.mode || dummyEventData.eventMode,
          venueSearchLocation: derivedVenueSearchLocation,
          fullVenueAddress: derivedFullVenueAddress,
          latitude: derivedLatitude,
          longitude: derivedLongitude,
          totalCapacity: payload?.totalCapacity ?? payload?.capacity ?? dummyEventData.totalCapacity,
          ticketPrice: inferredTicketPrice ?? null,
          currency: inferredTicketCurrency,
          ticketTypes:
            normalizedTicketTypes.length > 0
              ? normalizedTicketTypes
              : inferredTicketTypes,
          bookingCutoffTime: ticketSaleEndIso || dummyEventData.bookingCutoffTime,
          cancellationAllowed: payload?.cancellationAllowed ?? dummyEventData.cancellationAllowed,
          cancellationCutoff: payload?.cancellationCutoff || payload?.cancellationCutoffTime || dummyEventData.cancellationCutoff,
          refundPercentage: payload?.refundPercentage ?? dummyEventData.refundPercentage,
          organizerName: payload?.organizerName || payload?.organizer || dummyEventData.organizerName,
          organizerEmail: payload?.organizerEmail || dummyEventData.organizerEmail,
          organizerPhone: payload?.organizerPhone || dummyEventData.organizerPhone,
          termsAndPolicies: payload?.termsAndPolicies || payload?.terms || dummyEventData.termsAndPolicies,
          artists: derivedArtists,
          whatYoullDo: Array.isArray(payload?.whatYoullDo) ? payload.whatYoullDo : [],
        };

        if (!mounted) return;
        setEvent(normalizedEvent);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || "Failed to load event details");
        setEvent(dummyEventData);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [eventIdFromQuery]);

  useEffect(() => {
    if (!event) return;
    setSelectedTicketType(event.ticketTypes?.[0]?.id || "general");
  }, [event]);

  // Format date for display
  const formatDate = (dateStr) => {
    return moment(dateStr).format("MMMM D, YYYY");
  };

  // Format time for display
  const formatTime = (timeStr) => {
    return moment(timeStr, "HH:mm").format("h:mm A");
  };

  // Format datetime for display
  const formatDateTime = (dateTimeStr) => {
    return moment(dateTimeStr).format("MMMM D, YYYY [at] h:mm A");
  };

  // Calculate days until event
  const daysUntilEvent = () => {
    const eventDate = moment(event.startDate);
    const today = moment();
    const diff = eventDate.diff(today, "days");
    return diff > 0 ? diff : 0;
  };

  // Check if booking is still open
  const isBookingOpen = () => {
    if (!event.bookingCutoffTime) return true;
    const cutoff = moment(event.bookingCutoffTime);
    if (!cutoff.isValid()) return true;
    return moment().isBefore(cutoff);
  };

  // Get all images for gallery
  const allImages = [event?.coverImage, ...(event?.gallery || [])].filter(Boolean);

  const socials = [
    { title: "twitter", url: "https://twitter.com/ui8" },
    { title: "instagram", url: "https://www.instagram.com/ui8net/" },
    { title: "facebook", url: "https://www.facebook.com/ui8.net/" },
  ];

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <Loader />
      </div>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <div className={styles.eventProduct}>
      {error && (
        <div style={{ padding: "1rem", textAlign: "center", backgroundColor: "#fee", color: "#c33" }}>
          <p>⚠️ {error}</p>
        </div>
      )}
      {/* Hero Section with Title, Actions, and Gallery */}
      <div className={cn("section-mb64", styles.hero)}>
        <div className={cn("container", styles.heroContainer)}>
          {/* Header with Title and Actions */}
          <div className={styles.heroHeader}>
            <div className={styles.heroTitleBox}>
              <h1 className={styles.heroTitle}>{event.title}</h1>
            </div>
            <div className={styles.heroActions}>
              <Actions />
            </div>
          </div>

          {/* Gallery Layout - 4 Images in Rectangle Arrangement */}
          {allImages.length > 0 && (
            <div className={styles.heroGallery}>
              {/* Main Large Image on Left */}
              <div 
                className={styles.heroMainImage}
                onClick={() => setGalleryIndex(0)}
              >
                <img 
                  src={allImages[0] || "/images/content/main-pic-1.jpg"} 
                  alt={event.title} 
                />
              </div>

              {/* Grid of 3 Smaller Images on Right */}
              <div className={styles.heroImageGrid}>
                {[1, 2, 3].map((imgIdx) => {
                  const img = allImages[imgIdx] || allImages[0];
                  const isLast = imgIdx === 3;
                  return (
                    <div
                      key={imgIdx}
                      className={styles.heroGridImage}
                      onClick={() => setGalleryIndex(imgIdx)}
                    >
                      <img 
                        src={img} 
                        alt={`Event ${imgIdx + 1}`} 
                      />
                      {/* Show all photos button on last image */}
                      {isLast && allImages.length > 4 && (
                        <button 
                          className={styles.showAllPhotos}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Navigate to full photo view or open gallery
                          }}
                        >
                          <Icon name="image" size="20" />
                          <span>Show all photos</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={cn("container", styles.container)}>
        <div className={styles.layout}>
          {/* Left Column - Main Content */}
          <div className={styles.mainContent}>
            {/* Description Section */}
            <section className={cn("section", styles.contentSection)}>
              <h2 className={styles.sectionTitle}>About This Event</h2>
              <div className={styles.description}>
                <p>{event.description}</p>
              </div>
            </section>

            {/* Artists Section */}
            {event.artists && event.artists.length > 0 && (
              <section className={cn("section", styles.contentSection, styles.whatYoullDoSection)}>
                <h2 className={styles.sectionTitle}>Artists</h2>
                <div className={styles.whatYoullDoList}>
                  {event.artists.map((item, index) => (
                    <div
                      key={index}
                      className={cn(styles.whatYoullDoItem, {
                        [styles.lastItem]: index === event.artists.length - 1,
                      })}
                    >
                      <div className={styles.whatYoullDoImage}>
                        <img src={item.image} alt={item.title} />
                      </div>
                      <div className={styles.whatYoullDoContent}>
                        <h3 className={styles.whatYoullDoTitle}>{item.title}</h3>
                        <p className={styles.whatYoullDoDescription}>{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* What You'll Do Section */}
            {event.whatYoullDo && event.whatYoullDo.length > 0 && (
              <section className={cn("section", styles.contentSection, styles.whatYoullDoSection)}>
                <h2 className={styles.sectionTitle}>What you'll do</h2>
                <div className={styles.whatYoullDoList}>
                  {event.whatYoullDo.map((item, index) => (
                    <div
                      key={index}
                      className={cn(styles.whatYoullDoItem, {
                        [styles.lastItem]: index === event.whatYoullDo.length - 1,
                      })}
                    >
                      <div className={styles.whatYoullDoImage}>
                        <img src={item.image} alt={item.title} />
                      </div>
                      <div className={styles.whatYoullDoContent}>
                        <h3 className={styles.whatYoullDoTitle}>{item.title}</h3>
                        <p className={styles.whatYoullDoDescription}>{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}





          </div>

          {/* Right Column - Booking Sidebar */}
          <div className={styles.sidebar}>
            {/* Booking Card */}
            <div className={styles.bookingCard}>
              {/* Event Information Heading */}
              <h3 className={styles.bookingCardTitle}>Event Information</h3>
              
              {/* Event Details List */}
              <div className={styles.eventDetailsList}>
                <div className={styles.eventDetailItem}>
                  <Icon name="calendar" size="18" />
                  <span>{formatDate(event.startDate)}</span>
                </div>
                <div className={styles.eventDetailItem}>
                  <Icon name="clock" size="18" />
                  <span>{formatTime(event.startTime)}</span>
                </div>
                <div className={styles.eventDetailItem}>
                  <Icon name="clock" size="18" />
                  <span>1hr 30min</span>
                </div>
                <div className={styles.eventDetailItem}>
                  <Icon name="user" size="18" />
                  <span>18+</span>
                </div>
                <div className={styles.eventDetailItem}>
                  <Icon name="globe" size="18" />
                  <span>English</span>
                </div>
                <div className={styles.eventDetailItem}>
                  <Icon name="star" size="18" />
                  <span>Music</span>
                </div>
                {/* Guest/Attendee Selector */}
                <div 
                  ref={guestItemRef}
                  className={cn(styles.eventDetailItem, styles.clickableItem)}
                  style={{ position: 'relative' }}
                >
                  <Icon name="user" size="18" />
                  <div 
                    className={styles.guestSelector}
                    onClick={() => setShowGuestPicker(!showGuestPicker)}
                    role="button"
                  >
                    <span className={styles.guestLabel}>Guest</span>
                    <span className={styles.guestValue}>
                      {guests.adults + guests.children === 0 
                        ? "Add guests" 
                        : guests.adults + guests.children === 1 
                        ? "1 guest" 
                        : `${guests.adults + guests.children} guests`}
                    </span>
                  </div>
                  <GuestPicker
                    visible={showGuestPicker}
                    onClose={() => setShowGuestPicker(false)}
                    onGuestChange={(guestData) => {
                      setGuests(guestData);
                    }}
                    initialGuests={guests}
                    maxGuests={event.totalCapacity || undefined}
                    allowPets={false}
                    childrenAllowed={true}
                    infantsAllowed={true}
                    adultsLabel="Guests"
                  />
                </div>
                {/* Ticket Type Selector */}
                {event.ticketTypes && event.ticketTypes.length > 0 && (
                  <OutsideClickHandler onOutsideClick={() => setShowTicketTypePicker(false)}>
                    <div 
                      ref={ticketTypeItemRef}
                      className={cn(styles.eventDetailItem, styles.clickableItem)}
                      style={{ position: 'relative' }}
                    >
                      <Icon name="bag" size="18" />
                      <div 
                        className={styles.guestSelector}
                        onClick={() => setShowTicketTypePicker(!showTicketTypePicker)}
                        role="button"
                      >
                      <span className={styles.guestLabel}>Ticket Type</span>
                      <span className={styles.guestValue}>
                        {(() => {
                          const selectedType = event.ticketTypes.find(t => t.id === selectedTicketType) || event.ticketTypes[0];
                          const price = asNumber(selectedType?.price) ?? asNumber(event.ticketPrice) ?? 0;
                          return `${selectedType?.name || "Ticket"} - ${event.currency} ${price.toFixed(2)}`;
                        })()}
                      </span>
                      </div>
                      {showTicketTypePicker && (
                        <div className={styles.ticketTypePicker}>
                          {event.ticketTypes.map((ticketType) => (
                            <div
                              key={ticketType.id}
                              className={cn(styles.ticketTypeOption, {
                                [styles.selected]: selectedTicketType === ticketType.id,
                              })}
                              onClick={() => {
                                setSelectedTicketType(ticketType.id);
                                setShowTicketTypePicker(false);
                              }}
                            >
                              <div className={styles.ticketTypeName}>{ticketType.name}</div>
                              <div className={styles.ticketTypePrice}>
                                {event.currency} {ticketType.price}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </OutsideClickHandler>
                )}
              </div>

              {/* Booking Status Banner */}
              {isBookingOpen() && (
                <div className={styles.bookingStatusBanner}>
                  <Icon name="bell" size="18" />
                  <span>Bookings are filling fast for {event.venueSearchLocation || "this event"}</span>
                </div>
              )}

              {!isBookingOpen() && (
                <div className={styles.bookingStatusBannerClosed}>
                  <Icon name="close-circle" size="18" />
                  <span>Booking is now closed</span>
                </div>
              )}

              {/* Total Price and Book Button Section */}
              <div className={styles.bookingFooter}>
                <div className={styles.totalPriceSection}>
                  <span className={styles.totalPriceLabel}>Total Price</span>
                  <span className={styles.totalPriceAmount}>
                    {(() => {
                      const selectedType = event.ticketTypes?.find(t => t.id === selectedTicketType) || event.ticketTypes?.[0] || { price: event.ticketPrice || 0 };
                      const totalGuests = guests.adults + guests.children;
                      const unitPrice = asNumber(selectedType?.price) ?? asNumber(event.ticketPrice) ?? 0;
                      const totalPrice = totalGuests * unitPrice;
                      return `${event.currency} ${totalPrice.toFixed(2)}`;
                    })()}
                  </span>
                </div>
                <button 
                  className={cn("button", styles.bookButton)}
                  disabled={!isBookingOpen()}
                >
                  <span>Book Now</span>
                  <Icon name="bag" size="16" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Venue Information Section */}
      {event.eventMode === "Offline" && (event.venueSearchLocation || event.fullVenueAddress || (event.latitude && event.longitude)) && (
        <section className={cn("section", styles.venueSection)}>
          <div className={cn("container", styles.venueContainer)}>
            <div className={styles.venueInner}>
              <h2 className={styles.sectionTitle}>Venue Information</h2>
              <div className={styles.venueCard}>
                <div className={styles.venueHeader}>
                  <Icon name="marker" size="24" />
                  <div>
                    <div className={styles.venueLocation}>{event.venueSearchLocation}</div>
                    <div className={styles.venueAddress}>{event.fullVenueAddress}</div>
                  </div>
                </div>
                {event.latitude && event.longitude && (
                  <div className={styles.venueMap}>
                    <div className={styles.mapPlaceholder}>
                      <Icon name="location" size="48" />
                      <p>Map View</p>
                      <div className={styles.mapCoordinates}>
                        {event.latitude.toFixed(6)}, {event.longitude.toFixed(6)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Cancellation & Refund Policy Section */}
      {(event.cancellationAllowed !== undefined || event.refundPercentage) && (
        <section className={cn("section", styles.policySection)}>
          <div className={cn("container", styles.policyContainer)}>
            <div className={styles.policyInner}>
              <h2 className={styles.sectionTitle}>Cancellation & Refund Policy</h2>
              <div className={styles.policyCard}>
                <div className={styles.policyItem}>
                  <div className={styles.policyLabel}>Cancellation Allowed</div>
                  <div className={styles.policyValue}>
                    {event.cancellationAllowed ? (
                      <span className={styles.badgeYes}>Yes</span>
                    ) : (
                      <span className={styles.badgeNo}>No</span>
                    )}
                  </div>
                </div>
                {event.cancellationAllowed && event.cancellationCutoff && (
                  <div className={styles.policyItem}>
                    <div className={styles.policyLabel}>Cancellation Cut-off</div>
                    <div className={styles.policyValue}>
                      {formatDateTime(event.cancellationCutoff)}
                    </div>
                  </div>
                )}
                {event.refundPercentage !== undefined && (
                  <div className={styles.policyItem}>
                    <div className={styles.policyLabel}>Refund Percentage</div>
                    <div className={styles.policyValue}>{event.refundPercentage}%</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Terms & Policies Section */}
      {event.termsAndPolicies && (
        <section className={cn("section", styles.termsSection)}>
          <div className={cn("container", styles.termsContainer)}>
            <div className={styles.termsInner}>
              <h2 className={styles.sectionTitle}>Terms & Policies</h2>
              <div className={styles.termsCard}>
                <p>{event.termsAndPolicies}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <section className={cn("section", styles.reviewsSection)}>
        <div className={cn("container", styles.reviewsContainer)}>
          <div className={styles.reviewsInner}>
            <CommentsProduct
              className={styles.comments}
              parametersUser={[
                { title: "Verified Organizer", icon: "check" },
              ]}
              info={event.description}
              socials={socials}
              buttonText="Contact Organizer"
            />
          </div>
        </div>
      </section>

      {/* Related Events */}
      <div className={styles.relatedSection}>
        <Browse
          classSection="section"
          headSmall
          classTitle="h4"
          title="More Events You Might Like"
          items={browse2}
        />
      </div>
    </div>
  );
};

export default EventProduct;
