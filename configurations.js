
class Configuration {
    constructor(initialization, policy, evasion_strength = null) {
        this.initialization = initialization,
            this.policy = policy,
            this.evasion_strength = evasion_strength
    }

    name() {
        let maybe_evasion_string = this.evasion_strength != null ? `-evasion ${this.evasion_strength}` : '';
        return `${this.initialization.num_boids} nodes-${this.initialization.name}-${this.policy.name}${maybe_evasion_string}`;
    }
}

const Configurations = {
    circle_noCollision: new Configuration(Initializations.circle(10), Policies.noCollision),
    circle_avoidClosest: new Configuration(Initializations.circle(10), Policies.avoidClosest),
    circle_velocityObject: new Configuration(Initializations.circle(10), Policies.velocityObstacle, 50.0),
    circle_velocityObject_evade: new Configuration(Initializations.circle(10), Policies.velocityObstacle, 100.0),
    circle_velocityObject_adaptive: new Configuration(Initializations.circle(10), Policies.velocityObstacle, "adaptive"),

};
