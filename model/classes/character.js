class Character {
    constructor(name = "", level = 1, power = 1, health = 1, weapon = {}) {
        this.name = name,
        this.level = level,
        this.power = power,
        this.health = health,
        this.weapon = weapon
    }
    
    getJSON = function() {
        return {
            "name": this.name,
            "level": this.level,
            "power": this.power,
            "health": this.health,
            "weapon": this.weapon
            }
    }
}

module.exports = Character