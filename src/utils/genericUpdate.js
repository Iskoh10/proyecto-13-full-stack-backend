const { deleteFile } = require('./deleteFile');
const { normalizeToArray } = require('./normalizeToArray');
const uploadFileToCloudinary = require('./uploadFileToCloudinary');
const mongoose = require('mongoose');

const genericUpdate = async ({
  id,
  user,
  body,
  Model,
  filePdf = '',
  file = '',
  files = ''
}) => {
  try {
    let { comments, likes, dislikes, attendees, ratings, ...updateData } = body;

    comments = normalizeToArray(comments);
    likes = normalizeToArray(likes);
    dislikes = normalizeToArray(dislikes);
    attendees = normalizeToArray(attendees);

    const event = await Model.findById(id);

    if (!event) {
      throw new Error('Evento no encontrado');
    }

    if (filePdf) {
      const eventToUpdate = await Model.findById(id);
      deleteFile(eventToUpdate.fileUrl);

      const url = await uploadFileToCloudinary(filePdf.path);
      updateData.fileUrl = url;
    }

    if (file) {
      const eventToUpdate = await Model.findById(id);

      if (eventToUpdate) {
        deleteFile(eventToUpdate.productImage);
        updateData.productImage = file.path;
      } else {
        throw new Error('Imagen no encontrada');
      }
    }

    if (files && files['image']) {
      const eventToUpdate = await Model.findById(id);

      if (Array.isArray(eventToUpdate.image)) {
        for (const imgUrl of eventToUpdate.image) {
          deleteFile(imgUrl);
        }
      } else if (eventToUpdate.image) {
        deleteFile(eventToUpdate.image);
      }
      updateData.image = files['image'].map((file) => file.path);
    }

    let updateOps = {};

    const isOwner = event.user._id.toString() === user._id.toString();

    if (isOwner) {
      if (Object.keys(updateData).length > 0) {
        updateOps.$set = { ...updateData };
      }
    }

    if (Array.isArray(comments) && comments.length > 0) {
      updateOps.$push = {
        ...(updateOps.$push || {}),
        comments: { $each: comments }
      };
    }

    if (Array.isArray(likes) && likes.length > 0) {
      updateOps.$addToSet = {
        ...(updateOps.$addToSet || {}),
        likes: { $each: likes }
      };
    }

    if (Array.isArray(dislikes) && dislikes.length > 0) {
      updateOps.$addToSet = {
        ...(updateOps.$addToSet || {}),
        dislikes: { $each: dislikes }
      };
    }

    if (Array.isArray(attendees) && attendees.length > 0) {
      updateOps.$addToSet = {
        ...(updateOps.$addToSet || {}),
        attendees: { $each: attendees }
      };
    }

    let updated;

    if (Array.isArray(ratings) && ratings.length > 0) {
      const userId = new mongoose.Types.ObjectId(user._id);
      const productId = new mongoose.Types.ObjectId(id);

      await Promise.all(
        ratings.map(async (rating) => {
          const prevRating = await Model.findOne({
            _id: productId,
            'ratings.userId': userId
          });

          if (prevRating) {
            const result = await Model.updateOne(
              { _id: id, 'ratings.userId': userId },
              { $set: { 'ratings.$.value': rating.value } }
            );
          } else {
            const result = await Model.updateOne(
              { _id: id },
              { $push: { ratings: { userId: userId, value: rating.value } } }
            );
          }
        })
      );
    }

    if (Object.keys(updateOps).length > 0) {
      updated = await Model.findByIdAndUpdate(id, updateOps, {
        new: true
      });
    } else {
      updated = await Model.findById(id);
    }
    return updated;
  } catch (error) {
    throw error;
  }
};

module.exports = { genericUpdate };
