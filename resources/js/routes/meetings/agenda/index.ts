import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\MeetingAgendaController::store
 * @see app/Http/Controllers/MeetingAgendaController.php:11
 * @route '/meetings/{meeting}/agenda'
 */
export const store = (args: { meeting: number | { id: number } } | [meeting: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/meetings/{meeting}/agenda',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MeetingAgendaController::store
 * @see app/Http/Controllers/MeetingAgendaController.php:11
 * @route '/meetings/{meeting}/agenda'
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
* @see \App\Http\Controllers\MeetingAgendaController::store
 * @see app/Http/Controllers/MeetingAgendaController.php:11
 * @route '/meetings/{meeting}/agenda'
 */
store.post = (args: { meeting: number | { id: number } } | [meeting: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MeetingAgendaController::destroy
 * @see app/Http/Controllers/MeetingAgendaController.php:26
 * @route '/meetings/{meeting}/agenda/{agendaItem}'
 */
export const destroy = (args: { meeting: number | { id: number }, agendaItem: number | { id: number } } | [meeting: number | { id: number }, agendaItem: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/meetings/{meeting}/agenda/{agendaItem}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MeetingAgendaController::destroy
 * @see app/Http/Controllers/MeetingAgendaController.php:26
 * @route '/meetings/{meeting}/agenda/{agendaItem}'
 */
destroy.url = (args: { meeting: number | { id: number }, agendaItem: number | { id: number } } | [meeting: number | { id: number }, agendaItem: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    meeting: args[0],
                    agendaItem: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        meeting: typeof args.meeting === 'object'
                ? args.meeting.id
                : args.meeting,
                                agendaItem: typeof args.agendaItem === 'object'
                ? args.agendaItem.id
                : args.agendaItem,
                }

    return destroy.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace('{agendaItem}', parsedArgs.agendaItem.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingAgendaController::destroy
 * @see app/Http/Controllers/MeetingAgendaController.php:26
 * @route '/meetings/{meeting}/agenda/{agendaItem}'
 */
destroy.delete = (args: { meeting: number | { id: number }, agendaItem: number | { id: number } } | [meeting: number | { id: number }, agendaItem: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const agenda = {
    store: Object.assign(store, store),
destroy: Object.assign(destroy, destroy),
}

export default agenda