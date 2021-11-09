'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
    async beforeUpdate(ctx) {
        const { data } = ctx.request.body;
        const { id } = ctx.params;
        const { user } = ctx.state;

        // Cannot update likes and views of a post if not super admin
        if (!user.isSuperAdmin) {
            if (data.likes || data.views) {
                ctx.response.status = 400;
                ctx.response.body = {
                    statusCode: 400,
                    message: 'Cannot update likes and views of a post',
                };
            }
        }
    }
};
