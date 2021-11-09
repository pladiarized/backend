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
        const { editorial } = ctx.request.body;
        const { _id } = user;
        const { _id: editorialId } = editorial;

        const isLiked = await strapi.services.editorial.isLiked(editorialId, _id);

        if (isLiked) {
            return ctx.badRequest(null, [{ messages: [{ id: 'Already liked' }] }]);
        }

        const editorialToUpdate = await strapi.services.editorial.update(
            { _id: editorialId },
            { $push: { likes: _id } }
        );

        return editorialToUpdate;
    },
    comment: async (ctx) => {
        const { id } = ctx.params;
        const { user } = ctx.state;
        const { editorial } = ctx.request.body;
        const { _id } = user;
        const { _id: editorialId } = editorial;

        const editorialToUpdate = await strapi.services.editorial.update(
            { _id: editorialId },
            { $push: { comments: _id } }
        );

        return editorialToUpdate;
    },
    unlike: async (ctx) => {
        const { id } = ctx.params;
        const { user } = ctx.state;
        const { editorial } = ctx.request.body;
        const { _id } = user;
        const { _id: editorialId } = editorial;

        const isLiked = await strapi.services.editorial.isLiked(editorialId, _id);

        if (!isLiked) {
            return ctx.badRequest(null, [{ messages: [{ id: 'Not liked' }] }]);
        }

        const editorialToUpdate = await strapi.services.editorial.update(
            { _id: editorialId },
            { $pull: { likes: _id } }
        );

        return editorialToUpdate;
    }
};
