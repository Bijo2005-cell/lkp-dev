import axios from "axios";

// ✅ Create axios instance with relative path (proxy will handle the domain)
export const ListingsAPI = axios.create({
  baseURL: "/api", // proxy will forward to http://69.62.77.33/api
  headers: { "Content-Type": "application/json" },
});

// ✅ Automatically attach JWT if available
ListingsAPI.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

// ✅ Function to call listings API
export const getListings = async (
  businessInterest = "EXPERIENCE",
  limit = 50,
  offset = 0
) => {
  try {
    const response = await ListingsAPI.get("/public/listings", {
      params: { businessInterest, limit, offset },
    });
    // Normalize response to always return an array of listings so callers
    // (like the Catalog component) can safely call `.map` without changing
    // the existing UI code.
    const payload = response.data;
    console.log("✅ Listings fetched (raw):", payload);

    // If payload is already an array - return it
    if (Array.isArray(payload)) return payload;

    // If payload is an object, try common array properties or a single item
    if (payload && typeof payload === "object") {
      if (Array.isArray(payload.data)) return payload.data;
      if (Array.isArray(payload.items)) return payload.items;
      if (Array.isArray(payload.listings)) return payload.listings;

      // If API returned a single listing object, wrap it in an array
      if (payload.listingId || payload.listing_id || payload.id) return [payload];

      // As a last resort, try to find the first array in the object whose
      // elements look like listings (have listingId or id)
      const firstCandidate = Object.values(payload).find(
        (v) =>
          Array.isArray(v) &&
          v.length > 0 &&
          (v[0].listingId || v[0].listing_id || v[0].id)
      );
      if (Array.isArray(firstCandidate)) return firstCandidate;
    }

    // Fallback to empty array to avoid downstream errors
    return [];
  } catch (error) {
    console.error("❌ Error fetching listings:", error);
    throw error;
  }
};

// ✅ Function to get single listing by id
export const getListing = async (id) => {
  try {
    const response = await ListingsAPI.get(`/public/listings/${id}`);
    const payload = response.data;
    console.log("✅ Listing fetched (raw):", payload);

    // If response is wrapped in an object with a listing property, unwrap
    if (payload && typeof payload === "object") {
      if (payload.listing) return payload.listing;
      if (payload.data && !Array.isArray(payload.data)) return payload.data;
    }

    return payload;
  } catch (error) {
    console.error("❌ Error fetching listing:", error);
    throw error;
  }
};
