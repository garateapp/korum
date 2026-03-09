import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\GoogleCalendarController::connect
 * @see app/Http/Controllers/GoogleCalendarController.php:18
 * @route '/integrations/google-calendar/connect'
 */
export const connect = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: connect.url(options),
    method: 'get',
})

connect.definition = {
    methods: ["get","head"],
    url: '/integrations/google-calendar/connect',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GoogleCalendarController::connect
 * @see app/Http/Controllers/GoogleCalendarController.php:18
 * @route '/integrations/google-calendar/connect'
 */
connect.url = (options?: RouteQueryOptions) => {
    return connect.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GoogleCalendarController::connect
 * @see app/Http/Controllers/GoogleCalendarController.php:18
 * @route '/integrations/google-calendar/connect'
 */
connect.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: connect.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GoogleCalendarController::connect
 * @see app/Http/Controllers/GoogleCalendarController.php:18
 * @route '/integrations/google-calendar/connect'
 */
connect.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: connect.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GoogleCalendarController::forceConsent
 * @see app/Http/Controllers/GoogleCalendarController.php:24
 * @route '/integrations/google-calendar/force-consent'
 */
export const forceConsent = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: forceConsent.url(options),
    method: 'get',
})

forceConsent.definition = {
    methods: ["get","head"],
    url: '/integrations/google-calendar/force-consent',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GoogleCalendarController::forceConsent
 * @see app/Http/Controllers/GoogleCalendarController.php:24
 * @route '/integrations/google-calendar/force-consent'
 */
forceConsent.url = (options?: RouteQueryOptions) => {
    return forceConsent.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GoogleCalendarController::forceConsent
 * @see app/Http/Controllers/GoogleCalendarController.php:24
 * @route '/integrations/google-calendar/force-consent'
 */
forceConsent.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: forceConsent.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GoogleCalendarController::forceConsent
 * @see app/Http/Controllers/GoogleCalendarController.php:24
 * @route '/integrations/google-calendar/force-consent'
 */
forceConsent.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: forceConsent.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GoogleCalendarController::callback
 * @see app/Http/Controllers/GoogleCalendarController.php:30
 * @route '/integrations/google-calendar/callback'
 */
export const callback = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: callback.url(options),
    method: 'get',
})

callback.definition = {
    methods: ["get","head"],
    url: '/integrations/google-calendar/callback',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GoogleCalendarController::callback
 * @see app/Http/Controllers/GoogleCalendarController.php:30
 * @route '/integrations/google-calendar/callback'
 */
callback.url = (options?: RouteQueryOptions) => {
    return callback.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GoogleCalendarController::callback
 * @see app/Http/Controllers/GoogleCalendarController.php:30
 * @route '/integrations/google-calendar/callback'
 */
callback.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: callback.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GoogleCalendarController::callback
 * @see app/Http/Controllers/GoogleCalendarController.php:30
 * @route '/integrations/google-calendar/callback'
 */
callback.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: callback.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GoogleCalendarController::sync
 * @see app/Http/Controllers/GoogleCalendarController.php:46
 * @route '/integrations/google-calendar/sync'
 */
export const sync = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sync.url(options),
    method: 'post',
})

sync.definition = {
    methods: ["post"],
    url: '/integrations/google-calendar/sync',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GoogleCalendarController::sync
 * @see app/Http/Controllers/GoogleCalendarController.php:46
 * @route '/integrations/google-calendar/sync'
 */
sync.url = (options?: RouteQueryOptions) => {
    return sync.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GoogleCalendarController::sync
 * @see app/Http/Controllers/GoogleCalendarController.php:46
 * @route '/integrations/google-calendar/sync'
 */
sync.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sync.url(options),
    method: 'post',
})
const googleCalendar = {
    connect: Object.assign(connect, connect),
forceConsent: Object.assign(forceConsent, forceConsent),
callback: Object.assign(callback, callback),
sync: Object.assign(sync, sync),
}

export default googleCalendar