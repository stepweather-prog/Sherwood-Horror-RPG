// js/combat.js — обновлённые скиллы
Sherwood.Combat = {
    _battle: null,
    _skills: {},
    _playerBuffs: {},

    init: function() {
        this._skills = {
            simple_attack: { id: 'simple_attack', name: 'Простая атака', icon: 'assets/talents/simple_attack.png', description: 'Базовая атака', damageMultiplier: 1.0, hits: 1, cooldown: 0, currentCooldown: 0, unlocked: true, cost: 0, type: 'damage' },
            healing: { id: 'healing', name: 'Исцеление', icon: 'assets/talents/healing.png', description: 'Восстанавливает 20% максимального HP', damageMultiplier: 0, healPercent: 0.20, hits: 1, cooldown: 4, currentCooldown: 0, unlocked: true, cost: 0, type: 'heal' },
            healer: { id: 'healer', name: 'Целитель', icon: 'assets/talents/Healer.png', description: 'Усиливает исцеление на 50%', damageMultiplier: 0, healBoost: 0.5, hits: 1, cooldown: 0, currentCooldown: 0, unlocked: true, cost: 0, type: 'passive' },
            numbness: { id: 'numbness', name: 'Онемение', icon: 'assets/talents/Numbness.png', description: 'Снижает урон врага на 30% на 2 хода', damageMultiplier: 0, enemyDamageReduction: 0.3, duration: 2, hits: 1, cooldown: 4, currentCooldown: 0, unlocked: true, cost: 0, type: 'debuff' },
            ricochet: { id: 'ricochet', name: 'Рикошет', icon: 'assets/talents/Ricochet.png', description: 'Атака бьёт двух врагов', damageMultiplier: 0.8, hits: 2, cooldown: 3, currentCooldown: 0, unlocked: true, cost: 0, type: 'damage' },
            riot: { id: 'riot', name: 'Бунт', icon: 'assets/talents/Riot.png', description: 'Увеличивает шанс крита на 30%', damageMultiplier: 1.0, critChanceBonus: 0.3, hits: 1, cooldown: 3, currentCooldown: 0, unlocked: true, cost: 0, type: 'buff' },
            silence: { id: 'silence', name: 'Тишина', icon: 'assets/talents/Silence.png', description: 'Блокирует способности врага на 1 ход', damageMultiplier: 0.5, silenceDuration: 1, hits: 1, cooldown: 5, currentCooldown: 0, unlocked: true, cost: 0, type: 'debuff' },
            blocking: { id: 'blocking', name: 'Блок', icon: 'assets/talents/blocking.png', description: 'Шанс 40% заблокировать удар', damageMultiplier: 0, blockChance: 0.4, hits: 1, cooldown: 0, currentCooldown: 0, unlocked: true, cost: 0, type: 'passive' },
            evil_eye: { id: 'evil_eye', name: 'Сглаз', icon: 'assets/talents/evil_eye.png', description: 'Снижает защиту врага на 50% на 2 хода', damageMultiplier: 0.3, defenseReduction: 0.5, duration: 2, hits: 1, cooldown: 4, currentCooldown: 0, unlocked: true, cost: 0, type: 'debuff' },
            force_elements: { id: 'force_elements', name: 'Сила стихий', icon: 'assets/talents/force of the elements.png', description: 'Добавляет стихийный урон 30%', damageMultiplier: 1.3, hits: 1, cooldown: 4, currentCooldown: 0, unlocked: true, cost: 0, type: 'damage' },
            funnel: { id: 'funnel', name: 'Воронка', icon: 'assets/talents/funnel.png', description: 'Вытягивает 40% HP от урона', damageMultiplier: 1.0, lifesteal: 0.4, hits: 1, cooldown: 4, currentCooldown: 0, unlocked: true, cost: 0, type: 'damage' },
            ignore: { id: 'ignore', name: 'Игнор', icon: 'assets/talents/ignore.png', description: 'Игнорирует 50% брони врага', damageMultiplier: 1.1, armorPierce: 0.5, hits: 1, cooldown: 3, currentCooldown: 0, unlocked: true, cost: 0, type: 'damage' },
            inspiration: { id: 'inspiration', name: 'Вдохновение', icon: 'assets/talents/inspiration.png', description: 'Увеличивает опыт на 50%', damageMultiplier: 1.0, expBoost: 0.5, hits: 1, cooldown: 5, currentCooldown: 0, unlocked: true, cost: 0, type: 'buff' },
            knot: { id: 'knot', name: 'Узел', icon: 'assets/talents/knot.png', description: 'Сковывает врага на 2 хода', damageMultiplier: 0.4, rootDuration: 2, hits: 1, cooldown: 4, currentCooldown: 0, unlocked: true, cost: 0, type: 'debuff' },
            parry: { id: 'parry', name: 'Парирование', icon: 'assets/talents/parry.png', description: 'Отражает 100% урона 1 ход', damageMultiplier: 0, parry: true, hits: 1, cooldown: 5, currentCooldown: 0, unlocked: true, cost: 0, type: 'defense' },
            poisoning: { id: 'poisoning', name: 'Отравление', icon: 'assets/talents/poisoning.png', description: 'Наносит 7% HP врага за ход, 3 хода', damageMultiplier: 0.6, dotDamage: 0.07, dotDuration: 3, hits: 1, cooldown: 4, currentCooldown: 0, unlocked: true, cost: 0, type: 'damage' },
            stunning: { id: 'stunning', name: 'Оглушение', icon: 'assets/talents/stunning.png', description: 'Оглушает врага на 1 ход', damageMultiplier: 0.4, stunDuration: 1, hits: 1, cooldown: 5, currentCooldown: 0, unlocked: true, cost: 0, type: 'debuff' },
            vampirism: { id: 'vampirism', name: 'Вампиризм', icon: 'assets/talents/vampirism.png', description: 'Восстанавливает 50% урона как HP', damageMultiplier: 0.9, lifesteal: 0.5, hits: 1, cooldown: 4, currentCooldown: 0, unlocked: true, cost: 0, type: 'damage' },
        };
        this._playerBuffs = {};
    },

    getSkills: function() {
        return this._skills;
    },

    unlockSkill: function(id) {
        if (!this._skills[id]) return { success: false, reason: 'Скилл не найден' };
        if (this._skills[id].unlocked) return { success: false, reason: 'Уже открыт' };

        var p = Sherwood.getPlayer();
        if ((p.resources.gold || 0) < this._skills[id].cost) {
            return { success: false, reason: 'Нужно ' + this._skills[id].cost + ' золота' };
        }

        p.resources.gold -= this._skills[id].cost;
        this._skills[id].unlocked = true;
        Sherwood.saveGame();
        return { success: true };
    },

    start: function(monsterId, isBoss, mode, monsterStats) {
        var p = Sherwood.getPlayer();
        if (!p) return;

        var enemyName = 'Монстр';
        var enemyImage = monsterId || 'plague_crow.png';

        if (Sherwood.Bestiary && Sherwood.Bestiary.BEASTS) {
            var beastData = Sherwood.Bestiary.BEASTS[monsterId];
            if (beastData && beastData.name) {
                enemyName = beastData.name;
            }
        }

        var baseHp, baseAtk, baseDef;

        if (monsterStats && monsterStats.atk && monsterStats.def && monsterStats.hp) {
            baseAtk = monsterStats.atk;
            baseDef = monsterStats.def;
            baseHp = monsterStats.hp;
        } else {
            var playerLevel = p.level || 1;
            baseHp = Math.floor(100 + playerLevel * 20);
            baseAtk = Math.floor(10 + playerLevel * 3);
            baseDef = Math.floor(8 + playerLevel * 2);
        }

        if (isBoss) {
            baseHp = Math.floor(baseHp * 3);
            baseAtk = Math.floor(baseAtk * 1.5);
            baseDef = Math.floor(baseDef * 1.2);
            enemyName = 'БОСС: ' + enemyName;
        }

        var enemy = {
            name: enemyName,
            image: enemyImage,
            hp: baseHp,
            maxHp: baseHp,
            attack: baseAtk,
            defense: baseDef,
            isBoss: isBoss || false,
            mode: mode || 'dungeon',
            dots: [],
            stunned: 0,
            silenced: 0,
            defenseReduced: { percent: 0, remainingTurns: 0 },
            damageReduced: { percent: 0, remainingTurns: 0 },
            rooted: { remainingTurns: 0 }
        };

        this._battle = {
            enemy: enemy,
            playerHp: p.stats.hp,
            playerMaxHp: p.stats.maxHp,
            turn: 0
        };

        for (var id in this._skills) {
            this._skills[id].currentCooldown = 0;
        }

        this._playerBuffs = {
            parry: { remainingTurns: 0 },
            riot: { remainingTurns: 0 },
            inspiration: { remainingTurns: 0 }
        };

        return this._battle;
    },

    getState: function() {
        if (!this._battle) return null;

        return {
            enemyName: this._battle.enemy.name,
            enemyImage: this._battle.enemy.image,
            enemyHp: this._battle.enemy.hp,
            enemyMaxHp: this._battle.enemy.maxHp,
            enemyAttack: this._battle.enemy.attack,
            enemyDefense: this._battle.enemy.defense,
            isBoss: this._battle.enemy.isBoss
        };
    },

    _tickCooldowns: function() {
        for (var id in this._skills) {
            if (this._skills[id].currentCooldown > 0) {
                this._skills[id].currentCooldown--;
            }
        }
    },

    _calculateDamage: function(attack, defense) {
        var damage = Math.max(1, Math.floor(attack * 0.15 + (attack - defense) * 0.25));
        var spread = Math.floor(Math.random() * 5);
        damage += spread;
        return damage;
    },

    attack: function() {
        if (!this._battle) return { error: 'Нет боя' };

        var b = this._battle;
        var p = Sherwood.getPlayer();

        this._tickCooldowns();

        var rawDamage = this._calculateDamage(p.stats.attack, b.enemy.defense);

        var critChance = 0.15;
        if (this._playerBuffs.riot && this._playerBuffs.riot.remainingTurns > 0) {
            critChance += 0.3;
        }

        var crit = Math.random() < critChance;
        if (crit) rawDamage = Math.floor(rawDamage * 1.8);

        b.enemy.hp -= rawDamage;
        if (b.enemy.hp < 0) b.enemy.hp = 0;

        var result = {
            damage: rawDamage,
            crit: crit,
            enemyHp: b.enemy.hp,
            enemyMaxHp: b.enemy.maxHp,
            enemyDead: b.enemy.hp <= 0,
            enemyImage: b.enemy.image
        };

        if (b.enemy.hp <= 0) {
            result.win = true;
            var expBonus = (this._playerBuffs.inspiration && this._playerBuffs.inspiration.remainingTurns > 0) ? 1.5 : 1;
            result.exp = Math.floor(b.enemy.maxHp * 0.3 * expBonus);
            result.gold = Math.floor(b.enemy.maxHp * 0.1);
            this._battle = null;
            return result;
        }

        var enemyResult = this._enemyTurn();

        if (enemyResult.playerDead) {
            result.playerDead = true;
            result.exp = Math.floor(b.enemy.maxHp * 0.1);
            result.gold = 0;
            this._battle = null;
            return result;
        }

        p.stats.hp = b.playerHp;
        result.playerHp = b.playerHp;
        result.enemyDamage = enemyResult.enemyDamage;

        this._tickBuffs();

        Sherwood.saveGame();
        return result;
    },

    useSkill: function(skillId) {
        if (!this._battle) return { error: 'Нет боя' };

        var skill = this._skills[skillId];
        if (!skill) return { error: 'Скилл не найден' };
        if (!skill.unlocked) return { error: 'Скилл не открыт' };
        if (skill.currentCooldown > 0) return { error: 'Перезарядка: ' + skill.currentCooldown };

        var b = this._battle;
        var p = Sherwood.getPlayer();

        this._tickCooldowns();
        skill.currentCooldown = skill.cooldown;

        var result = {
            skillName: skill.name,
            damage: 0,
            heal: 0,
            enemyHp: b.enemy.hp,
            enemyMaxHp: b.enemy.maxHp,
            enemyDead: false,
            enemyImage: b.enemy.image,
            effects: []
        };

        switch (skill.type) {
            case 'heal':
                var healAmount = Math.floor(p.stats.maxHp * skill.healPercent);
                p.stats.hp = Math.min(p.stats.maxHp, p.stats.hp + healAmount);
                b.playerHp = p.stats.hp;
                result.heal = healAmount;
                result.effects.push('+ ' + healAmount + ' HP');
                break;

            case 'defense':
                if (skill.parry) {
                    this._playerBuffs.parry.remainingTurns = 1;
                    result.effects.push('Парирование активно');
                }
                break;

            case 'buff':
                if (skill.critChanceBonus) {
                    this._playerBuffs.riot.remainingTurns = 2;
                    result.effects.push('Шанс крита +30% на 2 хода');
                }
                if (skill.expBoost) {
                    this._playerBuffs.inspiration.remainingTurns = 2;
                    result.effects.push('Опыт +50% на 2 хода');
                }
                break;

            case 'debuff':
                if (skill.enemyDamageReduction) {
                    b.enemy.damageReduced.percent = skill.enemyDamageReduction;
                    b.enemy.damageReduced.remainingTurns = skill.duration;
                    result.effects.push('Урон врага снижен на 30%');
                }
                if (skill.silenceDuration) {
                    b.enemy.silenced = skill.silenceDuration;
                    result.effects.push('Враг блокирован на ' + skill.silenceDuration + ' ход');
                }
                if (skill.defenseReduction) {
                    b.enemy.defenseReduced.percent = skill.defenseReduction;
                    b.enemy.defenseReduced.remainingTurns = skill.duration;
                    result.effects.push('Защита врага снижена');
                }
                if (skill.rootDuration) {
                    b.enemy.rooted.remainingTurns = skill.rootDuration;
                    result.effects.push('Враг скован на ' + skill.rootDuration + ' хода');
                }
                if (skill.stunDuration) {
                    b.enemy.stunned = skill.stunDuration;
                    result.effects.push('Враг оглушён');
                }
                break;

            default:
                var totalDamage = 0;
                var hits = skill.hits || 1;
                var effectiveDefense = b.enemy.defense;

                if (skill.armorPierce) {
                    effectiveDefense = Math.floor(effectiveDefense * (1 - skill.armorPierce));
                }

                if (b.enemy.defenseReduced.remainingTurns > 0) {
                    effectiveDefense = Math.floor(effectiveDefense * (1 - b.enemy.defenseReduced.percent));
                }

                for (var h = 0; h < hits; h++) {
                    var hitDamage = this._calculateDamage(p.stats.attack * skill.damageMultiplier, effectiveDefense);
                    totalDamage += hitDamage;
                    b.enemy.hp -= hitDamage;
                    if (b.enemy.hp < 0) b.enemy.hp = 0;
                    if (b.enemy.hp <= 0) break;
                }

                result.damage = totalDamage;
                result.hits = hits;

                if (skill.dotDamage && skill.dotDuration && b.enemy.hp > 0) {
                    b.enemy.dots.push({ damagePerTurn: skill.dotDamage, remainingTurns: skill.dotDuration });
                    result.effects.push('Отравление на ' + skill.dotDuration + ' хода');
                }

                if (skill.lifesteal && totalDamage > 0) {
                    var lsAmount = Math.floor(totalDamage * skill.lifesteal);
                    p.stats.hp = Math.min(p.stats.maxHp, p.stats.hp + lsAmount);
                    b.playerHp = p.stats.hp;
                    result.heal = lsAmount;
                    result.effects.push('+ ' + lsAmount + ' HP');
                }
                break;
        }

        result.enemyHp = b.enemy.hp;
        result.enemyMaxHp = b.enemy.maxHp;

        if (b.enemy.hp <= 0) {
            result.enemyDead = true;
            result.win = true;
            var expBonus2 = (this._playerBuffs.inspiration && this._playerBuffs.inspiration.remainingTurns > 0) ? 1.5 : 1;
            result.exp = Math.floor(b.enemy.maxHp * 0.3 * expBonus2);
            result.gold = Math.floor(b.enemy.maxHp * 0.1);
            this._battle = null;
            return result;
        }

        if (b.enemy.stunned > 0) {
            b.enemy.stunned--;
            result.enemyStunned = true;
        } else {
            var enemyResult = this._enemyTurn();

            if (enemyResult.playerDead) {
                result.playerDead = true;
                this._battle = null;
                return result;
            }

            result.enemyDamage = enemyResult.enemyDamage;
        }

        this._tickBuffs();

        p.stats.hp = b.playerHp;
        result.playerHp = b.playerHp;

        Sherwood.saveGame();
        return result;
    },

    _enemyTurn: function() {
        if (!this._battle) return { playerDead: false };

        var b = this._battle;
        var p = Sherwood.getPlayer();

        if (this._playerBuffs.parry && this._playerBuffs.parry.remainingTurns > 0) {
            return { playerDead: false, enemyDamage: 0, parried: true };
        }

        var attackValue = b.enemy.attack;

        if (b.enemy.damageReduced.remainingTurns > 0) {
            attackValue = Math.floor(attackValue * (1 - b.enemy.damageReduced.percent));
        }

        if (b.enemy.silenced > 0) {
            attackValue = Math.floor(attackValue * 0.5);
        }

        if (b.enemy.rooted.remainingTurns > 0) {
            attackValue = Math.floor(attackValue * 0.7);
        }

        var defenseValue = p.stats.defense;
        var enemyDamage = this._calculateDamage(attackValue, defenseValue);

        var blockSkill = this._skills.blocking;
        if (blockSkill && blockSkill.unlocked && blockSkill.blockChance) {
            if (Math.random() < blockSkill.blockChance) {
                enemyDamage = 0;
            }
        }

        b.playerHp -= enemyDamage;
        if (b.playerHp < 0) b.playerHp = 0;
        p.stats.hp = b.playerHp;

        return {
            playerDead: b.playerHp <= 0,
            enemyDamage: enemyDamage,
            playerHp: b.playerHp
        };
    },

    _tickBuffs: function() {
        if (this._playerBuffs.parry && this._playerBuffs.parry.remainingTurns > 0) {
            this._playerBuffs.parry.remainingTurns--;
        }
        if (this._playerBuffs.riot && this._playerBuffs.riot.remainingTurns > 0) {
            this._playerBuffs.riot.remainingTurns--;
        }
        if (this._playerBuffs.inspiration && this._playerBuffs.inspiration.remainingTurns > 0) {
            this._playerBuffs.inspiration.remainingTurns--;
        }

        if (this._battle && this._battle.enemy) {
            var e = this._battle.enemy;
            if (e.damageReduced.remainingTurns > 0) e.damageReduced.remainingTurns--;
            if (e.defenseReduced.remainingTurns > 0) e.defenseReduced.remainingTurns--;
            if (e.rooted.remainingTurns > 0) e.rooted.remainingTurns--;
            if (e.silenced > 0) e.silenced--;
        }
    },

    flee: function() {
        if (!this._battle) return { success: true };

        var b = this._battle;
        var p = Sherwood.getPlayer();

        if (Math.random() < 0.6) {
            this._battle = null;
            Sherwood.saveGame();
            return { success: true };
        }

        var enemyDamage = Math.max(1, Math.floor(b.enemy.attack - p.stats.defense * 0.3));
        p.stats.hp = Math.max(0, p.stats.hp - enemyDamage);
        b.playerHp = p.stats.hp;

        if (p.stats.hp <= 0) {
            this._battle = null;
            Sherwood.saveGame();
            return { lose: true, damage: enemyDamage };
        }

        Sherwood.saveGame();
        return { success: false, damage: enemyDamage };
    },

    isInBattle: function() {
        return this._battle !== null;
    }
};
