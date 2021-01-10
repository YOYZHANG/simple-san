const lifeCycleOwnIs = function() {
    return this[name];
}

export enum LifeCycleKEY {
    'start' = 'start',
    'compiled' = 'compiled',
    'inited' = 'inited',
    'created' = 'created',
    'attached' = 'attached',
    'leaving' = 'leaving',
    'detached' = 'detached',
    'disposed' = 'disposed',
    'updated' = 'updated'
}


export type LifeCycleType = {
    is?: (lifeCycle: string) => {}
} & {[p in LifeCycleKEY]: boolean}


export const LifeCycle: {[p in LifeCycleKEY]: (LifeCycleType)} = {
    start: {},
    
    complied: {
        is: lifeCycleOwnIs,
        compiled: true
    },

    inited: {
        is: lifeCycleOwnIs,
        compiled: true,
        inited: true
    },

    created: {
        is: lifeCycleOwnIs,
        compiled: true,
        inited: true,
        created: true
    },

    attached: {
        is: lifeCycleOwnIs,
        compiled: true,
        inited: true,
        created: true,
        attached: true
    },

    leaving: {
        is: lifeCycleOwnIs,
        compiled: true,
        inited: true,
        created: true,
        attached: true,
        leaving: true
    },

    detached: {
        is: lifeCycleOwnIs,
        compiled: true,
        inited: true,
        created: true,
        detached: true
    },

    disposed: {
        is: lifeCycleOwnIs,
        disposed: true
    }
}