const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {

  res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({
    path: "reviews", populate: {
      path: "author",
    },
  }).populate("owner");
  if (!listing) {
    req.flash("error", "Listing not found");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res) => {
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  }).send();

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  
  // Handle multiple images: upload buffer directly to Cloudinary
  const { cloudinary } = require("../cloudconfig.js");
  newListing.image = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload_stream({
        folder: "Homify_DEV"
      }, (error, result) => {
        if (error) throw error;
        return result;
      });
      // Use a Promise to handle the stream
      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: "Homify_DEV" }, (error, result) => {
          if (error) return reject(error);
          newListing.image.push({ url: result.secure_url, filename: result.public_id });
          resolve();
        });
        stream.end(file.buffer);
      });
    }
  }

  // Fallback for single file upload
  if (req.file && (!req.files || req.files.length === 0)) {
    await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: "Homify_DEV" }, (error, result) => {
        if (error) return reject(error);
        newListing.image.push({ url: result.secure_url, filename: result.public_id });
        resolve();
      });
      stream.end(req.file.buffer);
    });
  }
  newListing.geometry = response.body.features[0].geometry;
  await newListing.save();
  req.flash("success", "Successfully created a new listing!");
  res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
}

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  const listingData = {
    title: req.body.listing.title,
    description: req.body.listing.description,
    price: req.body.listing.price,
    location: req.body.listing.location,
    country: req.body.listing.country,
    category: req.body.listing.category
  };

  
  const currentListing = await Listing.findById(id);
  
  
  if (currentListing.location !== listingData.location) {
    let response = await geocodingClient.forwardGeocode({
      query: listingData.location,
      limit: 1
    }).send();
    
    listingData.geometry = response.body.features[0].geometry;
  }

  
  if (req.files && req.files.length > 0) {
    
    const newImages = req.files.map(file => ({
      url: file.path,
      filename: file.filename
    }));
    
    
    if (req.body.listing.deleteImages) {
      const remainingImages = currentListing.image.filter(img => 
        !req.body.listing.deleteImages.includes(img.filename)
      );
      
      
      if (remainingImages.length > 0 || newImages.length > 0) {
        currentListing.image = remainingImages;
      } else {
        req.flash("error", "Cannot delete all images. At least one image is required.");
        return res.redirect(`/listings/${id}/edit`);
      }
    }
    
    
    listingData.image = [...currentListing.image, ...newImages];
  } else if (req.file) {
    
    const newImage = {
      url: req.file.path,
      filename: req.file.filename
    };
    
    
    if (req.body.listing.deleteImages) {
      const remainingImages = currentListing.image.filter(img => 
        !req.body.listing.deleteImages.includes(img.filename)
      );
      
      // Only update if we're not deleting all images
      if (remainingImages.length > 0) {
        currentListing.image = remainingImages;
      } else {
        req.flash("error", "Cannot delete all images. At least one image is required.");
        return res.redirect(`/listings/${id}/edit`);
      }
    }
    
    
    listingData.image = [...currentListing.image, newImage];
  } else if (req.body.listing.deleteImages) {
    
    const remainingImages = currentListing.image.filter(img => 
      !req.body.listing.deleteImages.includes(img.filename)
    );
    
    
    if (remainingImages.length > 0) {
      listingData.image = remainingImages;
    } else {
      req.flash("error", "Cannot delete all images. At least one image is required.");
      return res.redirect(`/listings/${id}/edit`);
    }
  } else {
    
    listingData.image = currentListing.image;
  }

  try {
    let listing = await Listing.findByIdAndUpdate(id, listingData, { 
      new: true,
      runValidators: true 
    });
    req.flash("success", "Successfully updated the listing!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error("Update error:", err);
    req.flash("error", "Failed to update listing. Please try again.");
    res.redirect(`/listings/${id}/edit`);
  }
}

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted the listing!");
  res.redirect("/listings");
}

module.exports.filterByCategory = async(req,res)=>{
  const { category } = req.params;
  const listings = await Listing.find({category: new RegExp(`^${category}$`, "i")}); //case insensitive search
  if (!listings.length) {
    req.flash("error", "No listings found for this category");
    return res.redirect("/listings");
  }
  res.render("listings/index.ejs", { allListings: listings });
}

module.exports.searchListings = async (req, res) => {
  const { search } = req.query;
  if (!search) {
    return res.redirect("/listings");
  }
  
  // Search in title, description, location, and country fields
  const listings = await Listing.find({
    $or: [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
      { country: { $regex: search, $options: 'i' } }
    ]
  });
  
  if (!listings.length) {
    req.flash("error", "No listings found matching your search");
    return res.redirect("/listings");
  }
  
  res.render("listings/index.ejs", { allListings: listings });
}

module.exports.toggleLike = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const listing = await Listing.findById(id);

  const likeIndex = listing.likes.indexOf(userId);
  if (likeIndex === -1) {
    // User hasn't liked the listing yet, add the like
    listing.likes.push(userId);
  } else {
    // User has already liked, remove the like
    listing.likes.splice(likeIndex, 1);
  }

  await listing.save();
  res.json({ likes: listing.likes.length, isLiked: likeIndex === -1 });
}