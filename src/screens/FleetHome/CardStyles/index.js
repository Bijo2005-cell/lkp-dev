import React from "react";
import cn from "classnames";
import Card from "../../../components/Card";
import Browse from "../../../components/Browse";
import DestinationCard from "../DestinationCard";
import styles from "../FleetHome.module.sass";

/**
 * Card Styles Components for Homepage Sections
 * These components handle different card style layouts based on API cardStyle
 */

// Helper to format image URL from API
const formatImageUrl = (url) => {
  if (!url) return "/images/content/card-pic-13.jpg";

  // If already a full URL, check if it's an Azure blob with SAS token
  if (url.startsWith("http://") || url.startsWith("https://")) {
    // Check if it's an Azure blob storage URL
    if (url.includes("lkpleadstoragedev.blob.core.windows.net")) {
      // If URL contains SAS token query parameters (sig= indicates SAS token), allow it
      // SAS tokens provide temporary authenticated access to the blob
      if (url.includes("sig=") && url.includes("sv=")) {
        // URL has SAS token, return it as-is (it should work)
        return url;
      }
      // No SAS token, fallback to default image
      return "/images/content/card-pic-13.jpg";
    }
    // Not an Azure blob URL, return as-is
    return url;
  }

  // Skip creating Azure blob URLs without SAS tokens since they require authentication
  // Return default image instead to prevent repeated 409 errors
  if (url.includes("/") && !url.startsWith("/")) {
    // This would create an Azure blob URL which requires auth
    // Return default image instead to prevent failed requests
    return "/images/content/card-pic-13.jpg";
  }

  if (url.startsWith("/")) {
    return url;
  }

  return "/images/content/card-pic-13.jpg";
};

// Transform API listing to Card component format
const transformListingToCard = (listing) => {
  const coverPhotoUrl = formatImageUrl(listing.coverPhotoUrl);
  
  const price = listing.individualPrice || 0;
  const hasPrice = price > 0;
  const priceDisplay = hasPrice ? `₹${price.toLocaleString("en-IN")}` : null;

  return {
    id: `listing-${listing.listingId}`,
    listingId: listing.listingId,
    title: listing.title || "Listing",
    src: coverPhotoUrl,
    srcSet: coverPhotoUrl,
    url: `/stays-product?id=${listing.listingId}`,
    location: null, // Remove location/address from cards
    priceActual: priceDisplay, // Only show price if individualPrice exists
    hasPrice: hasPrice,
    rating: listing.averageRating || 0,
    reviews: listing.totalReviews || 0,
    briefDescription: listing.briefDescription,
    tags: listing.tags || [],
    host: listing.host,
    // Card component expects these optional fields
    priceOld: null,
    cost: priceDisplay, // Only show price if individualPrice exists
    options: [],
    categoryText: null,
    comment: null,
    avatar: null,
  };
};

// Transform API listing to Browse component format (for carousel)
const transformListingToBrowse = (listing) => {
  const coverPhotoUrl = formatImageUrl(listing.coverPhotoUrl);

  return {
    id: `listing-${listing.listingId}`,
    listingId: listing.listingId,
    title: listing.title || "Listing",
    src: coverPhotoUrl,
    srcSet: coverPhotoUrl,
    url: `/stays-product?id=${listing.listingId}`,
    categoryText: null, // Remove location/address from carousel cards
    category: null,
    counter: listing.totalReviews || 0,
  };
};

// Transform API listing to DestinationCard format
const transformListingToDestination = (listing) => {
  const coverPhotoUrl = formatImageUrl(listing.coverPhotoUrl);

  return {
    id: `listing-${listing.listingId}`,
    listingId: listing.listingId,
    title: listing.title || "Destination",
    location: null, // Remove location/address from destination cards
    src: coverPhotoUrl,
    srcSet: coverPhotoUrl,
    url: `/stays-product?id=${listing.listingId}`,
  };
};

/**
 * CARD_CAROUSEL - Horizontal scrolling carousel
 */
export const CardCarousel = ({ section, listings, className }) => {
  const browseItems = listings.map(transformListingToBrowse);

  return (
    <section className={cn(styles.categorySection, className)}>
      <div className={styles.sectionHeader}>
        <h2 className={cn("h2", styles.sectionTitle)}>{section.sectionTitle}</h2>
        {section.description && (
          <p className={styles.sectionSubtitle}>{section.description}</p>
        )}
      </div>
      <div className={styles.browseWrapper}>
        <Browse
          classSection=""
          headSmall
          classTitle="h4"
          title=""
          items={browseItems}
        />
      </div>
    </section>
  );
};

/**
 * CARD_GRID - Standard grid layout
 */
export const CardGrid = ({ section, listings, className }) => {
  const cardItems = listings.map(transformListingToCard);

  return (
    <section className={cn(styles.categorySection, className)}>
      <div className={styles.sectionHeader}>
        <h2 className={cn("h2", styles.sectionTitle)}>{section.sectionTitle}</h2>
        {section.description && (
          <p className={styles.sectionSubtitle}>{section.description}</p>
        )}
      </div>
      <div className={styles.gridList}>
        {cardItems.map((item) => (
          <Card className={styles.gridCard} item={item} key={item.id} />
        ))}
      </div>
    </section>
  );
};

/**
 * CARD_ROW - Row layout (horizontal cards)
 */
export const CardRow = ({ section, listings, className }) => {
  const cardItems = listings.map(transformListingToCard);

  return (
    <section className={cn(styles.categorySection, className)}>
      <div className={styles.sectionHeader}>
        <h2 className={cn("h2", styles.sectionTitle)}>{section.sectionTitle}</h2>
        {section.description && (
          <p className={styles.sectionSubtitle}>{section.description}</p>
        )}
      </div>
      <div className={styles.rowList}>
        {cardItems.map((item) => (
          <Card className={styles.rowCard} item={item} key={item.id} row />
        ))}
      </div>
    </section>
  );
};

/**
 * CARD_DESTINATION - Circular destination cards (Today's Special style)
 */
export const CardDestination = ({ section, listings, className }) => {
  const destinationItems = listings.map(transformListingToDestination);
  
  // Split cards into two rows with equal distribution
  const totalCards = destinationItems.length;
  const cardsPerRow = Math.ceil(totalCards / 2);
  const firstRowCards = destinationItems.slice(0, cardsPerRow);
  const secondRowCards = destinationItems.slice(cardsPerRow);

  return (
    <section className={cn(styles.categorySection, className)}>
      <div className={styles.sectionHeader}>
        <h2 className={cn("h2", styles.sectionTitle)}>{section.sectionTitle}</h2>
        {section.description && (
          <p className={styles.sectionSubtitle}>{section.description}</p>
        )}
      </div>
      <div className={styles.destinationScrollWrapper}>
        <div className={styles.destinationGrid}>
          <div className={styles.destinationRow}>
            {firstRowCards.map((item) => (
              <DestinationCard
                className={styles.destinationCard}
                item={item}
                key={item.id}
              />
            ))}
          </div>
          <div className={styles.destinationRow}>
            {secondRowCards.map((item) => (
              <DestinationCard
                className={styles.destinationCard}
                item={item}
                key={item.id}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * CARD_PREMIUM - Premium grid layout
 */
export const CardPremium = ({ section, listings, className }) => {
  const cardItems = listings.map(transformListingToCard);

  return (
    <section className={cn(styles.categorySection, className)}>
      <div className={styles.sectionHeader}>
        <h2 className={cn("h2", styles.sectionTitle)}>{section.sectionTitle}</h2>
        {section.description && (
          <p className={styles.sectionSubtitle}>{section.description}</p>
        )}
      </div>
      <div className={styles.premiumGrid}>
        {cardItems.map((item) => (
          <Card className={styles.premiumCard} item={item} key={item.id} />
        ))}
      </div>
    </section>
  );
};

/**
 * Main component that renders the appropriate card style based on cardStyle prop
 * Maps API cardStyle values (uppercase format) to frontend card components:
 * - "CARD_GRID" → CardGrid component
 * - "CARD_CAROUSEL" → CardCarousel component
 * - "CARD_LIST" → CardDestination component
 * - "CARD_ROW" → CardRow component
 */
export const HomepageSectionCard = ({ section, listings, className }) => {
  if (!section || !listings || listings.length === 0) {
    return null;
  }

  // Use cardStyle exactly as provided by API (case-sensitive)
  const cardStyle = section.cardStyle || "CARD_GRID";

  // Map API cardStyle values to component card styles (case-sensitive matching)
  // API returns uppercase format: CARD_GRID, CARD_CAROUSEL, CARD_LIST, CARD_ROW
  switch (cardStyle) {
    case "CARD_GRID":
      return <CardGrid section={section} listings={listings} className={className} />;
    
    case "CARD_CAROUSEL":
      return <CardCarousel section={section} listings={listings} className={className} />;
    
    case "CARD_LIST":
      return <CardDestination section={section} listings={listings} className={className} />;
    
    case "CARD_ROW":
      return <CardRow section={section} listings={listings} className={className} />;
    
    default:
      // Default to grid layout
      return <CardGrid section={section} listings={listings} className={className} />;
  }
};

// Export helper functions for use in other components
export { transformListingToCard, transformListingToBrowse, transformListingToDestination, formatImageUrl };