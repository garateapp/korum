import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
 * @see routes/web.php:31
 * @route '/manual/usuario'
 */
export const user = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: user.url(options),
    method: 'get',
})

user.definition = {
    methods: ["get","head"],
    url: '/manual/usuario',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:31
 * @route '/manual/usuario'
 */
user.url = (options?: RouteQueryOptions) => {
    return user.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:31
 * @route '/manual/usuario'
 */
user.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: user.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:31
 * @route '/manual/usuario'
 */
user.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: user.url(options),
    method: 'head',
})
const manual = {
    user: Object.assign(user, user),
}

export default manual