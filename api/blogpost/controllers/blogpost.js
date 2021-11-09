'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {
    //findOne
    async findOne(ctx) {
        try {
            const data = await strapi.services.blogpost.findOne({ public_id: ctx.params.public_id });
            return sanitizeEntity(data, { model: strapi.models.blogpost });
        } catch (err) {
            return ctx.badRequest(null, [{ messages: [{ public_id: 'An error occured' }] }]);
        }
    },
    
    // get blogpost next
    async getNext(ctx) {
        try {
            const data = await strapi.services.blogpost.findOne({ public_id: ctx.params.public_id });
            const next = await strapi.services.blogpost.find({
                // strapi query builder
                _sort: 'id:asc',
                _start: data.id,
                _limit: 1
                // end strapi query builder
            });
            if (next.length === 0) {
                // return first blogpost
                const first = await strapi.services.blogpost.find({
                    _sort: 'id:asc',
                    _limit: 1
                });
                return sanitizeEntity(first[0], { model: strapi.models.blogpost });
            }
            return sanitizeEntity(next[0], { model: strapi.models.blogpost });
        } catch (err) {
            return ctx.badRequest(null, [{ messages: [{ public_id: 'An error occured' }] }]);
        }
    },

    //define createComment function
    createComment: async ctx => {
        //get the blogpost
        const blogpost = await strapi.services.blogpost.findOne({public_id: ctx.params.public_id});
        //get the comment
        const comment = ctx.request.body.comment;
        //get the user
        const user = ctx.state.user;
        //add the user to the comment
        comment.user = user;
        //add the blogpost id to the comment
        comment.blogpost = blogpost.id;
        //create the comment
        const newComment = await strapi.services.comment.create(comment);
        //add the comment to the blogpost
        blogpost.comments.push(newComment);
        //save the blogpost
        await blogpost.save();
        //update the blogpost
        await strapi.services.blogpost.update({id: blogpost.id}, blogpost);
        //return the comment
        return sanitizeEntity(newComment, { model: strapi.models.comment });
    },
    //define deleteComment function
    deleteComment: async ctx => {
        //get the comment
        const comment = await strapi.services.comment.findOne({id: ctx.params.comment_id});
        //get the blogpost
        const blogpost = await strapi.services.blogpost.findOne({id: comment.blogpost});
        //get the user
        const user = ctx.state.user;
        //check if the user is the owner of the comment
        if (user.id === comment.user.id) {
            //remove the comment from the blogpost
            blogpost.comments = blogpost.comments.filter(c => c.id !== comment.id);
            //save the blogpost
            await blogpost.save();  
            //delete the comment
            await strapi.services.comment.delete({id: ctx.params.id});
            //return the blogpost
            return sanitizeEntity(blogpost, { model: strapi.models.blogpost });
        } else {
            return ctx.unauthorized(null, [{ messages: [{ id: 'You are not the owner of this comment' }] }]);
        }
    },
    //define updateComment function
    updateComment: async ctx => {
        //get the comment
        const comment = await strapi.services.comment.findOne({id: ctx.params.comment_id});
        //get the blogpost
        const blogpost = await strapi.services.blogpost.findOne({id: comment.blogpost});
        //get the user
        const user = ctx.state.user;
        //check if the user is the owner of the comment
        if (user.id === comment.user.id) { 
            //update the comment
            await strapi.services.comment.update({id: ctx.params.id}, ctx.request.body);
            //return the blogpost
            return sanitizeEntity(blogpost, { model: strapi.models.blogpost });
        } else {
            return ctx.unauthorized(null, [{ messages: [{ id: 'You are not the owner of this comment' }] }]);
        }
    },
    //define findComments function
    findComments: async ctx => {
        //get the blogpost
        const blogpost = await strapi.services.blogpost.findOne({public_id: ctx.params.public_id});
        //get the comments
        const comments = await strapi.services.comment.find({blogpost: blogpost.id});
        //return the comments
        return comments;
    },
    //define like function
    like: async ctx => {
        //get the blogpost
        const blogpost = await strapi.services.blogpost.findOne({public_id: ctx.params.public_id});
        //get the user
        const user = await strapi.services.user.findOne({id: ctx.state.user.id});
        //get the like
        const like = await strapi.services.like.findOne({blogpost: blogpost.id, user: user.id});
        //if the like exists
        if(like) {
            //delete the like
            const deletedLike = await strapi.services.like.delete({id: like.id});
            //return the deleted like
            return deletedLike;
        }
        //if the like does not exist
        else {
            //create the like
            const newLike = await strapi.services.like.create({blogpost: blogpost.id, user: user.id});
            //return the new like
            return newLike;
        }
    },
    //define findLikes function
    findLikes: async ctx => {
        //get the blogpost
        const blogpost = await strapi.services.blogpost.findOne({public_id: ctx.params.public_id});
        //get the likes
        const likes = await strapi.services.like.find({blogpost: blogpost.id});
        //return the likes
        return likes;
    },
    //define isLiked function
    isLiked: async ctx => {
        //get the blogpost
        const blogpost = await strapi.services.blogpost.findOne({public_id: ctx.params.public_id});
        //get the user
        const user = await strapi.services.user.findOne({id: ctx.state.user.id});
        //get the like
        const like = await strapi.services.like.findOne({blogpost: blogpost.id, user: user.id});
        //if the like exists
        if(like) {
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
