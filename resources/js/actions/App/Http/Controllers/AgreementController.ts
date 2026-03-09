import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AgreementController::myPending
 * @see app/Http/Controllers/AgreementController.php:36
 * @route '/agreements/mypending'
 */
export const myPending = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: myPending.url(options),
    method: 'get',
})

myPending.definition = {
    methods: ["get","head"],
    url: '/agreements/mypending',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AgreementController::myPending
 * @see app/Http/Controllers/AgreementController.php:36
 * @route '/agreements/mypending'
 */
myPending.url = (options?: RouteQueryOptions) => {
    return myPending.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgreementController::myPending
 * @see app/Http/Controllers/AgreementController.php:36
 * @route '/agreements/mypending'
 */
myPending.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: myPending.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AgreementController::myPending
 * @see app/Http/Controllers/AgreementController.php:36
 * @route '/agreements/mypending'
 */
myPending.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: myPending.url(options),
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
const AgreementController = { myPending, index, show }

export default AgreementController