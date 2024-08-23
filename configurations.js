
const Configurations = {
    circle_noCollision: {
        initialization: Initializations.circle(10),
        policy: Policies.noCollision,
        evasion_strength: null
    },
    circle_avoidClosest: {
        initialization: Initializations.circle(20),
        policy: Policies.avoidClosest,
        evasion_strength: null
    },
    circle_velocityObject: {
        initialization: Initializations.circle(10),
        policy: Policies.velocityObstacle,
        evasion_strength: 50.0
    },
    circle_velocityObject_evasive: {
        initialization: Initializations.circle(10),
        policy: Policies.velocityObstacle,
        evasion_strength: 100.0
    },
    // Add more configurations here...
};

function extractNameFromConfig(config) {
    let maybe_evasion_string = config.evasion_strength != null ? `-evasion ${config.evasion_strength}` : '';
    return `${config.initialization.num_boids} nodes-${config.initialization.name}-${config.policy.name}${maybe_evasion_string}`;
}