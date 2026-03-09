import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MeetingMinuteController::create
 * @see app/Http/Controllers/MeetingMinuteController.php:15
 * @route '/meetings/{meeting}/minute/create'
 */
export const create = (args: { meeting: number | { id: number } } | [meeting: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/meetings/{meeting}/minute/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MeetingMinuteController::create
 * @see app/Http/Controllers/MeetingMinuteController.php:15
 * @route '/meetings/{meeting}/minute/create'
 */
create.url = (args: { meeting: number | { id: number } } | [meeting: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { meeting: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { meeting: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    meeting: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        meeting: typeof args.meeting === 'object'
                ? args.meeting.id
                : args.meeting,
                }

    return create.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingMinuteController::create
 * @see app/Http/Controllers/MeetingMinuteController.php:15
 * @route '/meetings/{meeting}/minute/create'
 */
create.get = (args: { meeting: number | { id: number } } | [meeting: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MeetingMinuteController::create
 * @see app/Http/Controllers/MeetingMinuteController.php:15
 * @route '/meetings/{meeting}/minute/create'
 */
create.head = (args: { meeting: number | { id: number } } | [meeting: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MeetingMinuteController::store
 * @see app/Http/Controllers/MeetingMinuteController.php:30
 * @route '/meetings/{meeting}/minute'
 */
export const store = (args: { meeting: number | { id: number } } | [meeting: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/meetings/{meeting}/minute',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MeetingMinuteController::store
 * @see app/Http/Controllers/MeetingMinuteController.php:30
 * @route '/meetings/{meeting}/minute'
 */
store.url = (args: { meeting: number | { id: number } } | [meeting: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { meeting: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { meeting: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    meeting: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        meeting: typeof args.meeting === 'object'
                ? args.meeting.id
                : args.meeting,
                }

    return store.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingMinuteController::store
 * @see app/Http/Controllers/MeetingMinuteController.php:30
 * @route '/meetings/{meeting}/minute'
 */
store.post = (args: { meeting: number | { id: number } } | [meeting: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MeetingMinuteController::show
 * @see app/Http/Controllers/MeetingMinuteController.php:88
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
 * @see app/Http/Controllers/MeetingMinuteController.php:88
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
 * @see app/Http/Controllers/MeetingMinuteController.php:88
 * @route '/minutes/{minute}'
 */
show.get = (args: { minute: number | { id: number } } | [minute: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MeetingMinuteController::show
 * @see app/Http/Controllers/MeetingMinuteController.php:88
 * @route '/minutes/{minute}'
 */
show.head = (args: { minute: number | { id: number } } | [minute: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})
const MeetingMinuteController = { create, store, show }

export default MeetingMinuteController