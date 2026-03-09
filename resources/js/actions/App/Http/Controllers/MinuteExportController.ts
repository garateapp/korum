import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MinuteExportController::exportMethod
 * @see app/Http/Controllers/MinuteExportController.php:11
 * @route '/meetings/{meeting}/export'
 */
export const exportMethod = (args: { meeting: number | { id: number } } | [meeting: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(args, options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/meetings/{meeting}/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MinuteExportController::exportMethod
 * @see app/Http/Controllers/MinuteExportController.php:11
 * @route '/meetings/{meeting}/export'
 */
exportMethod.url = (args: { meeting: number | { id: number } } | [meeting: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return exportMethod.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MinuteExportController::exportMethod
 * @see app/Http/Controllers/MinuteExportController.php:11
 * @route '/meetings/{meeting}/export'
 */
exportMethod.get = (args: { meeting: number | { id: number } } | [meeting: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MinuteExportController::exportMethod
 * @see app/Http/Controllers/MinuteExportController.php:11
 * @route '/meetings/{meeting}/export'
 */
exportMethod.head = (args: { meeting: number | { id: number } } | [meeting: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(args, options),
    method: 'head',
})
const MinuteExportController = { exportMethod, export: exportMethod }

export default MinuteExportController