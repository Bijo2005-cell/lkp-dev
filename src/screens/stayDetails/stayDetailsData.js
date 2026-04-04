const API_BASE = "http://69.62.77.33:8080/api";
const SAME_ORIGIN_API_BASE = "/api";

export const fallbackStayDetails = {
  stayId: 2,
  bookingScope: "Property-Based",
  badges: ["RESORT", "LUXURY", "5 Star"],
  title: "Azure Horizon Resort & Spa",
  subtitle: "Maafushi Island, Kaafu Atoll, Maldives, 08090",
  price: "35,000",
  rating: 5,
  overview:
    "Nestled on a private island, Azure Horizon Resort & Spa offers an unparalleled escape from the ordinary. Our resort features overwater villas, private beach access, and a world-renowned underwater restaurant. Whether you're seeking a romantic getaway, a family adventure, or a wellness retreat, our dedicated team ensures every moment is crafted to perfection.",
  stats: [
    { label: "TYPE", value: "Resort" },
    { label: "CHECK-IN", value: "14:00" },
    { label: "CHECK-OUT", value: "12:00" },
    { label: "ROOMS", value: "2 Types" },
  ],
  amenities: {
    property: ["WiFi", "Spa", "Private Beach", "Bar", "Swimming Pool", "Fitness Center", "Airport Shuttle", "Restaurant"],
    services: ["24-Hour Front Desk", "Currency Exchange", "Kids Club", "Concierge Service", "Water Sports Center", "Medical Clinic"],
  },
  policies: {
    checkin: [
      { label: "Check-in", value: "14:00" },
      { label: "Check-out", value: "12:00" },
      { label: "Method", value: "Reception" },
    ],
    cancellation: "Free cancellation up to 7 days before check-in. 50% charge for cancellations within 7 days. No-show charged 100%.",
    houseRules: "No smoking inside the villas. Quiet hours from 10 PM to 7 AM. Drone photography requires prior permission.",
    arrivalInstructions: "Please present your passport and booking confirmation at the front desk upon arrival. A welcome drink awaits you.",
  },
  gallery: [
    { src: "/images/content/main-pic-6.jpg", alt: "Resort overwater pier" },
    { src: "/images/content/slider-pic-1.jpg", alt: "Resort entrance at night" },
    { src: "/images/content/photo-1.4.jpg", alt: "Luxury resort lobby" },
    { src: "/images/content/photo-2.8.jpg", alt: "Curved resort architecture" },
    { src: "/images/content/photo-3.3.jpg", alt: "Signature tropical welcome drink" },
  ],
  rooms: [
    {
      roomId: 1,
      type: "Room 1",
      title: "Bamboo Deluxe Room",
      description: "Suspended over the crystal-clear lagoon, this villa features a private infinity pool, direct ocean access, and a glass-floor living room panel.",
      guests: "Max 2 Guests",
      units: "1 Units",
      price: "2,500",
      priceLabel: "STARTING FROM",
      image: "/images/content/photo-2.2.jpg",
      amenities: ["Private Pool", "Ocean View", "Bathtub", "+ 3 more"],
      availableRooms: 1,
      mealPlanCode: "EP",
      maxAdults: 2,
      maxChildren: 0,
      maxGuests: 2,
    },
  ],
  manager: {
    initials: "S",
    name: "Sarah Jenkins",
    role: "Managed by",
    phone: "+960 123 4567",
    email: "reservations@azurehorizon.com",
    website: "Visit Website",
  },
  secondaryTabs: ["Overview", "Amenities", "Policies"],
};

const toDisplayString = (value) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "object") {
    return value.displayName || value.name || value.title || value.label || value.code || value.amenityName || value.facilityName || "";
  }
  return "";
};

const asArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined || value === "") return [];
  return [value];
};

const titleCase = (value) =>
  String(value || "")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const formatImageUrl = (url) => {
  if (!url) return null;
  const raw = String(url).trim();
  if (!raw) return null;
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  if (raw.startsWith("/")) return raw;
  const [pathPart, queryPart] = raw.split("?");
  const normalizedPath = String(pathPart).replaceAll("%2F", "/");
  const encodedPath = encodeURI(normalizedPath);
  return `https://lkpleadstoragedev.blob.core.windows.net/lead-documents/${encodedPath}${queryPart ? `?${queryPart}` : ""}`;
};

const pickFirst = (...values) => values.find((value) => value !== undefined && value !== null && value !== "");

const numberFormat = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const extractGallery = (stay) => {
  const items = [];
  const pushImage = (url, alt) => {
    const src = formatImageUrl(url);
    if (!src || items.some((item) => item.src === src)) return;
    items.push({ src, alt });
  };

  pushImage(stay?.coverPhotoUrl || stay?.coverImageUrl || stay?.imageUrl, stay?.propertyName || "Stay image");
  asArray(stay?.media).forEach((item, index) => {
    pushImage(item?.url || item?.src || item?.imageUrl || item, `${stay?.propertyName || "Stay"} ${index + 1}`);
  });
  asArray(stay?.images).forEach((item, index) => {
    pushImage(item?.url || item?.src || item?.imageUrl || item, `${stay?.propertyName || "Stay"} ${index + 1}`);
  });

  return items.length ? items.slice(0, 5) : fallbackStayDetails.gallery;
};

const extractAmenities = (stay) => {
  const property = [...asArray(stay?.amenities), ...asArray(stay?.propertyAmenities), ...asArray(stay?.features)]
    .map(toDisplayString)
    .filter(Boolean);
  const services = [...asArray(stay?.facilities), ...asArray(stay?.services), ...asArray(stay?.propertyServices)]
    .map(toDisplayString)
    .filter(Boolean);

  return {
    property: property.length ? property.slice(0, 8) : fallbackStayDetails.amenities.property,
    services: services.length ? services.slice(0, 8) : fallbackStayDetails.amenities.services,
  };
};

const getInitialRoomPrice = (room, stay) => {
  const mealPlans = room?.mealPlanPricing || {};
  const mealPlan = mealPlans.EP || mealPlans.MAP || mealPlans.CP || mealPlans.BB || mealPlans.AP || {};
  return numberFormat(
    mealPlan.extraAdultPrice ||
      room?.extraAdultPrice ||
      stay?.extraAdultPrice ||
      stay?.fullPropertyExtraAdultPrice ||
      0
  );
};

const getMealPlanCode = (room) => {
  const mealPlans = room?.mealPlanPricing || {};
  return Object.keys(mealPlans)[0] || "EP";
};

const extractRooms = (stay) => {
  const rooms = [...asArray(stay?.rooms), ...asArray(stay?.roomTypes)];
  if (!rooms.length) return fallbackStayDetails.rooms;

  return rooms.slice(0, 6).map((room, index) => {
    const amenities = [...asArray(room?.amenities), ...asArray(room?.features), ...asArray(room?.highlights)]
      .map(toDisplayString)
      .filter(Boolean);
    const basePrice = getInitialRoomPrice(room, stay);

    return {
      roomId: pickFirst(room?.roomId, room?.id, index + 1),
      type: pickFirst(room?.roomCategory, room?.type, room?.category, `Room ${index + 1}`),
      title: pickFirst(room?.roomTypeName, room?.title, room?.name, room?.roomName, `Room ${index + 1}`),
      description: pickFirst(room?.description, room?.briefDescription, stay?.briefDescription, fallbackStayDetails.rooms[0].description),
      guests: `Max ${pickFirst(room?.maxGuests, (Number(room?.maxAdults || 0) + Number(room?.maxChildren || 0)) || "", 2)} Guests`,
      units: `${pickFirst(room?.units, room?.availableRooms, room?.availableUnits, 1)} Units`,
      price: basePrice.toLocaleString("en-IN"),
      priceLabel: "STARTING FROM",
      image: formatImageUrl(
        room?.coverPhotoUrl ||
          room?.imageUrl ||
          room?.coverImageUrl ||
          room?.images?.[0]?.url ||
          room?.images?.[0] ||
          fallbackStayDetails.rooms[index % fallbackStayDetails.rooms.length].image
      ),
      amenities: amenities.length ? amenities.slice(0, 4) : fallbackStayDetails.rooms[index % fallbackStayDetails.rooms.length].amenities,
      availableRooms: numberFormat(pickFirst(room?.availableRooms, room?.units, room?.availableUnits, 1), 1),
      mealPlanCode: getMealPlanCode(room),
      maxAdults: numberFormat(room?.maxAdults, 0),
      maxChildren: numberFormat(room?.maxChildren, 0),
      maxGuests: numberFormat(pickFirst(room?.maxGuests, numberFormat(room?.maxAdults, 0) + numberFormat(room?.maxChildren, 0), 2), 2),
    };
  });
};

const extractManager = (stay) => {
  const hostName = [stay?.host?.firstName, stay?.host?.lastName].filter(Boolean).join(" ").trim();
  const name = pickFirst(hostName, stay?.host?.fullName, stay?.host?.name, stay?.managerName, stay?.contactName, stay?.primaryContactName, stay?.salesContactName, fallbackStayDetails.manager.name);
  return {
    initials: String(name || "S").charAt(0).toUpperCase(),
    name,
    role: "Managed by",
    phone: pickFirst(stay?.primaryPhone, stay?.salesPhone, stay?.frontOfficePhone, stay?.contactPhone, stay?.phoneNumber, stay?.host?.phoneNumber, fallbackStayDetails.manager.phone),
    email: pickFirst(stay?.primaryEmail, stay?.salesEmail, stay?.contactEmail, stay?.email, stay?.host?.email, fallbackStayDetails.manager.email),
    website: pickFirst(stay?.hotelWebsiteUrl, "Visit Website"),
  };
};

export const normalizeStayDetails = (stay) => {
  if (!stay || typeof stay !== "object") return fallbackStayDetails;

  const propertyType = titleCase(toDisplayString(stay?.propertyType));
  const category = titleCase(toDisplayString(stay?.propertyCategory || stay?.category));
  const apiRating = pickFirst(stay?.ratingSummary?.averageRating, stay?.averageRating, stay?.rating, 0);
  const starBadge = pickFirst(stay?.starRating, apiRating ? `${Math.round(Number(apiRating))} Star` : "");
  const badges = [propertyType, category, starBadge].filter(Boolean);

  const title = pickFirst(stay?.propertyName, stay?.title, fallbackStayDetails.title);
  const subtitle = pickFirst(stay?.fullAddress, stay?.address, [stay?.cityArea, stay?.district, stay?.state, stay?.country].filter(Boolean).join(", "), fallbackStayDetails.subtitle);
  const basePrice = numberFormat(pickFirst(stay?.startingPrice, stay?.individualPrice, stay?.b2cPrice, stay?.fullPropertyB2cPrice, 0), 0);
  const roomCount = [...asArray(stay?.rooms), ...asArray(stay?.roomTypes)].length || numberFormat(stay?.totalRoomsUnits, 0);

  return {
    stayId: pickFirst(stay?.stayId, stay?.id, fallbackStayDetails.stayId),
    bookingScope: pickFirst(stay?.bookingScope, fallbackStayDetails.bookingScope),
    badges: badges.length ? badges : fallbackStayDetails.badges,
    title,
    subtitle,
    price: (basePrice > 0 ? basePrice : 35000).toLocaleString("en-IN"),
    rating: numberFormat(apiRating, fallbackStayDetails.rating),
    overview: pickFirst(stay?.detailedDescription, stay?.details, stay?.propertyDescription, stay?.description, stay?.shortDescription, stay?.briefDescription, fallbackStayDetails.overview),
    stats: [
      { label: "TYPE", value: propertyType || fallbackStayDetails.stats[0].value },
      { label: "CHECK-IN", value: pickFirst(stay?.checkInTime, stay?.checkIn, fallbackStayDetails.stats[1].value) },
      { label: "CHECK-OUT", value: pickFirst(stay?.checkOutTime, stay?.checkOut, fallbackStayDetails.stats[2].value) },
      { label: "ROOMS", value: `${roomCount || 0} ${roomCount === 1 ? "Type" : "Types"}` },
    ],
    amenities: extractAmenities(stay),
    policies: {
      checkin: [
        { label: "Check-in", value: pickFirst(stay?.checkInTime, stay?.checkIn, fallbackStayDetails.policies.checkin[0].value) },
        { label: "Check-out", value: pickFirst(stay?.checkOutTime, stay?.checkOut, fallbackStayDetails.policies.checkin[1].value) },
        { label: "Method", value: pickFirst(stay?.checkInMethod, stay?.arrivalMethod, "Reception") },
      ],
      cancellation: pickFirst(stay?.cancellationPolicyTemplate, stay?.cancellationPolicy, stay?.cancellationPolicies, fallbackStayDetails.policies.cancellation),
      houseRules: pickFirst(stay?.propertyRulesTemplate, stay?.houseRules, stay?.rules, fallbackStayDetails.policies.houseRules),
      arrivalInstructions: pickFirst(stay?.checkInInstructions, stay?.arrivalInstructions, stay?.googleMapsLink, fallbackStayDetails.policies.arrivalInstructions),
    },
    gallery: extractGallery(stay),
    rooms: extractRooms(stay),
    manager: extractManager(stay),
    secondaryTabs: fallbackStayDetails.secondaryTabs,
  };
};

const fetchJson = async (paths, options) => {
  let lastError = null;
  for (const path of paths) {
    try {
      const response = await fetch(path, options);
      if (!response.ok) {
        lastError = new Error(`Request failed: ${response.status}`);
        continue;
      }
      const data = await response.json();
      try {
        console.log(`[API] ${options?.method || "GET"} ${path} ->`, data);
      } catch (e) {
        // ignore logging errors
      }
      return data;
    } catch (error) {
      try {
        console.error(`[API] error ${path}`, error);
      } catch (e) {}
      lastError = error;
    }
  }
  throw lastError || new Error("Request failed");
};

export const fetchStayDetails = async (stayId) => {
  const id = stayId || "2";
  const payload = await fetchJson([`${SAME_ORIGIN_API_BASE}/public/stays/${id}`, `${API_BASE}/public/stays/${id}`]);
  if (payload && typeof payload === "object") {
    if (payload.stay) return payload.stay;
    if (payload.data && typeof payload.data === "object") return payload.data;
  }
  return payload;
};

export const fetchRoomAvailability = async (stayId, checkInDate, checkOutDate) => {
  const params = `checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`;
  return fetchJson([`${SAME_ORIGIN_API_BASE}/stays/${stayId}/room-availability?${params}`, `${API_BASE}/stays/${stayId}/room-availability?${params}`]);
};

export const createStayBooking = async (payload) => {
  try {
    console.log("[API] POST /api/orders/stay payload ->", payload);
  } catch (e) {}

  return fetchJson([
    `${SAME_ORIGIN_API_BASE}/orders/stay`,
  ],
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  }
  );
};
