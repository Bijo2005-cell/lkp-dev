import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { useLocation, useHistory } from "react-router-dom";
import {
  BedDouble,
  CalendarDays,
  ChevronRight,
  Check,
  CircleCheck,
  Clock3,
  Globe,
  Grid2x2,
  Heart,
  Info,
  List,
  Mail,
  MapPin,
  Phone,
  Share2,
  Shield,
  Star,
  Users,
} from "lucide-react";
import cn from "classnames";
import DateSingle from "../../components/DateSingle";
import GuestPicker from "../../components/GuestPicker";
import {
  createStayBooking,
  fallbackStayDetails,
  fetchRoomAvailability,
  fetchStayDetails,
  normalizeStayDetails,
} from "./stayDetailsData";
import styles from "./StayDetails.module.sass";

const ImageGallery = ({ gallery, title }) => {
  const [featured, ...supporting] = gallery;

  return (
    <section className={styles.gallery}>
      <div className={cn(styles.galleryCard, styles.galleryCardFeatured)}>
        <img src={featured.src} alt={featured.alt || title} className={styles.galleryImage} />
      </div>
      <div className={styles.galleryGrid}>
        {supporting.map((image) => (
          <div className={styles.galleryCard} key={image.src}>
            <img src={image.src} alt={image.alt || title} className={styles.galleryImage} />
          </div>
        ))}
      </div>
    </section>
  );
};

const formatGuestLabel = (guests) => {
  const total = (guests.adults || 0) + (guests.children || 0);
  if (total === 0) return "Add guests";
  if (total === 1) return "1 Guest";
  return `${total} Guests`;
};

const formatDateForApi = (date) => (moment.isMoment(date) ? date.format("YYYY-MM-DD") : "");
const parsePriceValue = (value) => Number(String(value || 0).replace(/,/g, "")) || 0;
const formatCurrency = (value) => `Rs.${Number(value || 0).toLocaleString("en-IN")}`;
const getTotalGuests = (guests) => (guests.adults || 0) + (guests.children || 0);
const getNightCount = (checkInDate, checkOutDate) => {
  if (!moment.isMoment(checkInDate) || !moment.isMoment(checkOutDate)) return 1;
  return Math.max(checkOutDate.clone().startOf("day").diff(checkInDate.clone().startOf("day"), "days"), 1);
};
const getRoomCapacity = (room) => Math.max(
  Number(
    room?.maxGuests ||
    room?.maxAdults ||
    ((Number(room?.maxAdults || 0) || 0) + (Number(room?.maxChildren || 0) || 0)) ||
    1
  ),
  1
);
const getRequiredRoomsForGuests = (room, totalGuests) => {
  const capacity = getRoomCapacity(room);
  return Math.max(Math.ceil(Math.max(totalGuests, 1) / capacity), 1);
};

const getCachedGuestDetails = () => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const customerData = JSON.parse(localStorage.getItem("customerData") || "{}");

    const customerName =
      userInfo.firstName ||
      userData.firstName ||
      customerData.firstName ||
      localStorage.getItem("firstName") ||
      "guest";

    const customerEmail =
      userInfo.email ||
      userData.email ||
      customerData.email ||
      localStorage.getItem("email") ||
      "guest@gmail.com";

    const customerPhone =
      userInfo.customerPhone ||
      userInfo.phoneNumber ||
      userInfo.phone ||
      customerData.customerPhone ||
      customerData.phoneNumber ||
      userData.phoneNumber ||
      localStorage.getItem("customerPhone") ||
      localStorage.getItem("phoneNumber") ||
      localStorage.getItem("phone") ||
      "";

    return {
      customerName: customerName || "guest",
      customerEmail: customerEmail || "guest@gmail.com",
      customerPhone,
    };
  } catch (error) {
    return {
      customerName: "guest",
      customerEmail: "guest@gmail.com",
      customerPhone:
        localStorage.getItem("customerPhone") ||
        localStorage.getItem("phoneNumber") ||
        localStorage.getItem("phone") ||
        "",
    };
  }
};

const RoomCountPicker = ({ visible, maxRooms, value, onIncrement, onDecrement }) => {
  if (!visible) return null;

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "8px 14px",
      border: "1px solid #DDE5F1",
      borderRadius: 12,
      background: "#fff",
      marginTop: 8,
    }}>
      <span style={{ fontSize: 13, color: "#8993A7", fontWeight: 600 }}>Rooms</span>
      <button
        type="button"
        onClick={onDecrement}
        disabled={value <= 1}
        style={{
          width: 28, height: 28, borderRadius: "50%",
          border: "1px solid #DDE5F1", background: "#F7F9FC",
          fontSize: 16, cursor: value <= 1 ? "not-allowed" : "pointer",
          color: "#283043", display: "flex", alignItems: "center", justifyContent: "center"
        }}
      >−</button>
      <span style={{ minWidth: 20, textAlign: "center", fontWeight: 700, fontSize: 14, color: "#283043" }}>
        {value}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        disabled={value >= maxRooms}
        style={{
          width: 28, height: 28, borderRadius: "50%",
          border: "1px solid #DDE5F1", background: "#F7F9FC",
          fontSize: 16, cursor: value >= maxRooms ? "not-allowed" : "pointer",
          color: "#283043", display: "flex", alignItems: "center", justifyContent: "center"
        }}
      >+</button>
      <span style={{ fontSize: 12, color: "#8993A7" }}>
        room{value !== 1 ? "s" : ""} of {maxRooms}
      </span>
    </div>
  );
};

const BookingCard = ({
  details,
  checkInDate,
  checkOutDate,
  guests,
  showGuestPicker,
  setShowGuestPicker,
  setCheckInDate,
  setCheckOutDate,
  setGuests,
  onBookNow,
  isSubmitting,
  isRoomBased,
  selectedRoom,
  displayPrice,
  displaySuffix,
  totalPrice,
  numberOfNights,
  totalGuests,
  capacityMessage,
  bookingError,
  isBookingBlocked,
  availabilityLoading,
  ctaLabel,
}) => (
  <aside className={styles.sidebarCard}>
    <div className={styles.bookingHeader}>
      <div>
        <span className={styles.priceValue}>{displayPrice}</span>
        <span className={styles.priceSuffix}>{displaySuffix}</span>
      </div>
      <div className={styles.ratingPill}>
        <Star size={14} fill="currentColor" />
        <span>{details.rating}</span>
      </div>
    </div>

    <div className={styles.bookingGrid}>
      <div className={styles.field}>
        <span>CHECK-IN</span>
        <div className={styles.dateField}>
          <DateSingle
            className={styles.datePicker}
            placeholder="Add date"
            displayFormat="MMM DD"
            date={checkInDate}
            onDateChange={setCheckInDate}
            id="stay-details-check-in"
            plain
            small
          />
          <CalendarDays size={14} className={styles.fieldIcon} />
        </div>
      </div>

      {/* Removed inline sidebar rooms +/- control — moved into each RoomCard */}

      <div className={styles.field}>
        <span>CHECK-OUT</span>
        <div className={styles.dateField}>
          <DateSingle
            className={styles.datePicker}
            placeholder="Add date"
            displayFormat="MMM DD"
            date={checkOutDate}
            onDateChange={setCheckOutDate}
            id="stay-details-check-out"
            plain
            small
          />
          <CalendarDays size={14} className={styles.fieldIcon} />
        </div>
      </div>

      <div className={cn(styles.field, styles.fieldWide, styles.guestFieldWrap)}>
        <span>GUESTS</span>
        <button
          type="button"
          className={styles.fieldButton}
          onClick={() => setShowGuestPicker(!showGuestPicker)}
        >
          <span>{formatGuestLabel(guests)}</span>
          <span className={styles.fieldButtonIcon}>
            <Users size={14} />
          </span>
        </button>
        <div className={styles.guestPickerWrap}>
          <GuestPicker
            visible={showGuestPicker}
            onClose={() => setShowGuestPicker(false)}
            onGuestChange={setGuests}
            initialGuests={guests}
            maxGuests={isRoomBased && selectedRoom ? getRoomCapacity(selectedRoom) * Math.max(Number(selectedRoom.availableRooms || 1), 1) : undefined}
            className={styles.guestPickerPopover}
          />
        </div>
      </div>
    </div>

    {isRoomBased && selectedRoom ? (
      <div className={styles.priceSummary}>
        <div className={styles.priceSummaryRow}>
          <span>
            {formatCurrency(parsePriceValue(selectedRoom.price))} x {selectedRoom.roomsBooked} room{selectedRoom.roomsBooked > 1 ? "s" : ""}
          </span>
          <strong>{formatCurrency(parsePriceValue(selectedRoom.price) * selectedRoom.roomsBooked)}</strong>
        </div>
        <div className={styles.priceSummaryRow}>
          <span>{numberOfNights} night{numberOfNights > 1 ? "s" : ""}</span>
          <strong>{formatCurrency(totalPrice)}</strong>
        </div>
      </div>
    ) : null}

    {capacityMessage ? <p className={styles.infoText}>{capacityMessage}</p> : null}
    {bookingError ? <p className={styles.errorText}>{bookingError}</p> : null}

    <button
      type="button"
      className={styles.availabilityButton}
      onClick={onBookNow}
      disabled={isSubmitting || isBookingBlocked}
    >
      {isSubmitting ? "Processing..." : availabilityLoading ? "Updating Availability..." : ctaLabel}
    </button>
    <p className={styles.helperText}>
      {isRoomBased && selectedRoom
        ? `${totalGuests} guest${totalGuests !== 1 ? "s" : ""} selected`
        : availabilityLoading
          ? "Checking rooms for your dates and guests"
          : "You won't be charged yet"}
    </p>
  </aside>
);

const ContactCard = ({ manager }) => (
  <aside className={styles.sidebarCard}>
    <h3 className={styles.contactTitle}>Contact Property</h3>
    <div className={styles.managerRow}>
      <div className={styles.managerBadge}>{manager.initials}</div>
      <div>
        <p className={styles.managerMeta}>{manager.role}</p>
        <p className={styles.managerName}>{manager.name}</p>
      </div>
    </div>

    <button type="button" className={styles.contactAction}>
      <Phone size={16} />
      <span>{manager.phone}</span>
    </button>
    <button type="button" className={styles.contactAction}>
      <Mail size={16} />
      <span>{manager.email}</span>
    </button>
    <button type="button" className={styles.contactAction}>
      <Globe size={16} />
      <span>{manager.website}</span>
    </button>
  </aside>
);

const RoomCard = ({ room, selectedRoom, onToggleSelect, onRoomsBookedChange, roomPickerOpen, totalGuests }) => {
  const isSelected = selectedRoom?.roomId === room.roomId;
  const roomCount = isSelected ? selectedRoom.roomsBooked : 1;
  const maxRooms = Math.max(Number(room.availableRooms || 1), 1);
  const requiredRooms = getRequiredRoomsForGuests(room, totalGuests);
  const canAccommodate = requiredRooms <= maxRooms;

  return (
    <article className={styles.roomCard}>
      <div className={styles.roomImageWrap}>
        <span className={styles.roomType}>{room.type}</span>
        <img src={room.image} alt={room.title} className={styles.roomImage} />
      </div>

      <div className={styles.roomContent}>
        <h3 className={styles.roomTitle}>{room.title}</h3>
        <div className={styles.roomMeta}>
          <span>
            <Users size={14} />
            {room.guests}
          </span>
          <span>
            <BedDouble size={14} />
            {room.units}
          </span>
        </div>
        <p className={styles.roomDescription}>{room.description}</p>
        <div className={styles.amenityList}>
          {room.amenities.map((amenity) => (
            <span className={styles.amenityChip} key={amenity}>
              {amenity}
            </span>
          ))}
        </div>
        <div className={styles.roomFooter}>
          <div>
            <span className={styles.roomPriceLabel}>{room.priceLabel || "STARTING FROM"}</span>
            <div className={styles.roomPriceRow}>
              <span className={styles.roomPrice}>Rs.{room.price}</span>
              <span className={styles.roomPriceSuffix}>/ night</span>
            </div>
            <p className={cn(styles.roomCapacityHint, { [styles.roomCapacityHintError]: !canAccommodate })}>
              {canAccommodate
                ? `${requiredRooms} room${requiredRooms > 1 ? "s" : ""} required for ${totalGuests} guest${totalGuests !== 1 ? "s" : ""}`
                : "No rooms available for selected guest count"}
            </p>
          </div>

          <div className={styles.roomActionGroup}>
            <button
              type="button"
              className={cn(styles.selectButton, { [styles.selectButtonDisabled]: !canAccommodate })}
              onClick={() => onToggleSelect(room)}
              disabled={!canAccommodate}
            >
              <span>{isSelected ? "Selected Room" : "Select Room"}</span>
              <ChevronRight size={16} />
            </button>

            {isSelected && (
              <div className={styles.roomPickerWrap}>
                <RoomCountPicker
                  visible={roomPickerOpen}
                  maxRooms={maxRooms}
                  value={roomCount}
                  onIncrement={() => onRoomsBookedChange(room.roomId, roomCount + 1)}
                  onDecrement={() => onRoomsBookedChange(room.roomId, roomCount - 1)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

const AmenitiesPanel = ({ details }) => (
  <section className={cn(styles.sectionBlock, styles.panelSection)}>
    <div className={styles.panelGrid}>
      <div>
        <div className={styles.panelHeading}>
          <Grid2x2 size={22} />
          <h2 className={styles.sectionTitle}>Property Amenities</h2>
        </div>
        <div className={styles.featureGrid}>
          {details.amenities.property.map((item) => (
            <div key={item} className={styles.featureItem}>
              <span className={cn(styles.featureIcon, styles.featureIconGreen)}>
                <Check size={16} />
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className={styles.panelHeading}>
          <List size={22} />
          <h2 className={styles.sectionTitle}>Facilities & Services</h2>
        </div>
        <div className={styles.featureGrid}>
          {details.amenities.services.map((item) => (
            <div key={item} className={styles.featureItem}>
              <span className={cn(styles.featureIcon, styles.featureIconBlue)}>
                <Check size={16} />
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const PoliciesPanel = ({ details }) => (
  <section className={cn(styles.sectionBlock, styles.panelSection)}>
    <div className={styles.policyShell}>
      <div className={styles.policyGrid}>
        <div className={styles.policyBlock}>
          <div className={styles.panelHeading}>
            <Clock3 size={22} />
            <h2 className={styles.sectionTitle}>Check-in / Check-out</h2>
          </div>
          <div className={styles.policyCard}>
            {details.policies.checkin.map((item) => (
              <div key={item.label} className={styles.policyRow}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.policyBlock}>
          <div className={styles.panelHeading}>
            <Shield size={22} />
            <h2 className={styles.sectionTitle}>Cancellation Policy</h2>
          </div>
          <div className={styles.policyCard}>
            <p className={styles.policyText}>{details.policies.cancellation}</p>
          </div>
        </div>
      </div>

      <div className={styles.policyBlock}>
        <div className={styles.panelHeading}>
          <CircleCheck size={22} />
          <h2 className={styles.sectionTitle}>House Rules</h2>
        </div>
        <div className={styles.policyCard}>
          <p className={styles.policyText}>{details.policies.houseRules}</p>
        </div>
      </div>

      <div className={styles.policyBlock}>
        <div className={styles.panelHeading}>
          <Info size={22} />
          <h2 className={styles.sectionTitle}>Arrival Instructions</h2>
        </div>
        <div className={styles.policyCard}>
          <p className={styles.policyText}>{details.policies.arrivalInstructions}</p>
        </div>
      </div>
    </div>
  </section>
);

const StayDetailsPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(fallbackStayDetails.secondaryTabs[0]);
  const [details, setDetails] = useState(fallbackStayDetails);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkInDate, setCheckInDate] = useState(moment());
  const [checkOutDate, setCheckOutDate] = useState(moment().add(1, "day"));
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [guests, setGuests] = useState({ adults: 2, children: 0, infants: 0, pets: 0 });
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomPickerOpen, setRoomPickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");

  const stayId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("id") || "2";
  }, [location.search]);

  const isRoomBased = details.bookingScope === "Room-Based";
  const history = useHistory();
  const totalGuests = useMemo(() => getTotalGuests(guests), [guests]);
  const numberOfNights = useMemo(() => getNightCount(checkInDate, checkOutDate), [checkInDate, checkOutDate]);
  const selectedRoomPrice = useMemo(() => parsePriceValue(selectedRoom?.price), [selectedRoom]);
  const roomCapacity = useMemo(() => getRoomCapacity(selectedRoom), [selectedRoom]);
  const availableRoomCount = useMemo(() => Math.max(Number(selectedRoom?.availableRooms || 1), 1), [selectedRoom]);
  const requiredRoomCount = useMemo(() => {
    if (!isRoomBased || !selectedRoom) return 1;
    return getRequiredRoomsForGuests(selectedRoom, totalGuests);
  }, [isRoomBased, selectedRoom, totalGuests]);
  const hasInsufficientRooms = Boolean(isRoomBased && selectedRoom && requiredRoomCount > availableRoomCount);
  const selectedRoomCount = selectedRoom?.roomsBooked || 1;
  const bookingError = hasInsufficientRooms ? "No rooms available for selected guest count" : availabilityError;
  const capacityMessage = useMemo(() => {
    if (!isRoomBased || !selectedRoom) return "";
    if (hasInsufficientRooms) {
      return `This room fits ${roomCapacity} guest${roomCapacity > 1 ? "s" : ""} per room, but your group needs ${requiredRoomCount} rooms and only ${availableRoomCount} ${availableRoomCount === 1 ? "is" : "are"} available.`;
    }
    if (requiredRoomCount > 1) {
      return `Guest count exceeds one-room capacity, so ${requiredRoomCount} rooms will be booked automatically.`;
    }
    return `This room fits up to ${roomCapacity} guest${roomCapacity > 1 ? "s" : ""} per room.`;
  }, [availableRoomCount, hasInsufficientRooms, isRoomBased, requiredRoomCount, roomCapacity, selectedRoom]);
  const totalPrice = useMemo(() => {
    if (isRoomBased && selectedRoom) {
      return selectedRoomPrice * selectedRoomCount * numberOfNights;
    }

    return parsePriceValue(details.price) * numberOfNights;
  }, [details.price, isRoomBased, numberOfNights, selectedRoom, selectedRoomCount, selectedRoomPrice]);
  const displayPrice = isRoomBased && selectedRoom
    ? formatCurrency(totalPrice)
    : formatCurrency(parsePriceValue(details.price));
  const displaySuffix = isRoomBased && selectedRoom ? " total" : " / night";
  const isBookingBlocked = Boolean(isRoomBased && (availabilityLoading || !selectedRoom || hasInsufficientRooms));
  const ctaLabel = !isRoomBased
    ? "Book Now"
    : !selectedRoom
      ? "Select Room to Book"
      : hasInsufficientRooms
        ? "No Rooms Available"
        : "Book Now";

  useEffect(() => {
    if (!isRoomBased || !selectedRoom) return;

    setSelectedRoom((prev) => {
      if (!prev) return prev;
      const nextMinimum = Math.max(Math.ceil(Math.max(totalGuests, 1) / getRoomCapacity(prev)), 1);
      const availableRooms = Math.max(Number(prev.availableRooms || 1), 1);
      const currentRooms = Math.max(Number(prev.roomsBooked || 1), 1);
      const nextRooms = Math.min(Math.max(currentRooms, nextMinimum), availableRooms);

      if (nextRooms === currentRooms) return prev;
      return { ...prev, roomsBooked: nextRooms };
    });
  }, [isRoomBased, selectedRoom, totalGuests]);

  useEffect(() => {
    let mounted = true;

    const loadStay = async () => {
      try {
        setLoading(true);
        setError("");
        const stay = await fetchStayDetails(stayId);
        if (!mounted) return;
        setDetails(normalizeStayDetails(stay));
      } catch (err) {
        if (!mounted) return;
        setError("Unable to load stay details right now.");
        setDetails(fallbackStayDetails);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadStay();
    return () => {
      mounted = false;
    };
  }, [stayId]);

  useEffect(() => {
    if (!isRoomBased) return;

    const checkIn = formatDateForApi(checkInDate);
    const checkOut = formatDateForApi(checkOutDate);
    if (!checkIn || !checkOut) return;

    let cancelled = false;

    const syncAvailability = async () => {
      try {
        setAvailabilityLoading(true);
        setAvailabilityError("");
        const response = await fetchRoomAvailability(stayId, checkIn, checkOut);
        if (cancelled) return;

        let nextAvailableRooms = [];
        setDetails((prev) => {
          nextAvailableRooms = (response?.rooms || []).map((room, index) => {
            const mealPlanCode = Object.keys(room.mealPlanPricing || {})[0] || "EP";
            const plan = room.mealPlanPricing?.[mealPlanCode] || {};
            return {
              roomId: room.roomId,
              type: `Room ${index + 1}`,
              title: room.roomName,
              description: prev.rooms[index]?.description || fallbackStayDetails.rooms[0].description,
              guests: `Max ${room.maxGuests || room.maxAdults || 2} Guests`,
              units: `${room.availableRooms || room.totalRooms || 1} Units`,
              price: Number(plan.b2cPrice || room.b2cPrice || 0).toLocaleString("en-IN"),
              priceLabel: "AVAILABLE RATE",
              image: prev.rooms[index]?.image || fallbackStayDetails.rooms[0].image,
              amenities: prev.rooms[index]?.amenities || fallbackStayDetails.rooms[0].amenities,
              availableRooms: Number(room.availableRooms || 1),
              mealPlanCode,
              maxAdults: Number(room.maxAdults || 0),
              maxChildren: Number(room.maxChildren || 0),
              maxGuests: Number(room.maxGuests || room.maxAdults || 2),
            };
          });

          return {
            ...prev,
            rooms: nextAvailableRooms.length ? nextAvailableRooms : prev.rooms,
          };
        });

        setSelectedRoom((prev) => {
          if (!prev) return prev;
          const matchedRoom = nextAvailableRooms.find((room) => room.roomId === prev.roomId);
          if (!matchedRoom) return null;

          const minimumRooms = getRequiredRoomsForGuests(matchedRoom, totalGuests);
          return {
            ...matchedRoom,
            roomsBooked: Math.min(
              Math.max(Number(prev.roomsBooked || 1), minimumRooms),
              Math.max(Number(matchedRoom.availableRooms || 1), 1)
            ),
          };
        });
      } catch (err) {
        if (!cancelled) {
          setAvailabilityError("Unable to update availability right now.");
        }
      } finally {
        if (!cancelled) {
          setAvailabilityLoading(false);
        }
      }
    };

    syncAvailability();

    return () => {
      cancelled = true;
    };
  }, [checkInDate, checkOutDate, isRoomBased, stayId, totalGuests]);

  const handleToggleSelectRoom = (room) => {
    const wasSelected = selectedRoom?.roomId === room.roomId;
    setSelectedRoom((prev) => (
      wasSelected
        ? null
        : {
            ...room,
            roomsBooked: Math.min(
              getRequiredRoomsForGuests(room, totalGuests),
              Math.max(Number(room.availableRooms || 1), 1)
            ),
          }
    ));
    // Open the inline room picker when a room is selected, close when deselected
    setRoomPickerOpen(!wasSelected);
  };

  const handleRoomsBookedChange = (roomId, roomsBooked) => {
    setSelectedRoom((prev) => {
      if (!prev || prev.roomId !== roomId) return prev;
      const maxRooms = Math.max(Number(prev.availableRooms || 1), 1);
      const minimumRooms = Math.max(Math.ceil(Math.max(totalGuests, 1) / getRoomCapacity(prev)), 1);
      const nextCount = Math.min(Math.max(Number(roomsBooked) || minimumRooms, minimumRooms), maxRooms);
      return { ...prev, roomsBooked: nextCount };
    });
  };

  const handleBookNow = async () => {
    // For room-based bookings require a selected room; for property-based proceed without a room
    if (isRoomBased && !selectedRoom) {
      window.alert("Please select a room first.");
      return;
    }
    if (hasInsufficientRooms) {
      window.alert("No rooms available for selected guest count");
      return;
    }
    const cachedGuest = getCachedGuestDetails();
    if (!cachedGuest.customerPhone && !cachedGuest.customerEmail) {
      window.alert("Please provide a phone number or email in your profile before booking.");
      return;
    }

    const payload = {
      stayId: Number(details.stayId || stayId),
      checkInDate: formatDateForApi(checkInDate),
      checkOutDate: formatDateForApi(checkOutDate),
      numberOfGuests: (guests.adults || 0) + (guests.children || 0),
      customerName: cachedGuest.customerName,
      customerEmail: cachedGuest.customerEmail,
      customerPhone: cachedGuest.customerPhone,
      specialRequests: "",
      rooms: isRoomBased
        ? [
            {
              roomId: Number(selectedRoom.roomId),
              roomsBooked: Number(selectedRoom.roomsBooked || 1),
              adults: Number(guests.adults || 0),
              children: Number(guests.children || 0),
              mealPlanCode: selectedRoom.mealPlanCode || "EP",
              extraBeds: 0,
            },
          ]
        : [],
    };

    try {
      setIsSubmitting(true);
      const response = await createStayBooking(payload);
      // build bookingData to pass to Checkout page
      const bookingData = {
        isStay: true,
        stayId: payload.stayId,
        checkInDate: payload.checkInDate,
        checkOutDate: payload.checkOutDate,
        guests: { adults: guests.adults || 0, children: guests.children || 0 },
        roomType: selectedRoom?.title || "",
        mealPlan: selectedRoom?.mealPlanCode || payload.rooms?.[0]?.mealPlanCode || "",
        roomImage: selectedRoom?.image || null,
        // include raw payload and API response for downstream pages
        pendingBookingRequest: payload,
        pendingBookingResponse: response,
      };

      // navigate to checkout/confirm-and-pay with bookingData in location state
      history.push("/checkout", { bookingData });
    } catch (err) {
      window.alert("Unable to create booking right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.content}>
        <section className={styles.hero}>
          <div className={styles.badges}>
            {details.badges.map((badge, index) => (
              <span
                key={`${badge}-${index}`}
                className={cn(styles.badge, {
                  [styles.badgeAccent]: index === 0,
                  [styles.badgeGold]: index === 2,
                })}
              >
                {index === 2 && <Star size={12} fill="currentColor" />}
                {badge}
              </span>
            ))}
          </div>

          <div className={styles.heroHead}>
            <div>
              <h1 className={styles.title}>{details.title}</h1>
              <p className={styles.location}>
                <MapPin size={16} />
                <span>{details.subtitle}</span>
              </p>
            </div>
            <div className={styles.heroActions}>
              <button type="button" className={styles.actionButton}>
                <Share2 size={16} />
                <span>Share</span>
              </button>
              <button type="button" className={styles.actionButton}>
                <Heart size={16} />
                <span>Save</span>
              </button>
            </div>
          </div>
          {error ? <p className={styles.statusText}>{error}</p> : null}
          {loading ? <p className={styles.statusText}>Loading stay details...</p> : null}
        </section>

        <ImageGallery gallery={details.gallery} title={details.title} />

        <section className={styles.mainGrid}>
          <div className={styles.primaryColumn}>
            <div className={styles.secondaryTabs}>
              {details.secondaryTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={cn(styles.secondaryTab, {
                    [styles.secondaryTabActive]: tab === activeTab,
                  })}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "Overview" && (
              <section className={styles.tabContent}>
                <section className={styles.sectionBlock}>
                  <h2 className={styles.sectionTitle}>About this property</h2>
                  <p className={styles.bodyCopy}>{details.overview}</p>

                  <div className={styles.statsCard}>
                    {details.stats.map((item) => (
                      <div key={item.label}>
                        <p className={styles.statLabel}>{item.label}</p>
                        <p className={styles.statValue}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </section>
            )}
            {activeTab === "Amenities" && <AmenitiesPanel details={details} />}
            {activeTab === "Policies" && <PoliciesPanel details={details} />}

            {isRoomBased && (
              <section className={styles.sectionBlock}>
                <div className={styles.sectionRow}>
                  <div>
                    <h2 className={styles.sectionTitle}>Available Rooms</h2>
                    <p className={styles.sectionSubtitle}>Select your perfect accommodation</p>
                  </div>
                  <span className={styles.infoBadge}>{details.rooms.length} room types found</span>
                </div>

                <div className={styles.roomList}>
                  {details.rooms.map((room) => (
                    <RoomCard
                      key={`${room.roomId}-${room.title}`}
                      room={room}
                      selectedRoom={selectedRoom}
                      onToggleSelect={handleToggleSelectRoom}
                      onRoomsBookedChange={handleRoomsBookedChange}
                      roomPickerOpen={roomPickerOpen && selectedRoom?.roomId === room.roomId}
                      totalGuests={totalGuests}
                    />
                  ))}
                </div>
              </section>
            )}

            <section className={styles.sectionBlock}>
              <h2 className={styles.sectionTitle}>Where you'll be</h2>
              <div className={styles.mapCard}>
                <div className={styles.mapLabel}>
                  <h3>{details.title}</h3>
                  <p>{details.subtitle}</p>
                </div>
                <button type="button" className={styles.mapButton}>
                  <MapPin size={16} />
                  <span>View in Google Maps</span>
                </button>
              </div>
            </section>
          </div>

          <div className={styles.sidebar}>
            <BookingCard
              details={details}
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              guests={guests}
              showGuestPicker={showGuestPicker}
              setShowGuestPicker={setShowGuestPicker}
              setCheckInDate={setCheckInDate}
              setCheckOutDate={setCheckOutDate}
              setGuests={setGuests}
              onBookNow={handleBookNow}
              isSubmitting={isSubmitting}
              isRoomBased={isRoomBased}
              selectedRoom={selectedRoom}
              displayPrice={displayPrice}
              displaySuffix={displaySuffix}
              totalPrice={totalPrice}
              numberOfNights={numberOfNights}
              totalGuests={totalGuests}
              capacityMessage={capacityMessage}
              bookingError={bookingError}
              isBookingBlocked={isBookingBlocked}
              availabilityLoading={availabilityLoading}
              ctaLabel={ctaLabel}
            />
            <ContactCard manager={details.manager} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default StayDetailsPage;
