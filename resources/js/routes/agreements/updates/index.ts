import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AgreementUpdateController::store
 * @see app/Http/Controllers/AgreementUpdateController.php:12
 * @route '/agreements/{agreement}/updates'
 */
export const store = (args: { agreement: number | { id: number } } | [agreement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/agreements/{agreement}/updates',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AgreementUpdateController::store
 * @see app/Http/Controllers/AgreementUpdateController.php:12
 * @route '/agreements/{agreement}/updates'
 */
store.url = (args: { agreement: number | { id: number } } | [agreement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{agreement}', parsedArgs.agreement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgreementUpdateController::store
 * @see app/Http/Controllers/AgreementUpdateController.php:12
 * @route '/agreements/{agreement}/updates'
 */
store.post = (args: { agreement: number | { id: number } } | [agreement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})
const updates = {
    store: Object.assign(store, store),
}

export default updates