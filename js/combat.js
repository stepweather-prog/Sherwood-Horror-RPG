// js/combat-ui.js
Sherwood.CombatUI = {
    _arenaDefeatShown: false,
    _arenaVictoryShown: false,
    _arenaCooldownInterval: null,
    _currentArenaOpponents: null,
    _currentArenaOpponentIndex: 0,

    init: function() {
        this._arenaDefeatShown = false;
        this._arenaVictoryShown = false;
        this._currentArenaOpponents = null;
        this._currentArenaOpponentIndex = 0;
    },

    _showBattleScreen: function(enemyData, mode, modeTitle, extraInfo, onAttack, onFlee, customBg) {
        if (Sherwood.Dungeon2D5 && Sherwood.Dungeon2D5._topPanel) {
            Sherwood.Dungeon2D5._topPanel.style.display = 'none';
        }
        var e = enemyData, p = Sherwood.getPlayer();
        var ehp = e.maxHp > 0 ? Math.round((e.hp / e.maxHp) * 100) : 100;
        var php = p.stats.maxHp > 0 ? Math.round((p.stats.hp / p.stats.maxHp) * 100) : 100;
        var imgPath = (mode === 'arena') ? e.image : (mode === 'portal' ? 'assets/portal_beasts/' + e.image : 'assets/all_beasts/' + e.image);
        var h = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:flex-start;height:100%;padding:4px 8px;overflow:hidden;">';
        h += '<div style="display:flex;align-items:center;gap:8px;width:100%;margin-bottom:2px;"><span style="color:#e0c080;font-size:0.8em;flex:1;text-align:center;">' + (modeTitle || '') + '</span></div>';
        h += '<div style="color:#f44336;font-weight:bold;font-size:0.9em;text-align:center;">' + e.name + '</div>';
        h += '<div style="display:flex;align-items:center;gap:4px;width:100%;margin-bottom:2px;"><div style="flex:1;position:relative;height:50px;"><img src="assets/interface/life_scale.png" style="width:100%;height:50px;position:absolute;top:0;left:0;z-index:0;"><div style="position:absolute;top:10px;left:28px;right:28px;bottom:10px;overflow:hidden;z-index:1;"><div id="enemy-hp-bar" style="background:url(assets/interface/filling_the_poisoned_health_bar.jpeg) left/auto 100%;height:100%;width:' + ehp + '%;"></div></div><span id="enemy-hp-text" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#fff;font-size:0.7em;z-index:2;font-weight:bold;text-shadow:0 0 4px #000;">' + e.hp + '</span></div></div>';
        h += '<div style="display:flex;gap:10px;justify-content:center;margin-bottom:2px;"><span style="color:#fff;font-size:0.75em;font-weight:bold;">АТК ' + (e.attack || 0) + '</span><span style="color:#fff;font-size:0.75em;font-weight:bold;">ЗЩТ ' + (e.defense || 0) + '</span><span style="color:#fff;font-size:0.75em;font-weight:bold;">HP ' + e.hp + '</span></div>';
        h += '<div style="position:relative;display:inline-block;" id="enemy-card-area"><img src="' + imgPath + '" id="enemy-card" style="width:400px;height:400px;object-fit:contain;position:relative;z-index:1;" onerror="this.style.display=&quot;none&quot;"><div id="enemy-hit-overlay" style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:2;pointer-events:none;display:none;"></div><div id="damage-numbers" style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:3;pointer-events:none;"></div></div>';
        
        if (mode === 'arena') {
            h += '<button id="arena-switch-btn" onclick="Sherwood.CombatUI._arenaSwitchTarget()" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);width:40px;height:40px;background:transparent;border:none;cursor:pointer;z-index:20;"><img src="assets/interface/arrow_arena.png" style="width:100%;height:100%;object-fit:contain;"></button>';
        }
        
        var chargedSkillLeft = null, chargedSkillRight = null;
        if (Sherwood.Combat && Sherwood.Combat._battle) { var battle = Sherwood.Combat._battle; if (battle.chargedSkills && battle.chargedSkills.length > 0) { chargedSkillLeft = battle.chargedSkills[0] || null; chargedSkillRight = battle.chargedSkills[1] || null; } }
        var skills = Sherwood.Combat ? Sherwood.Combat.getSkills() : {};
        
        h += '<div style="display:flex;align-items:center;justify-content:center;gap:8px;margin:2px 0;">';
        h += chargedSkillLeft && skills[chargedSkillLeft] ? '<button onclick="Sherwood.CombatUI._useSkill(\'' + chargedSkillLeft + '\')" style="width:44px;height:44px;border-radius:50%;border:2px solid #ffd700;overflow:hidden;padding:0;background:rgba(201,168,76,0.3);"><img src="' + skills[chargedSkillLeft].icon + '" style="width:100%;height:100%;object-fit:contain;"></button>' : '<div style="width:44px;height:44px;"></div>';
        h += '<button onclick="' + onAttack + '" style="background:url(assets/skills/skill_shot_normal.png) center/contain no-repeat;width:56px;height:56px;border:3px solid #c9a040;border-radius:50%;cursor:pointer;flex-shrink:0;position:relative;overflow:hidden;">';
        h += '<div id="attack-cooldown-overlay" style="position:absolute;top:0;left:0;width:100%;height:0%;background:rgba(0,0,0,0.6);border-radius:0 0 50% 50%;pointer-events:none;"></div>';
        h += '</button>';
        h += chargedSkillRight && skills[chargedSkillRight] ? '<button onclick="Sherwood.CombatUI._useSkill(\'' + chargedSkillRight + '\')" style="width:44px;height:44px;border-radius:50%;border:2px solid #ffd700;overflow:hidden;padding:0;background:rgba(201,168,76,0.3);"><img src="' + skills[chargedSkillRight].icon + '" style="width:100%;height:100%;object-fit:contain;"></button>' : '<div style="width:44px;height:44px;"></div>';
        h += '</div>';
        
        h += '<div style="display:flex;align-items:center;gap:4px;width:100%;margin-bottom:2px;"><div style="flex:1;position:relative;height:50px;"><img src="assets/interface/life_scale.png" style="width:100%;height:50px;position:absolute;top:0;left:0;z-index:0;"><div style="position:absolute;top:10px;left:28px;right:28px;bottom:10px;overflow:hidden;z-index:1;"><div id="player-hp-bar" style="background:url(assets/interface/life_interface_asset_horizontal_progress_bar.jpeg) left/auto 100%;height:100%;width:' + php + '%;"></div></div><span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#fff;font-size:0.7em;z-index:2;font-weight:bold;text-shadow:0 0 4px #000;">' + p.stats.hp + '</span></div></div>';
        h += '<div style="display:flex;gap:10px;justify-content:center;"><span style="color:#fff;font-size:0.75em;font-weight:bold;">АТК ' + p.stats.attack + '</span><span style="color:#fff;font-size:0.75em;font-weight:bold;">ЗЩТ ' + p.stats.defense + '</span><span style="color:#fff;font-size:0.75em;font-weight:bold;">HP ' + p.stats.hp + '</span></div>';
        h += '<div id="battle-dialog" style="width:90%;background:rgba(0,0,0,0.75);border:1px solid #555;border-radius:8px;padding:4px;margin-top:2px;min-height:32px;color:#aaa;font-size:0.65em;text-align:left;overflow:hidden;"></div>';
        h += '</div>';
        SherwoodUI._openScreen('', customBg || 'dungeon_fight', h);
    },

    _useSkill: function(skillId) {
        if (!Sherwood.Combat) return;
        SherwoodUI._playHitSounds();
        var r = Sherwood.Combat.useSkill(skillId);
        if (!r) return;
        if (r.error) { this._showDialog(r.error, '#ff9800'); return; }
        this._handleCombat(r);
    },

    _showDialog: function(msg, color) {
        var dlg = document.getElementById('battle-dialog');
        if (dlg) { dlg.innerHTML += '<div style="color:' + (color||'#fff') + ';margin:1px 0;">' + msg + '</div>'; dlg.scrollTop = dlg.scrollHeight; }
    },

    _showDamageNumber: function(dmg, isCrit) {
        var container = document.getElementById('damage-numbers');
        if (!container) return;
        var el = document.createElement('div');
        el.style.cssText = 'position:absolute;top:40%;left:50%;transform:translate(-50%,-50%);color:' + (isCrit ? '#ff6a00' : '#ffd700') + ';font-size:' + (isCrit ? '1.8em' : '1.2em') + ';font-weight:bold;text-shadow:0 0 8px #000;z-index:10;pointer-events:none;animation:dmgFloat 1s ease-out forwards;';
        el.textContent = (isCrit ? '💥 ' : '') + dmg;
        container.appendChild(el);
        setTimeout(function() { el.remove(); }, 1000);
    },

    _hitEnemyCard: function() {
        var card = document.getElementById('enemy-card');
        if (!card) return;
        card.style.transition = 'transform 0.1s, filter 0.15s';
        card.style.transform = 'translateX(2px) rotate(0.5deg) scale(0.95)';
        card.style.filter = 'brightness(1.3) saturate(2) hue-rotate(-10deg)';
        setTimeout(function() { card.style.transform = ''; card.style.filter = ''; }, 200);
    },

    _updateEnemyHP: function(hp, max) {
        var bar = document.getElementById('enemy-hp-bar'), txt = document.getElementById('enemy-hp-text');
        if (bar) { var pct = max > 0 ? Math.round((hp / max) * 100) : 0; bar.style.width = pct + '%'; }
        if (txt) txt.textContent = hp;
        var p = Sherwood.getPlayer();
        if (p) { var playerBar = document.getElementById('player-hp-bar'); if (playerBar) { var php = p.stats.maxHp > 0 ? Math.round((p.stats.hp / p.stats.maxHp) * 100) : 0; playerBar.style.width = php + '%'; } }
    },

    _showCombatScreen: function() {
        var b = Sherwood.Combat.getState();
        if (!b) {
            if (Sherwood.Dungeon2D5 && Sherwood.Dungeon2D5._topPanel) {
                Sherwood.Dungeon2D5._topPanel.style.display = 'flex';
            }
            if (Sherwood.Dungeon2D5 && Sherwood.Dungeon2D5._dungeon) {
                Sherwood.Dungeon2D5.render();
            } else {
                SherwoodUI._renderDungeon();
            }
            return;
        }
        if (Sherwood.Dungeon2D5 && Sherwood.Dungeon2D5._topPanel) {
            Sherwood.Dungeon2D5._topPanel.style.display = 'none';
        }
        this._showBattleScreen({ name: b.enemyName, image: b.enemyImage, hp: b.enemyHp, maxHp: b.enemyMaxHp, attack: b.enemyAttack, defense: b.enemyDefense }, "dungeon", (b.isBoss ? "БОСС: " : "") + b.enemyName, "", "SherwoodUI._combatAttack()", "SherwoodUI._combatFlee");
    },

    _combatAttack: function() {
        SherwoodUI._playHitSounds();
        this._handleCombat(Sherwood.Combat.attack());
    },

    _combatFlee: function() {
        var r = Sherwood.Combat.flee();
        if (r.success) {
            SherwoodUI._resumeMusic();
            if (Sherwood.Dungeon2D5 && Sherwood.Dungeon2D5._dungeon) {
                Sherwood.Dungeon2D5.render();
            } else {
                SherwoodUI._leaveDungeon();
            }
            return;
        }
        if (r.lose) {
            this._showDialog('Поражение...', '#f44336');
            SherwoodUI._resumeMusic();
            var self = this;
            setTimeout(function() {
                if (Sherwood.Dungeon2D5 && Sherwood.Dungeon2D5._dungeon) {
                    Sherwood.Dungeon2D5.render();
                } else {
                    self._leaveDungeon();
                }
            }, 1200);
            return;
        }
        this._showDialog('Побег не удался! Враг: -' + r.damage, '#ff9800');
        this._showCombatScreen();
    },

    _handleCombat: function(r) {
        if (!r) return;
        if (r.win) {
            if (r.exp) Sherwood.addExp(r.exp);
            if (r.gold) { Sherwood.addResource('gold', r.gold); Sherwood.addResource('silver', Math.floor(r.gold * 2)); }
            Sherwood.saveGame();
            if (Sherwood.Daily) { Sherwood.Daily.updateProgress('kill_beasts', 1); Sherwood.Daily.updateProgress('collect_loot', 1); }
            if (Sherwood.Dungeon && Sherwood.Dungeon.killMonster) Sherwood.Dungeon.killMonster();
            if (Sherwood.Bestiary && r.enemyImage) Sherwood.Bestiary.registerKill(r.enemyImage);
            SherwoodUI._resumeMusic();
            SherwoodUI.updateDisplay();
            if (Sherwood.Dungeon2D5 && Sherwood.Dungeon2D5._dungeon) {
                Sherwood.Dungeon2D5.render();
            } else {
                var d = Sherwood.Dungeon.getDungeon();
                if (d) { d.px = d.prevPx || d.px; d.py = d.prevPy || d.py; }
                SherwoodUI._renderDungeon();
            }
        }
        else if (r.lose) {
            SherwoodUI._resumeMusic();
            SherwoodUI.updateDisplay();
            var scrolls = Math.random() < 0.08 ? 1 : 0;
            if (scrolls) Sherwood.addResource('scrolls', scrolls);
            SherwoodUI._pendingRewards = { exp: Math.floor(r.exp * 0.3), silver: Math.floor(r.gold * 1.5), scrolls: scrolls };
            SherwoodUI._afterRewardAction = function() {
                if (Sherwood.Dungeon2D5 && Sherwood.Dungeon2D5._dungeon) {
                    Sherwood.Dungeon2D5.render();
                } else {
                    SherwoodUI._leaveDungeon();
                }
            };
            SherwoodUI._showDefeatScreen(SherwoodUI._pendingRewards);
        }
        else {
            this._hitEnemyCard();
            this._showDamageNumber(r.damage, r.crit);
            this._updateEnemyHP(r.enemyHp, r.enemyMaxHp);
            this._showDialog((r.crit ? 'CRIT ' : '') + 'Damage: ' + r.damage, r.crit ? '#ff6a00' : '#fff');
            SherwoodUI.updateDisplay();
            var self = this;
            setTimeout(function() { self._showCombatScreen(); }, 1000);
        }
    },

    _arenaSwitchTarget: function() {
        if (!this._currentArenaOpponents || !Sherwood.Arena.isInMatch()) return;
        var aliveBots = this._currentArenaOpponents.filter(function(o) { return o.stats.hp > 0; });
        if (aliveBots.length <= 1) return;
        var currentIdx = this._currentArenaOpponentIndex;
        var nextIdx = currentIdx;
        for (var i = 1; i <= this._currentArenaOpponents.length; i++) {
            var checkIdx = (currentIdx + i) % this._currentArenaOpponents.length;
            if (this._currentArenaOpponents[checkIdx].stats.hp > 0) { nextIdx = checkIdx; break; }
        }
        if (nextIdx !== currentIdx) {
            this._currentArenaOpponentIndex = nextIdx;
            Sherwood.Arena._currentOpponent = this._currentArenaOpponents[nextIdx];
            this._showArenaBattle();
            this._showDialog('Цель переключена', '#ff9800');
        }
    }
};

Sherwood.CombatUI.init();
