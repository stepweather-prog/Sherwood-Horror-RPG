// js/profile-ui.js — UI профиля
Sherwood.ProfileUI = {
    show: function() {
        SherwoodUI._playSound('click');
        var p = Sherwood.getPlayer();
        var eq = Sherwood.Bag ? Sherwood.Bag.getEquipment() : {};
        var ring = eq.ring, amulet = eq.amulet;
        var trophies = p.trophies || [];
        var activeSkin = p.activeSkin || 'skin1_01';
        
        var h = '';
        h += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;margin-bottom:8px;">';
        h += '<div style="text-align:center;"><img src="' + SherwoodUI._statIcons.attack + '" style="width:120px;height:120px;object-fit:contain;"><div style="color:#fff;font-size:2em;font-weight:bold;">' + p.stats.attack + '</div></div>';
        h += '<div style="text-align:center;"><img src="' + SherwoodUI._statIcons.defense + '" style="width:120px;height:120px;object-fit:contain;"><div style="color:#fff;font-size:2em;font-weight:bold;">' + p.stats.defense + '</div></div>';
        h += '<div style="text-align:center;"><img src="' + SherwoodUI._statIcons.hp + '" style="width:120px;height:120px;object-fit:contain;"><div style="color:#fff;font-size:2em;font-weight:bold;">' + p.stats.hp + '</div></div>';
        h += '</div>';
        
        h += '<div style="text-align:center;margin-bottom:8px;">';
        h += '<div onclick="Sherwood.ProfileUI._showSkinSelector()" style="cursor:pointer;display:inline-block;position:relative;">';
        h += '<img src="assets/hero_skins/' + activeSkin + '.png" style="width:200px;height:200px;border-radius:14px;border:3px solid #ffd700;object-fit:contain;" onerror="this.src=\'assets/hero_skins/skin1_01.png\'">';
        h += '<div style="position:absolute;bottom:-4px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.8);color:#ffd700;font-size:0.7em;font-weight:bold;padding:4px 12px;border-radius:4px;">Сменить</div>';
        h += '</div>';
        h += '<div style="color:#e0c080;font-weight:bold;margin-top:8px;font-size:1.2em;">' + p.name + '</div>';
        h += '<div style="color:#aaa;font-size:0.9em;">Уровень ' + p.level + '</div>';
        h += '</div>';
        
        h += '<div style="display:flex;flex-direction:column;gap:8px;align-items:center;">';
        h += '<div class="profile-action-btn" onclick="Sherwood.ProfileUI._showAllTrophies()"><img src="' + (trophies.length > 0 && trophies[0].icon ? trophies[0].icon : 'assets/all_trophies/asset_isolated_on_a_solid.png') + '"><span class="action-label">' + (trophies.length > 0 ? trophies.length + ' трофеев' : 'Трофеи') + '</span></div>';
        h += '<div class="profile-action-btn" onclick="Sherwood.ProfileUI._showAllRings()"><img src="' + (ring ? ring.icon || 'assets/interface/ring_first_level.png' : 'assets/interface/ring_first_level.png') + '"><span class="action-label">' + (ring ? ring.name : 'Кольца') + '</span></div>';
        h += '<div class="profile-action-btn" onclick="Sherwood.ProfileUI._showAllAmulets()"><img src="' + (amulet ? amulet.icon || 'assets/interface/sherwood_amulet_level_one.png' : 'assets/interface/sherwood_amulet_level_one.png') + '"><span class="action-label">' + (amulet ? amulet.name : 'Амулеты') + '</span></div>';
        h += '<div class="profile-action-btn" onclick="Sherwood.ProfileUI._showTalents()"><img src="assets/all_buttons/ranger_skills_button.png"><span class="action-label">Таланты</span></div>';
        h += '<div class="profile-action-btn" onclick="Sherwood.ProfileUI._showWallet()"><img src="assets/interface/wallet.png"><span class="action-label">Кесет</span></div>';
        h += '<div class="profile-action-btn" onclick="Sherwood.ProfileUI._showBestiary()"><img src="assets/all_buttons/bestiary.png"><span class="action-label">Бестиарий</span></div>';
        h += '</div>';
        
        SherwoodUI._openScreenScrollable('Профиль', 'profile', h);
    },

    _showSkinSelector: function() {
        var player = Sherwood.getPlayer();
        var unlockedSkins = player.unlockedSkins || ['skin1_01'];
        var activeSkin = player.activeSkin || 'skin1_01';
        
        var h = '<div style="text-align:center;color:#e0c080;font-size:1.1em;font-weight:bold;margin-bottom:12px;">Выбор облика</div>';
        h += '<div style="display:flex;flex-direction:column;align-items:center;gap:8px;">';
        
        for (var i = 0; i < unlockedSkins.length; i++) {
            var sid = unlockedSkins[i];
            var data = Sherwood.SKIN_BONUSES ? Sherwood.SKIN_BONUSES[sid] : null;
            var skinName = data ? data.name : sid;
            var isActive = sid === activeSkin;
            
            h += '<div onclick="' + (isActive ? '' : 'Sherwood.ProfileUI._selectSkin(\'' + sid + '\')') + '" style="cursor:' + (isActive ? 'default' : 'pointer') + ';background:rgba(0,0,0,0.5);border:2px solid ' + (isActive ? '#ffd700' : '#555') + ';border-radius:8px;padding:10px;width:80%;text-align:center;">';
            h += '<img src="assets/hero_skins/' + sid + '.png" style="width:64px;height:64px;object-fit:contain;border-radius:4px;" onerror="this.src=\'assets/hero_skins/skin1_01.png\'">';
            h += '<div style="color:' + (isActive ? '#ffd700' : '#e0c080') + ';font-size:0.75em;font-weight:bold;margin-top:4px;">' + skinName + '</div>';
            if (isActive) {
                h += '<div style="color:#ffd700;font-size:0.6em;margin-top:2px;">Установлен</div>';
            } else {
                h += '<div style="color:#4caf50;font-size:0.6em;margin-top:2px;">Нажми чтобы надеть</div>';
            }
            h += '</div>';
        }
        h += '</div>';
        
        SherwoodUI._openScreenScrollable('Смена облика', 'profile', h, 'Sherwood.ProfileUI.show()');
    },

    _selectSkin: function(skinId) {
        var r = Sherwood.Forge ? Sherwood.Forge.equipSkin(skinId) : { success: false };
        if (r.success) {
            var heroImg = document.querySelector('.hero-layer img');
            if (heroImg) heroImg.src = 'assets/hero_skins/' + skinId + '.png';
            SherwoodUI._showToast('Облик установлен!');
            this.show();
        } else {
            SherwoodUI._showToast(r.reason || 'Ошибка');
        }
    },

    _showAllTrophies: function() {
        var trophies = Sherwood.getPlayer().trophies || [];
        var h = '<div style="padding:10px;"><div style="color:#e0c080;font-weight:bold;margin-bottom:8px;">Трофеи (' + trophies.length + ')</div>';
        
        if (trophies.length === 0) {
            h += '<div style="text-align:center;padding:20px;"><img src="assets/all_trophies/asset_isolated_on_a_solid.png" style="width:180px;height:180px;object-fit:contain;"><div style="color:#aaa;margin-top:8px;">Нет трофеев</div></div>';
        }
        
        for (var i = 0; i < trophies.length; i++) {
            var t = trophies[i];
            h += '<div style="display:flex;gap:12px;background:rgba(0,0,0,0.5);border:1px solid #c9a040;border-radius:10px;padding:10px;margin-bottom:8px;">';
            h += '<div style="position:relative;width:80px;height:80px;flex-shrink:0;">';
            h += '<img src="assets/all_trophies/asset_isolated_on_a_solid.png" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:contain;z-index:0;">';
            h += '<img src="' + (t.icon || 'assets/all_trophies/asset_isolated_on_a_solid.png') + '" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:56px;height:56px;object-fit:contain;z-index:1;border-radius:8px;">';
            h += '</div>';
            h += '<div style="flex:1;"><div style="color:#e0c080;font-weight:bold;">' + t.name + '</div>';
            if (t.bonus) h += '<div style="color:#aaa;font-size:0.7em;margin-top:4px;">АТК +' + (t.bonus.attack||0) + ' | ЗЩТ +' + (t.bonus.defense||0) + ' | HP +' + (t.bonus.hp||0) + '</div>';
            h += '</div></div>';
        }
        h += '</div>';
        
        SherwoodUI._openScreen('Трофеи', 'profile', h, 'Sherwood.ProfileUI.show()');
    },

    _showAllRings: function() {
        var equipment = Sherwood.Bag ? Sherwood.Bag.getEquipment() : {};
        var ring = equipment.ring;
        var h = '<div style="padding:10px;"><div style="color:#e0c080;font-weight:bold;margin-bottom:8px;">Кольца</div>';
        
        if (!ring) {
            h += '<div style="color:#aaa;">Нет колец</div>';
        } else {
            h += '<div style="display:flex;gap:12px;background:rgba(0,0,0,0.5);border:1px solid #c9a040;border-radius:10px;padding:10px;margin-bottom:8px;">';
            h += '<img src="' + (ring.icon || 'assets/interface/ring_first_level.png') + '" style="width:80px;height:80px;object-fit:contain;border-radius:8px;flex-shrink:0;">';
            h += '<div style="flex:1;"><div style="color:#e0c080;font-weight:bold;">' + ring.name + '</div>';
            if (ring.stats) h += '<div style="color:#aaa;font-size:0.7em;margin-top:4px;">АТК +' + (ring.stats.attack||0) + ' | ЗЩТ +' + (ring.stats.defense||0) + '</div>';
            h += '</div></div>';
        }
        h += '</div>';
        
        SherwoodUI._openScreen('Кольца', 'profile', h, 'Sherwood.ProfileUI.show()');
    },

    _showAllAmulets: function() {
        var equipment = Sherwood.Bag ? Sherwood.Bag.getEquipment() : {};
        var amulet = equipment.amulet;
        var h = '<div style="padding:10px;"><div style="color:#e0c080;font-weight:bold;margin-bottom:8px;">Амулеты</div>';
        
        if (!amulet) {
            h += '<div style="color:#aaa;">Нет амулетов</div>';
        } else {
            h += '<div style="display:flex;gap:12px;background:rgba(0,0,0,0.5);border:1px solid #c9a040;border-radius:10px;padding:10px;margin-bottom:8px;">';
            h += '<img src="' + (amulet.icon || 'assets/interface/sherwood_amulet_level_one.png') + '" style="width:80px;height:80px;object-fit:contain;border-radius:8px;flex-shrink:0;">';
            h += '<div style="flex:1;"><div style="color:#e0c080;font-weight:bold;">' + amulet.name + '</div>';
            if (amulet.stats) h += '<div style="color:#aaa;font-size:0.7em;margin-top:4px;">HP +' + (amulet.stats.hp||0) + ' | ЗЩТ +' + (amulet.stats.defense||0) + '</div>';
            h += '</div></div>';
        }
        h += '</div>';
        
        SherwoodUI._openScreen('Амулеты', 'profile', h, 'Sherwood.ProfileUI.show()');
    },

    _showTalents: function() {
        var skills = Sherwood.Combat ? Sherwood.Combat.getSkills() : {};
        var player = Sherwood.getPlayer();
        if (!player.activeSkills) player.activeSkills = {};
        
        var h = '<div style="padding:10px;"><div style="color:#e0c080;font-size:1.1em;font-weight:bold;text-align:center;margin-bottom:12px;">Мои таланты</div>';
        var hasUnlocked = false;
        
        for (var id in skills) {
            var s = skills[id];
            if (!s.unlocked) continue;
            hasUnlocked = true;
            var isActive = player.activeSkills[id] !== false;
            
            h += '<div onclick="Sherwood.ProfileUI._toggleTalent(\'' + id + '\')" style="cursor:pointer;background:rgba(0,0,0,0.5);border:2px solid ' + (isActive ? '#4caf50' : '#555') + ';border-radius:8px;padding:10px;margin-bottom:8px;display:flex;align-items:center;gap:10px;">';
            h += '<img src="' + s.icon + '" style="width:44px;height:44px;object-fit:contain;">';
            h += '<div style="flex:1;"><div style="color:#e0c080;">' + s.name + '</div><div style="color:#aaa;font-size:0.7em;">' + s.description + '</div></div>';
            if (isActive) { h += '<div style="color:#4caf50;font-size:0.7em;font-weight:bold;">Вкл</div>'; }
            else { h += '<div style="color:#888;font-size:0.7em;font-weight:bold;">Выкл</div>'; }
            h += '</div>';
        }
        
        if (!hasUnlocked) { h += '<div style="color:#aaa;text-align:center;padding:20px;">Нет изученных талантов</div>'; }
        h += '<div style="color:#aaa;font-size:0.65em;text-align:center;margin-top:8px;">Нажми на талант чтобы включить или выключить</div></div>';
        
        SherwoodUI._openScreenScrollable('Таланты', 'profile', h, 'Sherwood.ProfileUI.show()');
    },

    _toggleTalent: function(id) {
        var player = Sherwood.getPlayer();
        if (!player.activeSkills) player.activeSkills = {};
        if (player.activeSkills[id] === false) {
            player.activeSkills[id] = true;
        } else {
            player.activeSkills[id] = false;
        }
        Sherwood.saveGame();
        this._showTalents();
    },

    _showWallet: function() {
        if (typeof Sherwood.WalletUI !== 'undefined') {
            Sherwood.WalletUI.show();
        } else {
            SherwoodUI._showPlaceholder('Кесет', 'wallet', 'Sherwood.ProfileUI.show()');
        }
    },

    _showBestiary: function() {
        if (typeof Sherwood.BestiaryUI !== 'undefined') {
            Sherwood.BestiaryUI.show();
        } else {
            SherwoodUI._showPlaceholder('Бестиарий', 'bestiary', 'Sherwood.ProfileUI.show()');
        }
    }
};
