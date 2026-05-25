const garments = {
  home: {
    title: 'My Garments',
    apiState: 'API state',
  },
  uploadingScreen: {
    title: 'Analyzing Garment',
    status: 'Identifying type, color, and occasion...',
    description: 'We are processing your image details.',
  },
  confirmationScreen: {
    title: 'Confirm Detected Garments',
    description: 'Review and confirm detected attributes before saving.',
    headerTitle: 'New Garment',
    discard: 'Discard',
    create: 'Add garment',
    progress: '{{current}} of {{total}}',
    attributes: {
      title: 'Garment information',
      name: 'Name',
      category: 'Category',
      brand: 'Brand',
      style: 'Style',
      colors: 'Colors',
    },
    editHint: 'You can adjust the detected attributes before adding the garment.',
    fallback: {
      noName: 'Unnamed garment',
      pending: 'Pending',
    },
  },
  closetScreen: {
    title: 'My Closet',
    empty: 'No results found',
    fallback: {
      noName: 'Unnamed garment',
    }
  },
  detailScreen: {
    tabs: {
      info: 'Information',
      outfit: 'Outfit',
    },
    sectionTitle: 'Garment information',
    actions: {
      delete: 'Delete',
      edit: 'Edit',
      cancel: 'Cancel',
      save: 'Save',
      changeImage: 'Change image',
    },
    fields: {
      name: 'Name',
      category: 'Category',
      color: 'Color',
      style: 'Occasion',
      brand: 'Brand',
    },
    options: {
      categories: {
        tops: 'Tops',
        pants: 'Pants',
        shoes: 'Shoes',
        accessories: 'Accessories',
        dresses: 'Dresses',
        coats: 'Coats',
      },
      styles: {
        casual: 'Casual',
        sport: 'Sport',
        formal: 'Formal',
        work: 'Work',
        party: 'Party',
      },
      colors: {
        white: 'White',
        black: 'Black',
        beige: 'Beige',
        blue: 'Blue',
        brown: 'Brown',
        gray: 'Gray',
        red: 'Red',
        green: 'Green',
      },
    },
    outfitTodo: 'Coming soon: outfit recommendations for this garment.',
    fallback: {
      noName: 'Unnamed garment',
      pending: 'Pending',
    },
  },
  uploadSourceSheet: {
    title: 'Add garment',
    subtitle: 'Choose how to upload the image',
    uploadingDescription: 'Preparing and uploading image...',
    camera: {
      title: 'Camera',
      description: 'Take a photo now',
    },
    gallery: {
      title: 'Gallery',
      description: 'Choose from your photos',
    },
    errors: {
      cameraPermissionDenied: 'Camera permission is required to take a photo.',
      cameraAssetMissing: 'No photo was captured. Please try again.',
      cameraUploadFailed: 'Failed to upload photo from camera. Please try again.',
      galleryPermissionDenied: 'Gallery permission is required to choose an image.',
      galleryAssetMissing: 'No image was selected. Please try again.',
      galleryUploadFailed: 'Failed to upload image from gallery. Please try again.',
      fileReadFailed: 'We could not read the selected image. Please try another one.',
      imageProcessingFailed: 'We could not optimize this image. Please try another one.',
      fileTooLarge: 'The selected image is too large. Please choose a smaller image.',
    },
    cancel: 'Cancel',
  },
  filters: {
    title: 'Filters',
    search: 'Search',
    searchPlaceholder: 'Garment name...',
    color: 'Color',
    style: 'Style',
    category: 'Type',
    filters: 'Filters',
    noOptions: 'No options available',
    clear: 'Clear',
    apply: 'Apply',
    loadError: 'Error loading filters',
  },
  exploreScreen: {
    title: 'Explore',
    subtitle: 'Clothes tailored to your lifestyle',
    searchPlaceholder: 'Search brands, styles, or apparel...',
    emptyTitle: 'No recommended garments found.',
    emptySubtitle: 'Try modifying your search or change the category.',
    categories: {
      all: 'All',
      tops: 'Tops',
      pants: 'Pants',
      shoes: 'Shoes',
      coats: 'Coats',
      dresses: 'Dresses',
      accessories: 'Accessories',
    },
    badges: {
      trending: 'Trending',
      new: 'New',
      recommended: 'Recommended',
      bestSeller: 'Best Seller',
      basic: 'Basic',
    },
    details: {
      back: 'Back',
      matchPercentage: '{{score}}% Match',
      whyRecommended: 'Why do we recommend this?',
      detailsTitle: 'Product details',
      category: 'Category',
      idealStyle: 'Ideal Style',
      brand: 'Associated brand',
      colors: 'Available colors',
      price: 'Market price',
      description: 'Description',
      goToStore: 'Go to store',
      addToCloset: 'Add to closet',
      adding: 'Adding...',
      addedAlertTitle: 'Garment added!',
      addedAlertMessage: 'We have successfully added "{{name}}" to your virtual closet.',
      addedAlertButton: 'Perfect',
      marketingAlertTitle: 'Marketing Redirect',
      marketingAlertMessage: 'Opening store for {{brand}} to purchase for {{price}}...',
      marketingAlertButton: 'OK',
    },
    garments: {
      rec_1: {
        name: 'Swell Bomber Jacket',
        description: 'A loose-fit bomber jacket in a neutral beige knitted fabric. Features a ribbed round collar, dropped shoulders, and a front metal zipper closure concealed by a snap-button placket. Ideal for layering in daily transition looks.',
        insight: 'Matches 98% of your current wardrobe. Perfect to wear over your basic white tops and classic blue jeans.'
      },
      rec_2: {
        name: 'Classic Straight Jeans 501',
        description: 'The original straight-leg jeans that started it all. Mid-weight premium non-stretch cotton fabric in an evergreen light blue wash. Built with five pockets, patented button fly, and straight cut from hip to ankle.',
        insight: 'Completes your wardrobe silhouette. These jeans match beautifully with 85% of the upper clothes you already own.'
      },
      rec_3: {
        name: 'Soft Suede Loafers',
        description: 'Classic loafers crafted from soft, flexible terracotta brown suede leather. Breathable leather interior with cushioned insole for exceptional comfort. Thin, flexible non-slip rubber sole.',
        insight: 'A key transition footwear. Perfect for formal meetings or weekend dinners with classic blue jeans or brown chinos.'
      },
      rec_4: {
        name: 'Oversized Knit Top',
        description: 'A loose, drop-shoulder short-sleeve top in fine off-white knit. Features a ribbed crewneck and asymmetrical hem with side slits. Exceptionally soft and highly breathable.',
        insight: 'Your perfect basic layer. Designed to fit effortlessly underneath any of your coffee-toned jackets or coats.'
      },
      rec_5: {
        name: 'Classic Camel Trench Coat',
        description: 'Double-breasted classic camel trench coat in water-resistant technical fabric. Designed with wide lapels, removable belt, adjustable cuffs, and hidden side pockets. Perfect for gray days in the city.',
        insight: 'Ideal for your office style. Blends effortlessly with dark bottoms and formal brown or black shoes.'
      },
      rec_6: {
        name: 'Midi Pleated Dress',
        description: 'Long dress in fine charcoal black pleated knit. Features a closed mock neck and highly flattering fitted silhouette with elegant drape. Perfect for special dinners or evening events.',
        insight: 'Ideal for weekend plans or gala dinners. Dress it up easily with your metallic accessories.'
      },
      rec_7: {
        name: 'Minimalist Leather Bag',
        description: 'Minimalist bag made of premium quality satin black leather. Features magnet closure and adjustable shoulder strap. Inside fully lined compartment with zipper pocket.',
        insight: 'The ultimate versatile accessory. Fits your laptop for work as well as your casual outfits.'
      },
      rec_8: {
        name: 'Sporty Active Sneakers',
        description: 'Retro-running minimalist sneakers featuring mixed panels of light gray nylon and soft sand suede. Anti-slip honey rubber sole and EVA midsole for full cushioning comfort.',
        insight: 'The ultimate desired comfort. Looks incredible with your sporty sets or to dress down standard trousers.'
      }
    }
  },
}

export default garments
