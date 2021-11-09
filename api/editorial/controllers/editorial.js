'use strict';

const { sanitizeEntity } = require("strapi-utils/lib");
const { findComments } = require("../../editorial/controllers/editorial");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    //findone function
    async findOne(ctx) {
        try {

            const data = await strapi.services.editorial.findOne({ public_id: ctx.params.public_id });
            return sanitizeEntity(data, { model: strapi.models.editorial });

        } catch (err) {
            return ctx.badRequest(null, [{ messages: [{ public_id: 'An error occurred' }] }]);
        }
    },
    //get next function
    async getNext(ctx) {
        try {

            const data = await strapi.services.editorial.getNext({ public_id: ctx.params.public_id });
            const next = await strapi.services.editorial.find(
                {
                    _sort: 'id:asc',
                    _start: data.id,
                    _limit: 1
                }
            );
                if (next.length === 0) {
                    const first = await strapi.services.editorial.find(
                        {
                            _sort: 'id:asc',
                            _limit: 1
                        }
                    );
                    return sanitizeEntity(first[0], { model: strapi.models.editorial });
                
                }
                return sanitizeEntity(next[0], { model: strapi.models.editorial });

        } catch (err) {
            return ctx.badRequest(null, [{ messages: [{ public_id: 'An error occurred' }] }]);
        }
    },
    //define createComment function
    createComment: async ctx => {
        //get the editorial
        const editorial = await strapi.services.editorial.findOne({public_id: ctx.params.public_id});
        //get the comment from json body 'comment'
        const comment = ctx.request.body.comment;
        //get the user
        const user = ctx.state.user;
        //add the user to the comment
        comment.user = user;
        //add the editorial id to the comment
        comment.editorial = editorial.id;
        //create the comment
        const newComment = await strapi.services.comment.create(comment);
        //add the comment to the editorial
        editorial.comments.push(newComment);
        //save the editorial
        await editorial.save();
        //update the editorial
        await strapi.services.editorial.update({id: editorial.id}, editorial);
        //return the comment
        return sanitizeEntity(newComment, { model: strapi.models.comment });
    },
    //define deleteComment function
    deleteComment: async ctx => {
        //get the comment
        const comment = await strapi.services.comment.findOne({id: ctx.params.comment_id});
        //get the editorial
        const editorial = await strapi.services.editorial.findOne({id: comment.editorial});
        //get the user
        const user = ctx.state.user;
        //check if the user is the owner of the comment
        if (user.id === comment.user.id) {
            //remove the comment from the editorial
            editorial.comments = editorial.comments.filter(c => c.id !== comment.id);
            //save the editorial
            await editorial.save();  
            //delete the comment
            await strapi.services.comment.delete({id: ctx.params.id});
            //return the editorial
            return sanitizeEntity(editorial, { model: strapi.models.editorial });
        } else {
            return ctx.unauthorized(null, [{ messages: [{ id: 'You are not the owner of this comment' }] }]);
        }
    },
    //define updateComment function
    updateComment: async ctx => {
        //get the comment
        const comment = await strapi.services.comment.findOne({id: ctx.params.comment_id});
        //get the editorial
        const editorial = await strapi.services.editorial.findOne({id: comment.editorial});
        //get the user
        const user = ctx.state.user;
        //check if the user is the owner of the comment
        if (user.id === comment.user.id) { 
            //update the comment
            await strapi.services.comment.update({id: ctx.params.id}, ctx.request.body);
            //return the editorial
            return sanitizeEntity(editorial, { model: strapi.models.editorial });
        } else {
            return ctx.unauthorized(null, [{ messages: [{ id: 'You are not the owner of this comment' }] }]);
        }
    },
    //define findComments function
    findComments: async (ctx) => {
        //get the editorial
        const editorial = await strapi.services.editorial.findOne({public_id: ctx.params.public_id});
        //get the comments
        const comments = await findComments(editorial.id);
        //return the comments
        return sanitizeEntity(comments, { model: strapi.models.comment });
    },
    //define like function
    like: async (ctx) => {
        //get the editorial
        const editorial = await strapi.services.editorial.findOne({public_id: ctx.params.public_id});
        //get the user
        const user = await strapi.services.user.findOne({id: ctx.state.user.id});
        //get the like
        const like = await strapi.services.like.findOne({user: user.id, editorial: editorial.id});
        //if the like exists
        if (like) {
            //delete the like
            const deletedLike = await strapi.services.like.delete({id: like.id});
            //return the like
            return deletedLike;
        }
        //if the like does not exist
        else {
            //create the like
            const newLike = await strapi.services.like.create({user: user.id, editorial: editorial.id});
            //return the like
            return newLike;
        }
    },
    //define findLikes function
    findLikes: async (ctx) => {
        //get the editorial
        const editorial = await strapi.services.editorial.findOne({public_id: ctx.params.public_id});
        //get the likes
        const likes = await strapi.services.like.find({editorial: editorial.id});
        //return the likes
        return likes;
    },
    //define isLiked function
    isLiked: async (ctx) => {
        //get the editorial
        const editorial = await strapi.services.editorial.findOne({public_id: ctx.params.public_id});
        //get the user
        const user = await strapi.services.user.findOne({id: ctx.state.user.id});
        //get the like
        const like = await strapi.services.like.findOne({user: user.id, editorial: editorial.id});
        //if the like exists
        if (like) {
            //return true
            return true;
        }
        //if the like does not exist
        else {
            //return false
            return false;
        }
    }
};
