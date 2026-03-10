import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\MeetingMinuteController::show
 * @see app/Http/Controllers/MeetingMinuteController.php:175
 * @route '/minutes/{minute}'
 */
export const show = (args: { minute: number | { id: number } } | [minute: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/minutes/{minute}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MeetingMinuteController::show
 * @see app/Http/Controllers/MeetingMinuteController.php:175
 * @route '/minutes/{minute}'
 */
show.url = (args: { minute: number | { id: number } } | [minute: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { minute: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { minute: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    minute: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        minute: typeof args.minute === 'object'
                ? args.minute.id
                : args.minute,
                }

    return show.definition.url
            .replace('{minute}', parsedArgs.minute.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingMinuteController::show
 * @see app/Http/Controllers/MeetingMinuteController.php:175
 * @route '/minutes/{minute}'
 */
show.get = (args: { minute: number | { id: number } } | [minute: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MeetingMinuteController::show
 * @see app/Http/Controllers/MeetingMinuteController.php:175
 * @route '/minutes/{minute}'
 */
show.head = (args: { minute: number | { id: number } } | [minute: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})
const minutes = {
    show: Object.assign(show, show),
}

export default minutes