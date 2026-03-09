import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MeetingParticipantController::store
 * @see app/Http/Controllers/MeetingParticipantController.php:11
 * @route '/meetings/{meeting}/participants'
 */
export const store = (args: { meeting: number | { id: number } } | [meeting: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/meetings/{meeting}/participants',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MeetingParticipantController::store
 * @see app/Http/Controllers/MeetingParticipantController.php:11
 * @route '/meetings/{meeting}/participants'
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
* @see \App\Http\Controllers\MeetingParticipantController::store
 * @see app/Http/Controllers/MeetingParticipantController.php:11
 * @route '/meetings/{meeting}/participants'
 */
store.post = (args: { meeting: number | { id: number } } | [meeting: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MeetingParticipantController::update
 * @see app/Http/Controllers/MeetingParticipantController.php:30
 * @route '/meetings/{meeting}/participants/{participant}'
 */
export const update = (args: { meeting: number | { id: number }, participant: number | { id: number } } | [meeting: number | { id: number }, participant: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/meetings/{meeting}/participants/{participant}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\MeetingParticipantController::update
 * @see app/Http/Controllers/MeetingParticipantController.php:30
 * @route '/meetings/{meeting}/participants/{participant}'
 */
update.url = (args: { meeting: number | { id: number }, participant: number | { id: number } } | [meeting: number | { id: number }, participant: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    meeting: args[0],
                    participant: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        meeting: typeof args.meeting === 'object'
                ? args.meeting.id
                : args.meeting,
                                participant: typeof args.participant === 'object'
                ? args.participant.id
                : args.participant,
                }

    return update.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace('{participant}', parsedArgs.participant.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingParticipantController::update
 * @see app/Http/Controllers/MeetingParticipantController.php:30
 * @route '/meetings/{meeting}/participants/{participant}'
 */
update.patch = (args: { meeting: number | { id: number }, participant: number | { id: number } } | [meeting: number | { id: number }, participant: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\MeetingParticipantController::destroy
 * @see app/Http/Controllers/MeetingParticipantController.php:42
 * @route '/meetings/{meeting}/participants/{participant}'
 */
export const destroy = (args: { meeting: number | { id: number }, participant: number | { id: number } } | [meeting: number | { id: number }, participant: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/meetings/{meeting}/participants/{participant}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MeetingParticipantController::destroy
 * @see app/Http/Controllers/MeetingParticipantController.php:42
 * @route '/meetings/{meeting}/participants/{participant}'
 */
destroy.url = (args: { meeting: number | { id: number }, participant: number | { id: number } } | [meeting: number | { id: number }, participant: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    meeting: args[0],
                    participant: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        meeting: typeof args.meeting === 'object'
                ? args.meeting.id
                : args.meeting,
                                participant: typeof args.participant === 'object'
                ? args.participant.id
                : args.participant,
                }

    return destroy.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace('{participant}', parsedArgs.participant.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingParticipantController::destroy
 * @see app/Http/Controllers/MeetingParticipantController.php:42
 * @route '/meetings/{meeting}/participants/{participant}'
 */
destroy.delete = (args: { meeting: number | { id: number }, participant: number | { id: number } } | [meeting: number | { id: number }, participant: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const MeetingParticipantController = { store, update, destroy }

export default MeetingParticipantController