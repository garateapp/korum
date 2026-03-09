import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\MeetingTypeController::index
 * @see app/Http/Controllers/Admin/MeetingTypeController.php:12
 * @route '/admin/meeting-types'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/meeting-types',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\MeetingTypeController::index
 * @see app/Http/Controllers/Admin/MeetingTypeController.php:12
 * @route '/admin/meeting-types'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MeetingTypeController::index
 * @see app/Http/Controllers/Admin/MeetingTypeController.php:12
 * @route '/admin/meeting-types'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\MeetingTypeController::index
 * @see app/Http/Controllers/Admin/MeetingTypeController.php:12
 * @route '/admin/meeting-types'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\MeetingTypeController::store
 * @see app/Http/Controllers/Admin/MeetingTypeController.php:19
 * @route '/admin/meeting-types'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/meeting-types',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\MeetingTypeController::store
 * @see app/Http/Controllers/Admin/MeetingTypeController.php:19
 * @route '/admin/meeting-types'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MeetingTypeController::store
 * @see app/Http/Controllers/Admin/MeetingTypeController.php:19
 * @route '/admin/meeting-types'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\MeetingTypeController::update
 * @see app/Http/Controllers/Admin/MeetingTypeController.php:31
 * @route '/admin/meeting-types/{meeting_type}'
 */
export const update = (args: { meeting_type: string | number } | [meeting_type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/meeting-types/{meeting_type}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\MeetingTypeController::update
 * @see app/Http/Controllers/Admin/MeetingTypeController.php:31
 * @route '/admin/meeting-types/{meeting_type}'
 */
update.url = (args: { meeting_type: string | number } | [meeting_type: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { meeting_type: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    meeting_type: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        meeting_type: args.meeting_type,
                }

    return update.definition.url
            .replace('{meeting_type}', parsedArgs.meeting_type.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MeetingTypeController::update
 * @see app/Http/Controllers/Admin/MeetingTypeController.php:31
 * @route '/admin/meeting-types/{meeting_type}'
 */
update.put = (args: { meeting_type: string | number } | [meeting_type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\MeetingTypeController::update
 * @see app/Http/Controllers/Admin/MeetingTypeController.php:31
 * @route '/admin/meeting-types/{meeting_type}'
 */
update.patch = (args: { meeting_type: string | number } | [meeting_type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\MeetingTypeController::destroy
 * @see app/Http/Controllers/Admin/MeetingTypeController.php:43
 * @route '/admin/meeting-types/{meeting_type}'
 */
export const destroy = (args: { meeting_type: string | number } | [meeting_type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/meeting-types/{meeting_type}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\MeetingTypeController::destroy
 * @see app/Http/Controllers/Admin/MeetingTypeController.php:43
 * @route '/admin/meeting-types/{meeting_type}'
 */
destroy.url = (args: { meeting_type: string | number } | [meeting_type: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { meeting_type: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    meeting_type: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        meeting_type: args.meeting_type,
                }

    return destroy.definition.url
            .replace('{meeting_type}', parsedArgs.meeting_type.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MeetingTypeController::destroy
 * @see app/Http/Controllers/Admin/MeetingTypeController.php:43
 * @route '/admin/meeting-types/{meeting_type}'
 */
destroy.delete = (args: { meeting_type: string | number } | [meeting_type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const MeetingTypeController = { index, store, update, destroy }

export default MeetingTypeController