import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MeetingController::index
 * @see app/Http/Controllers/MeetingController.php:21
 * @route '/meetings'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/meetings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MeetingController::index
 * @see app/Http/Controllers/MeetingController.php:21
 * @route '/meetings'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingController::index
 * @see app/Http/Controllers/MeetingController.php:21
 * @route '/meetings'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MeetingController::index
 * @see app/Http/Controllers/MeetingController.php:21
 * @route '/meetings'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MeetingController::create
 * @see app/Http/Controllers/MeetingController.php:62
 * @route '/meetings/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/meetings/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MeetingController::create
 * @see app/Http/Controllers/MeetingController.php:62
 * @route '/meetings/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingController::create
 * @see app/Http/Controllers/MeetingController.php:62
 * @route '/meetings/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MeetingController::create
 * @see app/Http/Controllers/MeetingController.php:62
 * @route '/meetings/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MeetingController::store
 * @see app/Http/Controllers/MeetingController.php:70
 * @route '/meetings'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/meetings',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MeetingController::store
 * @see app/Http/Controllers/MeetingController.php:70
 * @route '/meetings'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingController::store
 * @see app/Http/Controllers/MeetingController.php:70
 * @route '/meetings'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MeetingController::show
 * @see app/Http/Controllers/MeetingController.php:101
 * @route '/meetings/{meeting}'
 */
export const show = (args: { meeting: number | { id: number } } | [meeting: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/meetings/{meeting}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MeetingController::show
 * @see app/Http/Controllers/MeetingController.php:101
 * @route '/meetings/{meeting}'
 */
show.url = (args: { meeting: number | { id: number } } | [meeting: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingController::show
 * @see app/Http/Controllers/MeetingController.php:101
 * @route '/meetings/{meeting}'
 */
show.get = (args: { meeting: number | { id: number } } | [meeting: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MeetingController::show
 * @see app/Http/Controllers/MeetingController.php:101
 * @route '/meetings/{meeting}'
 */
show.head = (args: { meeting: number | { id: number } } | [meeting: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MeetingController::edit
 * @see app/Http/Controllers/MeetingController.php:113
 * @route '/meetings/{meeting}/edit'
 */
export const edit = (args: { meeting: number | { id: number } } | [meeting: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/meetings/{meeting}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MeetingController::edit
 * @see app/Http/Controllers/MeetingController.php:113
 * @route '/meetings/{meeting}/edit'
 */
edit.url = (args: { meeting: number | { id: number } } | [meeting: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingController::edit
 * @see app/Http/Controllers/MeetingController.php:113
 * @route '/meetings/{meeting}/edit'
 */
edit.get = (args: { meeting: number | { id: number } } | [meeting: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MeetingController::edit
 * @see app/Http/Controllers/MeetingController.php:113
 * @route '/meetings/{meeting}/edit'
 */
edit.head = (args: { meeting: number | { id: number } } | [meeting: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MeetingController::update
 * @see app/Http/Controllers/MeetingController.php:124
 * @route '/meetings/{meeting}'
 */
export const update = (args: { meeting: number | { id: number } } | [meeting: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/meetings/{meeting}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\MeetingController::update
 * @see app/Http/Controllers/MeetingController.php:124
 * @route '/meetings/{meeting}'
 */
update.url = (args: { meeting: number | { id: number } } | [meeting: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingController::update
 * @see app/Http/Controllers/MeetingController.php:124
 * @route '/meetings/{meeting}'
 */
update.put = (args: { meeting: number | { id: number } } | [meeting: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\MeetingController::update
 * @see app/Http/Controllers/MeetingController.php:124
 * @route '/meetings/{meeting}'
 */
update.patch = (args: { meeting: number | { id: number } } | [meeting: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\MeetingController::destroy
 * @see app/Http/Controllers/MeetingController.php:154
 * @route '/meetings/{meeting}'
 */
export const destroy = (args: { meeting: number | { id: number } } | [meeting: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/meetings/{meeting}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MeetingController::destroy
 * @see app/Http/Controllers/MeetingController.php:154
 * @route '/meetings/{meeting}'
 */
destroy.url = (args: { meeting: number | { id: number } } | [meeting: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingController::destroy
 * @see app/Http/Controllers/MeetingController.php:154
 * @route '/meetings/{meeting}'
 */
destroy.delete = (args: { meeting: number | { id: number } } | [meeting: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\MeetingController::cancel
 * @see app/Http/Controllers/MeetingController.php:171
 * @route '/meetings/{meeting}/cancel'
 */
export const cancel = (args: { meeting: number | { id: number } } | [meeting: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: cancel.url(args, options),
    method: 'patch',
})

cancel.definition = {
    methods: ["patch"],
    url: '/meetings/{meeting}/cancel',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\MeetingController::cancel
 * @see app/Http/Controllers/MeetingController.php:171
 * @route '/meetings/{meeting}/cancel'
 */
cancel.url = (args: { meeting: number | { id: number } } | [meeting: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return cancel.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingController::cancel
 * @see app/Http/Controllers/MeetingController.php:171
 * @route '/meetings/{meeting}/cancel'
 */
cancel.patch = (args: { meeting: number | { id: number } } | [meeting: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: cancel.url(args, options),
    method: 'patch',
})
const MeetingController = { index, create, store, show, edit, update, destroy, cancel }

export default MeetingController