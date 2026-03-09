import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AttachmentController::store
 * @see app/Http/Controllers/AttachmentController.php:14
 * @route '/attachments'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/attachments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AttachmentController::store
 * @see app/Http/Controllers/AttachmentController.php:14
 * @route '/attachments'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttachmentController::store
 * @see app/Http/Controllers/AttachmentController.php:14
 * @route '/attachments'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AttachmentController::destroy
 * @see app/Http/Controllers/AttachmentController.php:46
 * @route '/attachments/{attachment}'
 */
export const destroy = (args: { attachment: number | { id: number } } | [attachment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/attachments/{attachment}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AttachmentController::destroy
 * @see app/Http/Controllers/AttachmentController.php:46
 * @route '/attachments/{attachment}'
 */
destroy.url = (args: { attachment: number | { id: number } } | [attachment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { attachment: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { attachment: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    attachment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        attachment: typeof args.attachment === 'object'
                ? args.attachment.id
                : args.attachment,
                }

    return destroy.definition.url
            .replace('{attachment}', parsedArgs.attachment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttachmentController::destroy
 * @see app/Http/Controllers/AttachmentController.php:46
 * @route '/attachments/{attachment}'
 */
destroy.delete = (args: { attachment: number | { id: number } } | [attachment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const AttachmentController = { store, destroy }

export default AttachmentController