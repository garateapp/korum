import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
 * @see routes/web.php:71
 * @route '/notifications/mark-read'
 */
export const markRead = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markRead.url(options),
    method: 'post',
})

markRead.definition = {
    methods: ["post"],
    url: '/notifications/mark-read',
} satisfies RouteDefinition<["post"]>

/**
 * @see routes/web.php:71
 * @route '/notifications/mark-read'
 */
markRead.url = (options?: RouteQueryOptions) => {
    return markRead.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:71
 * @route '/notifications/mark-read'
 */
markRead.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markRead.url(options),
    method: 'post',
})
const notifications = {
    markRead: Object.assign(markRead, markRead),
}

export default notifications