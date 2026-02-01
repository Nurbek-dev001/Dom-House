import mongoose from 'mongoose';
import Property from '../models/propertymodel.js';
import { config } from '../config/config.js';

const extraImagesPool = [
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c9c5d5?w=1200&q=80',
  'https://images.unsplash.com/photo-1497366216548-495226ae6d35?w=1200&q=80',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
  'https://images.unsplash.com/photo-1613581821968-16e59e309b93?w=1200&q=80',
  'https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=1200&q=80',
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&q=80',
  'https://images.unsplash.com/photo-1604014237800-1c6174d54ecb?w=1200&q=80'
];

const run = async () => {
  try {
    await mongoose.connect(config.MONGO_URL);
    console.log('Connected to MongoDB');

    const properties = await Property.find();
    console.log(`Found ${properties.length} properties`);

    let updatedCount = 0;
    for (let i = 0; i < properties.length; i++) {
      const prop = properties[i];
      const images = Array.isArray(prop.image) ? [...prop.image] : (prop.image ? [prop.image] : []);
      let added = 0;
      let counter = 0;
      while (images.length < 5) {
        images.push(extraImagesPool[(i + counter) % extraImagesPool.length]);
        counter++;
        added++;
      }
      if (added > 0) {
        prop.image = images;
        await prop.save();
        updatedCount++;
        console.log(`Updated property ${prop._id}: added ${added} images`);
      }
    }

    console.log(`Done. ${updatedCount} properties were updated.`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

run();