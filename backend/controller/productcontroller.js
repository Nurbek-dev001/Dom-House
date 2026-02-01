import fs from "fs";
import imagekit from "../config/imagekit.js";
import Property from "../models/propertymodel.js";

const addproperty = async (req, res) => {
    try {
        const { title, location, price, beds, baths, sqft, type, availability, description, amenities,phone } = req.body;

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];
        const image5 = req.files.image5 && req.files.image5[0];

        const images = [image1, image2, image3, image4, image5].filter((item) => item !== undefined);

        // Upload images to ImageKit and delete after upload
        const imageUrls = await Promise.all(
            images.map(async (item) => {
                const result = await imagekit.upload({
                    file: fs.readFileSync(item.path),
                    fileName: item.originalname,
                    folder: "Property",
                });
                fs.unlink(item.path, (err) => {
                    if (err) console.log("Error deleting the file: ", err);
                });
                return result.url;
            })
        );

        // Create a new product
        const product = new Property({
            title,
            location,
            price,
            beds,
            baths,
            sqft,
            type,
            availability,
            description,
            amenities,
            image: imageUrls,
            phone
        });

        // Save the product to the database
        await product.save();

        res.json({ message: "Product added successfully", success: true });
    } catch (error) {
        console.log("Error adding product: ", error);
        res.status(500).json({ message: "Server Error", success: false });
    }
};

const listproperty = async (req, res) => {
    try {
        const propertyDocs = await Property.find();
        // Normalize and sanitize fields for frontend
        const property = propertyDocs.map((p) => {
            const obj = p.toObject ? p.toObject() : { ...p };
            
            // Use images.full if available, otherwise use image array
            let imageArray = [];
            if (Array.isArray(obj.images) && obj.images.length > 0) {
                imageArray = obj.images
                    .filter(img => img && img.full && typeof img.full === 'string')
                    .map(img => img.full);
            }
            if (imageArray.length === 0 && Array.isArray(obj.image)) {
                imageArray = obj.image.filter(url => typeof url === 'string' && url.length > 0 && url !== '/placeholder.jpg');
            }
            if (imageArray.length === 0) {
                imageArray = ['/placeholder.jpg'];
            }
            obj.image = imageArray;
            
            // Ensure price, beds, baths, sqft are numbers, price fallback to 0
            obj.price = Number(String(obj.price).replace(/[^0-9.-]+/g, ''));
            if (!obj.price || isNaN(obj.price)) obj.price = 0;
            
            obj.beds = Number(obj.beds) || 0;
            obj.baths = Number(obj.baths) || 0;
            obj.sqft = Number(obj.sqft) || 0;
            return obj;
        });
        res.json({ property, success: true });
    } catch (error) {
        console.log("Error listing products: ", error);
        res.status(500).json({ message: "Server Error", success: false });
    }
};

const removeproperty = async (req, res) => {
    try {
        const property = await Property.findByIdAndDelete(req.body.id);
        if (!property) {
            return res.status(404).json({ message: "Property not found", success: false });
        }
        return res.json({ message: "Property removed successfully", success: true });
    } catch (error) {
        console.log("Error removing product: ", error);
        return res.status(500).json({ message: "Server Error", success: false });
    }
};

const updateproperty = async (req, res) => {
    try {
        const { id, title, location, price, beds, baths, sqft, type, availability, description, amenities,phone } = req.body;

        const property = await Property.findById(id);
        if (!property) {
            console.log("Property not found with ID:", id); // Debugging line
            return res.status(404).json({ message: "Property not found", success: false });
        }

        if (!req.files) {
            // No new images provided
            property.title = title;
            property.location = location;
            property.price = price;
            property.beds = beds;
            property.baths = baths;
            property.sqft = sqft;
            property.type = type;
            property.availability = availability;
            property.description = description;
            property.amenities = amenities;
            property.phone = phone;
            // Keep existing images
            await property.save();
            return res.json({ message: "Property updated successfully", success: true });
        }

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];
        const image5 = req.files.image5 && req.files.image5[0];

        const images = [image1, image2, image3, image4, image5].filter((item) => item !== undefined);

        // Upload images to ImageKit and delete after upload
        const imageUrls = await Promise.all(
            images.map(async (item) => {
                const result = await imagekit.upload({
                    file: fs.readFileSync(item.path),
                    fileName: item.originalname,
                    folder: "Property",
                });
                fs.unlink(item.path, (err) => {
                    if (err) console.log("Error deleting the file: ", err);
                });
                return result.url;
            })
        );

        property.title = title;
        property.location = location;
        property.price = price;
        property.beds = beds;
        property.baths = baths;
        property.sqft = sqft;
        property.type = type;
        property.availability = availability;
        property.description = description;
        property.amenities = amenities;
        property.image = imageUrls;
        property.phone = phone;

        await property.save();
        res.json({ message: "Property updated successfully", success: true });
    } catch (error) {
        console.log("Error updating product: ", error);
        res.status(500).json({ message: "Server Error", success: false });
    }
};

const singleproperty = async (req, res) => {
    try {
        const { id } = req.params;
        const property = await Property.findById(id);
        if (!property) {
            return res.status(404).json({ message: "Property not found", success: false });
        }
        // Normalize numeric fields and image before returning
        const obj = property.toObject ? property.toObject() : { ...property };
        
        // Build image array from images field if available
        if (Array.isArray(obj.images) && obj.images.length > 0) {
            obj.image = obj.images
                .filter(img => img && img.full)
                .map(img => img.full)
                .slice(0, 5); // Limit to 5 images
        }
        
        // Фото
        if (Array.isArray(obj.image)) {
            obj.image = obj.image.filter(url => typeof url === 'string' && url.length > 0);
        } else if (typeof obj.image === 'string') {
            obj.image = [obj.image];
        } else {
            obj.image = [];
        }
        if (!obj.image || obj.image.length === 0) {
            obj.image = ['/placeholder.jpg'];
        }
        // Цена
        obj.price = Number(String(obj.price).replace(/[^0-9.-]+/g, ''));
        if (!obj.price || isNaN(obj.price)) obj.price = 0;
        
        obj.beds = typeof obj.beds === 'number' ? obj.beds : Number(obj.beds) || 0;
        obj.baths = typeof obj.baths === 'number' ? obj.baths : Number(obj.baths) || 0;
        obj.sqft = typeof obj.sqft === 'number' ? obj.sqft : Number(obj.sqft) || 0;

        res.json({ property: obj, success: true });
    } catch (error) {
        console.log("Error fetching property:", error);
        res.status(500).json({ message: "Server Error", success: false });
    }
};

export { addproperty, listproperty, removeproperty, updateproperty , singleproperty};