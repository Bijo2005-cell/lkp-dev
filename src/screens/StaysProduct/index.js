import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import cn from "classnames";
import styles from "./StaysProduct.module.sass";
import Product from "../../components/Product";
import Description from "./Description";
import Itinerary from "../../components/Itinerary";
import TabSection from "./TabSection";
import CommentsProduct from "../../components/CommentsProduct";
import Browse from "../../components/Browse";
import { browse2 } from "../../mocks/browse";

// Helper function to format image URLs (from Azure blob storage or full URLs)
const formatImageUrl = (url) => {
  if (!url) return null;
  
  // Already a full URL
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  
  // Azure blob storage path (e.g., "leads/3/listings/6/cover-photo/image.jpg")
  if (url.startsWith("leads/")) {
    return `https://lkpleadstoragedev.blob.core.windows.net/lead-documents/${url}`;
  }
  
  // Relative path - prepend base URL if needed
  if (url.startsWith("/")) {
    return url;
  }
  
  // Otherwise assume it's a blob storage path
  return `https://lkpleadstoragedev.blob.core.windows.net/lead-documents/${url}`;
};

const options = [
  {
    title: "Superhost",
    icon: "home",
  },
  {
    title: "Queenstown, Otago, New Zealand",
    icon: "flag",
  },
  {
    title: "Nature & Adventure",
    icon: "route",
  },
  {
    title: "Off-road Jeep Safari",
    icon: "car",
  },
];

const parametersUser = [
  {
    title: "Superhost",
    icon: "home",
  },
  {
    title: "256 reviews",
    icon: "star-outline",
  },
];

const socials = [
  {
    title: "twitter",
    url: "https://twitter.com/ui8",
  },
  {
    title: "instagram",
    url: "https://www.instagram.com/ui8net/",
  },
  {
    title: "facebook",
    url: "https://www.facebook.com/ui8.net/",
  },
];

const StaysProduct = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const idParam = params.get("id");
  const id = idParam ? idParam : "2"; // default to 2 as requested

  const [listing, setListing] = useState(null);
  const [hostData, setHostData] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  let mounted = true;
  const load = async () => {
    try {
      setLoading(true);
      const { getListing, getHost } = await import("../../utils/api");
      const data = await getListing(id);
      if (!mounted) return;

      setListing(data || null);

      // ✅ Build gallery dynamically from API
      const galleryImages = [];

      // 1️⃣ Add cover photo (if exists)
      if (data?.coverPhotoUrl) {
        const formattedUrl = formatImageUrl(data.coverPhotoUrl);
        if (formattedUrl) galleryImages.push(formattedUrl);
      }

      // 2️⃣ Add listingMedia images
      if (Array.isArray(data?.listingMedia)) {
        data.listingMedia.forEach((media) => {
          // Each media object has either 'url' or 'fileUrl'
          const imageUrl = formatImageUrl(media.url || media.fileUrl);
          if (imageUrl) galleryImages.push(imageUrl);
        });
      }

      // 3️⃣ Add keyActivities images (optional, if you want them too)
      if (Array.isArray(data?.keyActivities)) {
        data.keyActivities.forEach((activity) => {
          if (Array.isArray(activity.images)) {
            activity.images.forEach((img) => {
              const imageUrl = formatImageUrl(img.url || img.imageUrl);
              if (imageUrl) galleryImages.push(imageUrl);
            });
          }
        });
      }

      // ✅ Final fallback if no images
      setGalleryItems(galleryImages.length ? galleryImages : []);

      // ✅ Fetch host data if leadUserId is available
      const leadUserId = data?.leadUserId || data?.host?.leadUserId;
      if (leadUserId) {
        try {
          const hostResponse = await getHost(leadUserId);
          if (!mounted) return;
          setHostData(hostResponse || null);
        } catch (hostErr) {
          console.warn("⚠️ Failed to fetch host data:", hostErr);
          // Don't block the page if host fetch fails
        }
      }
    } catch (e) {
      console.error("Failed to load listing", e);
      setListing(null);
      setGalleryItems([]);
    } finally {
      if (mounted) setLoading(false);
    } 
  };

  load();
  return () => {
    mounted = false;
  };
}, [id]);


  return (
    <>
<Product
  classSection="section-mb64"
  title={listing?.title || "Spectacular views of Queenstown"}
  options={options}
  gallery={galleryItems && galleryItems.length > 0 ? galleryItems : []}
  type="stays"
/>

      <Description classSection="section" listing={listing} hostData={hostData} />
      <Itinerary classSection="section" listing={listing} />
      <TabSection classSection="section" listing={listing} />
      <CommentsProduct
        className={cn("section", styles.comment)}
        parametersUser={parametersUser}
        info={
          listing?.description ||
          "Described by Queenstown House & Garden magazine as having 'one of the best views we've ever seen' you will love relaxing in this newly built"
        }
        socials={socials}
        buttonText="Contact"
        hostData={hostData}
      />
      <Browse
        classSection="section"
        headSmall
        classTitle="h4"
        title="Explore mountains in New Zealand"
        items={browse2}
      />
    </>
  );
};

export default StaysProduct;
