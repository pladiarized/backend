'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
    //define like function
    like: async (ctx) => {
        const { id } = ctx.params;
        const { user } = ctx.state;
        const { blogpost } = ctx.request.body;
        const { _id } = user;
        const { _id: blogpostId } = blogpost;

        const isLiked = await strapi.services.blogpost.isLiked(blogpostId, _id);

        if (isLiked) {
            return ctx.badRequest(null, [{ messages: [{ id: 'Already liked' }] }]);
        }

        const blogpostToUpdate = await strapi.services.blogpost.update(
            { _id: blogpostId },
            { $push: { likes: _id } }
        );

        return blogpostToUpdate;
    },
    comment: async (ctx) => {
        const { id } = ctx.params;
        const { user } = ctx.state;
        const { blogpost } = ctx.request.body;
        const { _id } = user;
        const { _id: blogpostId } = blogpost;

        const blogpostToUpdate = await strapi.services.blogpost.update(
            { _id: blogpostId },
            { $push: { comments: _id } }
        );

        return blogpostToUpdate;
    },
    unlike: async (ctx) => {
        const { id } = ctx.params;
        const { user } = ctx.state;
        const { blogpost } = ctx.request.body;
        const { _id } = user;
        const { _id: blogpostId } = blogpost;

        const isLiked = await strapi.services.blogpost.isLiked(blogpostId, _id);

        if (!isLiked) {
            return ctx.badRequest(null, [{ messages: [{ id: 'Not liked' }] }]);
        }

        const blogpostToUpdate = await strapi.services.blogpost.update(
            { _id: blogpostId },
            { $pull: { likes: _id } }
        );

        return blogpostToUpdate;
    },
};
