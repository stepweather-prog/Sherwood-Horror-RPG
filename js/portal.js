// js/portal.js
Sherwood.Portal = {
    _currentPortal: null,
    _currentEnemies: [],
    _currentLevel: 0,
    _inPortal: false,
    _deathCount: 0,
    _timerInterval: null,
    _timeRemaining: 0,

    PORTALS: [
        {
            id: 1, name: 'Портал Нашествия', bg: 'assets/backgrounds/portal.png',
            boss: { name: 'Жнец-Полководец', image: 'the_reaper_commander.png', hp: 3000, attack: 120, defense: 60, exp: 500, gold: 400 },
            guard: { name: 'Матка Лесных Короедов', image: 'the_hive_mother.png', hp: 2000, attack: 95, defense: 46, exp: 300, gold: 250 },
            rewards: { gold: 500, exp: 800, silver: 1200 }
        },
        {
            id: 2, name: 'Портал Черных Пауков', bg: 'assets/backgrounds/portal.png',
            boss: { name: 'Ткачиха Мрака', image: 'the_dark_weaver.png', hp: 3500, attack: 135, defense: 65, exp: 600, gold: 480 },
            guard: { name: 'Проклятый Король Разбойников', image: 'the_cursed_outlaw_king.png', hp: 2300, attack: 105, defense: 50, exp: 350, gold: 300 },
            rewards: { gold: 650, exp: 1000, silver: 1500 }
        },
        {
            id: 3, name: 'Портал Увядания', bg: 'assets/backgrounds/portal.png',
            boss: { name: 'Истлевший Титан', image: 'the_decayed_titan.png', hp: 4000, attack: 150, defense: 70, exp: 700, gold: 560 },
            guard: { name: 'Древний Хранитель Склепа', image: 'ancient_crypt_warden.png', hp: 2600, attack: 115, defense: 55, exp: 400, gold: 350 },
            rewards: { gold: 800, exp: 1200, silver: 1800 }
        },
        {
            id: 4, name: 'Портал Цепей', bg: 'assets/backgrounds/portal.png',
            boss: { name: 'Вечный Узник', image: 'the_eternal_prisoner.png', hp: 4500, attack: 165, defense: 75, exp: 800, gold: 640 },
            guard: { name: 'Эхо Трех Порталов', image: 'echo_of_the_triumvirate.png', hp: 3000, attack: 130, defense: 60, exp: 450, gold: 400 },
            rewards: { gold: 950, exp: 1400, silver: 2100 }
        },
        {
            id: 5, name: 'Портал Ликантропов', bg: 'assets/backgrounds/portal.png',
            boss: { name: 'Кровавый Вожак', image: 'the_blood_alpha.png', hp: 5000, attack: 180, defense: 80, exp: 900, gold: 720 },
            guard: { name: 'Палач Священного Древа', image: 'sacred_tree_executioner.png', hp: 3500, attack: 145, defense: 68, exp: 500, gold: 450 },
            rewards: { gold: 1100, exp: 1600, silver: 2400 }
        },
        {
            id: 6, name: 'Портал Скорпиона', bg: 'assets/backgrounds/portal.png',
            boss: { name: 'Базальтовый Жнец', image: 'the_basalt_reaper.png', hp: 5500, attack: 195, defense: 85, exp: 1000, gold: 800 },
            guard: { name: 'Шервудское Отродье', image: 'sherwood_abomination.png', hp: 4500, attack: 170, defense: 80, exp: 600, gold: 500 },
            rewards: { gold: 1250, exp: 1800, silver: 2700 }
        },
        {
            id: 7, name: 'Портал Искажения', bg: 'assets/backgrounds/portal.png',
            boss: { name: 'Воплощение Искажения', image: 'embodiment_of_distortion.png', hp: 7000, attack: 220, defense: 100, exp: 1200, gold: 1000 },
            guard: { name: 'Изначальный Стержень', image: 'the_primordial_core.png', hp: 5000, attack: 180, defense: 90, exp: 700, gold: 600 },
            rewards: { gold: 1500, exp: 2200, silver: 3500 }
        }
    ],

    init: function() {
        var player = Sherwood.getPlayer();
        if (!player) return;
        if (!player.portal) player.portal = { completed: [], difficulty: {} };
    },

    getPortal: function(portalId) {
        for (var i = 0; i < this.PORTALS.length; i++) {
            if (this.PORTALS[i].id === portalId) return this.PORTALS[i];
        }
        return null;
    },

    getAllPortals: function() { return this.PORTALS; },

    enterPortal: function(portalId) {
        var portal = this.getPortal(portalId);
        if (!portal) return { success: false, reason: 'Портал не найден' };
        
        var player = Sherwood.getPlayer();
        var difficulty = player.portal.difficulty ? (player.portal.difficulty[portalId] || 0) : 0;
        var isHardMode = difficulty > 0 && difficulty % 2 === 0;
        var enemyMult = isHardMode ? 1.5 : 1;
        
        this._currentPortal = JSON.parse(JSON.stringify(portal));
        this._currentEnemies = [];
        
        var guard = this._currentPortal.guard;
        if (guard) {
            this._currentEnemies.push({
                name: guard.name,
                image: guard.image,
                hp: Math.floor(guard.hp * enemyMult),
                maxHp: Math.floor(guard.hp * enemyMult),
                attack: Math.floor(guard.attack * enemyMult),
                defense: Math.floor(guard.defense * enemyMult),
                exp: guard.exp,
                gold: guard.gold,
                isBoss: false
            });
        }
        
        var boss = this._currentPortal.boss;
        this._currentEnemies.push({
            name: boss.name,
            image: boss.image,
            hp: Math.floor(boss.hp * enemyMult),
            maxHp: Math.floor(boss.hp * enemyMult),
            attack: Math.floor(boss.attack * enemyMult),
            defense: Math.floor(boss.defense * enemyMult),
            exp: boss.exp,
            gold: boss.gold,
            isBoss: true
        });
        
        this._currentLevel = 0;
        this._inPortal = true;
        this._deathCount = 0;
        this._timeRemaining = 10800;
        this._startTimer();
        
        return { success: true, portal: this._currentPortal, enemies: this._currentEnemies, timeLimit: this._timeRemaining };
    },

    _startTimer: function() {
        if (this._timerInterval) clearInterval(this._timerInterval);
        var self = this;
        this._timerInterval = setInterval(function() {
            self._timeRemaining--;
            if (self._timeRemaining <= 0) self._exitPortal(false);
        }, 1000);
    },

    getCurrentBattle: function() {
        if (!this._inPortal || !this._currentPortal) return null;
        var enemy = this._currentEnemies[this._currentLevel];
        if (!enemy) return null;
        return {
            portal: this._currentPortal,
            level: this._currentLevel + 1,
            totalLevels: this._currentEnemies.length,
            enemy: enemy,
            timeRemaining: this._timeRemaining,
            deathCount: this._deathCount,
            isBoss: enemy.isBoss || false
        };
    },

    portalAttack: function() {
        if (!this._inPortal) return null;
        var battle = this.getCurrentBattle();
        if (!battle) return null;
        
        var player = Sherwood.getPlayer();
        var enemy = battle.enemy;
        
        var damage = Math.max(1, player.stats.attack - enemy.defense);
        enemy.hp -= damage;
        
        var result = {
            damage: damage,
            enemyName: enemy.name,
            enemyHp: Math.max(0, enemy.hp),
            enemyMaxHp: enemy.maxHp,
            enemyDead: enemy.hp <= 0,
            isBoss: enemy.isBoss || false
        };
        
        if (enemy.hp <= 0) {
            result.exp = enemy.exp;
            result.gold = enemy.gold;
            Sherwood.addExp(enemy.exp);
            Sherwood.addResource('gold', enemy.gold);
            Sherwood.addResource('silver', Math.floor(enemy.gold * 1.5));
            
            this._currentLevel++;
            if (this._currentLevel >= this._currentEnemies.length) {
                return this._completePortal();
            }
            
            result.nextEnemy = this._currentEnemies[this._currentLevel];
            return result;
        }
        
        var enemyDamage = Math.max(1, enemy.attack - player.stats.defense);
        player.stats.hp = Math.max(0, player.stats.hp - enemyDamage);
        result.enemyDamage = enemyDamage;
        result.playerHp = player.stats.hp;
        
        if (player.stats.hp <= 0) {
            return this._handleDeath();
        }
        
        Sherwood.saveGame();
        return result;
    },

    _handleDeath: function() {
        this._deathCount++;
        var player = Sherwood.getPlayer();
        
        if (this._deathCount > 5) {
            this._exitPortal(false);
            return { dead: true, portalFailed: true };
        }
        
        var cost = this._deathCount <= 2 
            ? { cost: this._deathCount * 2500, currency: 'silver' }
            : { cost: 50 + (this._deathCount - 2) * 50, currency: 'gold' };
        
        if ((player.resources[cost.currency] || 0) < cost.cost) {
            this._exitPortal(false);
            return { dead: true, portalFailed: true };
        }
        
        player.resources[cost.currency] -= cost.cost;
        player.stats.hp = player.stats.maxHp;
        Sherwood.saveGame();
        
        return { dead: true, deathCount: this._deathCount, cost: cost, resurrected: true, playerHp: player.stats.hp };
    },

    _completePortal: function() {
        var portal = this._currentPortal;
        var player = Sherwood.getPlayer();
        
        var timesCompleted = player.portal.completed ? player.portal.completed.filter(function(id) { return id === portal.id; }).length : 0;
        var firstTime = timesCompleted === 0;
        var isHardMode = timesCompleted > 0 && timesCompleted % 2 === 0;
        
        var mult = firstTime ? 1 : (isHardMode ? 0.5 : 0.3);
        var difficultyMult = isHardMode ? 1.5 : 1;
        
        var gold = Math.floor(portal.rewards.gold * mult * difficultyMult);
        var exp = Math.floor(portal.rewards.exp * mult * difficultyMult);
        var silver = Math.floor(portal.rewards.silver * mult * difficultyMult);
        
        Sherwood.addExp(exp);
        Sherwood.addResource('gold', gold);
        Sherwood.addResource('silver', silver);
        
        if (firstTime) {
            if (!player.portal.completed) player.portal.completed = [];
            player.portal.completed.push(portal.id);
        }
        
        if (!player.portal.difficulty) player.portal.difficulty = {};
        player.portal.difficulty[portal.id] = (player.portal.difficulty[portal.id] || 0) + 1;
        
        if (this._timerInterval) clearInterval(this._timerInterval);
        this._inPortal = false;
        var cp = this._currentPortal;
        this._currentPortal = null;
        this._currentEnemies = [];
        
        Sherwood.saveGame();
        
        return {
            portalComplete: true,
            portal: cp,
            rewards: { gold: gold, exp: exp, silver: silver },
            firstTime: firstTime,
            hardMode: isHardMode
        };
    },

    _exitPortal: function(success) {
        if (this._timerInterval) clearInterval(this._timerInterval);
        this._inPortal = false;
        this._currentPortal = null;
        this._currentEnemies = [];
        
        if (!success) {
            var player = Sherwood.getPlayer();
            player.stats.hp = Math.max(1, Math.floor(player.stats.maxHp * 0.1));
            Sherwood.saveGame();
        }
    },

    fleePortal: function() {
        this._exitPortal(false);
        return { success: true };
    },
    
    getTimeRemaining: function() { return this._timeRemaining; },
    isInPortal: function() { return this._inPortal; }
};
