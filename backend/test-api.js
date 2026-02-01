import axios from 'axios';

try {
  const response = await axios.get('http://localhost:4000/api/products/list');
  console.log('Response status:', response.status);
  console.log('Response data:', JSON.stringify(response.data, null, 2).substring(0, 500));
  console.log('Success field:', response.data.success);
  console.log('Property array length:', response.data.property?.length);
  if (response.data.property && response.data.property.length > 0) {
    console.log('First property _id:', response.data.property[0]._id);
    console.log('First property fields:', Object.keys(response.data.property[0]).join(', '));
  }
} catch (error) {
  console.error('Error:', error.message);
  if (error.response) {
    console.error('Response status:', error.response.status);
    console.error('Response data:', error.response.data);
  }
}
