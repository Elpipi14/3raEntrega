import mongoose from 'mongoose';

mongoose.connect("mongodb+srv://admin:admin14@clusterecommerce.bfjaefn.mongodb.net/store?retryWrites=true&w=majority")
  .then(() => console.log('Connected to MongoDB database'))
  .catch(() => console.log('error connecting mongo'));
