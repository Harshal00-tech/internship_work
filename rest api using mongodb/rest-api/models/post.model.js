import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  imageUrl : {
    type: String,
    required: true,
  },
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
}, {timeStamps : true}
)

const Post = mongoose.model('Post', postSchema)
export default Post