import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
import updates from './updates'
/**
* @see \App\Http\Controllers\AgreementController::mypending
 * @see app/Http/Controllers/AgreementController.php:36
 * @route '/agreements/mypending'
 */
export const mypending = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mypending.url(options),
    method: 'get',
})

mypending.definition = {
    methods: ["get","head"],
    url: '/agreements/mypending',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AgreementController::mypending
 * @see app/Http/Controllers/AgreementController.php:36
 * @route '/agreements/mypending'
 */
mypending.url = (options?: RouteQueryOptions) => {
    return mypending.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgreementController::mypending
 * @see app/Http/Controllers/AgreementController.php:36
 * @route '/agreements/mypending'
 */
mypending.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mypending.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AgreementController::mypending
 * @see app/Http/Controllers/AgreementController.php:36
 * @route '/agreements/mypending'
 */
mypending.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: mypending.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AgreementController::index
 * @see app/Http/Controllers/AgreementController.php:11
 * @route '/agreements'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/agreements',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AgreementController::index
 * @see app/Http/Controllers/AgreementController.php:11
 * @route '/agreements'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgreementController::index
 * @see app/Http/Controllers/AgreementController.php:11
 * @route '/agreements'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AgreementController::index
 * @see app/Http/Controllers/AgreementController.php:11
 * @route '/agreements'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AgreementController::show
 * @see app/Http/Controllers/AgreementController.php:57
 * @route '/agreements/{agreement}'
 */
export const show = (args: { agreement: number | { id: number } } | [agreement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/agreements/{agreement}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AgreementController::show
 * @see app/Http/Controllers/AgreementController.php:57
 * @route '/agreements/{agreement}'
 */
show.url = (args: { agreement: number | { id: number } } | [agreement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { agreement: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { agreement: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    agreement: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        agreement: typeof args.agreement === 'object'
                ? args.agreement.id
                : args.agreement,
                }

    return show.definition.url
            .replace('{agreement}', parsedArgs.agreement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgreementController::show
 * @see app/Http/Controllers/AgreementController.php:57
 * @route '/agreements/{agreement}'
 */
show.get = (args: { agreement: number | { id: number } } | [agreement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AgreementController::show
 * @see app/Http/Controllers/AgreementController.php:57
 * @route '/agreements/{agreement}'
 */
show.head = (args: { agreement: number | { id: number } } | [agreement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})
const agreements = {
    mypending: Object.assign(mypending, mypending),
index: Object.assign(index, index),
show: Object.assign(show, show),
updates: Object.assign(updates, updates),
}

export default agreements