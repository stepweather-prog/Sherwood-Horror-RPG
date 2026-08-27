// js/arena.js — обновлённый
Sherwood.ArenaUI = {
    _arenaDefeatShown: false,
    _arenaVictoryShown: false,
    _arenaCooldownInterval: null,
    _currentArenaOpponents: null,
    _currentArenaOpponentIndex: 0,

    show: function() {
        SherwoodUI._playSound('click');
        if (!Sherwood.Arena) { SherwoodUI._showPlaceholder('Арена', 'arena'); return; }
        if (Sherwood.Arena.isInMatch()) { this._showArenaBattle(); return; }
        var stats = Sherwood.Arena.getStats();
        var h = '<div style="text-align:center;"><div style="color:#e0c080;font-size:1.2em;font-weight:bold;margin-bottom:4px;">' + stats.rank + '</div><div style="color:#aaa;font-size:0.8em;margin-bottom:30px;">Побед: ' + stats.wins + ' | Поражений: ' + stats.losses + '</div><img src="assets/interface/blades_arena.png" style="width:240px;height:240px;object-fit:contain;display:block;margin:0 auto 30px;"><button onclick="Sherwood.ArenaUI._startBattle()" style="background:#c9a040;border:none;border-radius:8px;padding:14px 40px;color:#000;font-weight:bold;cursor:pointer;font-size:1em;">В бой</button></div>';
        SherwoodUI._openScreen('Арена', 'arena', h);
    },

    _startBattle: function() {
        SherwoodUI._stopMusic();
        this._arenaDefeatShown = false;
        this._arenaVictoryShown = false;
        var result = Sherwood.Arena.startMatch();
        if (!result.success) { SherwoodUI._showToast(result.reason); return; }
        this._currentArenaOpponents = result.opponents;
        this._currentArenaOpponentIndex = 0;
        this._showArenaBattle();
    },

    _showArenaBattle: function() {
        if (!this._currentArenaOpponents || this._currentArenaOpponentIndex >= this._currentArenaOpponents.length) {
            if (!this._arenaVictoryShown) this._arenaVictory();
            return;
        }
        var opp = this._currentArenaOpponents[this._currentArenaOpponentIndex];
        var skinFile = opp.skin || 'assets/hero_skins/skin1_01.png';
        Sherwood.CombatUI._showBattleScreen(
            { name: opp.name, image: skinFile, hp: opp.stats.hp, maxHp: opp.stats.maxHp, attack: opp.stats.attack, defense: opp.stats.defense },
            'arena', 'Арена - ' + opp.name, '', 'Sherwood.ArenaUI._attack()', 'Sherwood.ArenaUI._flee()', 'assets/backgrounds/duel_arena.png'
        );
        var self = this;
        if (this._arenaCooldownInterval) clearInterval(this._arenaCooldownInterval);
        this._arenaCooldownInterval = setInterval(function() { self._updateCooldown(); }, 100);
    },

    _updateCooldown: function() {
        var overlay = document.getElementById('attack-cooldown-overlay');
        if (!overlay) return;
        if (!Sherwood.Arena || !Sherwood.Arena.isInMatch()) { overlay.style.height = '0%'; return; }
        var lastAttack = Sherwood.Arena._lastPlayerAttack || 0;
        var cooldown = Sherwood.Arena._playerAttackCooldown || 3000;
        var timeSince = Date.now() - lastAttack;
        var remainingPct = Math.max(0, 1 - timeSince / cooldown);
        overlay.style.height = (remainingPct * 100) + '%';
    },

    _attack: function() {
        SherwoodUI._playHitSounds();
        var result = Sherwood.Arena.playerAttack();
        if (result.error) { Sherwood.CombatUI._showDialog(result.error, '#ff9800'); return; }
        if (result.damage !== undefined) {
            Sherwood.CombatUI._hitEnemyCard();
            Sherwood.CombatUI._updateEnemyHP(result.enemyHp, result.enemyMaxHp);
            Sherwood.CombatUI._showDialog('Урон: ' + result.damage, '#fff');
        }
        if (result.enemyDead && !result.win) {
            Sherwood.CombatUI._showDialog(result.enemyName + ' повержен!', '#4caf50');
            if (Sherwood.Daily) Sherwood.Daily.updateProgress('arena_wins', 1);
            var self = this;
            setTimeout(function() { self._showArenaBattle(); }, 1000);
            return;
        }
        if (result.win) { if (!this._arenaVictoryShown) this._arenaVictory(); return; }
        if (result.playerDead) { if (!this._arenaDefeatShown) this._arenaDefeat(); return; }
        var self = this;
        setTimeout(function() { self._showArenaBattle(); }, 700);
    },

    _arenaVictory: function() {
        if (this._arenaVictoryShown) return;
        this._arenaVictoryShown = true;
        if (this._arenaCooldownInterval) clearInterval(this._arenaCooldownInterval);
        SherwoodUI._stopMusic();
        Sherwood.Arena._inMatch = false;
        Sherwood.Arena._currentOpponent = null;
        var exp = 150, gold = 80, silver = 200;
        Sherwood.addExp(exp); Sherwood.addResource('gold', gold); Sherwood.addResource('silver', silver);
        Sherwood.saveGame(); SherwoodUI.updateDisplay();
        this._currentArenaOpponents = null;
        SherwoodUI._pendingRewards = { exp: exp, gold: gold, silver: silver };
        SherwoodUI._afterRewardAction = function() {
            Sherwood.ArenaUI._arenaVictoryShown = false;
            SherwoodUI._playMusic('main_theme');
            Sherwood.ArenaUI.show();
        };
        SherwoodUI._showVictoryScreen(SherwoodUI._pendingRewards);
    },

    _arenaDefeat: function() {
        if (this._arenaDefeatShown) return;
        this._arenaDefeatShown = true;
        if (this._arenaCooldownInterval) clearInterval(this._arenaCooldownInterval);
        SherwoodUI._stopMusic();
        Sherwood.Arena._inMatch = false;
        Sherwood.Arena._currentOpponent = null;
        Sherwood.Arena._losses++;
        Sherwood.Arena._saveStats();
        var player = Sherwood.getPlayer();
        player.stats.hp = player.stats.maxHp;
        Sherwood.saveGame();
        this._currentArenaOpponents = null;
        SherwoodUI._pendingRewards = { exp: 20, silver: 50 };
        SherwoodUI._afterRewardAction = function() {
            Sherwood.ArenaUI._arenaDefeatShown = false;
            SherwoodUI._playMusic('main_theme');
            Sherwood.ArenaUI.show();
        };
        SherwoodUI._showDefeatScreen(SherwoodUI._pendingRewards);
    },

    _flee: function() {
        if (this._arenaCooldownInterval) clearInterval(this._arenaCooldownInterval);
        SherwoodUI._stopMusic();
        Sherwood.Arena._inMatch = false;
        Sherwood.Arena._currentOpponent = null;
        this._currentArenaOpponents = null;
        Sherwood.Arena._losses++;
        Sherwood.Arena._saveStats();
        SherwoodUI._playMusic('main_theme');
        this.show();
    }
};
