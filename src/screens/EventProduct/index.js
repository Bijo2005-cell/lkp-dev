import React, { useState, useRef } from "react";
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
  const [event] = useState(dummyEventData);
  const [quantity, setQuantity] = useState(1);
  const [loading] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0, pets: 0 });
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const guestItemRef = useRef(null);
  const [selectedTicketType, setSelectedTicketType] = useState(event.ticketTypes?.[0]?.id || "general");
  const [showTicketTypePicker, setShowTicketTypePicker] = useState(false);
  const ticketTypeItemRef = useRef(null);

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
    return moment().isBefore(moment(event.bookingCutoffTime));
  };

  // Get all images for gallery
  const allImages = [event.coverImage, ...(event.gallery || [])].filter(Boolean);

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

  return (
    <div className={styles.eventProduct}>
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

            {/* What You'll Do Section */}
            {event.whatYoullDo && event.whatYoullDo.length > 0 && (
              <section className={cn("section", styles.contentSection, styles.whatYoullDoSection)}>
                <h2 className={styles.sectionTitle}>Artist</h2>
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
                          return `${selectedType.name} - ${event.currency} ${selectedType.price}`;
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
                      const selectedType = event.ticketTypes?.find(t => t.id === selectedTicketType) || { price: event.ticketPrice || 0 };
                      const totalGuests = guests.adults + guests.children;
                      const totalPrice = totalGuests * selectedType.price;
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
      {event.eventMode === "Offline" && (
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
